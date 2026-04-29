'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { 
  Users, Video, CheckCircle, XCircle, Clock, 
  Loader, AlertTriangle, User, Mail, Play, X, Shield, Crown
} from 'lucide-react';
import VerifiedBadge from '../../components/VerifiedBadge';

const AdminDashboard = () => {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [isAdmin, setIsAdmin] = useState(false);
  const [rejectModal, setRejectModal] = useState({ open: false, id: null, note: '' });
  const [processing, setProcessing] = useState(null);
  const [makeAdminEmail, setMakeAdminEmail] = useState('');
  const [makingAdmin, setMakingAdmin] = useState(false);
  const [adminSuccess, setAdminSuccess] = useState(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();

  useEffect(() => {
    checkAuthAndFetch();
  }, [filter]);

  const checkAuthAndFetch = async () => {
    const token = localStorage.getItem('skill-token');
    if (!token) {
      router.push('/pages/log_in');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const userId = decoded.id;
      
      const userRes = await fetch(`${API_BASE_URL}/api/users/${userId}`);
      const userData = await userRes.json();
      
      if (userData.status !== 'success' || !userData.data.user.isAdmin) {
        router.push('/pages/Home');
        return;
      }

      setIsAdmin(true);
      fetchVerifications(token);
    } catch (error) {
      console.error('Auth error:', error);
      router.push('/pages/log_in');
    }
  };

  const fetchVerifications = async (token) => {
    try {
      setLoading(true);
      const queryParam = filter !== 'all' ? `?status=${filter}` : '';
      const response = await fetch(`${API_BASE_URL}/api/verification/all${queryParam}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();

      if (data.status === 'success') {
        setVerifications(data.data.verifications);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    const token = localStorage.getItem('skill-token');
    try {
      setProcessing(id);
      const response = await fetch(`${API_BASE_URL}/api/verification/${id}/approve`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();

      if (data.status === 'success') {
        setVerifications(prev => prev.map(v => 
          v._id === id ? { ...v, status: 'verified' } : v
        ));
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(null);
    }
  };

  const handleMakeAdmin = async (e) => {
    e.preventDefault();
    if (!makeAdminEmail) return;
    const token = localStorage.getItem('skill-token');
    try {
      setMakingAdmin(true);
      setAdminSuccess(null);
      const response = await fetch(`${API_BASE_URL}/api/make-user-admin`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: makeAdminEmail })
      });
      const data = await response.json();

      if (data.status === 'success') {
        setAdminSuccess(data.message);
        setMakeAdminEmail('');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setMakingAdmin(false);
    }
  };

  const handleRemoveAdmin = async (e) => {
    e.preventDefault();
    if (!makeAdminEmail) return;
    const token = localStorage.getItem('skill-token');
    try {
      setMakingAdmin(true);
      setAdminSuccess(null);
      const response = await fetch(`${API_BASE_URL}/api/remove-admin`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: makeAdminEmail })
      });
      const data = await response.json();

      if (data.status === 'success') {
        setAdminSuccess(data.message);
        setMakeAdminEmail('');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setMakingAdmin(false);
    }
  };

  const handleReject = async () => {
    if (!rejectModal.id) return;
    const token = localStorage.getItem('skill-token');
    try {
      setProcessing(rejectModal.id);
      const response = await fetch(`${API_BASE_URL}/api/verification/${rejectModal.id}/reject`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ adminNote: rejectModal.note })
      });
      const data = await response.json();

      if (data.status === 'success') {
        setVerifications(prev => prev.map(v => 
          v._id === rejectModal.id ? { ...v, status: 'rejected', adminNote: rejectModal.note } : v
        ));
        setRejectModal({ open: false, id: null, note: '' });
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(null);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    const cleanPath = path.replace(/\\/g, '/');
    return `${API_BASE_URL}/${cleanPath}`;
  };

  const filterTabs = [
    { key: 'all', label: 'All', icon: Users },
    { key: 'pending', label: 'Pending', icon: Clock },
    { key: 'verified', label: 'Verified', icon: CheckCircle },
    { key: 'rejected', label: 'Rejected', icon: XCircle },
  ];

  if (loading && !isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader className="w-12 h-12 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Manage skill verifications</p>
        </div>

        <div className="mb-6 bg-white rounded-2xl shadow-xl p-4">
          <form onSubmit={handleMakeAdmin} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-grow">
              <input
                type="email"
                placeholder="Enter user email"
                value={makeAdminEmail}
                onChange={(e) => setMakeAdminEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 text-gray-900"
              />
            </div>
            <motion.button
              type="submit"
              disabled={makingAdmin || !makeAdminEmail}
              whileHover={{ scale: makingAdmin ? 1 : 1.02 }}
              whileTap={{ scale: makingAdmin ? 1 : 0.98 }}
              className={`flex items-center justify-center gap-2 px-6 py-2 rounded-xl font-semibold text-white ${
                makingAdmin || !makeAdminEmail
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-yellow-500 to-orange-500'
              }`}
            >
              {makingAdmin ? <Loader className="w-5 h-5 animate-spin" /> : <Crown className="w-5 h-5" />}
              Make Admin
            </motion.button>
            <motion.button
              type="button"
              onClick={handleRemoveAdmin}
              disabled={makingAdmin || !makeAdminEmail}
              whileHover={{ scale: makingAdmin ? 1 : 1.02 }}
              whileTap={{ scale: makingAdmin ? 1 : 0.98 }}
              className={`flex items-center justify-center gap-2 px-6 py-2 rounded-xl font-semibold text-white ${
                makingAdmin || !makeAdminEmail
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-500 to-pink-500'
              }`}
            >
              {makingAdmin ? <Loader className="w-5 h-5 animate-spin" /> : <XCircle className="w-5 h-5" />}
              Remove Admin
            </motion.button>
          </form>
          {adminSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 flex items-center gap-2"
            >
              <Shield className="w-5 h-5" />
              <span>{adminSuccess}</span>
            </motion.div>
          )}
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {filterTabs.map(tab => (
            <motion.button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap ${
                filter === tab.key
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </motion.button>
          ))}
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            <AlertTriangle className="w-5 h-5" />
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader className="w-12 h-12 text-purple-500 animate-spin" />
          </div>
        ) : verifications.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No verifications found</p>
          </div>
        ) : (
          <div className="grid gap-6">
            <AnimatePresence>
              {verifications.map((verification) => (
                <motion.div
                  key={verification._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-xl p-6"
                >
                  <div className="flex flex lg:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center overflow-hidden">
                        {verification.userId?.profilePicture ? (
                          <img 
                            src={getImageUrl(verification.userId.profilePicture)} 
                            alt={verification.userId.fullName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-10 h-10 text-gray-400" />
                        )}
                      </div>
                    </div>

                    <div className="flex-grow space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">
                            {verification.userId?.fullName || 'Unknown User'}
                          </h3>
                          <div className="flex items-center gap-2 text-gray-500 mt-1">
                            <Mail className="w-4 h-4" />
                            <span>{verification.userId?.email}</span>
                          </div>
                        </div>
                        <VerifiedBadge status={verification.status} />
                      </div>

                      <div className="flex items-center gap-2 text-gray-600">
                        <Video className="w-4 h-4" />
                        <span className="font-medium">Wants to verify:</span>
                        <span className="text-purple-600 font-semibold">{verification.skillName}</span>
                      </div>

                      {verification.videoUrl && (
                        <div className="bg-gray-100 rounded-xl p-4">
                          <p className="text-sm font-medium text-gray-600 mb-2">Submission Video:</p>
                          <video 
                            controls 
                            className="w-full max-h-64 rounded-lg"
                            src={verification.videoUrl}
                          />
                        </div>
                      )}

                      {verification.status === 'pending' && (
                        <div className="flex gap-3">
                          <motion.button
                            onClick={() => handleApprove(verification._id)}
                            disabled={processing === verification._id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 disabled:opacity-50"
                          >
                            {processing === verification._id ? (
                              <Loader className="w-5 h-5 animate-spin" />
                            ) : (
                              <CheckCircle className="w-5 h-5" />
                            )}
                            Approve
                          </motion.button>
                          <motion.button
                            onClick={() => setRejectModal({ open: true, id: verification._id, note: '' })}
                            disabled={processing === verification._id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 disabled:opacity-50"
                          >
                            <XCircle className="w-5 h-5" />
                            Reject
                          </motion.button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        <AnimatePresence>
          {rejectModal.open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4">Reject Verification</h3>
                <p className="text-gray-600 mb-4">Please provide a reason for rejection:</p>
                <textarea
                  value={rejectModal.note}
                  onChange={(e) => setRejectModal({ ...rejectModal, note: e.target.value })}
                  placeholder="Reason for rejection..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 text-gray-900 mb-4"
                />
                <div className="flex gap-3">
                  <motion.button
                    onClick={handleReject}
                    disabled={processing}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600"
                  >
                    {processing ? <Loader className="w-5 h-5 animate-spin" /> : <XCircle className="w-5 h-5" />}
                    Confirm Reject
                  </motion.button>
                  <motion.button
                    onClick={() => setRejectModal({ open: false, id: null, note: '' })}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300"
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;