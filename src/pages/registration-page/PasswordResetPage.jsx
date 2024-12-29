import React, { useEffect, useState } from 'react'
import { PopInput } from '../../components/inputs/PopInput'
import { OtpPopup } from '../../components/popup-box/OtpPopup'
import { toast } from 'react-toastify';
import axios from '../../configs/axios-configs';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinnerLine } from '../../components/spinners/LoadingSpinner';

export const PasswordResetPage = () => {
    // page title
    useEffect(() => {
        document.title = "Reset password"
    },[])

    const navigate = useNavigate();
    // handle otp
    const [openOtp, setOpenOtp] = useState(false);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(false)
    const handleOtp = async () => {
        if (!email) {
            toast.error("Email is required");
            return;
        }

        try {
            setLoading(true);
            await axios.post("/user/create-otp", { email, subject: "Otp request to Reset password", type: "reset-password" })
                .then(res => {
                    setToken(res?.data?.data?.token)
                    setOpenOtp(true);
                }
                )
        } catch (error) {
            toast.error("Error on trying");
        }
        setLoading(false)
    }

    // setup password change
    const [activeChange, setActiveChange] = useState(false)
    // checks the otp
    useEffect(() => {
        const checkOtp = async () => {
            setLoading(true)
            try {
                await axios.post("/user/check-otp", { email, otpCode: otp })
                    .then(() => setActiveChange(true))
            } catch (error) {
                if (error?.response?.status === 402 || error?.response?.status === 403) toast.error("Otp is not valid")
            }
            setLoading(false)
        }
        if (otp) checkOtp();
    }, [otp])

    // change password
    const [password, setpassword] = useState("");
    const handleCahngeOtp = async () => {
        if (!activeChange) {
            setLoading(true);
            handleOtp();
            setLoading(false)
        } else {
            setLoading(true)
            if (!password) {
                toast.error("Password is required");
                setLoading(false);
                return;
            }

            try {
                await axios.patch("/user/reset-password", { token, otpCode: otp, password, email })
                    .then(() => {
                        navigate("/home")
                    })

            } catch (error) {
                const status = error?.response?.status;
                if (status === 402 || status === 403) toast.error("Invalid otp")
            }
        }
        setLoading(false);
    }

    return (
        <div className='container hb-registration-continer'>
            <div className='hb-registration-content-warper'>
                <div className='hb-registration-content-box'>
                    <div className='text-center mb-4'>
                        <h3>Reset password</h3>
                    </div>
                    {!activeChange ? <div>
                        <PopInput type='email' placeholder='Enter registered email id' onChange={e => setEmail(e)} value={email} />
                        <p className='mt-2 hb-text-fade'><span><i className="ri-information-line"></i>You will recieve an otp to your registered email id</span></p>
                    </div> :
                        <div>
                            <PopInput type='password' placeholder='Enter new password' onChange={(e) => setpassword(e)} value={password} />
                            <p className='mt-2 hb-text-fade'><span><i className="ri-information-line"></i>Use a strong password</span></p>
                        </div>
                    }
                    <div className='align-self-end hb-auth-container-btn-box'>
                        <button className="hb-btn hb-btn-primary__grad py-2 w-100 justify-content-center rounded-5" onClick={handleCahngeOtp} disabled={loading}>{loading && <LoadingSpinnerLine />}{!activeChange ? "Verify email" : "Change password"}</button>
                    </div>
                </div>
            </div>
            <OtpPopup openState={openOtp} onClose={() => setOpenOtp(false)} onSubmit={e => setOtp(e)} />
        </div>
    )
}
