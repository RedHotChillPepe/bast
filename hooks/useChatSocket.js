import { useEffect, useRef, useState, useCallback } from 'react';
import io from 'socket.io-client';
import { useApi } from '../context/ApiContext';
import { getAuth } from '../utils/authUtils';

export const useChatSocket = (chatId, currentUser, onMessageReceived, onTyping) => {
    const { host } = useApi();
    const socketRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!chatId || typeof chatId !== 'number' || !currentUser) {
            console.warn('Invalid init params for socket:', { chatId, currentUser });
            return;
        }

        let newSocket;
        (async () => {
            const token = await getAuth(true);

            newSocket = io(host, {
                path: '/socket.io',
                transports: ['websocket'],
                auth: { token },
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
            });

            newSocket.on('connect', () => {
                setIsConnected(true);
                newSocket.emit('joinChat', {
                    chatId,
                    user: {
                        id: currentUser.id,
                        usertype: currentUser.usertype,
                    },
                });
            });

            newSocket.on('disconnect', () => {
                setIsConnected(false);
            });

            newSocket.on('messageSent', message => {
                if (onMessageReceived) onMessageReceived(message);
            });

            newSocket.on('error', err => {
                console.error('Socket error:', err);
            });

            socketRef.current = newSocket;
        })();

        return () => {
            if (socketRef.current) {
                socketRef.current.emit('leaveChat', {
                    chatId,
                    user: {
                        id: currentUser.id,
                        usertype: currentUser.usertype,
                    }
                });
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [host, chatId, currentUser, onMessageReceived]);

    useEffect(() => {
        const s = socketRef.current;
        if (!s) return;
        const handleUserTyping = ({ userId, usertype }) => {
            // console.log(`User ${userId} (${usertype}) is typing`);
            if (userId !== currentUser.id && usertype !== currentUser.usertype) onTyping(true);
        };
        const handleUserStop = ({ userId, usertype }) => {
            // console.log(`User ${userId} (${usertype}) stopped typing`);
            if (userId !== currentUser.id && usertype !== currentUser.usertype) onTyping(false);
        };
        s.on('userTyping', handleUserTyping);
        s.on('userStopTyping', handleUserStop);
        return () => {
            s.off('userTyping', handleUserTyping);
            s.off('userStopTyping', handleUserStop);
        };
    }, [socketRef.current, currentUser, onTyping]);

    const emitTyping = () => {
        if (socketRef.current && isConnected) {
            socketRef.current.emit('typing', { chatId, userId: currentUser.id, usertype: currentUser.usertype });
        }
    };

    const emitStopTyping = () => {
        if (socketRef.current && isConnected) {
            socketRef.current.emit('stopTyping', { chatId, userId: currentUser.id, usertype: currentUser.usertype });
        }
    };

    const sendMessage = useCallback(
        text => {
            if (!socketRef.current || !isConnected) {
                console.warn('Socket not connected');
                return;
            }
            const payload = {
                chat_id: chatId,
                message: text,
                user: {
                    id: currentUser.id,
                    usertype: currentUser.usertype,
                },
            };
            socketRef.current.emit('sendMessage', payload);
        },
        [chatId, currentUser, isConnected],
    );

    const markAsRead = useCallback((messageId, chatId) => {
        // if (!socketRef.current || !isConnected) return;
        console.log("messageId:", messageId);
        console.log(chatId);
        socketRef.current.emit('markMessagesRead', {
            messageId,
            chatId,
            userId: currentUser.id,
            usertype: currentUser.usertype
        });
    }, [socketRef.current, isConnected, currentUser]);

    return { socket: socketRef.current, isConnected, sendMessage, emitTyping, emitStopTyping, markAsRead };
};
