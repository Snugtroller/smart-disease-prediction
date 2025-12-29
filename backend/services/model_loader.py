import os
from typing import Dict, Any
import joblib

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, "models")


def _safe_load_model(path: str):
    if not os.path.exists(path):
        print(f"[ERROR] Model file NOT FOUND: {path}")
        return None
    model = joblib.load(path)
    try:
        setattr(model, "_sdp_model_path", path)
    except Exception:
        pass
    print(f"[INFO] Loaded model from {path}")
    return model


def load_disease_models() -> Dict[str, Any]:
    """
    Load trained ML models into memory at startup.
    """
    models = {
        "diabetes": _safe_load_model(
            os.path.join(MODELS_DIR, "xgb_model.pkl")
        ),
        "hypertension": _safe_load_model(
            os.path.join(MODELS_DIR, "hypertension_rf_calibrated.pkl")
        ),
        "stroke": _safe_load_model(
            os.path.join(MODELS_DIR, "stroke_xgb.pkl")
        ),
        # Heart disease can be added later
        "heart": None,
    }

    for k, v in models.items():
        if v is None:
            print(f"[WARN] Model for '{k}' is None")
        else:
            features = getattr(v, "feature_names_in_", None)
            if features is not None:
                print(f"[OK] Model '{k}' ready with features:", features)
            else:
                print(f"[OK] Model '{k}' ready")

    return models


def load_nlp_models() -> Dict[str, Any]:
    from transformers import pipeline
    import os

    sentiment_analyzer = pipeline("sentiment-analysis")
    
    # Use Gemini for advice generation (same as chatbot) - use stable model
    try:
        import google.generativeai as genai
        GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()
        
        if GEMINI_API_KEY:
            genai.configure(api_key=GEMINI_API_KEY)
            # Use gemini-1.5-flash (stable model with better quota)
            advice_generator = genai.GenerativeModel("gemini-1.5-flash")
            print("[INFO] Gemini AI (1.5-flash) initialized for advice generation")
        else:
            advice_generator = None
            print("[WARN] GEMINI_API_KEY not set. Using static advice.")
    except Exception as e:
        print(f"[WARN] Could not load Gemini for advice: {e}")
        advice_generator = None

    print("[INFO] NLP models loaded")

    return {
        "sentiment_analyzer": sentiment_analyzer,
        "advice_generator": advice_generator,
    }
