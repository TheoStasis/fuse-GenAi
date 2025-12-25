// app/api/generate/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Ensure this matches your working key setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" }); // Use your working model

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { topic, interest } = body;

    const prompt = `
      You are an expert educational engine.
      Explain the concept "${topic}" using a strict analogy to "${interest}".
      First, self-verify your analogy mappings for internal consistency and factual accuracy.
      Based on your self-check, include a verification status and confidence score.
      
      RETURN JSON ONLY. Do not use Markdown. Structure:
      {
        "analogy": "A fun, engaging paragraph explaining the connection like a story.",
        "raw_mapping": {
          "concept": "${topic}",
          "domain": "${interest}",
          "verification_status": "Verified Accurate",
          "confidence_score": "98%",
          "mappings": [
            {
              "technical_term": "Exact Concept Name",
              "technical_definition": "A 2-sentence sophisticated academic definition.",
              "analogy_term": "Analogy Equivalent",
              "analogy_explanation": "Why this specific analogy fits perfectly.",
              "code_analogy_left": "A pseudo-code or math equation for the technical side (e.g. F = ma)",
              "code_analogy_right": "A pseudo-code equation for the analogy side (e.g. Impact = Punch * Speed)"
            },
            {
              "technical_term": "Next Concept...",
              "technical_definition": "...",
              "analogy_term": "...",
              "analogy_explanation": "...",
              "code_analogy_left": "...",
              "code_analogy_right": "..."
            }
          ]
        }
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean up the response if Gemini adds ```json markers
    const cleanedText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    
    return NextResponse.json(JSON.parse(cleanedText));
    
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to generate analogy" }, { status: 500 });
  }
}