import os
from typing import Dict, Any

import joblib

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, "models", "disease")


def _safe_load_model(path: str):
    """
    Helper for lazy-loading models. In MVP phase this can be a dummy or stub.
    """
    if not os.path.exists(path):
        # Stub: in real deployment, raise or log a critical error
        print(f"[WARN] Model file not found at: {path}. Using dummy model.")
        return None
    return joblib.load(path)


def load_disease_models() -> Dict[str, Any]:
    """
    Load disease prediction models into memory.
    """
    models = {
        "diabetes": _safe_load_model(os.path.join(MODELS_DIR, "diabetes_model.pkl")),
        "heart": _safe_load_model(os.path.join(MODELS_DIR, "heart_model.pkl")),
        "hypertension": _safe_load_model(os.path.join(MODELS_DIR, "hypertension_model.pkl")),
    }
    print("[INFO] Disease models loaded:", list(models.keys()))
    return models


def load_nlp_models() -> Dict[str, Any]:
    """
    Load NLP models for mental health chatbot.
    Only loading sentiment analyzer - using Gemini AI for responses.
    """
    from transformers import pipeline

    # Only load sentiment analyzer (lightweight)
    sentiment_analyzer = pipeline("sentiment-analysis")

    print("[INFO] NLP models loaded: sentiment_analyzer")

    return {
        "sentiment_analyzer": sentiment_analyzer,
    }
