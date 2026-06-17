import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || "dummy_key_to_pass_build", 
});

const systemPrompt = `You are SkillScout, the AI assistant for SkillExchange platform.

Rules:
1. Only answer questions about SkillExchange platform. For anything else, say: "Please ask questions related to SkillExchange platform only!"
2. Always reply in English only.
3. Keep replies short - 2-3 lines max.
4. Be friendly and helpful.

About SkillExchange:
- Free peer-to-peer skill learning platform. Knowledge is the currency.
- Users list skills to teach & learn, find partners on Explore page, chat in real-time.
- Features: Smart matching, real-time chat with read receipts, notifications, profile management.`;

export async function POST(request) {
    try {
        const { prompt: userPrompt } = await request.json();

        if (!userPrompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            model: 'llama-3.3-70b-versatile',
            max_tokens: 150,
            temperature: 0.5,
        });

        const aiMessage = chatCompletion.choices[0]?.message?.content || "Sorry, I couldn't process that.";
        return NextResponse.json({ reply: aiMessage });

    } catch (error) {
        console.error('Groq API error:', error);
        return NextResponse.json({ error: 'AI connection failed.' }, { status: 500 });
    }
}