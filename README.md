# MoodSphere - AI-Powered Mental Wellness Platform

A comprehensive mental wellness web application built with Next.js, featuring AI-powered wellness assistance, mood tracking, and interactive wellness activities.

## Features

- 🧠 **AI Wellness Assistant** - Chat with an AI-powered wellness advisor
- 📊 **Mood Journaling** - Track your daily moods and emotions
- 🎮 **Interactive Games** - Breathing exercises, emotion recognition, and gratitude garden
- 📈 **Insights Dashboard** - Visualize your mood patterns and wellness journey
- 🏃‍♂️ **Activity Tracking** - Monitor wellness activities and progress
- 💓 **Wearable Integration** - Connect heart rate monitors via Web Bluetooth API
- 🌟 **Self-Care Resources** - Access curated wellness content and activities

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: FastAPI (Python) with AI wellness responses
- **Styling**: Shadcn/ui components
- **Deployment**: Vercel (Frontend), Docker (Backend)

## Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Python 3.8+ (for backend)

### Frontend Setup

1. Clone the repository:
```bash
git clone https://github.com/anmolsalaria/mood-sphere.git
cd mood-sphere
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Backend Setup (Optional - for AI Assistant)

1. Navigate to the backend directory:
```bash
cd Llama-2-GGML-Medical-Chatbot
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

4. Run the FastAPI server:
```bash
uvicorn fastapi_app:app --host 0.0.0.0 --port 8000
```

Or use Docker:
```bash
docker build -t ai-wellness-assistant-backend .
docker run -p 8000:8000 ai-wellness-assistant-backend
```

## Deployment

### Vercel Deployment (Frontend)

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect Next.js and deploy
3. Set environment variables if needed
4. Your app will be available at `https://your-app.vercel.app`

### Backend Deployment

For the AI Wellness Assistant backend, you can deploy to:
- **Railway**: Easy Python deployment
- **Render**: Free tier available
- **Heroku**: Traditional option
- **DigitalOcean App Platform**: Scalable solution

## Environment Variables

Create a `.env.local` file for local development:

```env
# Frontend (if needed)
NEXT_PUBLIC_API_URL=http://localhost:8000

# Backend (if using external AI services)
OPENAI_API_KEY=your_api_key_here
```

## Project Structure

```
moodsphere1/
├── app/                    # Next.js app directory
│   ├── ai-wellness-assistant/  # AI chat interface
│   ├── insights/           # Analytics dashboard
│   ├── mood-journal/       # Mood tracking
│   ├── self-care/          # Wellness activities
│   └── community/          # Community features
├── components/             # Reusable UI components
│   ├── ui/                # Shadcn/ui components
│   └── games/             # Interactive wellness games
├── contexts/              # React contexts
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
└── Llama-2-GGML-Medical-Chatbot/  # Backend API
    ├── fastapi_app.py     # FastAPI application
    ├── Dockerfile         # Docker configuration
    └── requirements.txt   # Python dependencies
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@moodsphere.com or create an issue in this repository.

## Acknowledgments

- Built with Next.js and React
- UI components from Shadcn/ui
- AI responses powered by wellness knowledge base
- Icons from Lucide React 