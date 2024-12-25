import React, { useState } from 'react'
import { useContext, useEffect } from 'react';
import TabNameContext from '../../contexts/TabName.context';
import { PopInput } from '../../components/inputs/PopInput';
import axios from "../../configs/axios-configs"

import rupeeIcon from "../../assets/svg/rupee-icon.svg"
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LoadingSpinnerLine } from '../../components/spinners/LoadingSpinner';

export const WithdrawalPage = () => {

    // chaneg the tabname
    const { tabName, setTabName } = useContext(TabNameContext);
    useEffect(() => {
        setTabName("Withdrawl");
        document.title = "Withdraw money from wallet"
    }, []);

    const navigate = useNavigate();
    // handle Inputs
    const [input, setInput] = useState({ amount: 10, upiId: "" });
    // fetch wallet
    const [wallet, setWallet] = useState(null);
    useEffect(() => {
        const fetchWallet = async () => {
            try {
                await axios.get('/wallet/get-wallet')
                    .then(res => setWallet(res?.data?.data))
            } catch (error) {

            }
        }
        fetchWallet();
    }, []);
    // handle withdrawl
    const [loading, setLoading] = useState(false);
    const handleWithDrawl = async () => {
        setLoading(true);
        if (input.amount >= 10 && input.upiId) {
            try {
                await axios.post('/wallet/create-withdraw', input)
                    .then(() => {
                        toast.success("Withdrawl request sent successfully");
                        navigate('/wallet')
                    })
            } catch (error) {
                if (error?.response.status === 400) toast.warn("Not enough amount in your wallet");
            }
        } else if (input < 10) toast.warn("Minimum required amount is 10")
        else {
            toast.error("Enter valid upiId")
        }
        setLoading(false);
    }
    return (
        <div className='container'>
            <div className='mb-5'>
                <div className='hb-display__inline-flex mb-3'>
                    <strong>Wallet Balance :</strong>
                    <span><i className="bi bi-currency-rupee"></i> {wallet?.totalCash}</span>
                </div>
                <div className='hb-inline-gird-2 mb-4' style={{ width: '100%' }}>
                    <div><img src={rupeeIcon} width={30} /></div>
                    <div>
                        <PopInput type='number' placeholder='Enter amount' value='10' inputclassName='hb-f-lg' />
                    </div>
                </div>
                <div>
                    <h6>Enter your UPI id</h6>
                    <div className='mb-2'>
                        <PopInput type='text' placeholder='eg: someone@provider' />
                    </div>
                    <div className='hb-display__inline-flex'><span>Get money through <img src={require("../../assets/img/upi-logo.webp")} width={45} /> within 24 hours. <a href="">Learn more</a></span></div>
                </div>
            </div>
            <div className='d-flex justify-content-center'>
                <button className='hb-btn hb-btn-primary__grad hb-btn-linear-lg' onClick={handleWithDrawl}>{loading && <LoadingSpinnerLine />}<span>Complete withdrawl</span></button>
            </div>
        </div>
    )
}
