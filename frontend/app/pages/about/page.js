'use client'

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link'; // Back button ke liye import kiya gaya

// --- Self-contained SVG Icons ---
const Zap = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>);
const X = ({ className, size = 24 }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);
const MessageCircle = ({ className, size = 24 }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>);
const ArrowLeft = ({ className, size = 24 }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>);
const UserPlus = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="17" y1="11" x2="23" y2="11"></line></svg>);
const Search = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>);
const Share2 = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>);
const Link2 = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 7h3a5 5 0 0 1 5 5 5 5 0 0 1-5 5h-3m-6 0H6a5 5 0 0 1-5-5 5 5 0 0 1 5-5h3"></path><line x1="8" y1="12" x2="16" y2="12"></line></svg>);
const FileText = ({ className, size = 24 }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>);

// --- Centralized content for a guided, tree-like conversation ---
const conversationTree = {
  en: {
    start: {
      text: 'Please select a language.',
      isLangSelector: true,
    },
    mainMenu: {
      text: 'Hello! How can I assist you today?',
      options: [
        { label: 'Tell me about Skill Exchanger', nextNode: 'faqMenu' },
        { label: 'How can I use the platform?', nextNode: 'usageMenu' },
        { label: 'I need help / support', nextNode: 'supportNode' },
      ],
    },
    faqMenu: {
      text: 'Sure! What would you like to know?',
      options: [
        { label: 'What is Skill Exchanger?', nextNode: 'faqWhatIsIt' },
        { label: 'How does matching work?', nextNode: 'faqMatching' },
        { label: 'Is the platform free to use?', nextNode: 'faqIsItFree' },
        { label: 'Go Back', nextNode: 'mainMenu', isBack: true },
      ],
    },
    usageMenu: {
        text: 'Great! Here’s how you can get started:',
        options: [
            { label: 'How do I post a skill?', nextNode: 'usagePostSkill' },
            { label: 'How do I view available skills?', nextNode: 'usageViewSkills' },
            { label: 'Go Back', nextNode: 'mainMenu', isBack: true },
        ]
    },
    // --- Answer Nodes ---
    faqWhatIsIt: {
      text: 'Skill Exchanger is a platform where you can learn and teach skills without money — just knowledge sharing.',
      options: [{ label: 'Back to questions', nextNode: 'faqMenu', isBack: true }],
    },
    faqMatching: {
      text: 'Our system matches you with other users based on the skills you offer and what you want to learn. You get a notification when a suitable match is found.',
      options: [{ label: 'Back to questions', nextNode: 'faqMenu', isBack: true }],
    },
    faqIsItFree: {
        text: 'Yes! Our platform is completely free for all users to exchange skills.',
        options: [{ label: 'Back to questions', nextNode: 'faqMenu', isBack: true }],
    },
    usagePostSkill: {
        text: "You can post your skill by clicking the 'Post a Skill' button on the dashboard and filling out a simple form.",
        options: [{ label: 'Back to usage options', nextNode: 'usageMenu', isBack: true }],
    },
    usageViewSkills: {
        text: 'You can see all available skills on the "Explore Skills" page. We are now redirecting you there.',
        options: [{ label: 'Back to usage options', nextNode: 'usageMenu', isBack: true }],
        action: 'redirect',
        path: '/skills'
    },
    supportNode: {
      text: 'For any support, please email our team at support@skillexchanger.com. We will get back to you within 24 hours.',
      options: [{ label: 'Go to Main Menu', nextNode: 'mainMenu', isBack: true }],
    },
  },
  hi: {
    start: {
      text: 'कृपया एक भाषा चुनें।',
      isLangSelector: true,
    },
    mainMenu: {
      text: 'नमस्ते! मैं आपकी कैसे सहायता कर सकता हूँ?',
      options: [
        { label: 'Skill Exchanger के बारे में बताएं', nextNode: 'faqMenu' },
        { label: 'मैं प्लेटफॉर्म का उपयोग कैसे करूं?', nextNode: 'usageMenu' },
        { label: 'मुझे मदद / समर्थन चाहिए', nextNode: 'supportNode' },
      ],
    },
    faqMenu: {
      text: 'ज़रूर! आप क्या जानना चाहेंगे?',
      options: [
        { label: 'Skill Exchanger क्या है?', nextNode: 'faqWhatIsIt' },
        { label: 'मैचिंग कैसे काम करती है?', nextNode: 'faqMatching' },
        { label: 'क्या यह प्लेटफॉर्म मुफ़्त है?', nextNode: 'faqIsItFree' },
        { label: 'वापस जाएं', nextNode: 'mainMenu', isBack: true },
      ],
    },
    usageMenu: {
        text: 'बढ़िया! आप इस तरह शुरुआत कर सकते हैं:',
        options: [
            { label: 'मैं एक स्किल कैसे पोस्ट करूं?', nextNode: 'usagePostSkill' },
            { label: 'मैं उपलब्ध स्किल्स कैसे देखूं?', nextNode: 'usageViewSkills' },
            { label: 'वापस जाएं', nextNode: 'mainMenu', isBack: true },
        ]
    },
    // --- Answer Nodes (Hindi) ---
    faqWhatIsIt: {
      text: 'Skill Exchanger एक ऐसा प्लेटफॉर्म है जहां आप बिना पैसे के कौशल सीख और सिखा सकते हैं - सिर्फ ज्ञान का आदान-प्रदान।',
      options: [{ label: 'सवालों पर वापस जाएं', nextNode: 'faqMenu', isBack: true }],
    },
    faqMatching: {
      text: 'हमारा सिस्टम आपके द्वारा ऑफ़र किए गए कौशल और आप जो सीखना चाहते हैं, उसके आधार पर आपको अन्य उपयोगकर्ताओं से मिलाता है। उपयुक्त मैच मिलने पर आपको एक सूचना मिलती है।',
      options: [{ label: 'सवालों पर वापस जाएं', nextNode: 'faqMenu', isBack: true }],
    },
    faqIsItFree: {
        text: 'जी हाँ! हमारा मंच सभी उपयोगकर्ताओं के लिए कौशल का आदान-pradan करने के लिए पूरी तरह से मुफ़्त है।',
        options: [{ label: 'सवालों पर वापस जाएं', nextNode: 'faqMenu', isBack: true }],
    },
    usagePostSkill: {
        text: "आप डैशबोर्ड पर 'Post a Skill' बटन पर क्लिक करके और एक सरल फ़ॉर्म भरकर अपना कौशल पोस्ट कर सकते हैं।",
        options: [{ label: 'उपयोग विकल्पों पर वापस', nextNode: 'usageMenu', isBack: true }],
    },
    usageViewSkills: {
        text: 'आप "Explore Skills" पेज पर सभी उपलब्ध कौशल देख सकते हैं। अब हम आपको वहां रीडायरेक्ट कर रहे हैं।',
        options: [{ label: 'उपयोग विकल्पों पर वापस', nextNode: 'usageMenu', isBack: true }],
        action: 'redirect',
        path: '/skills'
    },
    supportNode: {
      text: 'किसी भी सहायता के लिए, कृपया हमारी टीम को support@skillexchanger.com पर ईमेल करें। हम 24 घंटे के भीतर आपसे संपर्क करेंगे।',
      options: [{ label: 'मुख्य मेनू पर जाएं', nextNode: 'mainMenu', isBack: true }],
    },
  },
};


