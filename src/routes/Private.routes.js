import React, { useContext } from 'react'
import AuthContext from '../contexts/Auth.context'
import { Navigate, useLocation } from 'react-router-dom';

export const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useContext(AuthContext);
    const location = window.location.href;
    return (
        isAuthenticated ?
            <React.Fragment>
                {children}
            </React.Fragment>
            : <Navigate to={`/auth/login?redirect=${location}`} />
    )
}
