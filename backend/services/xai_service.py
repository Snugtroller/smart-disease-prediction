from typing import List, Dict

import numpy as np
import pandas as pd
import shap


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
        # Stub explanation for MVP
        return [
            {"feature": "glucose", "value": float(input_df.get("glucose", np.nan)), "shap_value": 0.25},
            {"feature": "bmi", "value": float(input_df.get("bmi", np.nan)), "shap_value": 0.18},
            {"feature": "age", "value": float(input_df.get("age", np.nan)), "shap_value": 0.12},
        ]

    # For tree-based models (RandomForest/XGBoost) we can use TreeExplainer
    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(input_df)

    # For binary classifier: shap_values is [class0, class1]
    if isinstance(shap_values, list) and len(shap_values) > 1:
        shap_values = shap_values[1]  # focus on positive class

    shap_row = shap_values[0]  # single input row
    feature_names = input_df.columns

    contributions = [
        {
            "feature": feature_names[i],
            "value": float(input_df.iloc[0, i]),
            "shap_value": float(shap_row[i]),
        }
        for i in range(len(feature_names))
    ]

    # Sort by absolute SHAP value, pick top_k
    contributions = sorted(contributions, key=lambda x: abs(x["shap_value"]), reverse=True)[:top_k]
    return contributions
