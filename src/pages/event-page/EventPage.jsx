import React, { useContext, useEffect, useState } from 'react'
import "./eventPage.style.css"
import trophyLogo from "../../assets/svg/trophy-logo.svg"
import clockLottie from "../../assets/lottie/clock-lottie.json"
import versusLottie from "../../assets/lottie/versus-lottie.json"
import winnerLottie from "../../assets/lottie/winner-lottie.json"
import Lottie from 'lottie-react'
import TabNameContext from '../../contexts/TabName.context'
import { PopupBox } from '../../components/popup-box/PopupBox'
import cashIcon from "../../assets/svg/cash-icon.svg"
import coinIcon from "../../assets/svg/coin-icon.svg"
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from '../../configs/axios-configs'
import { formatIsoDate } from '../../utils/date-format'
import { LoadingSpinnerLine } from '../../components/spinners/LoadingSpinner'
import blankLottie from "../../assets/lottie/blank-list.json"
import { toast } from 'react-toastify'


export const EventPage = () => {
    // Set tabtitle 
    const { tabName, setTabName } = useContext(TabNameContext);
    useEffect(() => {
        setTabName("Events");
        document.title = 'Events - hostelbetting.fun'
    }, [])

    const [eventList, setEventList] = useState(null);
    const [params] = useSearchParams();
    const tournamentId = params.get('tournamentId');
    // get event data
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                await axios.get(`/game/event-list?tournamentId=${tournamentId}`)
                    .then(res => setEventList(res.data?.data));
            } catch (error) {
                console.error(error);
            }
        }
        fetchEvent();
    }, [])

    return (
        <div className='container'>
            <div>
                <div className='mb-3'><strong>Upcoming Matches</strong></div>
                <ul className='p-0'>
                    {eventList === null && <div className='d-flex justify-content-center my-5'><LoadingSpinnerLine size={40} /></div>}
                    {eventList?.length === 0 && <div className='d-flex flex-column align-items-center'>
                        <Lottie
                            animationData={blankLottie}
                            loop={false}
                            className='hb-blank-lottie'
                        />
                        <div>No Events found</div>
                    </div>
                    }
                    {
                        eventList?.map((item, index) => {
                            return <EventItem data={item} key={index} />
                        })
                    }
                </ul>
            </div>
        </div>
    )
}

const EventItem = ({ data }) => {
    // handle team
    const [bettingOnTeam, setBettingOnTeam] = useState({});
    // Handle bet button click
    const [openBet, setOpenBet] = useState(false);
    const handleBetClick = (team) => {
        setBettingOnTeam(team)
        setOpenBet(true);
    }

    return (
        <li className='hb-event-item'>
            <div className='hb-event-item-detail-box'>
                <div className='hb-event-time-line mb-3'>
                    <span>
                        <Lottie animationData={clockLottie} loop={true} className='hb-clock-lottie' />
                    </span>
                    <span>{formatIsoDate(data?.time)?.timeStr}, {formatIsoDate(data?.time)?.dateStr}</span>
                </div>
                <div>
                    <div className='hb-event-item-team-list'>
                        {
                            data?.teams?.map((team, index) => {
                                return (
                                    <div className='hb-event-item-team-item' key={index}>
                                        <h6>{team?.teamName}</h6>
                                        <div className='hb-display__inline-flex mb-2'>
                                            <span><img src={trophyLogo} alt="" width={20} /></span>
                                            <span>{team?.teamRank}</span>
                                        </div>
                                        <div>
                                            <ul className='hb-text-fade mb-0 p-0'>
                                                {
                                                    team?.members?.map((member, index) => <li key={index}>{member?.name}</li>)
                                                }
                                            </ul>
                                        </div>
                                    </div>
                                )
                            })
                        }
                        <div className='hb-versus-logo-box'>
                            <Lottie animationData={versusLottie} loop={true} className='hb-vs-lottie' />
                        </div>
                    </div>
                </div>
                {!data?.isBetActive && <div className='hb-event-paused'>
                    {
                        Object.keys(data?.winnerTeam || {}).length > 0 ?
                            <div>
                                <div className='mb-4'><h5>Match Over</h5></div>
                                <div className='d-flex align-items-center gap-5'>
                                    <div className='d-flex align-items-center justify-content-center'>
                                        <Lottie animationData={winnerLottie} loop={false} className='hb-winner-trophy-logo' />
                                    </div>
                                    <div className='fs-4'>{data?.winnerTeam?.teamName}</div>
                                </div>
                            </div>
                            : <>
                                <div className='mb-2 fs-5'>OOps!! Bet paused</div>
                                <div className='hb-event-time-line'>
                                    <span>
                                        <Lottie animationData={clockLottie} loop={true} className='hb-clock-lottie' />
                                    </span>
                                    <span>{formatIsoDate(data?.time)?.timeStr}, {formatIsoDate(data?.time)?.dateStr}</span>
                                </div>
                            </>
                    }
                </div>}
            </div>
            {data?.isBetActive && <div className='hb-event-item-btn-box'>
                {
                    data?.teams?.map((team, index) => {
                        return (
                            <div key={index}>
                                <button className='hb-btn hb-btn-primary__grad rounded-5' onClick={() => handleBetClick(team)}>Place bid</button>

                            </div>
                        )
                    })
                }
            </div>}
            <BidPopup openState={openBet} onClose={() => setOpenBet(false)} team={bettingOnTeam} eventId={data?._id} />
        </li>
    )
}

const BidPopup = ({ openState, onClose, team, eventId, teamName }) => {
    const navigate = useNavigate();
    const appMessage = `
    Sorry for inconvenience!
    Cash betting is not allowed for now. You can Continue with Coins
    `
    return (
        <PopupBox openState={openState} className='hb-bet-popup' onClose={onClose} closeOnBackClick>
            <div className='hb-inline-gird-2'>
                <div>
                    <h5 className='mb-0'>Select betting mode</h5>
                    <p>Choose a mode to continue betting</p>
                </div>
                <div className='justify-self-end align-self-start'>
                    <button className='hb-btn' onClick={onClose}><span><i className="ri-close-large-line fs-5"></i></span></button>
                </div>
            </div>
            <div className='hb-bet-popup-btn-box'>
                <div className='mb-2'><button className="hb-btn hb-btn-primary__grad" onClick={() => toast.info(appMessage, { autoClose: 5000 })}><span><img src={cashIcon} alt="" width={30} /></span><span>Use cash</span></button></div>
                <div><button className="hb-btn hb-btn-primary__grad" onClick={() => navigate(`/create-bet?mode=coin&teamId=${team?._id}&eventId=${eventId}&team=${encodeURI(team?.teamName)}`)}><span><img src={coinIcon} alt="" width={27} /></span><span>Use coins</span></button></div>
            </div>
        </PopupBox>
    )
}