'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Camera, MapPin, Phone, Brain, Sparkles, Check, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation'; // useRouter ko import karein

const ProfileCreationPage = () => {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter(); // router ko initialize karein

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    profilePicture: null,
    gender: '',
    dateOfBirth: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    timeZone: typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : '',
    skillsToTeach: [],
    skillsToLearn: [],
    mobile: '',
    preferredContact: 'Email',
    bio: ''
  });

  const [errors, setErrors] = useState({});

  const predefinedSkills = [
    'Programming', 'Web Development', 'Mobile Development', 'Data Science', 'Machine Learning',
    'UI/UX Design', 'Graphic Design', 'Digital Marketing', 'Content Writing', 'Photography',
    'Video Editing', 'Music Production', 'Language Teaching', 'Cooking', 'Fitness Training',
    'Yoga', 'Guitar', 'Piano', 'Painting', 'Dancing', 'Public Speaking', 'Leadership'
  ];

  const steps = [
    { id: 1, title: 'Basic Info', icon: '👤' },
    { id: 2, title: 'Location', icon: '📍' },
    { id: 3, title: 'Skills', icon: '🧠' },
    { id: 4, title: 'About', icon: '✨' }
  ];

  const validateStep = (stepNum) => {
    const newErrors = {};
    switch(stepNum) {
      case 1:
        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        break;
      case 2:
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';
        if (!formData.country.trim()) newErrors.country = 'Country is required';
        break;
      case 3:
        if (formData.skillsToTeach.length === 0) newErrors.skillsToTeach = 'Please select at least one skill to teach';
        if (formData.skillsToLearn.length === 0) newErrors.skillsToLearn = 'Please select at least one skill to learn';
        break;
      case 4:
        if (formData.bio.trim().length < 50) newErrors.bio = 'Bio must be at least 50 characters';
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step) && step < 4) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
        setFormData({...formData, profilePicture: file});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSkillToggle = (skill, type) => {
    if (type === 'teach') {
      setFormData(prev => ({
        ...prev,
        skillsToTeach: prev.skillsToTeach.some(s => s.name === skill)
          ? prev.skillsToTeach.filter(s => s.name !== skill)
          : [...prev.skillsToTeach, { name: skill, level: 'Intermediate' }]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        skillsToLearn: prev.skillsToLearn.includes(skill)
          ? prev.skillsToLearn.filter(s => s !== skill)
          : [...prev.skillsToLearn, skill]
      }));
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;
    setIsSubmitting(true);
    setErrorMessage('');

    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      const val = formData[key];
      if (val === undefined || val === null || val === '') return;
      if (key === 'profilePicture' && val instanceof File) {
        formDataToSend.append(key, val);
      } else if (Array.isArray(val) || (typeof val === 'object' && val !== null)) {
        formDataToSend.append(key, JSON.stringify(val));
      } else {
        formDataToSend.append(key, val);
      }
    });

    try {
      const res = await fetch('https://skill-exchanger-backend-3.onrender.com/api/users/profile', {
        method: 'POST',
        body: formDataToSend,
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push('/pages/log_in'), 2000);
      } else {
        setErrorMessage(data.message || 'Server rejected the request');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <motion.div variants={cardVariants} className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Welcome! Let's start with the basics</h2>
              <p className="text-gray-600 mt-2">Tell us about yourself</p>
            </div>
            <div className="flex justify-center mb-6">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg group-hover:shadow-xl transition-shadow">
                  {uploadedImage ? <img src={uploadedImage} alt="Profile" className="w-full h-full object-cover" /> : <Camera className="w-8 h-8 text-white" />}
                </div>
                <label className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 p-3 rounded-full cursor-pointer transition-all transform group-hover:scale-110 shadow-lg">
                  <Camera className="w-5 h-5 text-white" />
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                <input type="text" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900" placeholder="John Doe" />
                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900" placeholder="john@example.com" />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password *</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password *</label>
                <input type="password" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900" placeholder="••••••••" />
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                <select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900">
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                <input type="date" value={formData.dateOfBirth} onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900" />
              </div>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div variants={cardVariants} className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">Where are you located?</h2>
              <p className="text-gray-600 mt-2">Help us connect you with nearby learners</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-gray-900" placeholder="New York" />
                </div>
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">State *</label>
                <input type="text" value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-gray-900" placeholder="NY" />
                {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Country *</label>
                <input type="text" value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-gray-900" placeholder="United States" />
                {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">ZIP Code</label>
                <input type="text" value={formData.zipCode} onChange={(e) => setFormData({...formData, zipCode: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-gray-900" placeholder="10001" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Time Zone</label>
                <input type="text" value={formData.timeZone} onChange={(e) => setFormData({...formData, timeZone: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-gray-900" placeholder="America/New_York" />
              </div>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div variants={cardVariants} className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">What skills do you have?</h2>
              <p className="text-gray-600 mt-2">Share your expertise and learning goals</p>
            </div>
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center"><Brain className="mr-2 text-purple-500" /> Skills You Can Teach</h3>
                {errors.skillsToTeach && <p className="text-red-500 text-sm mb-2">{errors.skillsToTeach}</p>}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {predefinedSkills.map(skill => (
                    <motion.button key={skill} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleSkillToggle(skill, 'teach')} className={`p-3 rounded-xl text-sm font-medium transition-all ${formData.skillsToTeach.some(s => s.name === skill) ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'}`}>{skill}</motion.button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center"><Sparkles className="mr-2 text-blue-500" /> Skills You Want to Learn</h3>
                {errors.skillsToLearn && <p className="text-red-500 text-sm mb-2">{errors.skillsToLearn}</p>}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {predefinedSkills.map(skill => (
                    <motion.button key={skill} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleSkillToggle(skill, 'learn')} className={`p-3 rounded-xl text-sm font-medium transition-all ${formData.skillsToLearn.includes(skill) ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'}`}>{skill}</motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div variants={cardVariants} className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Final touches</h2>
              <p className="text-gray-600 mt-2">Help others get to know you better</p>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">About Me *</label>
                <textarea value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-900" placeholder="Tell us about yourself, your experience, and what you're passionate about..." />
                {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input type="tel" value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-900" placeholder="+1 (555) 000-0000" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Contact</label>
                  <select value={formData.preferredContact} onChange={(e) => setFormData({...formData, preferredContact: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-900">
                    <option value="Email">Email</option>
                    <option value="Chat">Chat</option>
                  </select>
                </div>
              </div>
              {errorMessage && <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">{errorMessage}</div>}
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-8 px-4">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <motion.h1 initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }} className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">Create Your Profile</motion.h1>
          <p className="text-gray-600 text-lg">Join thousands of learners and teachers</p>
        </div>
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((s, index) => (
              <div key={s.id} className="flex items-center flex-1">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: index * 0.1 }} className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-300 ${step >= s.id ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' : 'bg-gray-200 text-gray-400'}`}>
                  {step > s.id ? <Check size={20} /> : s.icon}
                </motion.div>
                {index < steps.length - 1 && <div className={`flex-1 h-1 mx-2 transition-all duration-300 ${step > s.id ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4">
            {steps.map(s => <div key={s.id} className="text-center"><p className={`text-sm font-medium transition-colors ${step >= s.id ? 'text-gray-800' : 'text-gray-400'}`}>{s.title}</p></div>)}
          </div>
        </div>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }} className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          {renderStep()}
          <div className="flex justify-between mt-8">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={prevStep} disabled={step === 1} className={`px-6 py-3 rounded-xl font-semibold transition-all ${step === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Previous</motion.button>
            {step < 4 ? (
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={nextStep} className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2">Next <ChevronRight size={20} /></motion.button>
            ) : (
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleSubmit} disabled={isSubmitting} className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all">{isSubmitting ? 'Creating Profile...' : 'Create Profile ✨'}</motion.button>
            )}
          </div>
        </motion.div>
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div key={i} className="absolute w-2 h-2 bg-blue-200 rounded-full" animate={{ y: [0, -100], x: [0, Math.random() * 100 - 50], opacity: [0, 1, 0], }} transition={{ duration: Math.random() * 5 + 5, repeat: Infinity, delay: Math.random() * 5, }} style={{ left: `${Math.random() * 100}%`, top: '100%', }} />
          ))}
        </div>
      </motion.div>
      <AnimatePresence>
        {success && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="bg-white rounded-2xl p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Profile Created!</h3>
              <p className="text-gray-600">Welcome to our community!</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileCreationPage;