// frontend/context/SocketContext.js (Final Corrected Code)
'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { io } from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [unreadCounts, setUnreadCounts] = useState({});
    const [loggedInUser, setLoggedInUser] = useState(null);

    // Page load par user ka data (aur unread messages) fetch karein
    useEffect(() => {
        const token = localStorage.getItem('skill-token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                fetch(`https://skill-exchanger-backend-3.onrender.com/api/users/${decoded.id}`)
                    .then(res => res.json())
                    .then(data => {
                        if (data.status === 'success') {
                            setLoggedInUser(data.data.user);
                            setUnreadCounts(data.data.user.unreadMessages || {});
                        }
                    });
            } catch (e) { console.error("Auth error in context", e); }
        }
    }, []);

  

 // Socket connection useEffect - IMPROVED
    useEffect(() => {
        if (loggedInUser) {
            console.log('Connecting socket for user:', loggedInUser._id);
            
            const newSocket = io('https://skill-exchanger-backend-3.onrender.com', {
                transports: ['websocket', 'polling'],
                timeout: 20000,
                forceNew: false,
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionAttempts: 5
            });
            
            setSocket(newSocket);

            newSocket.on('connect', () => {
                console.log('Socket connected successfully with ID:', newSocket.id);
                newSocket.emit('addUser', loggedInUser._id);
            });

            newSocket.on('disconnect', (reason) => {
                console.log('Socket disconnected:', reason);
            });

            newSocket.on('connect_error', (error) => {
                console.error('Socket connection error:', error);
            });

            newSocket.on('new_message', (message) => {
                console.log('New message received in context:', message);
                
                const currentPath = window.location.pathname;
                const currentChatPartnerId = currentPath.includes('/chat/') ? 
                    currentPath.split('/chat/')[1] : null;
                
                // Show toast only if not in current chat
                if (message.senderId !== loggedInUser._id && 
                    message.senderId !== currentChatPartnerId) {
                    
                    toast.success(`New message from ${message.senderName || 'Someone'}!`, { 
                        icon: '📬',
                        duration: 4000 
                    });
                    
                    setUnreadCounts(prev => ({ 
                        ...prev, 
                        [message.senderId]: (prev[message.senderId] || 0) + 1 
                    }));
                }
            });

            // Cleanup function
            return () => {
                console.log('Disconnecting socket');
                newSocket.disconnect();
            };
        }
    }, [loggedInUser]);


    const clearUnreadFrom = useCallback((senderId) => {
        setUnreadCounts(prev => {
            const newCounts = { ...prev };
            delete newCounts[senderId];
            return newCounts;
        });
    }, []);
    
    useEffect(() => {
        const totalUnread = Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);
        if (totalUnread > 0) { document.title = `(${totalUnread}) Skill Exchange`; } 
        else { document.title = "Skill Exchange"; }
    }, [unreadCounts]);

    const value = useMemo(() => ({
        socket,
        unreadCounts,
        clearUnreadFrom,
    }), [socket, unreadCounts, clearUnreadFrom]);

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};