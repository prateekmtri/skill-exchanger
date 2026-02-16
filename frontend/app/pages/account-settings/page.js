'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Trash2, X, Loader } from 'lucide-react';

export default function AccountSettingsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // AuthLoading state taaki page turant na dikhe
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();

  // YEH useEffect AB SIRF CHECK KAREGA KI TOKEN HAI YA NAHI
  useEffect(() => {
    const token = localStorage.getItem('skill-token');
    if (!token) {
      router.push('/pages/log_in');
    } else {
      // Token hai, toh loading band kar dein aur page dikhayein
      setAuthLoading(false);
    }
  }, [router]);

  const handleDeleteAccount = async () => {
    setLoading(true);
    setError('');

    const token = localStorage.getItem('skill-token');

    // Safety Check: Agar token nahi hai toh action na lein
    if (!token) {
        setError('Authentication error. Please log in again.');
        setLoading(false);
        return;
    }

    if (!password) {
      setError('Password is required.');
      setLoading(false);
      return;
    }

    try {
      // --- YAHAN FINAL FIX HAI ---
      // Hum state ka intezaar nahi karenge, seedha token se ID nikalenge
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      // Agar token mein id nahi hai
      if (!userId) {
        throw new Error('Invalid token structure.');
      }

      const res = await fetch(`https://skill-exchanger-backend-3.onrender.com/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password: password })
      });

      if (res.status === 204) {
        alert('Account deleted successfully.');
        localStorage.removeItem('skill-token');
        router.push('/');
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to delete account.');
      }
    } catch (err) {
      console.error("Delete account error:", err);
      setError('An error occurred. Invalid token or network issue.');
    } finally {
      setLoading(false);
    }
  };

  // Jab tak auth check na ho, loading dikhayein
  if (authLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Account Settings</h1>
          
          <div className="border-2 border-red-300 rounded-lg p-6 mt-10">
            <div className="flex items-start">
              <ShieldAlert className="h-8 w-8 text-red-500 mr-4 flex-shrink-0" />
              <div>
                <h2 className="text-xl font-bold text-red-700">Danger Zone</h2>
                <p className="text-gray-600 mt-2">
                  Once you delete your account, there is no going back. All your data will be permanently removed. Please be certain.
                </p>
                <motion.button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-4 bg-red-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Delete My Account
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: -20 }}
              className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-800">Are you absolutely sure?</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-full hover:bg-gray-100">
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                This action is permanent. To confirm, please enter your password.
              </p>
              <div className="space-y-4">
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                  onClick={handleDeleteAccount}
                  disabled={loading || !password}
                  className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader className="animate-spin" size={20} />
                  ) : (
                    <Trash2 size={20} />
                  )}
                  {loading ? 'Deleting...' : 'Permanently Delete Account'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}