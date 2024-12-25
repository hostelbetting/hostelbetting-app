import React, { useContext } from 'react'
import AuthContext from '../../contexts/Auth.context'
import { Navigate } from 'react-router-dom';

export const AuthenticatedContainer = ({ children }) => {
    const { isAuthenticated } = useContext(AuthContext);
    return (
        isAuthenticated &&
        <React.Fragment>
            {children}
        </React.Fragment>
    )
}
