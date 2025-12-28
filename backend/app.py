from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


def _patch_importlib_metadata_for_py39() -> None:
    """Backport importlib.metadata.packages_distributions for Python 3.9.

    Some third-party libraries (e.g. google-api-core) call
    importlib.metadata.packages_distributions(), which exists in Python 3.10+.
    On Python 3.9 we patch it from the importlib-metadata backport if available.
    """
    try:
        import importlib.metadata as stdlib_metadata

        if hasattr(stdlib_metadata, "packages_distributions"):
            return

        import importlib_metadata as backport_metadata  # type: ignore

        stdlib_metadata.packages_distributions = backport_metadata.packages_distributions  # type: ignore[attr-defined]
    except Exception:
        # If anything goes wrong, don't prevent the app from starting.
        return


_patch_importlib_metadata_for_py39()

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
    app.config["ADVICE_GENERATOR"] = nlp_models.get("advice_generator")

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
    # Disable auto-reloader to avoid duplicate processes and "wrong code" confusion.
    app.run(host="0.0.0.0", port=5001, debug=True, use_reloader=False)
