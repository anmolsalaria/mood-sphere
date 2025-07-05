import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { question } = await req.json();

  let answer = "I'm here to help with your wellness questions!";
  const q = question.toLowerCase();
  if (q.includes('stress')) {
    answer = "For stress management, try deep breathing, regular exercise, and mindfulness.";
  } else if (q.includes('sleep')) {
    answer = "Good sleep hygiene includes a regular schedule, limiting screens before bed, and a relaxing routine.";
  } else if (q.includes('nutrition')) {
    answer = "A balanced diet with fruits, vegetables, whole grains, and lean proteins supports wellness.";
  } else if (q.includes('exercise')) {
    answer = "Regular exercise, even a daily walk, can boost your mood and overall health.";
  } else if (q.includes('meditation')) {
    answer = "Meditation and mindfulness can help reduce stress and improve emotional well-being.";
  } else if (q.includes('anxiety')) {
    answer = "For anxiety, try grounding techniques, deep breathing, and talking to someone you trust.";
  } else if (q.includes('depression')) {
    answer = "If you're feeling down, reach out to friends, family, or a professional. You're not alone.";
  }

  return NextResponse.json({ answer });
} 