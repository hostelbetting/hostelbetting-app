import React, { useContext, useEffect } from 'react'
import TabNameContext from '../../contexts/TabName.context';

export const ErrorPage = () => {
    // Set tabtitle 
    const { tabName, setTabName } = useContext(TabNameContext);
    useEffect(() => {
        setTabName("oOPs!");
        document.title = "404 page not found"
    }, [])

    return (
        <div className='container'>
            <h1>404 Not found</h1>
        </div>
    )
}
