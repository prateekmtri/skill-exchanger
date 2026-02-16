"use client";

// STEP 1: Zaroori cheezein import ki gayi hain.
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Bot } from 'lucide-react'; // Chatbot ka icon

// Navbar aur ChatModal components ko import kiya gaya hai.
import Navbar from '@/components/Navbar';
import ChatModal from '../../components/ChatInterface'; // STEP 2: ChatModal component import hua.

export default function Home() {
  // STEP 3: Chat modal ko control karne ke liye state.
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Homepage ke baaki saare states (inme koi badlav nahi hai)
  const [currentStory, setCurrentStory] = useState('');
  const [typewriterText, setTypewriterText] = useState('');
  const [showStory, setShowStory] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const videoRefs = useRef([]);

  const stories = [
    "Sarah was hesitant to learn coding at 35. Today, she mentors others and runs a successful web design studio. It's never too late to begin.",
    "James spent years as a hobbyist painter. After joining our community, he now sells his artwork professionally and teaches weekend workshops.",
    "Mia transformed her passion for baking into a thriving pastry business after connecting with a mentor who helped her refine her techniques.",
    "Tom was stuck in a career he didn't love. Learning UX design through our platform changed his life - now he creates products that help thousands.",
    "Aisha went from culinary disasters to running a popular food blog after exchanging her photography skills for cooking lessons here."
  ];

  const videos = [
    { src: "https://videos.pexels.com/video-files/2620043/2620043-uhd_2560_1440_25fps.mp4", alt: "Cooking a delicious meal", title: "Culinary Arts", icon: ( <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg> ) },
    { src: "https://videos.pexels.com/video-files/32928952/14033961_1080_1920_30fps.mp4", alt: "Playing cricket", title: "Sports Mastery", icon: ( <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg> ) },
    { src: "https://videos.pexels.com/video-files/4463159/4463159-hd_1920_1080_25fps.mp4", alt: "Painting a masterpiece", title: "Fine Arts", icon: ( <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg> ) },
    { src: "https://videos.pexels.com/video-files/2516160/2516160-hd_1920_1080_24fps.mp4", alt: "Coding a website", title: "Programming", icon: ( <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg> ) },
    { src: "https://videos.pexels.com/video-files/3772427/3772427-hd_1920_1080_25fps.mp4", alt: "Capturing stunning photos", title: "Photography", icon: ( <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg> ) }
  ];

  const typewriterMessage = "     What   will you learn today? ";

  // Effects (inme koi badlav nahi hai)
  useEffect(() => {
    const typewriterTimer = setTimeout(() => {
      let i = 0;
      const typingInterval = setInterval(() => {
        if (i < typewriterMessage.length) {
          setTypewriterText(prev => prev + typewriterMessage.charAt(i));
          i++;
        } else {
          clearInterval(typingInterval);
          setTimeout(() => setShowStory(true), 500);
        }
      }, 80);
      return () => clearInterval(typingInterval);
    }, 800);
    
    const randomStory = stories[Math.floor(Math.random() * stories.length)];
    setCurrentStory(randomStory);

    return () => clearTimeout(typewriterTimer);
  }, []);

  useEffect(() => {
    const videoInterval = setInterval(() => {
      if (!isHovered) {
        setCurrentVideoIndex(prev => (prev + 1) % videos.length);
      }
    }, 5000);

    return () => clearInterval(videoInterval);
  }, [isHovered, videos.length]);

  const handleDotClick = (index) => {
    setCurrentVideoIndex(index);
  };

  return (
    <>
      <Navbar />

      <main className="pt-20">
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 overflow-x-hidden">
          
          <div className="py-16 px-4 max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              
              <div className="lg:w-1/2 flex flex-col items-center w-full">
                <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="w-full max-w-2xl">
                  <div className="w-full h-[400px] lg:h-[500px] rounded-3xl shadow-2xl overflow-hidden relative group" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                    <AnimatePresence mode="wait">
                      <motion.div key={currentVideoIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} className="absolute inset-0">
                        <video ref={el => videoRefs.current[currentVideoIndex] = el} src={videos[currentVideoIndex].src} key={videos[currentVideoIndex].src} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                      </motion.div>
                    </AnimatePresence>
                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-6">
                      <p className="text-2xl font-bold text-white">{videos[currentVideoIndex].title}</p>
                    </div>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
                      {videos.map((_, index) => (
                        <motion.button key={index} whileHover={{ scale: 1.2 }} onClick={() => handleDotClick(index)} className={`w-3 h-3 rounded-full transition-all ${index === currentVideoIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'}`} />
                      ))}
                    </div>
                  </div>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-6 grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {videos.map((video, index) => (
                      <motion.button key={index} whileHover={{ y: -5 }} whileTap={{ scale: 0.95 }} onClick={() => handleDotClick(index)} className={`flex flex-col items-center p-3 rounded-xl transition-all ${index === currentVideoIndex ? 'bg-white shadow-md border border-indigo-100' : 'bg-white/60 hover:bg-white shadow-sm'}`}>
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mb-2">{video.icon}</div>
                        <span className="text-xs font-medium text-gray-700 text-center">{video.title}</span>
                      </motion.button>
                    ))}
                  </motion.div>
                </motion.div>
              </div>

              <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="lg:w-1/2 flex flex-col justify-center">
                <div className="max-w-xl">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-6">
                    <span className="inline-block bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium">
                      Learn. Share. Grow.
                    </span>
                  </motion.div>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mb-10">
                    <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
                      {typewriterText}
                      <span className="ml-1.5 inline-block w-1.5 h-10 bg-indigo-600 animate-pulse align-middle"></span>
                    </h1>
                  </motion.div>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"><div className="text-2xl font-bold text-indigo-600">50K+</div><div className="text-xs text-gray-500">Active Learners</div></div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"><div className="text-2xl font-bold text-indigo-600">120+</div><div className="text-xs text-gray-500">Skills Offered</div></div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"><div className="text-2xl font-bold text-indigo-600">95%</div><div className="text-xs text-gray-500">Satisfaction</div></div>
                  </motion.div>
                  <AnimatePresence>
                    {showStory && (
                      <motion.div initial={{ opacity: 0, y: 30, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30 }} transition={{ duration: 0.7, type: "spring" }} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-bl-full"></div>
                        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-purple-500/10 rounded-full"></div>
                        <div className="relative z-10">
                          <div className="flex items-center mb-4">
                            <div className="bg-indigo-100 p-2 rounded-full mr-3">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                            </div>
                            <p className="text-sm text-gray-500">Real Success Story</p>
                          </div>
                          <p className="text-lg text-gray-700 leading-relaxed">"{currentStory}"</p>
                          <Link href="/pages/create_P">
                              <motion.button whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.4)" }} whileTap={{ scale: 0.98 }} className="mt-6 px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium transition-all duration-300 shadow-md">
                                Start Your Journey
                              </motion.button>
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>
          
          <footer className="bg-white border-t">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                            </div>
                            <span className="text-xl font-bold text-gray-800">SkillExchange</span>
                        </div>
                        <p className="text-gray-500 text-sm">Connecting passionate learners with expert mentors worldwide.</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">Quick Links</h3>
                        <ul className="mt-4 space-y-2">
                            <li><Link href="/pages/show_user" className="text-base text-gray-500 hover:text-indigo-600">Explore</Link></li>
                            <li><Link href="/pages/create_P" className="text-base text-gray-500 hover:text-indigo-600">Sign Up</Link></li>
                            <li><Link href="#" className="text-base text-gray-500 hover:text-indigo-600">About Us</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">Legal</h3>
                        <ul className="mt-4 space-y-2">
                            <li><a href="#" className="text-base text-gray-500 hover:text-indigo-600">Privacy Policy</a></li>
                            <li><a href="#" className="text-base text-gray-500 hover:text-indigo-600">Terms of Service</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">Connect</h3>
                        <ul className="mt-4 space-y-2">
                            <li><a href="#" className="text-base text-gray-500 hover:text-indigo-600">Contact Us</a></li>
                            <li><a href="#" className="text-base text-gray-500 hover:text-indigo-600">GitHub</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-200 pt-8 text-center">
                    <p className="text-base text-gray-400">&copy; 2025 SkillExchange. All rights reserved.</p>
                </div>
            </div>
          </footer>
        </div>
      </main>

      {/* ==================================================================== */}
      {/* ===== CHATBOT INTEGRATION CODE ===== */}
      {/* ==================================================================== */}

      {/* STEP 4: Yeh floating button hai jo hamesha screen par dikhega. */}
      <button 
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 z-50"
        aria-label="Open Prateek's Assistant"
      >
        <Bot className="w-8 h-8" />
      </button>

      {/* STEP 5: Agar `isChatOpen` true hai, to hi ChatModal component screen par dikhega. */}
      <AnimatePresence>
        {isChatOpen && <ChatModal onClose={() => setIsChatOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
