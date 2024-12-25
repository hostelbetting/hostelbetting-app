import React, { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client';
import { useCurrentUser } from '../hooks/current-user';
import { toast } from 'react-toastify';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    // fetch current user
    const userData = useCurrentUser();
    // connect socket
    const [notification, setNotification] = useState()
    useEffect(() => {
        if (userData) {
            const socket = io(process.env.REACT_APP_PROXY_URL);
            socket.emit("join", userData?._id);
            socket.on("notification", (data) => {
                setNotification(data);
                toast(data?.subject)
            })
            return () => {
                socket.disconnect();
            };
        }
    }, [])
    return (
        <NotificationContext.Provider value={notification}>
            {children}
        </NotificationContext.Provider>
    )
}
