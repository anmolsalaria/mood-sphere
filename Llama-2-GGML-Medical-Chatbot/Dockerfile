# Use official Python 3.10 image
FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        build-essential \
        git \
        swig \
        curl \
        libopenblas-dev \
        libomp-dev \
        python3-dev \
        && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt ./

# Install Python dependencies
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt && \
    pip install fastapi uvicorn

# Copy the rest of the code
COPY . .

# Create a non-root user
RUN useradd -m llamauser
USER llamauser

# Expose API port
EXPOSE 8000

# Default command (to be replaced with FastAPI app later)
CMD ["uvicorn", "fastapi_app:app", "--host", "0.0.0.0", "--port", "8000"] 