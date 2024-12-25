import React, { useContext } from 'react'
import AuthContext from '../contexts/Auth.context';
import { Navigate } from 'react-router-dom';

export const PreloginRoute = ({children}) => {
    const { isAuthenticated } = useContext(AuthContext);
    return (
        isAuthenticated ?
            <Navigate to={'/*'} />
            :
            <React.Fragment>
                {children}
            </React.Fragment>
    )
}