const SkillExchangerAboutPage = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  // --- Chatbot State ---
  const [messages, setMessages] = useState([]);
  const [language, setLanguage] = useState(null);
  const messagesEndRef = useRef(null);

  // --- Effects ---
  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isChatbotOpen && !language) {
        setMessages([conversationTree.en.start]);
    }
  }, [isChatbotOpen, language]); // Added language to dependency array


  // --- Handlers ---
  const handleGetStarted = () => {
    const isLoggedIn = false; 
    if (isLoggedIn) {
        window.location.href = '/pages/Home';
    } else {
        window.location.href = '/pages/create_P';
    }
  };

  const handleLanguageSelect = (lang) => {
    setLanguage(lang);
    const mainMenu = conversationTree[lang].mainMenu;
    setMessages([mainMenu]);
  };

  const handleOptionClick = (option) => {
    if (!language) return;
    
    const userMessage = { sender: 'user', text: option.label };
    const nextNode = conversationTree[language][option.nextNode];
    
    setMessages(prev => [...prev, userMessage, nextNode]);

    if (nextNode.action === 'redirect') {
        // Using Next.js Link is better, but for simplicity, window.location is used
        window.location.href = '#' + nextNode.path;
    }
  };

  const closeChatbot = () => {
      setIsChatbotOpen(false);
      setLanguage(null); // Reset language when closing
      setMessages([]);
  }

  const closeTerms = () => {
      setIsTermsOpen(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-x-hidden">
      {/* --- ADDED: Back Arrow to Homepage --- */}
      <Link href="/" passHref>
        <div className="absolute top-4 left-4 z-20 p-2 bg-white/60 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all cursor-pointer" title="Back to Home">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </div>
      </Link>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
      </div>

      {/* Page Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className={`text-center mb-12 md:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4 animate-bounce">
            <Zap className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
            About Skill Exchanger
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Skill Exchanger is a global platform where learning meets sharing. We empower individuals to teach what they know and learn what they love — no financial barriers, just pure exchange of knowledge.
          </p>
        </div>

        {/* --- Our Story Section --- */}
        <div className="mb-12 md:mb-16 bg-white/70 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">Our Story</h2>
            <p className="text-center text-gray-700 max-w-4xl mx-auto leading-relaxed">
                Skill Exchanger was born from a simple idea: that knowledge should be accessible to everyone, regardless of their financial situation. We saw countless people with valuable skills but no easy way to share them. Our mission was to build that bridge, creating a vibrant community where learning is the only currency. We believe that everyone has something to teach and something to learn, and we're here to make those connections happen.
            </p>
        </div>

        {/* --- How It Works Section --- */}
        <div className="mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">How It Works</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {[
                    { icon: UserPlus, title: "Create Profile", desc: "Sign up for free and tell the community about the skills you can share and want to learn." },
                    { icon: Share2, title: "Post Your Skill", desc: "Create a listing for the skill you want to teach. Be clear and creative!" },
                    { icon: Search, title: "Find a Match", desc: "Browse skills offered by others or let our smart system suggest a perfect match for you." },
                    { icon: Link2, title: "Connect & Learn", desc: "Connect with your new partner, schedule a session, and start your skill exchange journey!" }
                ].map((step, i) => (
                    <div key={i} className="flex flex-col items-center p-2">
                        <div className="flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-md mb-4 border-2 border-blue-200">
                            <step.icon className="w-10 h-10 text-blue-500" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                        <p className="text-gray-600 text-sm">{step.desc}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 md:mb-16">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100"><h2 className="text-xl sm:text-2xl font-bold mb-3 bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">Our Vision</h2><p className="text-gray-700">To create the world’s largest open community for skill-sharing, where anyone, anywhere, can learn and grow together.</p></div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100"><h2 className="text-xl sm:text-2xl font-bold mb-3 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Our Mission</h2><p className="text-gray-700">Connecting learners and teachers through an easy-to-use platform that encourages collaboration, inclusivity, and growth mindset.</p></div>
        </div>

        {/* --- Join Our Community Section --- */}
        <div className="text-center bg-white/60 backdrop-blur-sm p-6 md:p-10 rounded-2xl shadow-xl mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Join Our Community
          </h2>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">Be a part of a global movement of learners and teachers. Your next skill is just an exchange away. Sign up today and unlock a world of knowledge.</p>
          <button onClick={handleGetStarted} className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
            Start Your Journey Now
          </button>
        </div>
      </div>

      {/* --- REFACTORED: Floating Action Buttons & Modals --- */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-4">
            <button onClick={() => setIsTermsOpen(true)} title="Terms & Conditions" className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform">
                <FileText size={24} />
            </button>
            <button onClick={() => setIsChatbotOpen(true)} title="Help & Info" className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform">
                <MessageCircle size={24} />
            </button>
      </div>

      {/* Terms and Conditions Modal */}
      {isTermsOpen && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="w-full max-w-md h-auto max-h-[80vh] bg-white shadow-2xl rounded-xl flex flex-col overflow-hidden">
                <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white p-3 flex justify-between items-center flex-shrink-0">
                    <span className="font-semibold">Terms and Conditions</span>
                    <button onClick={closeTerms} className="hover:opacity-75"><X size={18} /></button>
                </div>
                <div className="flex-1 p-4 overflow-y-auto text-sm text-gray-700 space-y-3">
                    <h3 className="font-bold">1. Acceptance of Terms</h3>
                    <p>By accessing and using Skill Exchanger, you accept and agree to be bound by the terms and provision of this agreement.</p>
                    <h3 className="font-bold">2. User Conduct</h3>
                    <p>You agree to act in a respectful and honest manner. Harassment, spam, and any illegal activities are strictly prohibited.</p>
                    <h3 className="font-bold">3. Skill Exchange</h3>
                    <p>All skill exchanges are agreements between users. Skill Exchanger is not responsible for the quality or outcome of any exchange.</p>
                    <h3 className="font-bold">4. Disclaimer</h3>
                    <p>The service is provided "as is". We make no warranty that the service will meet your requirements or be available on an uninterrupted, secure, or error-free basis.</p>
                </div>
            </div>
          </div>
      )}

      {/* Chatbot Modal */}
      {isChatbotOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="w-full max-w-md h-[80vh] max-h-[600px] bg-gray-50 shadow-2xl rounded-xl flex flex-col overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 flex justify-between items-center flex-shrink-0">
                    <span className="font-semibold">Skill Exchange Info</span>
                    <button onClick={closeChatbot} className="hover:opacity-75"><X size={18} /></button>
                </div>
                <div ref={messagesEndRef} className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-4 text-sm">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                            {/* Bot/User Message bubble */}
                            <div className={`p-3 rounded-2xl max-w-[85%] ${ msg.isLangSelector ? 'bg-transparent shadow-none' : (msg.sender === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none shadow-sm')}`}>
                                {msg.text}
                            </div>
                            {/* Language Selector */}
                            {msg.isLangSelector && (
                                <div className="mt-3 flex items-center justify-around space-x-2 w-full">
                                    <button onClick={() => handleLanguageSelect('en')} className="font-semibold bg-white border border-blue-200 text-blue-800 px-4 py-1.5 rounded-full hover:bg-blue-100 transition-colors w-full shadow-sm">English</button>
                                    <button onClick={() => handleLanguageSelect('hi')} className="font-semibold bg-white border border-purple-200 text-purple-800 px-4 py-1.5 rounded-full hover:bg-purple-100 transition-colors w-full shadow-sm">हिन्दी</button>
                                </div>
                            )}
                            {/* Options Buttons */}
                            {msg.options && (
                                <div className="mt-2 flex flex-col items-start space-y-2 w-full">
                                    {msg.options.map((option, index) => (
                                        <button key={index} onClick={() => handleOptionClick(option)} 
                                            className={`border text-xs font-semibold px-3 py-2 rounded-full hover:opacity-80 transition-opacity w-full text-left shadow-sm flex items-center ${option.isBack ? 'bg-gray-100 border-gray-300 text-gray-700' : 'bg-blue-50 border-blue-200 text-blue-800'}`}>
                                            {option.isBack && <ArrowLeft size={12} className="mr-2"/>}
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default SkillExchangerAboutPage;
