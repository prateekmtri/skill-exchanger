'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { jwtDecode } from 'jwt-decode';
import { 
    Users, Mail, MapPin, Brain, Sparkles, User as UserIcon, Calendar, 
    Info, Loader, AlertTriangle, Search, ChevronDown, ChevronUp, Clock, ArrowLeft
} from 'lucide-react';
import { useSocket } from '@/context/SocketContext';

// --- Helper functions ---
const formatTimeAgo = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.round((now - date) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);
    if (seconds < 60) return `${seconds} seconds ago`;
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days === 1) return `yesterday`;
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

const BioWithReadMore = ({ text, maxLength = 120 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  if (!text) { return <p className="text-gray-500 italic text-sm">No bio provided.</p>; }
  if (text.length <= maxLength) { return <p className="text-gray-700">{text}</p>; }
  return (
    <div>
      <p className="text-gray-700">{isExpanded ? text : `${text.substring(0, maxLength)}...`}</p>
      <button onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }} className="text-blue-600 hover:text-blue-800 text-sm font-semibold mt-1 flex items-center">
        {isExpanded ? 'Read Less' : 'Read More'}
        {isExpanded ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
      </button>
    </div>
  );
};


const UserCard = ({ user, onSkillClick, unreadCount }) => {
    const BACKEND_URL = 'https://skill-exchanger-backend-3.onrender.com';
    const router = useRouter();
    const imagePath = user.profilePicture ? user.profilePicture.replace(/\\/g, '/') : null;
    const imageUrl = imagePath ? `${BACKEND_URL}/${imagePath}` : null;
    const handleCardClick = () => {
        const token = localStorage.getItem('skill-token'); 
        if (!token) {
            alert('Please log in to start a chat.');
            router.push('/pages/log_in');
            return;
        }
        if (user.isChatEnabled) {
            router.push(`/pages/chat/${user._id}`);
        } else {
            alert('Chat is not available for this user.');
        }
    };
    const handleSkillButtonClick = (e, skill) => {
        e.stopPropagation();
        onSkillClick(skill);
    };
    return (
        <motion.div onClick={handleCardClick} layout variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200/80 flex flex-col cursor-pointer hover:shadow-xl hover:-translate-y-1">
            <div className="p-5 flex-grow">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                        <div className="relative w-16 h-16">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
                                {imageUrl ? (<img src={imageUrl} alt={user.fullName || 'User'} className="w-full h-full object-cover" />) : (<UserIcon className="w-8 h-8 text-gray-500" />)}
                            </div>
                            {unreadCount > 0 && (
                                <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </div>
                            )}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">{user.fullName || 'Unnamed User'}</h3>
                            <div className="flex items-center text-xs text-gray-500 mt-1"><Mail className="w-3 h-3 mr-2" /><span>{user.email}</span></div>
                        </div>
                    </div>
                </div>
                <div className="mb-4"><BioWithReadMore text={user.bio} /></div>
                <hr className="my-3" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center"><MapPin size={14} className="mr-2 text-gray-400" />{user.city}, {user.country}</div>
                    <div className="flex items-center"><Clock size={14} className="mr-2 text-gray-400" />Joined {formatTimeAgo(user.createdAt)}</div>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-800 flex items-center mb-2 text-sm"><Brain size={16} className="mr-2 text-purple-500" />Teaches</h4>
                    <div className="flex flex-wrap gap-2">
                        {(user.skillsToTeach || []).length > 0 ? ((user.skillsToTeach || []).map((skill) => (<button key={skill.name} onClick={(e) => handleSkillButtonClick(e, skill.name)} className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full hover:bg-purple-200 transition-colors">{skill.name}</button>))) : <span className="text-gray-500 text-xs">No skills to teach.</span>}
                    </div>
                </div>
                <div className="mt-3">
                    <h4 className="font-semibold text-gray-800 flex items-center mb-2 text-sm"><Sparkles size={16} className="mr-2 text-blue-500" />Wants to Learn</h4>
                    <div className="flex flex-wrap gap-2">
                        {(user.skillsToLearn || []).length > 0 ? ((user.skillsToLearn || []).map((skill) => (<button key={skill} onClick={(e) => handleSkillButtonClick(e, skill)} className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full hover:bg-blue-200 transition-colors">{skill}</button>))) : <span className="text-gray-500 text-xs">No skills to learn.</span>}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};


const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const { unreadCounts } = useSocket();
  const router = useRouter();
  // --- YEH LOADING LOOP KA FINAL FIX HAI ---
  const fetchInitiated = useRef(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('skill-token');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const userId = decoded.id;
          const res = await fetch(`https://skill-exchanger-backend-3.onrender.com/api/users/${userId}`);
          if (res.ok) {
            const data = await res.json();
            setLoggedInUser(data.data.user);
          } else { localStorage.removeItem('skill-token'); }
        } catch (error) { localStorage.removeItem('skill-token'); }
      }
      setAuthLoading(false);
    };
    checkAuthStatus();
  }, []);

  useEffect(() => {
    // Agar fetch pehle hi shuru ho chuka hai, toh dobara mat karo
    if (fetchInitiated.current) {
        return;
    }
    // Flag ko true set karo taaki yeh dobara na chale
    fetchInitiated.current = true;

    const fetchUsers = async () => {
      try {
        // setLoading(true) yahan dobara call karne ki zaroorat nahi, 
        // kyunki initial state pehle se hi true hai
        setError(null);
        const res = await fetch('https://skill-exchanger-backend-3.onrender.com/api/users');
        if (!res.ok) throw new Error('Failed to fetch users.');
        const data = await res.json();
        if (data.status === 'success') {
          setUsers(data.data.users);
        } else {
          throw new Error(data.message || 'An unknown error occurred.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // Aur yahan hamesha false karein
      }
    };
    fetchUsers();
  }, []); // Dependency array khaali hi rahega

  const handleSkillClick = (skill) => {
    setSkillFilter(skill);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const filteredUsers = useMemo(() => {
    if(!loggedInUser) return users;
    return users.filter(user => user._id !== loggedInUser._id);
  }, [users, loggedInUser]);

  const finalFilteredUsers = useMemo(() => {
    if (!filteredUsers) return [];
    return filteredUsers.filter(user => {
      const matchesSearchTerm = (user.fullName || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSkillFilter = skillFilter 
          ? (user.skillsToTeach || []).some(s => s.name === skillFilter) || (user.skillsToLearn || []).includes(skillFilter)
          : true;
      return matchesSearchTerm && matchesSkillFilter;
    });
  }, [filteredUsers, searchTerm, skillFilter]);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center p-4 mb-8">
            <motion.button 
                onClick={() => router.push('/pages/Home')}
                className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <ArrowLeft size={20} />
                Back to Home
            </motion.button>
            <div className="text-right">
              {authLoading ? ( <div className="h-6 bg-gray-200 rounded-md w-48 animate-pulse ml-auto"></div> ) : loggedInUser ? ( <h2 className="text-xl font-semibold text-gray-700"> Hi, <span className="font-bold text-purple-600">{loggedInUser.fullName}!</span> </h2> ) : ( <p className="text-md text-gray-600"> Please{' '} <Link href="/pages/log_in" className="font-bold text-blue-600 hover:underline"> Login </Link>{' '} to connect with others. </p> )}
            </div>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Meet Our Community
          </h1>
          <p className="text-gray-600 text-lg">Explore profiles, discover skills, and connect with learners and teachers.</p>
        </div>
        
        <div className="mb-8 p-4 bg-white rounded-xl shadow-md border border-gray-200 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-grow w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input type="text" placeholder="Search by name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" suppressHydrationWarning={true} />
            </div>
            {skillFilter && (
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700">Filtering by skill:</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-bold rounded-full">{skillFilter}</span>
                    <button onClick={() => setSkillFilter('')} className="text-red-500 hover:text-red-700 font-bold">&times; Clear</button>
                </div>
            )}
        </div>

        {loading && <div className="flex justify-center py-10"><Loader className="w-12 h-12 text-blue-500 animate-spin" /></div>}
        {error && <div className="text-center py-10 text-red-500"><AlertTriangle className="mx-auto mb-2" />{error}</div>}
        
        {!loading && !error && (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {(finalFilteredUsers || []).length > 0 ? (
                        (finalFilteredUsers || []).map(user => (
                            <UserCard 
                                key={user._id} 
                                user={user} 
                                onSkillClick={handleSkillClick}
                                unreadCount={unreadCounts[user._id] || 0}
                            />
                        ))
                    ) : (
                        <p className="col-span-full text-center text-gray-500 py-10"> No users found with the current filters. </p>
                    )}
                </AnimatePresence>
            </motion.div>
        )}
      </div>
    </div>
  );
};

export default UserListPage;