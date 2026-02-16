import { HfInference } from '@huggingface/inference';
import { NextResponse } from 'next/server';

// Hugging Face client ko initialize karein
const hf = new HfInference(process.env.HUGGING_FACE_TOKEN);

// 1. Chota kiya gaya nirdesh (Instructions)
const systemPrompt = `
Aap 'SkillScout' hain, SkillExchange platform ke AI guide.

**Aapke Niyam:**
1.  **Jawaab**: Sirf diye gaye CONTEXT ka istemal karke, 3-4 lines mein friendly aur engaging jawaab dein.
2.  **Refusal**: Agar sawaal CONTEXT se bahar ho (jaise general knowledge, coding help), to seedha mana kar dein: "Yeh sawaal mere syllabus se bahar hai! Main sirf SkillExchange platform ke liye banaya gaya hoon."
`;

// 2. Chota kiya gaya context
const prateekContext = `
**Platform**: SkillExchange
**Creators**: Prateek Mani Tripathi aur Ekta Verma (Contact info 'Contact' page par hai).

**Yeh Kya Hai?**
SkillExchange ek free community platform hai jahan gyaan (knowledge) hi currency hai. Iska maksad sabke liye skills ko accessible banana hai.

**Kaise Kaam Karta Hai?**
Users profile banate hain, "Skills to Teach" aur "Skills to Learn" list karte hain, 'Explore' page par doosre members ko dhoondte hain, aur skill exchange ke liye one-to-one chat shuru karte hain.

**Mukhya Features:**
* **User Discovery**: Users ko naam ya skills ke आधार par search aur filter karein.
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

        // 3. User ke prompt ko hamare naye instructions ke saath jodein
        const finalPromptForModel = `
        ${systemPrompt}

        ---
        CONTEXT:
        ${prateekContext}
        ---

        USER'S QUESTION: "${userPrompt}"

        ASSISTANT'S ANSWER:
        `;

        // Hugging Face API ko call karein
        const apiResponse = await hf.chatCompletion({
            model: 'Qwen/Qwen3-Coder-480B-A35B-Instruct', // Aap apne model ka naam yahan daal sakte hain
            messages: [{ role: 'user', content: finalPromptForModel }],
            max_tokens: 512,
        });

        const aiMessage = apiResponse.choices[0].message.content;

        return NextResponse.json({ reply: aiMessage });

    } catch (error) {
        console.error('Error in API route:', error);
        return NextResponse.json(
            { error: 'AI se connect karne mein problem ho rahi hai.' },
            { status: 500 }
        );
    }
}