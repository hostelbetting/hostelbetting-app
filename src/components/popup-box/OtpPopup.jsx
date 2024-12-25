import React, { useEffect, useState } from 'react'
import { PopupBox } from './PopupBox'

export const OtpPopup = ({ openState, onClose, onSubmit, length = 4 }) => {
    const [otp, setOtp] = useState(Array(length).fill(""));
    const [otpLine, setOtpLine] = useState('');

    const handleChange = (e, index) => {
        const value = e.target.value;
        if (!/^[0-9]?$/.test(value)) return; // Allow only numeric values

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        setOtpLine(newOtp.join(""));

        // Move to the next input if a digit is entered
        if (value && index < length - 1) {
            const nextInput = document.getElementById(`otp-input-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-input-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    useEffect(() => {
        if (otpLine.length === length) {
            onSubmit(otpLine);
            onClose();
            setOtpLine("");
            setOtp(otp.forEach(e => e = ""));
        }
    }, [otpLine]);
    return (
        <PopupBox openState={openState}>
            <div className='hb-otp-box'>
                <div className='mb-3'>
                    <h5>Verify your email</h5>
                    <div>Enter the otp send to s***@gmail.com <span className='hb-url-colored' onClick={onClose}>Edit</span></div>
                </div>
                <div className='hb-otp-input-box'>
                    {
                        otp?.map((digit, index) => {
                            return <input type="text" name="" id={`otp-input-${index}`}
                                className="hb-otp-input"
                                maxLength={1}
                                key={index}
                                value={digit}
                                onChange={(e) => handleChange(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                autoComplete={"off"}
                            />
                        })
                    }
                </div>
            </div>
        </PopupBox>
    )
}
