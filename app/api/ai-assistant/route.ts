import { NextRequest, NextResponse } from 'next/server';

const medical_keywords = [
  "mental health", "mental illness", "psychological", "psychiatric", "mental disorder",
  "depression", "anxiety", "panic attack", "stress", "bipolar", "bipolar disorder",
  "ptsd", "post-traumatic stress", "ocd", "obsessive compulsive disorder", "adhd",
  "attention deficit", "schizophrenia", "psychosis", "delusion", "hallucination",
  "mood disorder", "dysthymia", "cyclothymia", "suicide", "self-harm", "self injury",
  "trauma", "childhood trauma", "abuse", "emotional abuse", "sexual abuse", "counseling",
  "therapy", "psychotherapy", "cognitive behavioral therapy", "cbt", "talk therapy",
  "group therapy", "family therapy", "interpersonal therapy", "psychodynamic therapy",
  "medication", "antidepressant", "ssri", "prozac", "zoloft", "sertraline", "fluoxetine",
  "mental fatigue", "burnout", "nervous breakdown", "grief", "sadness", "loneliness",
  "insomnia", "sleep disorder", "nightmares", "night terrors", "emotional regulation",
  "emotional numbness", "fear", "phobia", "social anxiety", "performance anxiety",
  "generalized anxiety", "intrusive thoughts", "racing thoughts", "low self-esteem",
  "self-worth", "hopelessness", "helplessness", "worthlessness", "crying", "isolation",
  "anger", "aggression", "irritability", "mental fog", "lack of motivation",
  "overthinking", "rumination", "avoidance", "hypervigilance", "withdrawal",
  "addiction", "substance abuse", "alcoholism", "drug addiction", "eating disorder",
  "anorexia", "bulimia", "binge eating", "body image", "dissociation", "paranoia",
  "mental health crisis", "psychiatrist", "psychologist", "therapist", "mental health support"
];

function isMedicalQuestion(query: string): boolean {
  const queryLower = query.toLowerCase();
  return medical_keywords.some(keyword => queryLower.includes(keyword));
}

export async function POST(req: NextRequest) {
  const { question } = await req.json();

  if (!isMedicalQuestion(question)) {
    return NextResponse.json({ error: "Only medical-related questions are allowed." }, { status: 400 });
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: "Gemini API key not set." }, { status: 500 });
  }

  const url = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro-002:generateContent";
  const payload = {
    contents: [
      {
        parts: [
          {
            text: `You are a medical assistant. Answer the following question based only on medical knowledge.\nQuestion: ${question}`
          }
        ]
      }
    ]
  };

  try {
    const response = await fetch(`${url}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: "Failed to get a response from Gemini", details: errorText }, { status: 500 });
    }

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't find an answer.";
    return NextResponse.json({ answer: reply });
  } catch (err: any) {
    return NextResponse.json({ error: "Error contacting Gemini API", details: err.message }, { status: 500 });
  }
} 