import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './NetIncome.css';
import Navbar from '../../components/Navbar/Navbar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function NetIncome() {
    const [revenue, setRevenue] = useState(0);  // Initialize revenue to 0
    const [bankAccount, setBankAccount] = useState('');
    const [selectedBank, setSelectedBank] = useState('');

    const bankOptions = [
        "Bank Central Asia (BCA)",
        "Bank Mandiri",
        "Bank Rakyat Indonesia (BRI)",
        "Bank Negara Indonesia (BNI)",
        "Bank Syariah Indonesia (BSI)",
        "Bank Tabungan Negara (BTN)",
        "CIMB Niaga",
        "Permata Bank",
        "OCBC NISP",
        "Danamon",
        "Bank Sinarmas",
        "Bank Mega",
        "Bank Muamalat Indonesia",
        "UOB Indonesia",
        "Maybank Indonesia",
        "Bank Commonwealth",
        "Bank Jago",
        "Bank Bukopin",
        "Citibank Indonesia",
        "HSBC Indonesia"
    ];

    useEffect(() => {
        const fetchNetIncome = async () => {
            try {
                const response = await axios.get('http://localhost:3011/netincome', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                const { totalRevenue } = response.data;
                setRevenue(totalRevenue || 0);  // Set totalRevenue or fallback to 0
            } catch (error) {
                console.error('Error fetching net income:', error);
                toast.error('Error fetching net income.');
            }
        };

        fetchNetIncome();
    }, []);

    const handleWithdraw = () => {
        if (!selectedBank || !bankAccount) {
            toast.error('Please select a bank and enter your bank account.');
            return;
        }
        
        toast.success('Withdraw initiated successfully.');
    };

    return (
        <div className="netincome-container">
            <Navbar />
            <div className="netincome-wrapper">
                <h2 className="netincome-title">Net Income</h2>
                
                <div className="netincome-box">
                    <div className="revenue">
                        <p className="revenue-title">Revenue This Month</p>
                        <p className="revenue-amount">IDR {revenue.toLocaleString()}</p>  {/* Displaying subtotal */}
                    </div>

                    <div className="bank-input">
                        <p>Select your bank:</p>
                        <select value={selectedBank} onChange={e => setSelectedBank(e.target.value)}>
                            <option value="">Select Bank</option>
                            {bankOptions.map((bank, index) => (
                                <option key={index} value={bank}>{bank}</option>
                            ))}
                        </select>
                    </div>

                    <div className="account-input">
                        <label>Enter your bank account:</label>
                        <input 
                            type="text" 
                            value={bankAccount}
                            onChange={(e) => setBankAccount(e.target.value)} 
                            placeholder="Your Bank Account" 
                        />
                    </div>

                    <button className="withdraw-btn" onClick={handleWithdraw}>WITHDRAW</button>
                </div>
            </div>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </div>
    );
}
