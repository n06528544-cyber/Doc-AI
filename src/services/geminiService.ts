import { GoogleGenAI } from "@google/genai";
import { ScriptParams } from "../types";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || '' 
});

export async function* generateDocumentaryScript(params: ScriptParams) {
  const model = "gemini-3.1-pro-preview";
  
  const systemInstruction = `
    You are an award-winning documentary screenwriter and director. 
    Your task is to generate a professional documentary script based on the user's parameters.
    
    Structure the script using standard documentary format:
    - Title & Logline
    - Segments with specific timeframes
    - Each segment must include three distinct sections:
      1. **NARRATOR / VO**: The actual spoken narration or dialogue.
      2. **VISUALS**: Cinematic shot descriptions, B-roll, and framing.
      3. **SOUND / MUSIC**: Specific sound design (ambient, foley) and musical moods (tempo, instrumentation, emotion) to underscore the scene.
      
    Example Sound Prompt: "SOUND: Tense, driving strings underscore the urgency" or "SOUND: Gentle birdsong and rustling leaves create a peaceful atmosphere".

    Tone: ${params.tone}
    Narrative Style: ${params.narrativeStyle}
    Duration: ${params.duration} minutes
    Target Audience: ${params.targetAudience}
    
    Format the output in clean Markdown. Use headers (### Segment X) and bold labels (NARRATOR:, VISUALS:, SOUND:).
  `;

  const prompt = `Write a detailed documentary script about: ${params.topic}`;

  try {
    const responseStream = await ai.models.generateContentStream({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.8,
      },
    });

    for await (const chunk of responseStream) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
}
