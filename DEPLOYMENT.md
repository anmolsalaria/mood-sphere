# Backend Deployment Guide

## Quick Fix for AI Assistant Connection Issue

Your MoodSphere app is deployed on Vercel but the AI Assistant can't connect because the backend isn't deployed. Here's how to fix it:

## Option 1: Railway (Recommended - 5 minutes)

1. **Go to [Railway](https://railway.app)** and sign up with GitHub
2. **Click "New Project"** → "Deploy from GitHub repo"
3. **Select your `mood-sphere` repository**
4. **Set the source directory** to `Llama-2-GGML-Medical-Chatbot`
5. **Railway will automatically detect** the Dockerfile and deploy
6. **Copy the deployment URL** (e.g., `https://your-app.railway.app`)
7. **Update the frontend** with your Railway URL

### Update Frontend with Railway URL

Replace the placeholder URL in `app/ai-wellness-assistant/page.tsx`:

```typescript
const backendUrl = process.env.NODE_ENV === 'production' 
  ? 'https://your-actual-railway-url.railway.app/chat'  // Your Railway URL here
  : 'http://localhost:8000/chat'
```

Then redeploy to Vercel:
```bash
git add .
git commit -m "Update backend URL"
git push origin main
```

## Option 2: Render (Free Tier)

1. **Go to [Render](https://render.com)** and sign up
2. **Click "New"** → "Web Service"
3. **Connect your GitHub repo**
4. **Set build command**: `pip install -r requirements.txt`
5. **Set start command**: `uvicorn fastapi_app:app --host 0.0.0.0 --port $PORT`
6. **Deploy and copy the URL**

## Option 3: Heroku

1. **Install Heroku CLI**
2. **Create `Procfile`** in `Llama-2-GGML-Medical-Chatbot/`:
   ```
   web: uvicorn fastapi_app:app --host 0.0.0.0 --port $PORT
   ```
3. **Deploy**:
   ```bash
   cd Llama-2-GGML-Medical-Chatbot
   heroku create your-app-name
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

## Environment Variables (if needed)

If you need to set environment variables:

### Railway
- Go to your project → Variables tab
- Add any required environment variables

### Render
- Go to your service → Environment tab
- Add environment variables

### Heroku
```bash
heroku config:set VARIABLE_NAME=value
```

## Testing the Deployment

1. **Deploy the backend** using one of the options above
2. **Get the deployment URL** (e.g., `https://your-app.railway.app`)
3. **Test the API** by visiting `https://your-app.railway.app/` (should show FastAPI docs)
4. **Update the frontend** with the correct URL
5. **Redeploy to Vercel**
6. **Test the AI Assistant** on your live site

## Troubleshooting

### CORS Issues
If you get CORS errors, update `fastapi_app.py`:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your Vercel domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Port Issues
Make sure your deployment platform uses the `$PORT` environment variable:

```python
import os
port = int(os.getenv("PORT", 8000))
```

## Quick Status Check

- ✅ **Frontend**: Deployed on Vercel at https://mood-sphere.vercel.app
- ❌ **Backend**: Needs deployment (causing connection errors)
- ✅ **Dockerfile**: Ready for deployment
- ✅ **Requirements**: All dependencies included

Once you deploy the backend and update the URL, your AI Assistant will work perfectly! 🚀 