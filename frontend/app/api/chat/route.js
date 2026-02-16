import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Groq client initialize karein (.env se API key lega)
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || "dummy_key_to_pass_build", 
});

// 1. Instructions (System Prompt)
const systemPrompt = `
Aap 'SkillScout' hain, SkillExchange platform ke AI guide.

**Aapke Niyam:**
1. **Jawaab**: Sirf diye gaye CONTEXT ka istemal karke, 3-4 lines mein friendly aur engaging jawaab dein.
2. **Refusal**: Agar sawaal CONTEXT se bahar ho (jaise general knowledge, coding help), to seedha mana kar dein: "Yeh sawaal mere syllabus se bahar hai! Main sirf SkillExchange platform ke liye banaya gaya hoon."
`;

// 2. Platform Context
const prateekContext = `
**Platform**: SkillExchange
**Creators**: Prateek Mani Tripathi aur Ekta Verma (Contact info 'Contact' page par hai).

**Yeh Kya Hai?**
SkillExchange ek free community platform hai jahan gyaan (knowledge) hi currency hai. Iska maksad sabke liye skills ko accessible banana hai.

**Kaise Kaam Karta Hai?**
Users profile banate hain, "Skills to Teach" aur "Skills to Learn" list karte hain, 'Explore' page par doosre members ko dhoondte hain, aur skill exchange ke liye one-to-one chat shuru karte hain.

**Mukhya Features:**
* **User Discovery**: Users ko naam ya skills ke aadhar par search aur filter karein.
* **Real-time Chat**: Online status, read receipts (blue ticks), aur emoji support ke saath.
* **Profile Management**: Profile ko edit karne aur account ko surakshit roop se delete karne ka poora control.
* **Notifications**: New message ke liye pop-up (Toast) aur unread message count badge.
`;

export async function POST(request) {
    try {
        const { prompt: userPrompt } = await request.json();

        if (!userPrompt) {
            return NextResponse.json(
                { error: 'Prompt is required' },
                { status: 400 }
            );
        }

        // 3. Groq API Call
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: `${systemPrompt}\n\n--- \nCONTEXT:\n${prateekContext}`
                },
                {
                    role: 'user',
                    content: userPrompt,
                },
            ],
            // Groq par fast response ke liye llama-3.3-70b best hai
            model: 'llama-3.3-70b-versatile',
            max_tokens: 512,
            temperature: 0.7,
        });

        const aiMessage = chatCompletion.choices[0]?.message?.content || "Maafi chahta hoon, main abhi jawaab nahi de paa raha hoon.";

        return NextResponse.json({ reply: aiMessage });

    } catch (error) {
        console.error('Error in Groq API route:', error);
        return NextResponse.json(
            { error: 'AI se connect karne mein problem ho rahi hai.' },
            { status: 500 }
        );
    }
}