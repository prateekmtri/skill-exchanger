'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { useSocket } from '@/context/SocketContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Bell, UserCircle, LogOut, Settings, LayoutDashboard } from 'lucide-react';

const getInitials = (name = '') => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length === 1) return name.charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export default function Navbar() {
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    
    const { unreadCounts } = useSocket();
    const router = useRouter();
    const profileMenuRef = useRef(null);

    const totalUnread = Object.values(unreadCounts || {}).reduce((sum, count) => sum + count, 0);

    useEffect(() => {
        const token = localStorage.getItem('skill-token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                fetch(`https://skill-exchanger-backend-3.onrender.com/api/users/${decoded.id}`)
                    .then(res => {
                        if (!res.ok) {
                            localStorage.removeItem('skill-token');
                            return null;
                        }
                        return res.json();
                    })
                    .then(data => {
                        if (data && data.status === 'success') {
                            setLoggedInUser(data.data.user);
                        } else {
                            localStorage.removeItem('skill-token');
                        }
                    });
            } catch (e) {
                localStorage.removeItem('skill-token');
                setLoggedInUser(null);
            }
        }
        setAuthLoading(false);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('skill-token');
        setLoggedInUser(null);
        setIsProfileMenuOpen(false);
        router.push('/');
        setTimeout(() => window.location.reload(), 100);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setIsProfileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const NavLinks = ({ isMobile = false }) => (
        <div className={isMobile ? "flex flex-col space-y-4 p-4" : "hidden md:flex items-center space-x-8"}>
            <Link href="/" onClick={() => isMobile && setIsMobileMenuOpen(false)} className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">Home</Link>
            <Link href="/pages/show_user" onClick={() => isMobile && setIsMobileMenuOpen(false)} className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">Explore</Link>
            <Link href="/pages/about" onClick={() => isMobile && setIsMobileMenuOpen(false)} className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">About</Link>
            {/* --- YAHAN FIX HAI: Contact link ko wapas add kar diya gaya hai --- */}
            <Link href="/pages/contact" onClick={() => isMobile && setIsMobileMenuOpen(false)} className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">Contact</Link>
        </div>
    );
    
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
                <Link href="/" className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Skill<span className="font-light">Exchange</span></span>
                </Link>

                <NavLinks />

                <div className="flex items-center space-x-4">
                    {authLoading ? (
                        <div className="h-10 w-24 bg-gray-200 rounded-md animate-pulse"></div>
                    ) : loggedInUser ? (
                        <>
                            <Link href="/pages/show_user" className="relative p-2 rounded-full hover:bg-gray-100">
                                <Bell size={22} className="text-gray-600"/>
                                {totalUnread > 0 && (
                                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                                        {totalUnread > 9 ? '9+' : totalUnread}
                                    </span>
                                )}
                            </Link>
                            <div className="relative" ref={profileMenuRef}>
                                <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center space-x-2">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-lg border-2 border-white shadow-sm">
                                        {getInitials(loggedInUser.fullName)}
                                    </div>
                                </button>
                                <AnimatePresence>
                                    {isProfileMenuOpen && (
                                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border z-50">
                                            <div className="p-2">
                                                <div className="px-3 py-2 border-b">
                                                    <p className="text-sm font-semibold text-gray-800">{loggedInUser.fullName}</p>
                                                    <p className="text-xs text-gray-500 truncate">{loggedInUser.email}</p>
                                                </div>
                                                <Link href={`/pages/show_P`} onClick={() => setIsProfileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md mt-1"><UserCircle size={16}/> My Profile</Link>
                                                <Link href="/pages/account-settings" onClick={() => setIsProfileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"><Settings size={16}/> Settings</Link>
                                                <hr className="my-1"/>
                                                <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"><LogOut size={16}/> Logout</button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </>
                    ) : (
                        <div className="hidden md:flex items-center space-x-4">
                            <Link href="/pages/log_in" className="text-sm text-gray-600 hover:text-indigo-600 font-medium transition-colors">Login</Link>
                            <Link href="/pages/create_P" className="text-sm bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-colors shadow-md">Sign Up</Link>
                        </div>
                    )}
                    <div className="md:hidden">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            {isMobileMenuOpen ? <X size={24}/> : <Menu size={24}/>}
                        </button>
                    </div>
                </div>
            </div>
            
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden overflow-hidden">
                        <NavLinks isMobile={true}/>
                        {!loggedInUser && !authLoading && (
                            <div className="p-4 border-t space-y-3">
                                <Link href="/pages/log_in" className="block w-full text-center px-4 py-2 text-gray-700 bg-gray-100 rounded-md">Login</Link>
                                <Link href="/pages/create_P" className="block w-full text-center px-4 py-2 text-white bg-indigo-600 rounded-md">Sign Up</Link>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}