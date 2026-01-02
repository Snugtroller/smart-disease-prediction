from typing import Dict, Any, List
import pandas as pd

from .xai_service import explain_with_shap
from .cache_service import advice_cache


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
    # DIABETES (XGBoost) - BRFSS features
    # -------------------------
    if disease == "diabetes":
        _require_fields(
            payload,
            ["age", "bmi", "highbp", "highchol", "genhlth", "diffwalk"]
        )

        features = {
            "Age": float(payload["age"]),
            "BMI": float(payload["bmi"]),
            "HighBP": int(payload["highbp"]),
            "HighChol": int(payload["highchol"]),
            "GenHlth": int(payload["genhlth"]),
            "DiffWalk": int(payload["diffwalk"]),
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

    # -------------------------
    # STROKE (XGBoost)
    # -------------------------
    elif disease == "stroke":
        # 🔥 EXACT features used in stroke model
        _require_fields(
            payload,
            [
                "age",
                "hypertension",
                "heart_disease",
                "avg_glucose_level",
                "bmi",
                "smoking_status",
                "ever_married",
            ],
        )

        features = {
            "age": float(payload["age"]),
            "hypertension": int(payload["hypertension"]),
            "heart_disease": int(payload["heart_disease"]),
            "avg_glucose_level": float(payload["avg_glucose_level"]),
            "bmi": float(payload["bmi"]),
            "smoking_status": int(payload["smoking_status"]),
            "ever_married": int(payload["ever_married"]),
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
        if set(input_df.columns) != set(model_features):
            raise ValueError(
                f"Feature mismatch!\n"
                f"Input: {set(input_df.columns)}\n"
                f"Model: {set(model_features)}"
            )
        # Reorder input to match model's feature order
        input_df = input_df[model_features]

    # -------------------------
    # PREDICTION
    # -------------------------
    risk_score = float(model.predict_proba(input_df)[0][1])
    if disease == "hypertension":
        risk_score = 1.0 - risk_score

    # Disease-specific thresholds
    if disease == "stroke":
        # Stroke uses different thresholds
        if risk_score >= 0.6:
            risk_label = "High"
        elif risk_score >= 0.4:
            risk_label = "Moderate"
        else:
            risk_label = "Low"
    elif disease == "hypertension":
        if risk_score >= 0.67:
            risk_label = "High"
        elif risk_score >= 0.33:
            risk_label = "Moderate"
        else:
            risk_label = "Low"
    else:
        # Default thresholds for diabetes
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
        "stroke": "Stroke Risk",
    }[disease]

    # -------------------------
    # Gemini AI ADVICE (with caching)
    # -------------------------
    advice_text = None
    
    # Try to get from cache first
    cached_advice = advice_cache.get(disease, risk_label, explanation)
    if cached_advice:
        advice_text = cached_advice
        print(f"[CACHE HIT] Using cached advice for {disease} ({risk_label} risk)")
    elif advice_generator is not None:
        feature_labels = {
            "age": "Age", "sex": "Sex", "bmi": "BMI", "glucose": "Fasting Glucose",
            "trestbps": "Resting BP", "chol": "Cholesterol", "fbs": "Fasting Blood Sugar",
            "restecg": "Resting ECG", "exang": "Exercise Angina", "slope": "ST Slope",
            "hypertension": "Hypertension", "heart_disease": "Heart Disease",
            "avg_glucose_level": "Avg Glucose", "smoking_status": "Smoking Status",
            "ever_married": "Ever Married"
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
            print(f"[DEBUG] Calling Gemini API for {disease} ({risk_label})")
            response = advice_generator.generate_content(advice_prompt)
            print(f"[DEBUG] API response received: {response}")
            advice_text = response.text.strip() if response and hasattr(response, 'text') else None
            print(f"[DEBUG] Extracted text: {advice_text[:80] if advice_text else 'NONE'}...")
            
            # Only use generated text if it's substantial
            if advice_text and len(advice_text) >= 30:
                # Store in cache for future requests
                advice_cache.set(disease, risk_label, explanation, advice_text)
                print(f"[SUCCESS] Generated and cached AI advice ({len(advice_text)} chars)")
            else:
                print(f"[WARN] Generated text too short ({len(advice_text) if advice_text else 0} chars), using fallback")
                advice_text = None
            
        except Exception as e:
            error_msg = str(e)
            print(f"[ERROR] Gemini API error: {type(e).__name__}: {error_msg[:100]}")
            if "not found" in error_msg or "not supported" in error_msg:
                # Model not available, use fallback silently
                advice_text = None
            else:
                # Other errors, log them
                print(f"[WARN] Gemini advice generation failed: {e}")
                advice_text = None
    
    # Fallback to static advice if cache miss AND Gemini not available/failed
    if advice_text is None:
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
