from typing import Dict, Any


def analyze_and_respond(message: str, nlp_models: Dict[str, Any]) -> Dict[str, Any]:
    """
    Use sentiment analysis + generative model to provide a mental health chatbot response.

    Returns structure like:
    {
      "sentiment": {"label": "NEGATIVE", "score": 0.91},
      "bot_reply": "I’m sorry you're feeling this way..."
    }
    """
    sentiment_analyzer = nlp_models["sentiment_analyzer"]
    advice_generator = nlp_models["advice_generator"]

    sentiment_result = sentiment_analyzer(message)[0]
    sentiment_label = sentiment_result["label"]
    sentiment_score = float(sentiment_result["score"])

    prompt = (
        "You are a compassionate mental health assistant. "
        "Respond in a supportive, non-judgmental tone. "
        "Do NOT give medical diagnosis. "
        f"User sentiment: {sentiment_label} ({sentiment_score:.2f}). "
        f"User message: {message}"
    )

    try:
        gen_output = advice_generator(prompt, max_length=150, num_return_sequences=1)
        reply = gen_output[0]["generated_text"]
    except Exception as e:
        print(f"[WARN] Chatbot generation failed: {e}")
        reply = (
            "Thank you for sharing that with me. I may not have the perfect words right now, "
            "but you are not alone. If your feelings are overwhelming or you feel unsafe, "
            "please reach out to a trusted person or a professional helpline immediately."
        )

    return {
        "sentiment": {
            "label": sentiment_label,
            "score": sentiment_score,
        },
        "bot_reply": reply,
    }
