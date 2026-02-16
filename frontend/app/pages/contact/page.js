// app/pages/contact/page.js
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
// Link component ko import kiya gaya hai
import Link from 'next/link'; 
// ArrowLeft icon ko import kiya gaya hai
import { Mail, MessageSquare, Send, Linkedin, Twitter, User, Book, ArrowLeft } from 'lucide-react'; 
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: 'General Inquiry',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const templateParams = {
            name: formData.name,
            message: `Subject: ${formData.subject}\n\n${formData.message}`,
            time: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
            reply_to: formData.email,
        };

        emailjs.send(
            process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
            process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
            templateParams,
            process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
        ).then((response) => {
            console.log('SUCCESS!', response.status, response.text);
            toast.success('Message sent successfully!');
            setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
        }).catch((error) => {
            console.error('FAILED...', error);
            toast.error('Failed to send message. Please try again.');
        }).finally(() => {
            setLoading(false);
        });
    };

    const creators = [
        { 
            name: 'Prateek Mani Tripathi', 
            image: '/prateek.jpeg',
            linkedin: 'https://www.linkedin.com/in/prateek-mani-tripathi-51935a259/',
            twitter: 'https://x.com/PrateekTri20851'
        },
        { 
            name: 'Ekta Verma', 
            image: '/ekta.jpeg',
            linkedin: 'https://www.linkedin.com/in/ekta-verma-4b9436251/',
            twitter: 'https://x.com/EktaV1278'
        }
    ];
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8 relative">
            {/* --- YAHAN BACK BUTTON ADD KIYA GAYA HAI --- */}
            <Link href="/" passHref>
                <div className="absolute top-6 left-6 z-20 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all cursor-pointer" title="Back to Home">
                    <ArrowLeft className="w-6 h-6 text-gray-800" />
                </div>
            </Link>

            <div className="max-w-5xl mx-auto">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <h1 className="text-4xl sm:text-5xl font-bold text-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                        Get In Touch
                    </h1>
                    <p className="text-center text-lg text-gray-600 max-w-2xl mx-auto">
                        Have a question, suggestion, or just want to say hello? We'd love to hear from you.
                    </p>
                </motion.div>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><User className="h-5 w-5 text-gray-400" /></div>
                                    <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} required className="block w-full rounded-md border-gray-300 pl-10 py-3 focus:border-indigo-500 focus:ring-indigo-500" placeholder="John Doe" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><Mail className="h-5 w-5 text-gray-400" /></div>
                                    <input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} required className="block w-full rounded-md border-gray-300 pl-10 py-3 focus:border-indigo-500 focus:ring-indigo-500" placeholder="you@example.com" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                     <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><Book className="h-5 w-5 text-gray-400" /></div>
                                    <select name="subject" id="subject" value={formData.subject} onChange={handleInputChange} className="block w-full rounded-md border-gray-300 pl-10 py-3 focus:border-indigo-500 focus:ring-indigo-500">
                                        <option>General Inquiry</option>
                                        <option>Technical Support</option>
                                        <option>Partnership & Media</option>
                                        <option>Feedback & Suggestion</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                                <div className="mt-1">
                                    <textarea name="message" id="message" value={formData.message} onChange={handleInputChange} required rows={4} className="block w-full rounded-md border-gray-300 shadow-sm py-3 px-4 focus:border-indigo-500 focus:ring-indigo-500" placeholder="How can we help you?"></textarea>
                                </div>
                            </div>
                            <div>
                                <button type="submit" disabled={loading} className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-70">
                                    {loading ? 'Sending...' : 'Send Message'}
                                    <Send size={16}/>
                                </button>
                            </div>
                        </form>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="space-y-8">
                        <h2 className="text-2xl font-bold text-gray-800">Meet the Team</h2>
                        <div className="space-y-6">
                            {creators.map((creator) => (
                                <div key={creator.name} className="flex items-center gap-4">
                                    <img src={creator.image} alt={creator.name} className="w-16 h-16 rounded-full object-cover shadow-md" />
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900">{creator.name}</h3>
                                        <div className="flex items-center gap-4 mt-1">
                                            <a href={creator.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-700"><Linkedin size={20} /></a>
                                            <a href={creator.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-sky-500"><Twitter size={20} /></a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 border-t pt-6">
                             <h3 className="text-lg font-semibold text-gray-900 mb-2">Support Email</h3>
                             <a href="mailto:support@skillexchange.com" className="text-indigo-600 hover:underline">support@skillexchange.com</a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
