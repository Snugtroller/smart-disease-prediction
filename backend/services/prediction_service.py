from typing import Dict, Any

import numpy as np
import pandas as pd

from .xai_service import explain_with_shap


def _dummy_risk_score(features: pd.DataFrame) -> float:
    """
    Fallback risk scoring function when no model is present.
    Just a simple heuristic for MVP/demo.
    """
    age = features.get("age", pd.Series([0])).iloc[0]
    bmi = features.get("bmi", pd.Series([0])).iloc[0]
    glucose = features.get("glucose", pd.Series([0])).iloc[0]

    score = (age / 100) * 0.4 + (bmi / 50) * 0.3 + (glucose / 200) * 0.3
    return min(max(score, 0.0), 1.0)


def predict_disease_risk(
    disease: str,
    payload: Dict[str, Any],
    models: Dict[str, Any],
    advice_generator,
) -> Dict[str, Any]:
    """
    Core multi-disease prediction logic.

    :param disease: "diabetes" | "heart" | "hypertension"
    :param payload: Input JSON from frontend (age, bmi, glucose, etc.)
    :param models:  Dict of loaded models from app.config["DISEASE_MODELS"]
    :param advice_generator: HF text2text-generation pipeline
    """
    model = models.get(disease)

    # Extract basic numeric features for MVP
    features_dict = {
        "age": float(payload.get("age", 0)),
        "bmi": float(payload.get("bmi", 0)),
        "glucose": float(payload.get("glucose", 0)),
    }
    input_df = pd.DataFrame([features_dict])

    # 1) Risk score
    if model is None:
        risk_score = _dummy_risk_score(input_df)
    else:
        proba = model.predict_proba(input_df)[0][1]
        risk_score = float(proba)

    risk_label = "High" if risk_score >= 0.7 else "Moderate" if risk_score >= 0.4 else "Low"

    # 2) SHAP explanation
    explanation = explain_with_shap(model, input_df, top_k=3)

    # 3) GenAI advice
    advice_prompt = (
        f"The patient has a {disease} risk score of {risk_score:.2f} ({risk_label}). "
        f"Key factors: {explanation}. "
        "Provide short, actionable, non-alarming lifestyle and preventive health advice "
        "in 3–4 bullet points."
    )

    try:
        advice_output = advice_generator(advice_prompt, max_length=128, num_return_sequences=1)
        advice_text = advice_output[0]["generated_text"]
    except Exception as e:
        print(f"[WARN] Advice generation failed: {e}")
        advice_text = "Unable to generate detailed advice at the moment. Please consult a healthcare professional."

    return {
        "disease": disease,
        "risk_score": risk_score,
        "risk_label": risk_label,
        "explanation": explanation,
        "advice": advice_text,
    }
