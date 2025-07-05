from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import traceback
import random

app = FastAPI(title="AI Wellness Assistant API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://127.0.0.1:3000", "http://127.0.0.1:3001", "http://127.0.0.1:3002"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    question: str

class ChatResponse(BaseModel):
    answer: str
    error: Optional[str] = None

# Wellness advice database
wellness_responses = {
    "stress": [
        "Stress is a natural response, but chronic stress can impact your health. Try deep breathing exercises, meditation, or taking short breaks throughout your day. Regular physical activity and maintaining a consistent sleep schedule can also help manage stress levels.",
        "When feeling stressed, practice the 4-7-8 breathing technique: inhale for 4 seconds, hold for 7, exhale for 8. This activates your parasympathetic nervous system and helps you relax.",
        "Consider creating a stress management routine that includes mindfulness practices, regular exercise, and time for activities you enjoy. Remember, it's okay to ask for help when stress becomes overwhelming."
    ],
    "sleep": [
        "Quality sleep is crucial for mental and physical health. Aim for 7-9 hours per night. Create a relaxing bedtime routine, keep your bedroom cool and dark, and avoid screens 1 hour before bed.",
        "If you're having trouble sleeping, try establishing a consistent sleep schedule, avoiding caffeine after 2 PM, and creating a comfortable sleep environment. Consider relaxation techniques like progressive muscle relaxation.",
        "Good sleep hygiene includes maintaining a regular sleep schedule, creating a restful environment, and avoiding large meals, caffeine, and alcohol close to bedtime."
    ],
    "exercise": [
        "Regular physical activity is essential for both physical and mental health. Aim for at least 150 minutes of moderate exercise per week. Start with activities you enjoy and gradually increase intensity.",
        "Exercise releases endorphins that can improve mood and reduce stress. Even a 10-minute walk can make a difference. Find activities that fit your lifestyle and schedule.",
        "Physical activity doesn't have to be intense to be beneficial. Walking, yoga, swimming, or dancing are all great options. The key is consistency and finding something you enjoy."
    ],
    "nutrition": [
        "A balanced diet rich in fruits, vegetables, whole grains, and lean proteins supports both physical and mental health. Stay hydrated and try to eat regular meals throughout the day.",
        "Certain foods can impact your mood. Omega-3 fatty acids, found in fish and nuts, may help with depression. Complex carbohydrates can help stabilize blood sugar and mood.",
        "Eating regular, balanced meals helps maintain stable blood sugar levels, which can improve mood and energy. Don't skip meals, and try to include protein with each meal."
    ],
    "meditation": [
        "Meditation can help reduce stress, improve focus, and promote emotional well-being. Start with just 5-10 minutes daily. Focus on your breath and gently return your attention when your mind wanders.",
        "Mindfulness meditation involves paying attention to the present moment without judgment. You can practice this anywhere - while walking, eating, or doing daily activities.",
        "There are many types of meditation. Try different approaches to find what works for you. Guided meditations, available through apps and online, can be helpful for beginners."
    ],
    "anxiety": [
        "Anxiety is a common experience, but there are effective ways to manage it. Deep breathing, progressive muscle relaxation, and grounding techniques can help during anxious moments.",
        "When feeling anxious, try the 5-4-3-2-1 grounding technique: identify 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.",
        "Regular exercise, adequate sleep, and limiting caffeine and alcohol can help reduce anxiety. Consider talking to a mental health professional if anxiety significantly impacts your daily life."
    ],
    "depression": [
        "Depression is a serious condition that affects many people. Symptoms can include persistent sadness, loss of interest in activities, changes in sleep or appetite, and difficulty concentrating.",
        "If you're experiencing symptoms of depression, it's important to reach out for help. Talk to a healthcare provider or mental health professional. Treatment options include therapy, medication, and lifestyle changes.",
        "Small steps can make a difference when dealing with depression. Try to maintain a routine, get some physical activity, stay connected with others, and practice self-care activities you enjoy."
    ],
    "general": [
        "Taking care of your mental health is just as important as physical health. Regular self-care, maintaining social connections, and seeking help when needed are all important aspects of wellness.",
        "Everyone's wellness journey is unique. What works for one person may not work for another. Be patient with yourself and celebrate small progress.",
        "Building healthy habits takes time. Start small and be consistent. Remember that it's okay to have setbacks - they're a normal part of the process.",
        "Your mental health matters. Don't hesitate to reach out for support from friends, family, or mental health professionals when you need it."
    ]
}

def get_ai_response(question: str) -> str:
    """Generate an AI-like response based on the question content."""
    question_lower = question.lower()
    
    # Check for specific topics
    if any(word in question_lower for word in ["stress", "stressed", "overwhelmed"]):
        return random.choice(wellness_responses["stress"])
    elif any(word in question_lower for word in ["sleep", "insomnia", "tired", "rest"]):
        return random.choice(wellness_responses["sleep"])
    elif any(word in question_lower for word in ["exercise", "workout", "fitness", "physical"]):
        return random.choice(wellness_responses["exercise"])
    elif any(word in question_lower for word in ["diet", "nutrition", "food", "eating"]):
        return random.choice(wellness_responses["nutrition"])
    elif any(word in question_lower for word in ["meditation", "mindfulness", "breathing"]):
        return random.choice(wellness_responses["meditation"])
    elif any(word in question_lower for word in ["anxiety", "anxious", "worry", "panic"]):
        return random.choice(wellness_responses["anxiety"])
    elif any(word in question_lower for word in ["depression", "depressed", "sad", "hopeless"]):
        return random.choice(wellness_responses["depression"])
    elif any(word in question_lower for word in ["hi", "hello", "hey"]):
        return "Hello! I'm here to help you with your health and wellness questions. How can I assist you today? Feel free to ask about stress management, sleep, exercise, nutrition, meditation, or any other wellness topics."
    else:
        return random.choice(wellness_responses["general"])

@app.get("/health")
def health_check():
    return {"status": "healthy", "message": "AI Wellness Assistant is running"}

@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    try:
        answer = get_ai_response(request.question)
        return ChatResponse(answer=answer)
    except Exception as e:
        return ChatResponse(answer="", error=str(e) + "\n" + traceback.format_exc()) 