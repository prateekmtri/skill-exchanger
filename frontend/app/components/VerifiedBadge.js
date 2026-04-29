'use client';

import React from 'react';
import { motion } from 'framer-motion';

const VerifiedBadge = ({ status }) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'verified':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          icon: '✓',
          label: 'Verified'
        };
      case 'pending':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          icon: '🟡',
          label: 'Pending'
        };
      case 'rejected':
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-600',
          icon: '○',
          label: 'Unverified'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-600',
          icon: '○',
          label: 'Unverified'
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${config.bg} ${config.text} text-sm font-medium`}
    >
      <span className="text-base">{config.icon}</span>
      <span>{config.label}</span>
    </motion.div>
  );
};

export default VerifiedBadge;