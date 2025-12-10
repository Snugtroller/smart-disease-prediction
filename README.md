# Smart Disease Prediction System

A full-stack application for disease prediction using machine learning with an intelligent chatbot interface.

## Project Structure

```
├── backend/          # Flask API server
│   ├── app.py       # Main application entry point
│   ├── config.py    # Configuration settings
│   ├── routes/      # API route handlers
│   ├── services/    # Business logic and ML services
│   ├── models/      # ML model files
│   └── data/        # Data files
│
└── frontend/        # Next.js web application
    └── ...
```

## Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the Flask server:
```bash
python app.py
```

The backend API will be available at `http://localhost:5000`

## Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

The frontend will be available at `http://localhost:3000`

## Features

- Disease prediction using machine learning models
- Interactive chatbot interface for symptom analysis
- Natural language processing for symptom extraction
- Explainable AI (XAI) for prediction insights
- Modern, responsive web interface

## Technologies

**Backend:**
- Flask
- Python ML libraries
- NLP services

**Frontend:**
- Next.js
- React
- TypeScript

## License

MIT
