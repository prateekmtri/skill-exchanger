"use client";

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { X, Bot, Send } from 'lucide-react';

// Yeh Chatbot ka pop-up window hai, jise naye design ke hisaab se style kiya gaya hai.
export default function ChatModal({ onClose }) {
    const [prompt, setPrompt] = useState('');
    const [messages, setMessages] = useState([
        // Bot ka pehla greeting message.
        { sender: 'ai', text: 'Hello! Ask about skill exchanger' }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messageListRef = useRef(null);

    // Naya message aane par automatically neeche scroll karega.
    useEffect(() => {
        if (messageListRef.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!prompt.trim() || isLoading) return;

        const userMessage = { sender: 'user', text: prompt };
        setMessages(currentMessages => [...currentMessages, userMessage]);
        setIsLoading(true);
        setPrompt('');

        try {
            const response = await axios.post('/api/chat', { prompt });
            const aiMessage = { sender: 'ai', text: response.data.reply };
            setMessages(currentMessages => [...currentMessages, aiMessage]);
        } catch (error) {
            console.error("Error fetching AI response:", error);
            const errorMessage = { sender: 'ai', text: 'Sorry, I ran into an error. Please try again.' };
            setMessages(currentMessages => [...currentMessages, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // Backdrop (peeche ka dhundhla background)
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-[100]">
            
            {/* Modal ka main container */}
            <div className="w-[90%] max-w-lg h-[75vh] max-h-[700px] bg-slate-50 rounded-2xl flex flex-col shadow-2xl overflow-hidden">
                
                {/* Modal ka Header */}
                <div className="flex justify-between items-center p-4 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                        <Bot className="w-7 h-7 text-violet-600" />
                        <h2 className="text-xl font-bold text-black">Chatbot</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-black">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Message dikhane wala area */}
                <div ref={messageListRef} className="flex-grow p-4 overflow-y-auto space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-3 rounded-2xl ${
                                msg.sender === 'user' 
                                ? 'bg-violet-600 text-white' // User ka message bubble
                                : 'bg-white text-black border border-slate-200' // AI ka message bubble
                            }`}>
                                <p className="text-base">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                           <div className="bg-white text-black border border-slate-200 p-3 rounded-2xl">
                                <p className="text-base italic">Thinking...</p>
                           </div>
                        </div>
                    )}
                </div>

                {/* Message likhne wala form */}
                <form onSubmit={handleSubmit} className="p-4 border-t border-slate-200 bg-white">
                     <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-full px-2 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-300 transition-all">
                        <input
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Ask about  skill exchanger"
                            disabled={isLoading}
                            className="w-full bg-transparent text-black placeholder-gray-500 focus:outline-none px-3 py-3"
                        />
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="bg-violet-600 text-white rounded-full p-3 hover:bg-violet-700 disabled:bg-violet-400 disabled:cursor-not-allowed transition-colors"
                        >
                           <Send className="w-5 h-5" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}