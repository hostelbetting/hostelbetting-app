import React, { useContext, useEffect, useState } from 'react'
import "./notificationPage.style.css"
import TabNameContext from '../../contexts/TabName.context';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from '../../configs/axios-configs';
import { formatIsoDate } from '../../utils/date-format';
import Lottie from 'lottie-react';
import { LoadingSpinnerLine } from '../../components/spinners/LoadingSpinner';
import blankLottie from "../../assets/lottie/blank-list.json"


export const NotificationPage = () => {
  // Set tabtitle 
  const { tabName, setTabName } = useContext(TabNameContext);
  useEffect(() => {
    setTabName("Notifications");
  }, [])
  const navigate = useNavigate()

  // handle notification filter
  const [params] = useSearchParams();
  const filter = params.get('filter');
  useEffect(() => {
    if (!filter) navigate('/notification?filter=all');
  })
  // fetch notification list
  const [notificationList, setNotificationList] = useState(null);
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        await axios.get(`/user/notification-list?filter=${filter}`)
          .then(res => setNotificationList(res?.data?.data))

      } catch (error) {

      }
    }
    fetchNotifications();
  }, [filter])

  // page title
  useEffect(() => {
    document.title = `Notification - ${filter === 'unreads' ? `${notificationList?.length} unreads` : "all notifications"} `
  }, [filter, notificationList])
  
  return (
    <div className='container'>
      <section className='hb-sub-nav'>
        <div>
          <button className={`hb-sub-nav-opt-btn ${filter === 'all' && 'hb-sub-nav-opt-btn-active'}`} onClick={() => navigate('/notification')}>All</button>
        </div>
        <div>
          <button className={`hb-sub-nav-opt-btn ${filter === 'unreads' && 'hb-sub-nav-opt-btn-active'}`} onClick={() => navigate('/notification?filter=unreads')}>Unreads</button>
        </div>
      </section>
      <section>
        {notificationList === null && <div className='d-flex justify-content-center my-5'><LoadingSpinnerLine size={40} /></div>}
        {notificationList?.length === 0 && <div className='d-flex flex-column align-items-center'>
          <Lottie
            animationData={blankLottie}
            loop={false}
            className='hb-blank-lottie'
          />
          <div>No Notifications found</div>
        </div>}
        {
          notificationList?.map((item, index) => {
            return (
              <div key={index}>
                <div className='text-center my-3 hb-notification-date-flag'><span>{formatIsoDate(item?.date)?.dateStr}</span></div>
                <ul className='p-0'>
                  {
                    item?.notifications?.map((notif, index) => {
                      return <NotificationItem key={index} data={notif} />
                    })
                  }
                </ul>
              </div>
            )
          })
        }
      </section>
    </div>
  )
}

const NotificationItem = ({ data }) => {
  const [isRead, setIsRead] = useState(false);
  useEffect(() => data && setIsRead(data?.isReaded), [data]);
  // handle mark as read
  const handleNotificationRead = async () => {
    if (!data) return;
    try {
      await axios.patch(`/user/notification-read/${data?._id}`)
        .then(() => setIsRead(true))
    } catch (error) {

    }
  }
  return (
    <li className={`hb-notification-item ${isRead ? "" : "hb-notification-unread"}`} onClick={handleNotificationRead}>
      <div>
        <div className='hb-f-sm hb-text-fade'>{formatIsoDate(data?.createdAt)?.timeStr}</div>
      </div>
      <div>
        <div><h6 className='mb-0'>{data?.subject}</h6></div>
        <div>{data?.description}</div>
      </div>
    </li>
  )
}
