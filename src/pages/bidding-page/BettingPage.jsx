import React, { useContext, useEffect, useState } from 'react'
import { PopInput } from '../../components/inputs/PopInput'
import rupeeIcon from "../../assets/svg/rupee-icon.svg"
import coinIcon from "../../assets/svg/coin-icon.svg"
import "./bettingPage.style.css"
import TabNameContext from '../../contexts/TabName.context'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import axios from '../../configs/axios-configs'
import { toast } from 'react-toastify'
import { LoadingSpinnerLine } from '../../components/spinners/LoadingSpinner'

export const BettingPage = () => {
  // handle url
  const [params] = useSearchParams();
  const betWay = params.get('mode');
  const teamId = params.get("teamId");
  const eventId = params.get("eventId");
  const teamName = params.get("team");

  // Set tabtitle 
  const { tabName, setTabName } = useContext(TabNameContext);
  useEffect(() => {
    setTabName("Betting");
    document.title = `Place a bet on team - ${teamName}`
  }, [])

  // handle navigation
  const navigate = useNavigate();

  // Handle betting type 
  useEffect(() => {
    if (!(betWay === "cash" || betWay === "coin") || !teamId || !eventId || !teamName) {
      navigate("*")
    }
  }, [])

  // fetch wallet 
  const [wallet, setWallet] = useState(null);
  useEffect(() => {
    const fetchWallet = async (req, res) => {
      try {
        await axios.get("/wallet/get-wallet")
          .then(res => setWallet(res?.data?.data))
      } catch (error) {

      }
    }
    fetchWallet();
  }, [])

  // handle bet creation
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false)
  const handleBet = async () => {
    if (amount < 10) {
      toast.warn("Minimum bet amount is 10");
      return;
    }
    try {
      setLoading(true);
      await axios.post('/bet/create-new', { teamId, eventId, betWay, amount: Number(amount) })
        .then(async res => {
          const betId = res?.data?.data?.betId;
          try {
            await axios.post('/bet/create-transaction', { betId, isPaid: true })
              .then(() => {
                navigate(`/confirm-betting?id=${betId}`)
              })
          } catch (error) {

          }
        })
    } catch (error) {
      if (error?.response.status === 404) toast.error("You have not enough coins");
      if (error?.response?.status === 402) toast.error("You have already placed a bet on this event")
    }
    setLoading(false);
  }

  return (
    <div className='container'>
      <div className='mb-5'>
        <div className='mb-4'><h5>Initiate betting on {decodeURI(teamName)}</h5></div>
        {betWay === 'coin' && <div className='mb-2'><span>You have {wallet?.totalCoins} <img src={coinIcon} alt="" width={15} /> available on your wallet</span></div>}
        <div className='hb-inline-gird-2 hb-width-100 mb-2'>
          <div><img src={betWay === "coin" ? coinIcon : rupeeIcon} width={30} /></div>
          <div>
            <PopInput type='number' value={betWay === "coin" ? '50' : '10'} placeholder='Enter betting amount' inputclassName='hb-f-lg' onChange={e => setAmount(e)} />
          </div>
        </div>
        <div className='hb-f-sm hb-text-fade'>You can bet maximum {betWay === "coin" ? '1000 coins' : '50 rupees'} and minimum {betWay === "coin" ? '50 coins' : '10 rupees'} at a time. <Link to="/terms-conditions" className='hb-url-colored'>Terms & guidelines</Link></div>
      </div>
      <div className='d-flex justify-content-center'>
        <button className='hb-btn hb-btn-primary__grad hb-btn-linear-lg' onClick={handleBet} disabled={loading}>{loading && <LoadingSpinnerLine />} <span>{betWay === "coin" ? 'Confirm betting' : 'Proceed to pay'}</span></button>
      </div>
    </div>
  )
}