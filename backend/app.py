from flask import Flask
from flask_cors import CORS

from services.model_loader import load_disease_models, load_nlp_models
from routes.predict_routes import predict_bp
from routes.chat_routes import chat_bp


def create_app() -> Flask:
    """
    Application factory for the Smart Disease Prediction and Prevention System.
    """
    app = Flask(__name__)

    # CORS: allow Next.js dev server (localhost:3000) + generic for now
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Load ML models at startup (avoid per-request loading overhead)
    disease_models = load_disease_models()
    nlp_models = load_nlp_models()

    # Attach models to app config for easy access in routes/services
    app.config["DISEASE_MODELS"] = disease_models
    app.config["NLP_MODELS"] = nlp_models

    # Register blueprints
    app.register_blueprint(predict_bp, url_prefix="/api")
    app.register_blueprint(chat_bp, url_prefix="/api")

    @app.route("/health", methods=["GET"])
    def health_check():
        return {"status": "ok", "message": "Smart Disease API running"}, 200

    return app


app = create_app()

if __name__ == "__main__":
    # For development; in production use gunicorn/uwsgi, etc.
    app.run(host="0.0.0.0", port=5000, debug=True)
