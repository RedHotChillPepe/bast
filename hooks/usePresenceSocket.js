import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useApi } from '../context/ApiContext';
import { getAuth } from './../utils/authUtils';

const useSocket = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [opponentStatus, setOpponentStatus] = useState(null);
    const socketRef = useRef(null);
    const userRef = useRef(null);
    const { host } = useApi();

    const setOnlineStatus = (status) => {
        if (socketRef.current && userRef.current) {
            // Добавляем колбек для подтверждения отправки
            socketRef.current.emit('setOnlineStatus', {
                userId: userRef.current.sub,
                usertype: userRef.current.usertype,
                isOnline: status
            }, () => {
                // console.log(`Status ${status ? 'online' : 'offline'} confirmed`);
            });
        }
    };

    const connectSocket = async () => {
        try {
            const user = await getAuth(true);
            userRef.current = user.decoded;
            const token = user.token;

            socketRef.current = io(host, {
                path: '/socket.io',
                transports: ['websocket'],
                auth: { token },
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
            });

            socketRef.current.on('connect', () => {
                setIsConnected(true);
                setOnlineStatus(true);
            });

            socketRef.current.on('disconnect', () => {
                setIsConnected(false);
            });

            socketRef.current.on('presenceUpdate', (data) => {
                // console.log(data);
                // console.log(userRef);
                if (data.userId !== userRef.current?.sub && data.usertype !== userRef.current) {
                    setOpponentStatus(data.isOnline);
                }
            });

            socketRef.current.on('error', (err) => {
                console.error('Socket error:', err);
            });

            // Добавляем обработчик для статуса
            socketRef.current.on('userOnlineStatus', (status) => {
                // console.log(status);
                setOpponentStatus(status.isOnline);
            });

        } catch (err) {
            console.error('Socket initialization error:', err);
        }
    };

    const getOpponentStatus = (opponentId, opponentType) => {
        if (socketRef.current) {
            socketRef.current.emit(
                'getOnlineStatus',
                { userId: opponentId, usertype: opponentType },
                (status) => {
                    // console.log(status);
                    setOpponentStatus(status.isOnline);
                    return status.isOnline
                }
            );
        }
    };

    useEffect(() => {
        connectSocket();

        return () => {
            if (socketRef.current) {
                // Сначала отправляем статус, затем отключаемся
                setOnlineStatus(false);
                setTimeout(() => {
                    socketRef.current?.disconnect();
                }, 100); // Даем время на отправку
            }
        };
    }, [host]);

    return {
        isConnected,
        setOnlineStatus,
        opponentStatus,
        getOpponentStatus
    };
};

export default useSocket;
