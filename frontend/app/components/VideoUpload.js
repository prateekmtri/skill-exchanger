'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Upload, AlertCircle, CheckCircle } from 'lucide-react';

const VideoUpload = ({ userSkills, onUploadSuccess }) => {
  const [skillName, setSkillName] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska'];
      if (!validTypes.includes(file.type)) {
        setError('Please select a valid video file (mp4, mov, avi, mkv)');
        return;
      }
      if (file.size > 100 * 1024 * 1024) {
        setError('Video file must be less than 100MB');
        return;
      }
      setVideoFile(file);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!skillName) {
      setError('Please select a skill to verify');
      return;
    }
    if (!videoFile) {
      setError('Please select a video file');
      return;
    }

    setUploading(true);
    setError(null);
    setMessage(null);
    setProgress(20);

    try {
      const token = localStorage.getItem('skill-token');
      const formData = new FormData();
      formData.append('skillName', skillName);
      formData.append('video', videoFile);

      setProgress(40);

      const response = await fetch(`${API_BASE_URL}/api/verification/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      setProgress(80);

      const data = await response.json();

      if (data.status === 'success') {
        setMessage(data.message || 'Video submitted! Your verification is under review.');
        setProgress(100);
        setSkillName('');
        setVideoFile(null);
        if (onUploadSuccess) {
          onUploadSuccess();
        }
      } else {
        setError(data.message || 'Upload failed');
        setProgress(0);
      }
    } catch (err) {
      setError(err.message || 'Failed to upload video');
      setProgress(0);
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl p-8"
    >
      <div className="flex items-center mb-6">
        <Video className="w-6 h-6 text-purple-500 mr-3" />
        <h3 className="text-xl font-bold text-gray-800">Verify Your Skill</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Select Skill to Verify
          </label>
          <select
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            disabled={uploading}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 text-gray-900"
          >
            <option value="">Choose a skill...</option>
            {(userSkills || []).map((skill) => (
              <option key={skill.name} value={skill.name}>
                {skill.name} ({skill.level})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Upload Verification Video
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 transition-colors">
            <input
              type="file"
              accept="video/mp4,video/quicktime,video/x-msvideo,video/x-matroska"
              onChange={handleVideoChange}
              disabled={uploading}
              className="hidden"
              id="video-upload"
            />
            <label htmlFor="video-upload" className="cursor-pointer">
              {videoFile ? (
                <div className="flex items-center justify-center gap-2 text-purple-600">
                  <Video className="w-8 h-8" />
                  <span className="font-medium">{videoFile.name}</span>
                </div>
              ) : (
                <div className="text-gray-500">
                  <Upload className="w-10 h-10 mx-auto mb-2" />
                  <p className="text-sm">Click to upload video (max 100MB)</p>
                  <p className="text-xs mt-1">mp4, mov, avi, mkv</p>
                </div>
              )}
            </label>
          </div>
        </div>

        {progress > 0 && (
          <div className="space-y-2">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              />
            </div>
            <p className="text-sm text-gray-600 text-center">{progress}% uploaded</p>
          </div>
        )}

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700"
            >
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700"
            >
              <CheckCircle className="w-5 h-5" />
              <span>{message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="submit"
          disabled={uploading || !skillName || !videoFile}
          whileHover={{ scale: uploading ? 1 : 1.02 }}
          whileTap={{ scale: uploading ? 1 : 0.98 }}
          className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 ${
            uploading || !skillName || !videoFile
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg'
          }`}
        >
          {uploading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              Submit for Verification
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default VideoUpload;