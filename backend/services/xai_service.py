from typing import List, Dict, Any

import numpy as np
import pandas as pd
import shap


def _safe_scalar(value: Any) -> float:
    """Convert common pandas/numpy scalars to float safely."""
    try:
        if isinstance(value, pd.Series):
            value = value.iloc[0]
        if pd.isna(value):
            return 0.0

        as_float = float(value)
        # Never allow NaN/inf into JSON responses (breaks JSON parsers like axios).
        if not np.isfinite(as_float):
            return 0.0

        return as_float
    except Exception:
        return 0.0


def _unwrap_for_tree_explainer(model: Any) -> Any:
    """SHAP TreeExplainer doesn't support some sklearn wrappers (e.g. CalibratedClassifierCV)."""
    try:
        from sklearn.calibration import CalibratedClassifierCV  # type: ignore

        if isinstance(model, CalibratedClassifierCV):
            # Prefer a fitted underlying estimator if present
            calibrated = getattr(model, "calibrated_classifiers_", None)
            if calibrated:
                inner = getattr(calibrated[0], "estimator", None)
                if inner is not None:
                    return inner

            for attr in ("estimator", "base_estimator_", "base_estimator"):
                inner = getattr(model, attr, None)
                if inner is not None:
                    return inner
    except Exception:
        # If sklearn isn't installed or anything unexpected happens, just return original
        return model

    return model


def _heuristic_explanation(input_df: pd.DataFrame, top_k: int) -> List[Dict]:
    """Fallback explanation when SHAP cannot be computed.

    Returns a stable, frontend-friendly structure without crashing the API.
    """
    feature_names = list(input_df.columns)
    if not feature_names:
        return []

    values = [_safe_scalar(input_df.iloc[0, i]) for i in range(len(feature_names))]
    contributions: List[Dict] = []

    # Simple direction+importance proxy in [-1, 1]
    for name, val in zip(feature_names, values):
        shap_like = float(val) / (abs(float(val)) + 1.0) if np.isfinite(val) else 0.0

        contributions.append(
            {
                "feature": name,
                "value": val,
                "shap_value": shap_like,
            }
        )

    contributions = sorted(contributions, key=lambda x: abs(x["shap_value"]), reverse=True)[:top_k]
    return contributions


def explain_with_shap(model, input_df: pd.DataFrame, top_k: int = 3) -> List[Dict]:
    """
    Generate SHAP explanation for a single-row input_df.

    Returns a list of top_k feature contributions:
    [
      {"feature": "glucose", "value": 145, "shap_value": 0.23},
      ...
    ]
    """
    if model is None:
        return _heuristic_explanation(input_df, top_k=top_k)

    # For tree-based models (RandomForest/XGBoost) we can use TreeExplainer.
    # Some wrappers (e.g. CalibratedClassifierCV) are not supported; unwrap if possible.
    model_for_shap = _unwrap_for_tree_explainer(model)

    try:
        explainer = shap.TreeExplainer(model_for_shap)
        shap_values = explainer.shap_values(input_df)
    except Exception:
        return _heuristic_explanation(input_df, top_k=top_k)

    # Handle different SHAP output formats for binary classifiers
    if isinstance(shap_values, list) and len(shap_values) > 1:
        # Format: [class0_array, class1_array]
        shap_values = shap_values[1]  # focus on positive class
        shap_row = shap_values[0]  # single input row
    elif isinstance(shap_values, np.ndarray):
        if shap_values.ndim == 3 and shap_values.shape[2] == 2:
            # Format: (n_samples, n_features, n_classes)
            shap_row = shap_values[0, :, 1]  # first sample, all features, positive class
        elif shap_values.ndim == 2 and shap_values.shape[1] == 2:
            # Format: (n_features, n_classes)
            shap_row = shap_values[:, 1]  # all features, positive class
        else:
            # Single class or regression: (n_samples, n_features)
            shap_row = shap_values[0] if shap_values.ndim > 1 else shap_values
    else:
        # Fallback
        shap_row = shap_values[0] if hasattr(shap_values, '__getitem__') else shap_values

    feature_names = input_df.columns

    contributions = [
        {
            "feature": feature_names[i],
            "value": _safe_scalar(input_df.iloc[0, i]),
            "shap_value": _safe_scalar(shap_row[i]),
        }
        for i in range(len(feature_names))
    ]

    # Sort by absolute SHAP value, pick top_k
    contributions = sorted(contributions, key=lambda x: abs(x["shap_value"]), reverse=True)[:top_k]
    return contributions
