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
    const [waitText, setWaitText] = useState(false);
    const [LongwaitText, setLongWaitText] = useState(false);
    useEffect(() => {
        setTimeout(() => setWaitText(true), [5000]);
        setTimeout(() => setLongWaitText(true), [15000]);
    }, [])
    return (
        <div className='hb-page-loader-box'>
            <div className='hb-fadein-anim'>
                <img src={require("../assets/img/hostelbetting-logo-fill.png")} alt="" />
            </div>
            {waitText && <div className='d-flex gap-2 align-items-center hb-fadein-anim'>
                <LoadingSpinner1 />
                <span>Please wait</span>
            </div>}
            {LongwaitText && <div className='d-flex gap-2 align-items-center hb-fadein-anim'>
                <span>Don't worry! It can take few seconds</span>
            </div>}
        </div>
    )
}