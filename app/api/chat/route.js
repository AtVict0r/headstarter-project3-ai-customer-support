import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from '@google/generative-ai';

// POST function to handle incoming requests
export async function POST(req) {
  const data = await req.json();
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: "You are a customer support AI assistant. Your primary goal is to assist customers with their inquiries, resolve issues, and provide accurate information in a friendly and professional manner."
  });
  const chat = model.startChat({ history: [...data.slice(1)] });

  try {
    // Create a chat completion request to the Gemini API
    const result = await chat.sendMessage(data[data.length - 1].parts[0].text);
    console.log(result.response.text());
    return NextResponse.json(result.response.text() , { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: `Failed to generate text: ${error.message}` }, { status: 500 }); // Handle API errors
  }
}