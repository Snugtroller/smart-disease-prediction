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
    For MVP: keep it simple / lightweight; you can later swap to proper HF pipelines.
    """
    from transformers import pipeline

    # NOTE: These can be heavy; consider one-time downloading in setup phase.
    sentiment_analyzer = pipeline("sentiment-analysis")
    advice_generator = pipeline(
        "text2text-generation",
        model="google/flan-t5-small"  # you can later change to flan-t5-large
    )

    print("[INFO] NLP models loaded: sentiment_analyzer, advice_generator")

    return {
        "sentiment_analyzer": sentiment_analyzer,
        "advice_generator": advice_generator,
    }
