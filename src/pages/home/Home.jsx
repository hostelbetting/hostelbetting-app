import React, { useContext, useEffect, useState } from 'react'
import "./home.style.css"

import clockLottie from "../../assets/lottie/clock-lottie.json"
import Lottie from 'lottie-react'
import TabNameContext from '../../contexts/TabName.context'
import axios from '../../configs/axios-configs'
import emptyLottie from "../../assets/lottie/empty-lottie.json"
import { LoadingSpinnerLine } from '../../components/spinners/LoadingSpinner'
import { useNavigate } from 'react-router-dom'
import { getDateDifference } from '../../utils/date-difference'

export const Home = () => {
  // Set tabtitle 
  const { tabName, setTabName } = useContext(TabNameContext);
  useEffect(() => {
    setTabName("Fun app");
    document.title = "HostelBetting.fun: Bet, Play, Win!"
  }, [])

  // fetch content
  const [list, setList] = useState(null)
  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios.get("/game/tournament-list")
          .then(res => setList(res?.data?.data))
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);
  return (
    <div className='container'>
      <div>
        {
          list === null && <div className='d-flex justify-content-center my-3'><LoadingSpinnerLine size={40} /></div>
        }
        {list?.length === 0 &&
          <div className='d-flex flex-column align-items-center my-3'>
            <Lottie animationData={emptyLottie} className='hb-blank-lottie' loop={false} />
            <p>No tournaments found!</p>
          </div>
        }
        {
          list?.map((item, index) => {
            return <HomeItem key={index} data={item} />
          })
        }
      </div>
    </div>
  )
}

const HomeItem = ({ data }) => {
  const navigate = useNavigate();
  // reamining time
  const [timeRemaining, setTimeRemaining] = useState("00 days, 00 hours, 00 minutes");

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const isoStr = data?.soonestEventTime;
      const now = new Date();
      const targetDate = new Date(isoStr);

      if (targetDate <= now) {
        setTimeRemaining("00 days, 00 hours, 00 minutes");
        return;
      }

      // Calculate time difference
      let timeDifference = targetDate - now;

      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      timeDifference %= (1000 * 60 * 60 * 24);

      const hours = Math.floor(timeDifference / (1000 * 60 * 60));
      timeDifference %= (1000 * 60 * 60);

      const minutes = Math.floor(timeDifference / (1000 * 60));

      // Format the result with zero-padding
      const formattedDays = String(days).padStart(2, "0");
      const formattedHours = String(hours).padStart(2, "0");
      const formattedMinutes = String(minutes).padStart(2, "0");

      setTimeRemaining(`${formattedDays} days, ${formattedHours} hours, ${formattedMinutes} minutes`);
    };

    // Initial calculation
    calculateTimeRemaining();

    // Update every minute
    const interval = setInterval(calculateTimeRemaining, 60 * 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [data]);

  return (
    <div className='hb-home-item mb-3' onClick={() => navigate(`/events?tournamentId=${data?._id}`)}>
      <div className='hb-home-item-title-box'>
        <h1 className='mb-0'>{data?.title}</h1>
        <p>{data?.eventCount} ongoing events</p>
      </div>
      <div className='hb-home-item-back-img-box'><img src={data?.previewImg} alt="" /></div>
      {timeRemaining && <div className='hb-event-time-line'>
        <span>
          <Lottie animationData={clockLottie} loop={true} className='hb-clock-lottie' />
        </span>
        <span>Starts in {timeRemaining}</span>
      </div>}
    </div>
  )
}