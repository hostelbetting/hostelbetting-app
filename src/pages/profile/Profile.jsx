import React, { useContext, useEffect, useState } from 'react'
import "./Profile.style.css"
import trophyLogo from "../../assets/svg/trophy-logo.svg"
import earninglogo from "../../assets/svg/earnings.svg"
import TabNameContext from '../../contexts/TabName.context'
import { useNavigate, useParams } from 'react-router-dom'
import axios from '../../configs/axios-configs'
import { AuthenticatedContainer } from '../../components/Auth-container/AuthenticatedContainer'
import Lottie from 'lottie-react'
import { LoadingSpinnerLine } from '../../components/spinners/LoadingSpinner'
import blankLottie from "../../assets/lottie/blank-list.json"
import { formatIsoDate } from '../../utils/date-format'

export const Profile = () => {
    // Set tabtitle 
    const { tabName, setTabName } = useContext(TabNameContext);
    useEffect(() => {
        setTabName("Profile");
    }, [])

    // Init navigate
    const navigate = useNavigate();

    // Handle user data
    const { userId } = useParams();
    const [userData, setUserdata] = useState(null);
    useEffect(() => {
        const fetchUser = async () => {
            try {
                await axios.get(`/user/get-by-id/${userId}`)
                    .then(res => {
                        setUserdata(res?.data?.data);
                    })
            } catch (error) {
                if (error?.response?.status === 400) navigate('/*');
            }
        }
        fetchUser();
    }, [userId])

    // fetch previous bet list
    const [betList, setBetList] = useState(null);
    useEffect(() => {
        const fetchBetList = async () => {
            try {
                await axios.get('/bet/get-betlist', { userId: userId })
                    .then(res => {
                        setBetList(res?.data?.data);
                    })
            } catch (error) {
                console.error(error);
            }
        }
        fetchBetList();
    }, [userId])

    // set page title
    useEffect(() => {
        document.title = userData ? `Profile - ${userData?.userName}` : 'Loading...'
    }, [userData])

    return (
        <div className='container'>
            <div>
                <section className='hb-profile-details-box'>
                    <div className='hb-profile-img-box'>
                        <img src={userData?.avatar || require("../../assets/img/profile-logo.png")} alt="" className='rounded-circle' />
                        <button className="hb-profile-edit-btn" onClick={() => navigate('/edit-profile')}><span><i className="ri-pencil-fill fs-5"></i></span></button>
                    </div>
                    <div className='hb-profile-detail-stat-section'>
                        <div className='mb-3'><h4 className='mb-0'>{userData?.userName}</h4></div>
                        <div className='gf-profile-stat-box mb-3'>
                            <div className='hb-inline-gird-2'>
                                <img src={trophyLogo} alt="" width={25} />
                                <span className='justify-self-end'>{userData?.trophy}</span>
                            </div>
                            <div className='hb-inline-gird-2'>
                                <img src={earninglogo} alt="" width={25} />
                                <span className='justify-self-end'><i className="bi bi-currency-rupee"></i> {userData?.totalEarnings}</span>
                            </div>
                        </div>
                        <AuthenticatedContainer>
                            <div className='hb-display__inline-flex'>
                                <button className='hb-btn hb-btn-primary__grad' onClick={() => navigate('/wallet')}>
                                    <span><i className="ri-wallet-3-fill fs-5"></i></span><span>View wallet</span>
                                </button>
                                <button className='hb-btn hb-btn-bordered__grad' onClick={() => navigate('/edit-profile')}>
                                    <span><i className="ri-pencil-fill fs-5"></i></span><span>Edit profile</span>
                                </button>
                            </div>
                        </AuthenticatedContainer>
                    </div>
                </section>
                <section>
                    <h5 className='mb-3'>Previous Bettings</h5>
                    <ul className='p-0 hb-bet-history-list'>
                        {betList === null && <div className='d-flex justify-content-center my-5'><LoadingSpinnerLine size={40} /></div>}
                        {betList?.length === 0 && <div className='d-flex flex-column align-items-center'>
                            <Lottie
                                animationData={blankLottie}
                                loop={false}
                                className='hb-blank-lottie'
                            />
                            <div>No bets found</div>
                        </div>}
                        {
                            betList?.map((item, index) => {
                                return (
                                    <HistoryItem isWin={item?.isWin} key={index} mode={item?.betWay} data={item} />
                                )
                            })
                        }
                    </ul>
                </section>
            </div>
        </div>
    )
}

const HistoryItem = ({ isWin, mode, data }) => {
    return (
        <li className={`hb-bet-history-item ${isWin ? "hb-bet-history-item__green" : " hb-bet-history-item__red"} ${!data?.isOver && "hb-bet-history-item__blue"}`}>
            <div className='hb-bet-history-item-stat-box'>
                <div className='gf-history-effect-col'>
                    <span><i className={`bi ${isWin === true && "bi-plus-square-fill"} ${isWin === false && "bi-dash-square-fill"} ${!data?.isOver && "bi-0-square-fill"} fs-5`}></i></span>
                </div>
                <div>
                    <div className='hb-f-sm hb-text-fade'>{formatIsoDate(data?.createdAt)?.dateStr}</div>
                    <div>{data?.teamName}</div>
                </div>
            </div>
            <div className='justify-self-end d-grid'>
                <div className='gf-history-effect-col justify-self-end'>
                    <span>{data?.isOver && (isWin ? "+" : "-")} {isWin ? data?.amount * 1.5 : data?.amount}</span>
                    <span><i className={mode === 'coin' ? "ri-money-rupee-circle-fill" : "bi bi-currency-rupee"}></i></span>
                </div>
                <div className='hb-text-fade'>
                    {data?.transactionId}
                </div>
            </div>
        </li>
    )
}