import React, { useContext, useEffect } from 'react'
import TabNameContext from '../../contexts/TabName.context';
import { useNavigate } from 'react-router-dom';

export const ErrorPage = () => {
    // Set tabtitle 
    const { tabName, setTabName } = useContext(TabNameContext);
    useEffect(() => {
        setTabName("oOPs!");
        document.title = "404 page not found"
    }, [])

    const navigate = useNavigate();
    return (
        <div className='container'>
            <div className='hb-display__inline-flex flex-column gap-2'>
                <h1><strong>404</strong> Not found 😓</h1>
                <div>The route "{window.location.pathname}" isn't found. Try to use a valid route.</div>
                <button className='hb-btn hb-btn-primary__transparent my-3' onClick={() => navigate("/home")}><i class="ri-home-9-line"></i> Back to home</button>
            </div>
        </div>
    )
}
