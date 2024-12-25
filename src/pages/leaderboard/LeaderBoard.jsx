import React, { useContext, useEffect, useState } from 'react'
import "./leaderboard.style.css"
import trophyLogo from "../../assets/svg/trophy-logo.svg"
import TabNameContext from '../../contexts/TabName.context';
import axios from '../../configs/axios-configs';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Lottie from 'lottie-react';
import { LoadingSpinner1, LoadingSpinnerLine } from '../../components/spinners/LoadingSpinner';
import blankLottie from "../../assets/lottie/blank-list.json"

export const LeaderBoard = () => {
    // handle nav
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const boardFor = params.get('boardFor')
    useEffect(() => {
        if (!boardFor) navigate('/leaderboard?boardFor=teams');
    }, [])

    // Set tabtitle 
    const { tabName, setTabName } = useContext(TabNameContext);
    useEffect(() => {
        setTabName("Leaderboard");
        document.title = `${boardFor} Leaderboard : hostelbetting.fun`
    }, [boardFor])


    // fetch leaderboard
    const [leaderBoardList, setLeaderBoardList] = useState(null);
    useEffect(() => {
        const fetchList = async () => {
            try {
                const fetchUri = boardFor === 'teams' ? '/game/team-leaderboard' : '/game/bettor-leaderboard'
                await axios.get(fetchUri)
                    .then((res) => setLeaderBoardList(res?.data?.data))

            } catch (error) {
                console.log(error);
            }
        }
        if (boardFor)
            fetchList();
    }, [boardFor]);

    return (
        <div className='container'>
            <div>
                <section className='hb-sub-nav'>
                    <div>
                        <button className={`hb-sub-nav-opt-btn ${boardFor === 'teams' && 'hb-sub-nav-opt-btn-active'}`} onClick={() => navigate('/leaderboard?boardFor=teams')}>Teams</button>
                    </div>
                    <div>
                        <button className={`hb-sub-nav-opt-btn ${boardFor === 'bettors' && 'hb-sub-nav-opt-btn-active'}`} onClick={() => navigate('/leaderboard?boardFor=bettors')}>Bettors</button>
                    </div>
                </section>
                <section>
                    <div>
                        <ul className='p-0'>
                            {leaderBoardList === null && <div className='d-flex justify-content-center my-5'><LoadingSpinnerLine size={40} /></div>}
                            {leaderBoardList?.length === 0 && <div className='d-flex flex-column align-items-center'>
                                <Lottie
                                    animationData={blankLottie}
                                    loop={false}
                                    className='hb-blank-lottie'
                                />
                                <div>No data found</div>
                            </div>}
                            {
                                leaderBoardList?.map((item, index) => {
                                    return <LeaderboardItem index={index + 1} key={index} data={item} />
                                })
                            }
                        </ul>
                    </div>
                </section>
            </div>
        </div>
    )
}

const LeaderboardItem = ({ index, data }) => {
    return (
        <li className={`hb-leaderboard-item ${index === 1 && "hb-leader-1"} ${index === 2 && "hb-leader-2"} ${index === 3 && "hb-leader-3"}`}>
            <div className='hb-display__inline-flex'>
                <strong>#{index}</strong>
                <span>{data?.name}</span>
            </div>
            <div className='hb-display__inline-flex justify-self-end'>
                <img src={trophyLogo} alt="" width={20} />
                <span>{data?.trophy}</span>
            </div>
        </li>
    )
}