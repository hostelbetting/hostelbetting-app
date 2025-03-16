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
    }, [])

    const navigate = useNavigate();
    const [params] = useSearchParams();
    const redirectUri = params.get("redirect");
    // handle input
    const [input, setInput] = useState({ userName: "", email: "", password: "" });
    // handle registration
    const [loading, setLoading] = useState(false);
    const handleRegistration = async () => {
        try {
            // validate inputs
            if (Object.keys(input).some(e => input[e] === "")) {
                toast.error("All fields are required");
                return;
            }
            if (input.userName?.length < 3) {
                toast.error("User name must contain atleast 3 characters");
                return;
            }
            if (input.password?.length < 3) {
                toast.error("Password must contain atleast 5 characters");
                return;
            }
            // create form data
            setLoading(true);
            const formData = new FormData();
            formData.append("userName", input.userName);
            formData.append("email", input.email);
            formData.append("password", input.password);

            await axios.post("/user/create-user", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
                .then(async () => {
                    // send verification email
                    await axios.post("/user/create-email-verification", { email: input?.email })
                        .then(() => {
                            navigate(`/auth/verify?id=${input?.email}`)
                        })
                        .catch(error => {
                            toast.error("Something went wrong. Please try again")
                        })
                })

            setLoading(false)

        } catch (error) {
            if (error?.response?.status === 401) toast.error("User already registered. Try to log in");
            else toast.error("Registration failed. please try again later");
            console.error(error);
            setLoading(false);
        }
    }
    return (
        <div className='hb-registration-content-warper'>
            <div className='hb-registration-content-box'>
                <div className='text-center mb-4 d-grid align-items-center'>
                    <h3>Create new Account</h3>
                    <button className="hb-nav-opt-button mx-3 align-self-center" style={{position: "absolute", left: 0}} onClick={()=>navigate("/home")}><i class="ri-arrow-left-line fs-5"></i></button>
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
                    <p>By continuing you are accepting our <Link to="/terms-conditions" className='hb-url-colored'> Terms & conditions.</Link>
                    </p>
                </div>
                <div className='align-self-end hb-auth-container-btn-box'>
                    <button className='hb-btn hb-btn-primary__grad py-2 w-100 justify-content-center rounded-5' disabled={loading} onClick={handleRegistration}>{loading && <LoadingSpinnerLine />}<span>Create account</span></button>
                </div>
            </div>
        </div>
    )
}

export const VerificationPage = () => {
    // page title
    useEffect(() => {
        document.title = "Verify email - Hostelbetting.fun"
    }, [])

    const navigate = useNavigate();
    // queries
    const [query] = useSearchParams();
    const email = query.get('id');
    const token = query.get('token');
    const otp = query.get('code');
    useEffect(() => {
        if (email && !(token && otp)) { }
        else if ((token && otp) && !email) { }
        else navigate("/*")
    })

    const [isResend, setIsResend] = useState(false);
    // check is email send
    useEffect(() => {
        const checkStat = async () => {
            try {
                setIsResend(true);
                await axios.get(`/user/check-otp-creation?email=${email}`)
                    .then((res) => {
                        const stat = res?.data?.data?.isOtpGenerated
                        setIsResend(stat);
                    })
            } catch (error) {
                console.log(error);
                setIsResend(false);
                navigate("/*")
            }
        }
        if (email) checkStat();
    }, [email]);
    // allow resend request after 1.5 minutes
    const [counter, setCounter] = useState(90);
    useEffect(() => {
        if (isResend && counter >= 0) {
            if (counter === 0) {
                setIsResend(false);
                setCounter(90);
                return;
            }
            const countInterval = setInterval(() => {
                setCounter(count => count - 1)
            }, 1000);
            return () => clearInterval(countInterval);
        }
    }, [isResend, counter])
    // handle email resend
    const handleResend = async () => {
        if (!email) return;
        try {
            setIsResend(true)
            await axios.post("/user/create-email-verification", { email })
        } catch (error) {
            toast.error("Something went wrong. Please try again")
            setIsResend(false);
        }
    }

    // verify token and register user
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false)
    useEffect(() => {
        const handleUser = async () => {
            try {
                setLoading(true)
                await axios.post(`/user/verify-email?token=${token}&otpCode=${otp}`)
                    .then(() => {
                        window.location.href = `${window.location.origin}/home`
                    })
            } catch (error) {
                setError(true)
                const statusCode = error?.response?.status
                if (statusCode === 401) toast.error("Token expired. Try to resend verification email");
                else if (statusCode === 402) toast.error("Invalid request");
                else toast.error("Something went wrong")
                setLoading(false);
            }
        }
        if (token && otp) handleUser();
    }, [token, otp])
    return (
        <div className='hb-registration-content-warper'>
            <div className='hb-registration-content-box'>
                <div className='text-center mb-4'>
                    <h3>Verify registration</h3>
                </div>
                {(token && otp && !email) ?
                    <div>
                        {loading && <div className='d-flex align-items-center justify-content-center gap-2'><LoadingSpinnerLine /><span className='hb-text-fade'>Verifying...</span></div>}
                        {error && <div><h1>404</h1><span>Occurs</span></div>}
                    </div> :
                    <div>
                        <h5>A verification link has been send to your email. Click on that to complete registration.</h5>
                        <div className='d-flex align-items-center gap-2'>
                            <button className='hb-btn hb-url-colored' disabled={isResend} onClick={handleResend}><span>Resend </span><span><i class="ri-loop-left-line"></i></span></button>
                            {isResend && <div className='hb-text-fade'>in {counter} seconds</div>}
                        </div>
                    </div>}
            </div>
        </div>
    )
}

export const Login = () => {
    // page title
    useEffect(() => {
        document.title = "Log into hostelbetting.fun"
    }, [])

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
                        window.location.href = `${window.location.origin}/home`;
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
            <div className='text-center mb-4 d-grid align-items-center'>
                    <h3>Login</h3>
                    <button className="hb-nav-opt-button mx-3 align-self-center" style={{position: "absolute", left: 0}} onClick={()=>navigate("/home")}><i class="ri-arrow-left-line fs-5"></i></button>
                </div>
                <div>
                    <div className='mb-2'><button className='hb-btn hb-btn-primary__transparent' onClick={() => navigate(`/auth/registration?redirect=${redirectUri}`)}><span>Register new account</span><span><i class="ri-arrow-right-line"></i></span></button></div>
                    <div>
                        <div className='mb-3'><PopInput type="email" placeholder='Enter email' onChange={e => setInput({ ...input, email: e })} /></div>
                        <div className='mb-3'><PopInput type="password" placeholder='Password' onChange={e => setInput({ ...input, password: e })} /></div>
                        <p><Link to="/auth/reset-password" className='hb-url-colored'>Forget password?</Link></p>
                        <p>No account? <Link to={`/auth/registration?redirect=${redirectUri}`} target='_blank' className='hb-url-colored'>Create new account</Link></p>
                    </div>
                </div>
                <div className='align-self-end hb-auth-container-btn-box'>
                    <button className='hb-btn hb-btn-primary__grad py-2 w-100 justify-content-center rounded-5' onClick={handleLogin} disabled={loading}>{loading && <LoadingSpinnerLine />}<span>Login</span></button>
                </div>
            </div>
        </div>
    )
}