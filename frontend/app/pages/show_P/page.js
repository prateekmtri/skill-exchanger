'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Camera, MapPin, Phone, Brain, Sparkles, Edit, Save, X, Calendar, Globe, LogIn } from 'lucide-react';
import Link from 'next/link';

const UserProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const predefinedSkills = [
    'Programming', 'Web Development', 'Mobile Development', 'Data Science', 'Machine Learning',
    'UI/UX Design', 'Graphic Design', 'Digital Marketing', 'Content Writing', 'Photography',
    'Video Editing', 'Music Production', 'Language Teaching', 'Cooking', 'Fitness Training',
    'Yoga', 'Guitar', 'Piano', 'Painting', 'Dancing', 'Public Speaking', 'Leadership'
  ];

  useEffect(() => {
    const token = localStorage.getItem('skill-token');
    if (token) {
      try {
        const payloadBase64 = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));
        
        if (decodedPayload.id) {
          const currentUserId = decodedPayload.id;
          setUserId(currentUserId);
          setIsAuthenticated(true);
          fetchUserData(currentUserId);
        } else {
          handleAuthError();
        }
      } catch (error) {
        console.error("Token decoding failed:", error);
        handleAuthError();
      }
    } else {
      handleAuthError();
    }
  }, []);

  const handleAuthError = () => {
      setIsAuthenticated(false);
      setLoading(false);
  };

  const fetchUserData = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`https://skill-exchanger-backend-3.onrender.com/api/users/${id}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        setUserData(data.data.user);
        setEditData(data.data.user);
      } else {
        setMessage('Failed to load user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setMessage('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
        setEditData({...editData, profilePicture: file});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSkillToggle = (skill, type) => {
    if (type === 'teach') {
      setEditData(prev => ({
        ...prev,
        skillsToTeach: prev.skillsToTeach?.some(s => s.name === skill)
          ? prev.skillsToTeach.filter(s => s.name !== skill)
          : [...(prev.skillsToTeach || []), { name: skill, level: 'Intermediate' }]
      }));
    } else {
      setEditData(prev => ({
        ...prev,
        skillsToLearn: prev.skillsToLearn?.includes(skill)
          ? prev.skillsToLearn.filter(s => s !== skill)
          : [...(prev.skillsToLearn || []), skill]
      }));
    }
  };

  const handleSave = async () => {
    if (!userId) {
        setMessage("Authentication error. Please log in again.");
        return;
    }
    try {
      setSaving(true);
      setMessage('');

      const formDataToSend = new FormData();
      
      Object.keys(editData).forEach(key => {
        const val = editData[key];
        if (val === undefined || val === null || val === '') return;
        
        if (key === 'profilePicture' && val instanceof File) {
            formDataToSend.append(key, val);
        } else if (key === 'skillsToTeach' || key === 'skillsToLearn') {
            formDataToSend.append(key, JSON.stringify(val));
        } else if (typeof val === 'object' && val !== null && !(val instanceof File)) {
            formDataToSend.append(key, JSON.stringify(val));
        } else {
            formDataToSend.append(key, val);
        }
      });
      
      // --- YAHAN FINAL FIX HAI ---
      // Token ko `localStorage` se get karein
      const token = localStorage.getItem('skill-token');

      const response = await fetch(`https://skill-exchanger-backend-3.onrender.com/api/users/${userId}`, {
        method: 'PATCH',
        // `headers` mein Authorization token add karein
        // NOTE: Jab FormData bhejte hain, 'Content-Type' manually set nahi karte
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formDataToSend,
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        setUserData(data.data.user);
        setEditMode(false);
        setUploadedImage(null); // Uploaded image preview ko clear karein
        setMessage('Profile updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Error connecting to server');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="text-center bg-white p-10 rounded-2xl shadow-xl">
          <LogIn className="mx-auto h-12 w-12 text-blue-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please log in to view and edit your profile.</p>
          <Link href="/pages/log_in">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Go to Login
            </motion.div>
          </Link>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">User Not Found</h2>
          <p className="text-gray-600">The user profile could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <motion.h1 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
          >
            My Profile
          </motion.h1>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
                setEditMode(!editMode);
                if (editMode) {
                    setEditData(userData);
                    setUploadedImage(null);
                }
            }}
            className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              editMode 
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg'
            }`}
          >
            {editMode ? <X size={20} /> : <Edit size={20} />}
            {editMode ? 'Cancel' : 'Edit Profile'}
          </motion.button>
        </div>

        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className={`mb-6 p-4 rounded-xl ${
                message.includes('success') 
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-3 gap-8">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="relative inline-block mb-6">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                  {(uploadedImage || userData.profilePicture) ? (
                    <img 
                      src={uploadedImage || `https://skill-exchanger-backend-3.onrender.com/${userData.profilePicture.replace(/\\/g, '/')}`} 
                      alt="Profile" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <User className="w-12 h-12 text-white" />
                  )}
                </div>
                {editMode && (
                  <label className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 p-2 rounded-full cursor-pointer transition-all">
                    <Camera className="w-4 h-4 text-white" />
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{userData.fullName}</h2>
              <p className="text-gray-600 mb-4">{userData.email}</p>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-center gap-2 text-gray-600"><MapPin className="w-4 h-4" /><span>{userData.city}, {userData.state}</span></div>
                {userData.mobile && (<div className="flex items-center justify-center gap-2 text-gray-600"><Phone className="w-4 h-4" /><span>{userData.mobile}</span></div>)}
                <div className="flex items-center justify-center gap-2 text-gray-600"><Calendar className="w-4 h-4" /><span>Born: {formatDate(userData.dateOfBirth)}</span></div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center"><User className="mr-3 text-blue-500" /> Basic Information</h3>
              {editMode ? (
                <div className="grid md:grid-cols-2 gap-6">
                  <div><label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label><input type="text" value={editData.fullName || ''} onChange={(e) => setEditData({...editData, fullName: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" /></div>
                  <div><label className="block text-sm font-semibold text-gray-700 mb-2">Email</label><input type="email" value={editData.email || ''} onChange={(e) => setEditData({...editData, email: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" /></div>
                  <div><label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label><select value={editData.gender || ''} onChange={(e) => setEditData({...editData, gender: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"><option value="">Select Gender</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option><option value="prefer-not-to-say">Prefer not to say</option></select></div>
                  <div><label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label><input type="date" value={editData.dateOfBirth ? editData.dateOfBirth.split('T')[0] : ''} onChange={(e) => setEditData({...editData, dateOfBirth: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" /></div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  <div><span className="text-sm font-semibold text-gray-500">Full Name</span><p className="text-lg text-gray-800">{userData.fullName}</p></div>
                  <div><span className="text-sm font-semibold text-gray-500">Email</span><p className="text-lg text-gray-800">{userData.email}</p></div>
                  <div><span className="text-sm font-semibold text-gray-500">Gender</span><p className="text-lg text-gray-800 capitalize">{userData.gender || 'Not specified'}</p></div>
                  <div><span className="text-sm font-semibold text-gray-500">Date of Birth</span><p className="text-lg text-gray-800">{formatDate(userData.dateOfBirth)}</p></div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center"><MapPin className="mr-3 text-green-500" /> Location</h3>
              {editMode ? (
                <div className="grid md:grid-cols-2 gap-6">
                  <div><label className="block text-sm font-semibold text-gray-700 mb-2">City</label><input type="text" value={editData.city || ''} onChange={(e) => setEditData({...editData, city: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500" /></div>
                  <div><label className="block text-sm font-semibold text-gray-700 mb-2">State</label><input type="text" value={editData.state || ''} onChange={(e) => setEditData({...editData, state: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500" /></div>
                  <div><label className="block text-sm font-semibold text-gray-700 mb-2">Country</label><input type="text" value={editData.country || ''} onChange={(e) => setEditData({...editData, country: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500" /></div>
                  <div><label className="block text-sm font-semibold text-gray-700 mb-2">ZIP Code</label><input type="text" value={editData.zipCode || ''} onChange={(e) => setEditData({...editData, zipCode: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500" /></div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  <div><span className="text-sm font-semibold text-gray-500">City</span><p className="text-lg text-gray-800">{userData.city}</p></div>
                  <div><span className="text-sm font-semibold text-gray-500">State</span><p className="text-lg text-gray-800">{userData.state}</p></div>
                  <div><span className="text-sm font-semibold text-gray-500">Country</span><p className="text-lg text-gray-800">{userData.country}</p></div>
                  <div><span className="text-sm font-semibold text-gray-500">ZIP Code</span><p className="text-lg text-gray-800">{userData.zipCode || 'Not provided'}</p></div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center"><Brain className="mr-3 text-purple-500" /> Skills</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">Can Teach</h4>
                  {editMode ? (
                    <div className="flex flex-wrap gap-3">
                      {predefinedSkills.map(skill => (
                        <motion.button key={skill} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleSkillToggle(skill, 'teach')} className={`p-3 rounded-xl text-sm font-medium transition-all ${editData.skillsToTeach?.some(s => s.name === skill) ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border'}`}>{skill}</motion.button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {userData.skillsToTeach?.length > 0 ? userData.skillsToTeach.map((skill, index) => (<span key={index} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium">{skill.name} ({skill.level})</span>)) : <p className="text-gray-500">No skills to teach listed</p>}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">Want to Learn</h4>
                  {editMode ? (
                    <div className="flex flex-wrap gap-3">
                      {predefinedSkills.map(skill => (
                        <motion.button key={skill} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleSkillToggle(skill, 'learn')} className={`p-3 rounded-xl text-sm font-medium transition-all ${editData.skillsToLearn?.includes(skill) ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border'}`}>{skill}</motion.button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {userData.skillsToLearn?.length > 0 ? userData.skillsToLearn.map((skill, index) => (<span key={index} className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-medium">{skill}</span>)) : <p className="text-gray-500">No skills to learn listed</p>}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center"><Sparkles className="mr-3 text-orange-500" /> About & Contact</h3>
              {editMode ? (
                <div className="space-y-6">
                  <div><label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label><textarea value={editData.bio || ''} onChange={(e) => setEditData({...editData, bio: e.target.value})} rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500" placeholder="Tell us about yourself..."></textarea></div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div><label className="block text-sm font-semibold text-gray-700 mb-2">Mobile</label><input type="tel" value={editData.mobile || ''} onChange={(e) => setEditData({...editData, mobile: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500" /></div>
                    <div><label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Contact</label><select value={editData.preferredContact || ''} onChange={(e) => setEditData({...editData, preferredContact: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500"><option value="Email">Email</option><option value="Chat">Chat</option></select></div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div><span className="text-sm font-semibold text-gray-500">Bio</span><p className="text-gray-800 mt-1">{userData.bio || 'No bio provided'}</p></div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div><span className="text-sm font-semibold text-gray-500">Mobile</span><p className="text-lg text-gray-800">{userData.mobile || 'Not provided'}</p></div>
                    <div><span className="text-sm font-semibold text-gray-500">Preferred Contact</span><p className="text-lg text-gray-800">{userData.preferredContact}</p></div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {editMode && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center mt-8">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleSave} disabled={saving} className="px-8 py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2">
              <Save size={20} />
              {saving ? 'Saving...' : 'Save Changes'}
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;