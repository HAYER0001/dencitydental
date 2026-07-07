import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    const systemPrompt = {
      role: 'system',
      content: 'You are a brilliant, welcoming dental assistant for Dencity Dental Care located in Suratgarh. Your goal is to politely assist patients, answer questions about our services (Prosthodontics, Orthodontics, Endodontics, General Dentistry), and help them feel comfortable about visiting our clinic.'
    };

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // Adjust based on your preferred model
        messages: [systemPrompt, ...messages],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in chat route:', error);
    return NextResponse.json({ error: 'Failed to process chat' }, { status: 500 });
  }
}
