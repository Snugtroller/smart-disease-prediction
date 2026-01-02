from flask import Blueprint, current_app, request, jsonify

from services.prediction_service import predict_disease_risk
from services.cache_service import advice_cache, chatbot_cache

predict_bp = Blueprint("predict_bp", __name__)


@predict_bp.route("/predict", methods=["POST"])
def predict():
    """
    POST /api/predict

    Expected JSON body:
    For Diabetes:
    {
      "disease": "diabetes",
      "age": 45,
      "bmi": 27.3,
      "highbp": 1,
      "highchol": 1,
      "genhlth": 3,
      "diffwalk": 0
    }

    For Hypertension:
    {
      "disease": "hypertension",
      "age": 55,
      "sex": 1,
      "trestbps": 140,
      "chol": 250,
      "fbs": 0,
      "restecg": 1,
      "exang": 0,
      "slope": 2
    }

    For Stroke:
    {
      "disease": "stroke",
      "age": 50,
      "hypertension": 1,
      "heart_disease": 0,
      "avg_glucose_level": 150,
      "bmi": 28.5,
      "smoking_status": 1,
      "ever_married": 1
    }
    """
    try:
        payload = request.get_json(force=True)
        disease = payload.get("disease", "diabetes").lower()

        if disease == "heart":
            return jsonify({"error": "Heart disease model is not available right now"}), 400

        if disease not in {"diabetes", "hypertension", "stroke"}:
            return jsonify({"error": "Unsupported disease type. Use: diabetes, hypertension, or stroke"}), 400

        disease_models = current_app.config["DISEASE_MODELS"]
        advice_generator = current_app.config.get("ADVICE_GENERATOR")

        prediction_result = predict_disease_risk(
            disease=disease,
            payload=payload,
            models=disease_models,
            advice_generator=advice_generator,
        )

        return jsonify(prediction_result), 200

    except (KeyError, ValueError, AssertionError) as e:
        # Input/validation errors should be 4xx so the frontend can show a proper message.
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        print(f"[ERROR] /api/predict failed: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": "Internal server error"}), 500
