from __future__ import annotations

from typing import Dict, Any, List, Optional
import os
import random
import logging

# Import cache service
from .cache_service import chatbot_cache

# -----------------------------------------------------------------------------
# Configuration & Initialization
# -----------------------------------------------------------------------------

BOT_NAME = "MannMitra"  

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# Optional Gemini import
try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False
    genai = None  # type: ignore
    logger.warning(
        "[WARN] google-generativeai not installed. "
        "MannMitra will use fallback responses only."
    )

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()

if GEMINI_AVAILABLE and GEMINI_API_KEY:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        # Use gemini-2.5-flash (available and performant)
        gemini_model = genai.GenerativeModel("gemini-2.5-flash")
        logger.info("[INFO] Gemini AI (2.5-flash) initialized for MannMitra")
    except Exception as e:  # pragma: no cover - defensive
        gemini_model = None
        logger.error(f"[ERROR] Failed to initialize Gemini AI: {e}")
else:
    gemini_model = None
    if GEMINI_AVAILABLE:
        logger.warning(
            "[WARN] GEMINI_API_KEY not set. "
            "MannMitra will use fallback responses only."
        )
    else:
        logger.info("[INFO] Running without Gemini AI. Fallback only.")


# -----------------------------------------------------------------------------
# Helper functions
# -----------------------------------------------------------------------------

def get_mood_lifting_activities(sentiment: str) -> List[str]:
    """
    Get a small list of mood-lifting activities based on the sentiment label.

    Parameters
    ----------
    sentiment : str
        Sentiment label like "positive", "negative", or "neutral".

    Returns
    -------
    List[str]
        Up to three suggested activities.
    """
    activities: Dict[str, List[str]] = {
        "negative": [
            "Take a 10-minute walk outside – gentle movement and fresh air can help.",
            "Try a 5-minute breathing exercise: breathe in for 4, hold for 4, out for 4.",
            "Listen to a comforting playlist or podcast that you enjoy.",
            "Reach out to someone you trust and share a bit about how you're feeling.",
            "Write down 3 small things that went okay today, even if they feel minor.",
            "Do some light stretching or simple yoga poses.",
            "Watch a short, light-hearted or funny video.",
            "Take a warm shower or wash your face with cool water.",
            "Do something creative: doodling, coloring, writing, or crafting.",
            "Try a short guided mindfulness or grounding exercise."
        ],
        "neutral": [
            "Try a new recipe or snack you’ve been curious about.",
            "Organize a small area of your room or desk – a tidy space can feel refreshing.",
            "Learn something new – watch a short tutorial or read a quick article.",
            "Do a quick home workout or dance to a song you like.",
            "Spend a few minutes with plants or in nature if possible.",
            "Spend some time on a hobby you enjoy, even for 10–15 minutes.",
            "Set one small, realistic goal for today and gently work toward it."
        ],
        "positive": [
            "Share your good mood with someone – send a kind message or compliment.",
            "Celebrate your positive feelings by doing a favorite activity.",
            "Try something new you’ve been putting off, while your energy is good.",
            "Support someone else – sometimes helping others deepens our own joy.",
            "Write down what’s going well so you can revisit it on tougher days.",
            "Plan a small treat or fun activity for later in the week."
        ],
    }

    category = sentiment.lower()
    if category not in activities:
        category = "neutral"

    chosen = random.sample(activities[category], min(3, len(activities[category])))
    return chosen


def _is_potential_crisis(text: str) -> bool:
    """
    Heuristic check for potentially serious / crisis language.

    Note: This is NOT a diagnosis, just a simple keyword check to nudge the user
    towards professional or emergency support if needed.
    """
    text_lower = text.lower()
    crisis_keywords = [
        "suicide", "kill myself", "end my life", "self harm",
        "self-harm", "cutting", "hurt myself", "can't go on",
        "want to die", "ending it all",
    ]
    return any(kw in text_lower for kw in crisis_keywords)


def _build_gemini_prompt(message: str, sentiment: str) -> str:
    """
    Build a structured prompt for Gemini tailored for MannMitra.
    """
    return f"""
You are {BOT_NAME}, a compassionate, empathetic mental health support companion.

Your role:
- Listen carefully and without judgment.
- Validate the user's feelings.
- Provide gentle emotional support and simple coping strategies.
- Encourage breaks, self-care, and healthy routines when appropriate.
- Remind the user you are not a replacement for a therapist or doctor.
- Suggest seeking professional help or local emergency services if things sound very serious.

User's detected sentiment: {sentiment}
User's message: {message}

Guidelines:
- Respond in 2–4 short, clear sentences.
- Sound warm, kind, and human.
- Avoid medical diagnosis or clinical labels.
- If the message seems very serious or like a crisis, gently suggest reaching out
  to a mental health professional, a trusted person, or local emergency/helpline.

Now respond as {BOT_NAME}.
""".strip()


# -----------------------------------------------------------------------------
# Core response generation
# -----------------------------------------------------------------------------

def generate_ai_response(message: str, sentiment: str) -> str:
    """
    Generate a supportive response using Gemini AI if available, otherwise use
    a rule-based fallback.

    Parameters
    ----------
    message : str
        User's input text.
    sentiment : str
        Sentiment label from the sentiment analyzer.

    Returns
    -------
    str
        The chatbot's reply text.
    """
    if not gemini_model:
        # Fallback to rule-based responses
        return generate_fallback_response(message, sentiment)

    try:
        prompt = _build_gemini_prompt(message, sentiment)
        
        # Try cache first
        cached = chatbot_cache.get(sentiment, message)
        if cached:
            logger.info("[CACHE HIT] Chatbot response")
            return cached
        
        response = gemini_model.generate_content(prompt)
        text = (response.text or "").strip()
        if not text:
            raise ValueError("Empty response from Gemini")

        # Optional extra safety: append crisis guidance if needed
        if _is_potential_crisis(message):
            text += (
                "\n\nI’m really glad you shared this with me. "
                "I’m not a crisis service, but if you feel in immediate danger "
                "or overwhelmed, please consider contacting local emergency "
                "services, a trusted person, or a professional helpline in your area."
            )
        # Cache the response
        chatbot_cache.set(sentiment, message, text)
        logger.info("[CACHE MISS] Generated chatbot response")
        return text

    except Exception as e:  # pragma: no cover - defensive
        logger.error(f"[ERROR] Gemini AI failed: {e}")
        return generate_fallback_response(message, sentiment)


