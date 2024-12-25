import React, { useContext, useEffect, useState } from 'react'
import "./walletPage.style.css"

import walletIcon from "../../assets/svg/wallet-icon.svg"
import coinIcon from "../../assets/svg/coin-icon.svg"
import earningLogo from "../../assets/svg/earnings.svg"
import rupeeIcon from "../../assets/svg/rupee-icon.svg"
import TabNameContext from '../../contexts/TabName.context'
import { useNavigate } from 'react-router-dom'
import axios from '../../configs/axios-configs'
import Lottie from 'lottie-react'
import blankLottie from "../../assets/lottie/blank-list.json"
import { LoadingSpinnerLine } from '../../components/spinners/LoadingSpinner'

export const WalletPage = () => {
    // chaneg the tabname
    const { tabName, setTabName } = useContext(TabNameContext);
    useEffect(() => {
        setTabName("Wallet");
        document.title = "Hostelbetting.fun - wallet"
    }, []);

    const navigate = useNavigate();

    // fetch wallet details
    const [walletData, setWalletData] = useState(null);
    useEffect(() => {
        const fetchWallet = async () => {
            try {
                await axios.get('/wallet/get-wallet')
                    .then(res => {
                        setWalletData(res?.data?.data);
                    })
            } catch (error) {
                console.error(error);

            }
        }
        fetchWallet();
    }, []);

    // fetch withdrawl history
    const [withdrawHistory, setWithdrawHistory] = useState(null);
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                await axios.get('/wallet/withdraw-history')
                    .then(res => setWithdrawHistory(res?.data?.data))
            } catch (error) {

            }
        }
        fetchHistory();
    })

    return (
        <div className='container'>
            <section className='mb-4'>
                <div className='fs-5 hb-wallet-earning-show-box'>
                    <div className='hb-display__inline-grid hb-wallet-earning-item'>
                        <div className='hb-display__inline-flex'><img src={coinIcon} width={20} /><span className='mx-2'>Available coins</span></div>
                        <div className='hb-display__inline-flex justify-self-end'><span>{walletData?.totalCoins}</span></div>
                    </div>
                    <div className='hb-display__inline-grid hb-wallet-earning-item'>
                        <div className='hb-display__inline-flex'><img src={walletIcon} width={20} /><span className='mx-2'>Current balance </span></div>
                        <div className='hb-display__inline-flex justify-self-end'><img src={rupeeIcon} width={20} /><span>{walletData?.totalCash}</span></div>
                    </div>
                    <div className='hb-display__inline-grid hb-wallet-earning-item'>
                        <div className='hb-display__inline-flex'><img src={earningLogo} width={20} /><span className='mx-2'>Total earnings </span></div>
                        <div className='hb-display__inline-flex justify-self-end'><img src={rupeeIcon} width={20} /><span>{walletData?.totalEarnings}</span></div>
                    </div>
                </div>
                <div className='d-flex justify-content-center'>
                    <button className="hb-btn hb-btn-primary__grad hb-btn-linear-lg" onClick={() => navigate('/withdraw')}><span>Withdraw Money</span><span><i className="ri-arrow-right-wide-fill"></i></span></button>
                </div>
            </section>
            <section>
                <div>
                    <h5 className='mb-3'>Order history</h5>
                    <div>
                        <ul className='p-0'>
                            {withdrawHistory === null && <div className='d-flex justify-content-center my-5'><LoadingSpinnerLine size={40} /></div>}
                            {withdrawHistory?.length === 0 && <div className='d-flex flex-column align-items-center'>
                                <Lottie
                                    animationData={blankLottie}
                                    loop={false}
                                    className='hb-blank-lottie'
                                />
                                <div>No history found</div>
                            </div>}
                            {
                                withdrawHistory?.map((item, index) => {
                                    return <OrderHistoryItem key={index} data={item} />
                                })
                            }

                        </ul>
                    </div>
                </div>
            </section>

        </div>
    )
}

const OrderHistoryItem = ({ data }) => {
    return (
        <div className='hb-order-history-item'>
            <div>
                <div className='mb-1'><h6 className='mb-0 hb-f-sm '>Order Id</h6></div>
                <div className='hb-f-sm'>{data?._id}</div>
            </div>
            <div>
                <div className='hb-f-sm mb-1'>12 july 2005</div>
                <div className='hb-display__inline-flex'>
                    <div className='hb-current-status-para'><span><i className="bi bi-dot"></i></span><span>{data?.status}</span></div>
                    <div><span><i className="bi bi-currency-rupee"></i></span><span>{data?.amount}</span></div>
                </div>
            </div>
        </div>
    )
}
