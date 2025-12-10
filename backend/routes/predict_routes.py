from flask import Blueprint, current_app, request, jsonify

from services.prediction_service import predict_disease_risk

predict_bp = Blueprint("predict_bp", __name__)


@predict_bp.route("/predict", methods=["POST"])
def predict():
    """
    POST /api/predict

    Expected JSON body:
    {
      "disease": "diabetes",
      "age": 45,
      "bmi": 27.3,
      "glucose": 145
    }
    """
    try:
        payload = request.get_json(force=True)
        disease = payload.get("disease", "diabetes").lower()

        if disease not in {"diabetes", "heart", "hypertension"}:
            return jsonify({"error": "Unsupported disease type"}), 400

        disease_models = current_app.config["DISEASE_MODELS"]
        nlp_models = current_app.config["NLP_MODELS"]

        prediction_result = predict_disease_risk(
            disease=disease,
            payload=payload,
            models=disease_models,
            advice_generator=nlp_models["advice_generator"],
        )

        return jsonify(prediction_result), 200

    except Exception as e:
        print(f"[ERROR] /api/predict failed: {e}")
        return jsonify({"error": "Internal server error"}), 500