def generate_fallback_response(message: str, sentiment: str) -> str:
    """
    Rule-based fallback responses when Gemini AI is unavailable.

    Parameters
    ----------
    message : str
        User's input text.
    sentiment : str
        Sentiment label from the sentiment analyzer.

    Returns
    -------
    str
        The chatbot's reply text.
    """
    message_lower = message.lower()

    # Greetings
    if any(word in message_lower for word in ["hello", "hi", "hey", "greetings"]):
        return (
            f"Hi there, I’m {BOT_NAME}. 🌿 "
            "I’m here to listen and support you. How are you feeling right now?"
        )

    # Sadness / Depression
    if any(word in message_lower for word in ["sad", "depressed", "down", "unhappy", "crying", "tears"]):
        return (
            "I’m really sorry that you’re feeling this way. Your feelings are valid, "
            "and you don’t have to go through this alone. If you’d like, you can tell "
            "me a bit more about what’s weighing on your mind, and we can unpack it gently together."
        )

    # Anxiety / Stress
    if any(word in message_lower for word in ["anxious", "worried", "stress", "stressed", "nervous", "panic", "overwhelm"]):
        return (
            "It sounds like you’re feeling really overwhelmed, and that can be exhausting. "
            "Let’s take this one small step at a time. What’s the biggest thought or worry "
            "on your mind right now?"
        )

    # Loneliness
    if any(word in message_lower for word in ["lonely", "alone", "isolated", "nobody"]):
        return (
            "Feeling lonely can be very painful. Even though it might not feel like it, "
            "you matter and your feelings matter. I’m here with you right now — would you "
            "like to share what this loneliness has been like for you?"
        )

    # Anger / Frustration
    if any(word in message_lower for word in ["angry", "mad", "frustrated", "annoyed", "furious", "rage"]):
        return (
            "It’s completely okay to feel angry or frustrated — those emotions are valid too. "
            "If you’d like, you can tell me what happened, and we can explore it together in a calmer way."
        )

    # Potential crisis language
    if _is_potential_crisis(message):
        return (
            "Thank you for opening up about something this heavy. What you’re feeling is important, "
            "and you deserve support. I’m here to listen, but I’m not a crisis service. "
            "If you feel at risk of harming yourself or in immediate danger, please reach out to "
            "local emergency services, a trusted person, or a professional helpline in your area."
        )

    # Positive emotions
    if sentiment.lower() == "positive":
        return (
            "I’m really glad you’re feeling positive today! 🌟 "
            "What’s been going well for you or bringing you a bit of joy lately?"
        )

    # General negative
    if sentiment.lower() == "negative":
        return (
            "It sounds like things have been tough for you. I’m here to listen and support you "
            "without judgment. If you’d like, you can share a bit more about what’s been bothering you."
        )

    # Neutral / default
    return (
        "Thank you for sharing that with me. I’m here as a listening ear. "
        "How would you describe your mood in this moment?"
    )


def get_llm_status() -> Dict[str, Any]:
    """Return whether Gemini is enabled.

    Used by a lightweight status endpoint so the frontend can verify whether
    the chatbot is using Gemini or fallback responses.
    """
    return {
        "provider": "gemini" if gemini_model else "fallback",
        "gemini_enabled": bool(gemini_model),
        "model": getattr(gemini_model, "model_name", None) if gemini_model else None,
    }


# -----------------------------------------------------------------------------
# Public API
# -----------------------------------------------------------------------------

def analyze_and_respond(message: str, nlp_models: Dict[str, Any]) -> Dict[str, Any]:
    """
    Run sentiment analysis on the message and generate a supportive response.

    This is the main function you will call from your Flask route, e.g. `/chat`.

    Parameters
    ----------
    message : str
        User's input message.
    nlp_models : Dict[str, Any]
        Dictionary of NLP-related models or pipelines.
        Expected key:
            - "sentiment_analyzer": a callable like a Hugging Face pipeline
              that returns a list of dicts with "label" and "score".

    Returns
    -------
    Dict[str, Any]
        {
            "bot_name": str,
            "sentiment": { "label": str, "score": float },
            "bot_reply": str,
            "suggested_activities": List[str]
        }
    """
    sentiment_analyzer = nlp_models["sentiment_analyzer"]

    result = sentiment_analyzer(message)[0]
    sentiment_label: str = result.get("label", "NEUTRAL")
    sentiment_score: float = float(result.get("score", 0.0))

    # Generate AI-powered response
    reply = generate_ai_response(message, sentiment_label)

    # Mood-lifting activities for negative sentiment
    activities: List[str] = []
    if sentiment_label.lower() == "negative":
        activities = get_mood_lifting_activities(sentiment_label)
        if activities:
            activities_text = "\n\nHere are a few gentle ideas that might help a little:\n"
            for i, activity in enumerate(activities, 1):
                activities_text += f"• {activity}\n"
            reply += activities_text

    return {
        "bot_name": BOT_NAME,
        "sentiment": {
            "label": sentiment_label,
            "score": sentiment_score,
        },
        "bot_reply": reply,
        "suggested_activities": activities,
    }
