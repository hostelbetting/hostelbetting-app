import React, { useEffect, useState } from 'react'
import "./registrationPage.style.css"

import { Link, Outlet, useNavigate, useSearchParams } from 'react-router-dom'
import { PopInput } from '../../components/inputs/PopInput'
import { OtpPopup } from '../../components/popup-box/OtpPopup'
import { toast } from 'react-toastify'
import axios from '../../configs/axios-configs'
import { LoadingSpinnerLine } from '../../components/spinners/LoadingSpinner'

export const AuthenticationPage = () => {
    return (
        <div className='container hb-registration-continer'>
            <Outlet />
        </div >
    )
}

export const Registration = () => {
    // page title
    useEffect(() => {
        document.title = "Register yourself in hostelbetting.fun"
    },[])

    const navigate = useNavigate();
    const [params] = useSearchParams();
    const redirectUri = params.get("redirect");
    // handle input
    const [input, setInput] = useState({ userName: "", email: "", password: "" });
    // active otp handle
    const [openOtpBox, setOpenOtpBox] = useState(false);
    const [otp, setOtp] = useState("");
    const [otpToken, setOtpToken] = useState("");
    // handle registration
    const [loading, setLoading] = useState(false);
    const handleRegistration = async () => {
        try {
            if (Object.keys(input).some(e => input[e] === "")) {
                toast.error("All fields are required");
                return;
            }
            setLoading(true);
            // create otp
            await axios.post("/user/create-otp", { email: input.email, subject: "OTP for registration", type: "registration" })
                .then(res => setOtpToken(res?.data.data.token));

            setLoading(false)
            setOpenOtpBox(true);

        } catch (error) {
            if (error?.response?.status === 401) toast.error("User already registered. Try to log in");
            else toast.error("Registration failed. please try again later");
            console.error(error);
            setLoading(false);
        }
    }
    useEffect(() => {
        const handleCreate = async () => {
            if (otp && otpToken) {
                setLoading(true)
                const formData = new FormData();
                formData.append("otpCode", Number(otp));
                formData.append("token", otpToken);
                formData.append("userName", input.userName);
                formData.append("email", input.email);
                formData.append("password", input.password);

                await axios.post("/user/create-user", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                })
                    .then(async (res) => {
                        toast.success("Registration successfull");
                        // log into the account
                        await axios.post('/user/login-user', { email: input.email, password: input.password })
                            .then(async res => {
                                // create wallet
                                await axios.post("/wallet/create-wallet")
                                    .then(() => {
                                        setLoading(false);
                                        if (redirectUri && redirectUri !== "null") window.location.href = redirectUri;
                                        else {
                                            navigate("/home");
                                            window.location.reload();
                                        }
                                    })
                            })
                            .catch(err => console.log(err));
                    })
                    .catch(err => {
                        console.error(err);
                        if (err?.response.status === 402) toast.error("Otp mismatched");
                    })
                setLoading(false);
            }
        }
        handleCreate();
    }, [otp])
    return (
        <div className='hb-registration-content-warper'>
            <div className='hb-registration-content-box'>
                <div className='text-center mb-4'>
                    <h3>Create new Account</h3>
                </div>
                <div className='mb-3'>
                    <div className='mb-3'>
                        <PopInput type="text" placeholder='Enter your name' onChange={e => setInput({ ...input, userName: e })} />
                    </div>
                    <div className='mb-3'>
                        <PopInput type="email" placeholder='Enter email' onChange={e => setInput({ ...input, email: e })} />
                    </div>
                    <div className='mb-3'>
                        <PopInput type="password" placeholder='Create Password' onChange={e => setInput({ ...input, password: e })} />
                    </div>
                    <p className='mb-0'>Already have an account?<Link to={`/auth/login?redirect=${redirectUri}`} className='hb-url-colored'> Login</Link></p>
                    <p>By continuing you are accepting our <a href="" className='hb-url-colored'> Terms & conditions.</a>
                    </p>
                </div>
                <div className='align-self-end'>
                    <button className='hb-btn hb-btn-primary__grad py-2 w-100 justify-content-center rounded-5' disabled={loading} onClick={handleRegistration}>{loading && <LoadingSpinnerLine />}<span>Create account</span></button>
                </div>
            </div>
            <OtpPopup openState={openOtpBox} onClose={() => setOpenOtpBox(false)} email={input.email} onSubmit={(e) => setOtp(e)} />
        </div >
    )
}

export const Login = () => {
    // page title
    useEffect(() => {
        document.title = "Log into hostelbetting.fun"
    },[])

    const navigate = useNavigate();
    const [params] = useSearchParams();
    const redirectUri = params.get("redirect");
    // handle input
    const [input, setInput] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const handleLogin = async () => {
        try {
            if (!input.password || !input.email) {
                toast.error("Email and password is required");
                return;
            }
            setLoading(true);
            await axios.post("/user/login-user", input)
                .then((res) => {
                    setLoading(false)
                    if (redirectUri && redirectUri !== "null") window.location.href = redirectUri;
                    else {
                        navigate("/home");
                        window.location.reload();
                    }
                })
        } catch (error) {
            console.error(error)
            setLoading(false)
            if (error?.response?.status === 402) {
                toast.error("Incorrect password");
            }
            if (error?.response?.status === 403) {
                toast.error("User not registered");
            }
        }
    }
    return (
        <div className='hb-registration-content-warper'>
            <div className='hb-registration-content-box'>
                <div className='mb-5 text-center'>
                    <h3>Login</h3>
                </div>
                <div>
                    <div className='mb-2'><button className='hb-btn hb-btn-primary__transparent' onClick={() => navigate(`/auth/registration?redirect=${redirectUri}`)}>Register new account</button></div>
                    <div>
                        <div className='mb-3'><PopInput type="email" placeholder='Enter email' onChange={e => setInput({ ...input, email: e })} /></div>
                        <div className='mb-3'><PopInput type="password" placeholder='Password' onChange={e => setInput({ ...input, password: e })} /></div>
                        <p><Link to="/auth/reset-password" className='hb-url-colored'>Forget password?</Link></p>
                        <p>No account? <Link to={`/auth/registration?redirect=${redirectUri}`} target='_blank' className='hb-url-colored'>Create new account</Link></p>
                    </div>
                </div>
                <div className='align-self-end'><button className='hb-btn hb-btn-primary__grad py-2 w-100 justify-content-center rounded-5' onClick={handleLogin} disabled={loading}>{loading && <LoadingSpinnerLine />}<span>Login</span></button></div>
            </div>
        </div>
    )
}