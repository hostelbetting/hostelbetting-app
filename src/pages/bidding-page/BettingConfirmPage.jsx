import React, { useState, useEffect, useContext } from 'react'
import TabNameContext from '../../contexts/TabName.context';
import axios from '../../configs/axios-configs';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { formatIsoDate } from '../../utils/date-format';
import coinLogo from "../../assets/svg/coin-icon.svg"
import { toast } from 'react-toastify';

export const BettingConfirmPage = () => {
    // Set tabtitle 
    const { tabName, setTabName } = useContext(TabNameContext);
    useEffect(() => {
        setTabName("Success");
        document.title = "Successfully betting placed"
    }, [])

    // handle gif animation
    const [showGif, setShowGif] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setShowGif(false), 1500);
        return () => clearTimeout(timer);
    }, [1500]);

    const navigate = useNavigate();
    const [query] = useSearchParams();
    const betId = query.get('id');
    useEffect(() => {
        if (!betId) navigate('*');
    }, [])

    // fetch bet details
    const [bet, setBet] = useState(null)
    useEffect(() => {
        const fetchbet = async () => {
            try {
                await axios.get(`/bet/get-bet/${betId}`)
                    .then(res => setBet(res?.data?.data))
            } catch (error) {
                const status = error?.response?.status
                if (status === 401 || status === 402) navigate("*");
            }
        }
        if (betId) fetchbet();
    }, [betId]);

    // handle share
    const handleShare = async () => {
        try {
            await navigator?.share({
                url: window.location.href,
                title: "Hey I completed my betting on hostelbetting.fun"
            })
        } catch (error) {
            toast.warn("Unable to share")
        }
    }
    return (
        <div className='container'>
            <div>
                <div className='d-flex justify-content-center hb-bet-confirm-img-box'>
                    {showGif ?
                        <img src={require("../../assets/video/confirm-anim.gif")} alt="" /> :
                        <img src={require("../../assets/img/confirm-anim-static.png")} alt="" />
                    }
                </div>
                <div className='d-flex flex-column align-items-center mb-3'>
                    <h4>Successfully betting of {bet?.betway === "cash" ? <i className="bi bi-currency-rupee"></i> : <img src={coinLogo} width={25} />} {bet?.amount}</h4>
                    <div className='mb-4 text-center'>Your bet has been created successfully!. You can check match status through out the event.</div>
                    <div className='hb-table-box'>
                        <div><strong className='hb-text-fade'>Transaction Id </strong><span className='justify-self-end'>{bet?.transactionId}</span></div>
                        <div><strong className='hb-text-fade'>Billing date </strong><span className='justify-self-end'>{formatIsoDate(bet?.createdAt)?.dateStr}</span></div>
                    </div>
                </div>
                <div className='hb-display__inline-flex justify-content-center'>
                    <div><button className="hb-btn hb-btn-primary__grad" onClick={handleShare}><span>Share</span><span><i className="ri-share-forward-line"></i></span></button></div>
                    <div><button className="hb-btn hb-btn-bordered__grad" onClick={() => navigate('/home')}><span>Return home</span></button></div>
                </div>
            </div>
        </div>
    )
}
