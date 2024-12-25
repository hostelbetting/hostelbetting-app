import React, { createContext, useEffect, useState } from 'react'
import axios from '../configs/axios-configs';
import { LoadingSpinner1, LoadingSpinnerLine } from '../components/spinners/LoadingSpinner';
import { useCurrentUser } from '../hooks/current-user';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    useEffect(() => {
        const handleAuth = async () => {
            try {
                await axios.get('/user/check-auth')
                    .then(res => {
                        const logStatus = res.data?.data?.isAuthenticated
                        setTimeout(() => {
                            setIsAuthenticated(logStatus)
                        }, 600)
                    })
            } catch (error) {
                // console.log("Auth Error", error);
                setTimeout(() => {
                    setIsAuthenticated(false)
                }, 600)
            }
        }
        handleAuth()
    }, []);
    // currentUser
    const currentUser = useCurrentUser();
    return (
        <AuthContext.Provider value={{ isAuthenticated, currentUser }}>
            {
                isAuthenticated === null ? <LoaderBox />
                    : children
            }

        </AuthContext.Provider>
    )
}

export default AuthContext;

const LoaderBox = () => {
    return (
        <div className='d-flex align-items-center justify-content-center hb-bg-color' style={{ height: '100vh', width: '100vw' }}>
            <LoadingSpinner1 size={100} />
        </div>
    )
}