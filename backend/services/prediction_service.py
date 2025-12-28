from typing import Dict, Any, List
import pandas as pd

from .xai_service import explain_with_shap


# =========================
# VALIDATION
# =========================
def _require_fields(payload: Dict[str, Any], fields: List[str]) -> None:
    missing = [f for f in fields if f not in payload]
    if missing:
        raise ValueError(f"Missing required fields: {', '.join(missing)}")


# =========================
# FEATURE EXTRACTION
# =========================
def get_disease_features(disease: str, payload: Dict[str, Any]) -> pd.DataFrame:
    """
    Extract features EXACTLY as the model was trained.
    """

    # -------------------------
    # DIABETES (XGBoost)
    # -------------------------
    if disease == "diabetes":
        _require_fields(payload, ["age", "bmi", "glucose"])

        features = {
            "age": float(payload["age"]),
            "bmi": float(payload["bmi"]),
            "glucose": float(payload["glucose"]),
        }

    # -------------------------
    # HYPERTENSION (BRFSS RF)
    # -------------------------
    elif disease == "hypertension":
        # 🔥 EXACT features used in hypertension_BRFFS.ipynb
        _require_fields(
            payload,
            [
                "age",
                "sex",
                "trestbps",
                "chol",
                "fbs",
                "restecg",
                "exang",
                "slope",
            ],
        )

        features = {
            "age": float(payload["age"]),
            "sex": int(payload["sex"]),
            "trestbps": float(payload["trestbps"]),
            "chol": float(payload["chol"]),
            "fbs": int(payload["fbs"]),
            "restecg": int(payload["restecg"]),
            "exang": int(payload["exang"]),
            "slope": int(payload["slope"]),
        }

    else:
        raise ValueError(f"Unsupported disease type: {disease}")

    return pd.DataFrame([features])


# =========================
# PREDICTION LOGIC
# =========================
def predict_disease_risk(
    disease: str,
    payload: Dict[str, Any],
    models: Dict[str, Any],
    advice_generator=None,
) -> Dict[str, Any]:

    model = models.get(disease)
    if model is None:
        raise RuntimeError(f"Model for '{disease}' not loaded")

    # Build input
    input_df = get_disease_features(disease, payload)

    # -------------------------
    # HARD SAFETY CHECK
    # -------------------------
    model_features = getattr(model, "feature_names_in_", None)
    if model_features is not None:
        if list(input_df.columns) != list(model_features):
            raise ValueError(
                f"Feature mismatch!\n"
                f"Input: {list(input_df.columns)}\n"
                f"Model: {list(model_features)}"
            )

    # -------------------------
    # PREDICTION
    # -------------------------
    risk_score = float(model.predict_proba(input_df)[0][1])

    if risk_score >= 0.7:
        risk_label = "High"
    elif risk_score >= 0.4:
        risk_label = "Moderate"
    else:
        risk_label = "Low"

    # -------------------------
    # SHAP EXPLANATION
    # -------------------------
    explanation = explain_with_shap(model, input_df, top_k=5)

    disease_name = {
        "diabetes": "Type 2 Diabetes",
        "hypertension": "Hypertension",
    }[disease]

    # -------------------------
    # Gemini AI ADVICE
    # -------------------------
    if advice_generator is not None:
        # Build prompt with disease context using feature labels
        feature_labels = {
            "age": "Age", "sex": "Sex", "bmi": "BMI", "glucose": "Fasting Glucose",
            "trestbps": "Resting BP", "chol": "Cholesterol", "fbs": "Fasting Blood Sugar",
            "restecg": "Resting ECG", "exang": "Exercise Angina", "slope": "ST Slope"
        }
        factors_list = [
            f"{feature_labels.get(e['feature'], e['feature'])}: {e['value']:.1f}"
            for e in explanation[:3]
        ]
        factors_text = ', '.join(factors_list)
        
        advice_prompt = (
            f"You are a medical advisor. A patient has {disease_name} with a {risk_label} risk level "
            f"(risk score: {risk_score:.1%}). Key contributing factors are: {factors_text}. "
            f"Provide 3-4 sentences of professional, actionable lifestyle and preventive health advice. "
            f"Be empathetic, practical, and non-alarming. Focus on diet, exercise, stress management, and when to consult a doctor."
        )

        try:
            response = advice_generator.generate_content(advice_prompt)
            advice_text = response.text.strip() if response and hasattr(response, 'text') else None
            
            # Only use generated text if it's substantial
            if not advice_text or len(advice_text) < 30:
                advice_text = None
            
        except Exception as e:
            print(f"[WARN] Gemini advice generation failed: {e}")
            advice_text = None
    else:
        advice_text = None

    # Fallback to static advice if Gemini fails or is unavailable
    if not advice_text:
        advice_map = {
            "High": (
                f"Your {disease_name} risk is high. "
                "Please consult a healthcare professional as soon as possible. "
                "Immediate lifestyle changes and medical evaluation are advised."
            ),
            "Moderate": (
                f"You have moderate {disease_name} risk. "
                "Regular exercise, dietary improvements, stress management, "
                "and routine checkups are strongly recommended."
            ),
            "Low": (
                f"Your {disease_name} risk is currently low. "
                "Maintain a healthy lifestyle and continue regular health screenings."
            ),
        }
        advice_text = advice_map[risk_label]

    return {
        "disease": disease,
        "disease_name": disease_name,
        "risk_score": risk_score,
        "risk_label": risk_label,
        "explanation": explanation,
        "advice": advice_text,
        "input_features": input_df.to_dict(orient="records")[0],
    }
