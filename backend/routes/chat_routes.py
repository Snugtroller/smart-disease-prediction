from flask import Blueprint, current_app, request, jsonify

from services.nlp_service import analyze_and_respond

chat_bp = Blueprint("chat_bp", __name__)


@chat_bp.route("/chat", methods=["POST"])
def chat():
    """
    POST /api/chat

    Expected JSON body:
    {
      "message": "I feel anxious about exams"
    }
    """
    try:
        data = request.get_json(force=True)
        message = data.get("message", "").strip()

        if not message:
            return jsonify({"error": "Message cannot be empty"}), 400

        nlp_models = current_app.config["NLP_MODELS"]
        response_payload = analyze_and_respond(message, nlp_models)
        
        # Format response to match frontend expectations
        formatted_response = {
            "response": response_payload.get("bot_reply", ""),
            "sentiment": response_payload.get("sentiment", {}).get("label", "").lower(),
            "confidence": response_payload.get("sentiment", {}).get("score", 0)
        }

        return jsonify(formatted_response), 200

    except Exception as e:
        print(f"[ERROR] /api/chat failed: {e}")
        return jsonify({"error": "Internal server error"}), 500
