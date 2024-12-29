import React, { useContext, useEffect, useState } from 'react'
import "./navbar.style.css"

import TabNameContext from '../../contexts/TabName.context'
import { Dropdown } from '../dropdown/Dropdown';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../configs/axios-configs';
import { toast } from 'react-toastify';
import AuthContext from '../../contexts/Auth.context';
import { AuthenticatedContainer } from '../Auth-container/AuthenticatedContainer';
import { useCurrentUser } from '../../hooks/current-user';

export const Navbar = () => {
    const navigate = useNavigate();
    // handle tab title 
    const { tabName, setTabName } = useContext(TabNameContext);

    useEffect(() => {
        const element = document.getElementsByClassName('hb-nav-title')[0];
        if (!tabName) {
            setTabName("Fun app")
        }
        // add animation in element
        element.classList.add('hb-title-anim');
        return () => element.classList.remove('hb-title-anim');
    }, [tabName])

    // Handle profile dropdown
    const [openDropdown, setOpenDropdown] = useState(false);

    // get user details
    const { currentUser } = useContext(AuthContext);

    return (
        <nav className='hb-navbar'>
            <div>
                <h5 className='mb-0 hb-nav-title c-pointer' onClick={() => navigate('/home')}>
                    {
                        tabName === "Fun app" ?
                            <div className='d-flex align-items-center gap-1'>
                                <img src={require("../../assets/img/hostelbetting-logo-fill.webp")} width={42} alt="" className='rounded-3' />
                                <div className='hb-font-lobster fs-4'>.fun</div>
                            </div> :
                            tabName
                    }
                </h5>
            </div>
            <div className='hb-nav-opt-box'>
                <div>
                    <button className='hb-nav-opt-button hb-nav-wallet-btn' onClick={() => navigate('/wallet')}>
                        <span><i className="ri-wallet-3-fill nav-ico"></i></span>
                        <span><span><i className="bi bi-currency-rupee"></i></span> {currentUser?.walletBalance || 0}</span>
                    </button>
                </div>
                <div className='d-grid' onClick={() => navigate('/notification')}>
                    <button className='hb-nav-opt-button' onClick={() => navigate('/notification')}><i className="bi bi-bell-fill nav-ico"></i></button>
                    {(currentUser?.inboxCount > 0 && currentUser?.inboxCount < 100) && <div className='hb-notification-badge'>{currentUser?.inboxCount}</div>}
                </div>
                <div>
                    <button className='hb-nav-opt-button' onClick={(e) => {
                        setOpenDropdown(!openDropdown);
                        e.stopPropagation();
                    }}>
                        <img src={currentUser?.avatar || require("../../assets/img/profile-logo.png")} alt="" width={42} className='rounded-circle' />
                    </button>
                    <div className='d-flex justify-content-end'>
                        <ProfileDropdown openState={openDropdown} onClose={() => setOpenDropdown(false)} user={currentUser} />
                    </div>
                </div>
            </div>
        </nav>
    )
}

const ProfileDropdown = ({ openState, onClose, user }) => {
    const navigate = useNavigate();
    const handleOptionNav = (path) => {
        navigate(path);
        onClose();
    }

    // Handle theme toogle
    const [isDarkMode, setIsDarkMode] = useState(false)
    const handleToogleBtn = () => {
        const theme = localStorage.getItem("theme") || "dark"
        if (theme === "dark") setIsDarkMode(true)
        else { setIsDarkMode(false) }
    }
    const handleToogleTheme = () => {
        const isDark = document.body.classList.toggle('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        handleToogleBtn()
    }

    useEffect(() => {
        handleToogleBtn()
    })

    // handle auth container
    const { isAuthenticated } = useContext(AuthContext);

    // Handle log out
    const handleLogout = async () => {
        try {
            await axios.get('/user/logout-user')
                .then(res => {
                    navigate("/home")
                    window.location.reload()
                })
        } catch (error) {
            toast.error("Failed to logout");
        }
    }


    return (
        <Dropdown openState={openState} onClose={onClose} closeOnBackClick className='hb-profile-dropdown'>
            {isAuthenticated ?
                <div className='hb-profile-dropdown-profile-box mb-3 c-pointer' onClick={() => handleOptionNav(`/profile/${user?._id}`)}>
                    <div>
                        <img src={user?.avatar || require("../../assets/img/profile-logo.png")} alt="" width={50} className='rounded-circle' />
                    </div>
                    <div>{user?.userName}</div>
                </div> :
                <div className='mb-3'>
                    <button className="hb-btn hb-btn-primary__grad w-100 justify-content-center" onClick={() => handleOptionNav('/auth')}><span><i className="ri-login-circle-line"></i></span><span>Sign in</span></button>
                </div>
            }
            <div>
                <ul className='hb-profile-dropdown-opt-list'>
                    <li>
                        <button className='hb-linear-opt-btn' onClick={() => handleOptionNav('/events')}>
                            <span><i className="ri-calendar-event-fill"></i></span>
                            <span>Events</span>
                        </button>
                    </li>
                    <li>
                        <button className='hb-linear-opt-btn' onClick={() => handleOptionNav('/leaderboard')}>
                            <span><i className="ri-trophy-line"></i></span>
                            <span>Leaderboard</span>
                        </button>
                    </li>
                    <AuthenticatedContainer>
                        <li>
                            <button className='hb-linear-opt-btn' onClick={() => handleOptionNav('/wallet')}>
                                <span><i className="ri-wallet-3-line"></i></span>
                                <span>Withdraw money</span>
                            </button>
                        </li>
                    </AuthenticatedContainer>
                </ul>
            </div>

            <div className='mb-3'>
                <h6>Appearance</h6>
                <div className='hb-display__inline-grid px-2'>
                    <div>{isDarkMode ? "Dark" : "Light"} UI</div>
                    <div className='justify-self-end'>
                        <label htmlFor='toogle-check-box'>
                            <input type="checkbox" name="" id="toogle-check-box" className='d-none' onChange={handleToogleTheme} checked={isDarkMode} />
                            <div className='hb-toggler-track'>
                                <div className='justify-self-start hb-theme-sun-logo'><i className="ri-sun-line"></i></div>
                                <div className='hb-toggler-thumb hb-justify-s-start'></div>
                                <div className='justify-self-end hb-theme-moon-logo'><i className="ri-moon-line"></i></div>
                            </div>
                        </label>
                    </div>
                </div>
            </div>
            <AuthenticatedContainer>
                <div className='mb-3'>
                    <h6>Secuirity</h6>
                    <button className="hb-linear-opt-btn text-danger" onClick={handleLogout}><span><i className="ri-logout-box-line"></i></span><span>Log out</span></button>
                </div>
            </AuthenticatedContainer>
            <div className='hb-profile-dropdown-end-box'>
                <div><Link to="/privacy" className='hb-url-colored' onClick={onClose}>Privacy & guidelines</Link></div>
                <div><Link to="/terms-conditions" className='hb-url-colored' onClick={onClose}>Terms & conditions</Link></div>
            </div>
        </Dropdown>
    )
}
