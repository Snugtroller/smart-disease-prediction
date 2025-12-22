# Smart Disease Prediction System

A full-stack AI-powered health assessment platform combining disease risk prediction with mental health support.

## 🎯 Features

### 🏥 Disease Risk Prediction
- Multi-disease prediction (Diabetes, Heart Disease, Hypertension)
- Machine learning models for accurate risk assessment
- Explainable AI with SHAP values showing contributing factors
- Personalized preventive health advice

### 💬 Mental Health Support
- AI chatbot for emotional support
- Sentiment analysis to understand user emotions
- Empathetic responses with confidence scoring
- Real-time conversational interface

## 🏗️ Project Structure

```
├── backend/                    # Flask API server
│   ├── app.py                 # Main application entry point
│   ├── config.py              # Configuration settings
│   ├── routes/                # API route handlers
│   │   ├── predict_routes.py # Disease prediction endpoints
│   │   └── chat_routes.py    # Mental health chat endpoints
│   ├── services/              # Business logic and ML services
│   │   ├── model_loader.py   # ML model loading
│   │   ├── prediction_service.py
│   │   ├── nlp_service.py
│   │   └── xai_service.py    # Explainable AI service
│   ├── models/                # ML model files (.pkl, .h5, etc.)
│   └── data/                  # Dataset files
│
└── frontend/                  # Next.js web application
    ├── src/
    │   ├── app/              # Next.js app directory
    │   │   ├── page.js       # Main landing page
    │   │   ├── layout.js     # Root layout
    │   │   └── globals.css   # Global styles
    │   ├── components/       # React components
    │   │   ├── HealthForm.jsx    # Disease prediction form
    │   │   └── ChatBot.jsx       # Mental health chatbot
    │   └── lib/
    │       └── api.js        # API client (axios)
    ├── public/               # Static assets
    └── package.json          # Frontend dependencies
```

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- Node.js 18+
- pip and npm/yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Start the Flask server:**
   ```bash
   python app.py
   ```
   
   ✅ Backend API will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` if your backend runs on a different URL.

4. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   
   ✅ Frontend will be available at `http://localhost:3000`

## 📡 API Endpoints

### Disease Prediction
```
POST /api/predict
```
**Request Body:**
```json
{
  "disease": "diabetes",
  "age": 45,
  "bmi": 27.3,
  "glucose": 145
}
```

**Response:**
```json
{
  "disease": "diabetes",
  "risk_score": 0.72,
  "risk_label": "High",
  "explanation": [
    {
      "feature": "glucose",
      "value": 145,
      "shap_value": 0.43
    }
  ],
  "advice": "AI-generated preventive advice..."
}
```

### Mental Health Chat
```
POST /api/chat
```
**Request Body:**
```json
{
  "message": "I've been feeling anxious lately"
}
```

**Response:**
```json
{
  "response": "I hear that you're experiencing anxiety...",
  "sentiment": "negative",
  "confidence": 0.85
}
```

## 🛠️ Tech Stack

### Backend
- **Framework:** Flask
- **CORS:** Flask-CORS
- **ML Libraries:** scikit-learn, TensorFlow/PyTorch
- **NLP:** Transformers, spaCy
- **XAI:** SHAP (SHapley Additive exPlanations)

### Frontend
- **Framework:** Next.js 15 (App Router)
- **UI:** React 19, Tailwind CSS
- **HTTP Client:** Axios
- **Styling:** Tailwind CSS with custom gradient utilities

## 📝 Usage

1. **Disease Risk Assessment:**
   - Select a disease type (Diabetes, Heart Disease, or Hypertension)
   - Enter health parameters (age, BMI, glucose levels)
   - Click "Predict Risk" to get your assessment
   - Review SHAP explanations and personalized advice

2. **Mental Health Support:**
   - Switch to the "Mental Health Support" tab
   - Type your feelings or concerns in the chat
   - Receive empathetic AI responses
   - View sentiment analysis of your messages

## ⚠️ Disclaimer

This system is for educational and informational purposes only. It should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.

## 📄 License

MIT

## 👨‍💻 Author

VijayMakkad
