import React, { useEffect, useState } from 'react'
import "./input.style.css"

export const PopInput = ({ type = "text", placeholder = "", props, value = '', onChange, className = '', inputClass = '', disabled = false }) => {
    // generate random id 
    const id = Math.random().toFixed(3);

    // handle input focus
    const [isFocus, setIsFocus] = useState(false);
    // Input value
    const [input, setInput] = useState('');
    useEffect(() => {
        setInput(value)
        if (value?.length) setIsFocus(true)
    }, [value])

    // handle focus and blur
    const onFocus = () => setIsFocus(true);
    const onBlur = () => {
        if (!input?.length) setIsFocus(false);
    }

    // handle password view
    const [inputType, setInputType] = useState(type);
    const [passwordView, setPasswordView] = useState(false);
    const handlePasswordView = () => {
        setPasswordView(!passwordView);
    }

    useEffect(() => {
        if (type === "password" && passwordView) {
            setInputType('text')
        } else {
            setInputType(type);
        }
    }, [passwordView, inputType]);

    // Forward input
    useEffect(() => {
        if (onChange)
            onChange(input)
    }, [input])
    return (
        <div className={`hb-pop-input ${className} ${isFocus ? "hb-input-active" : ''} ${disabled && "hb-input-disabled"}`}>
            <label htmlFor={`pop-input-${id}`} className='hb-pop-input-placeholder'>{placeholder}</label>
            <input className={inputClass} type={inputType} placeholder='' id={`pop-input-${id}`} onChange={e => setInput(e.target.value)} onFocus={onFocus} onBlur={onBlur} value={input} />
            {type === "password" && <div className='c-pointer' onClick={handlePasswordView}><i className={passwordView ? "ri-eye-line" : "ri-eye-close-line"}></i></div>}
        </div>
    )
}
