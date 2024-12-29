import React, { useState, useEffect } from 'react';
import './AddBatch.css';
import Navbar from '../../components/Navbar/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

export default function AddBatch() {
    const [batchName, setBatchName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const navigate = useNavigate();

    const handleAddBatch = async () => {
        if (!batchName || !startDate || !endDate) {
            toast.error('Please fill in all the fields.');
            return;
        }

        const token = localStorage.getItem('token');

        if (!token) {
            toast.error('User not authenticated.');
            return;
        }

        // Dekode token untuk mendapatkan userId
        let userId;
        try {
            const decoded = jwtDecode(token);
            console.log('Decoded token:', decoded); // Add this line
            userId = decoded.id; // Ensure 'id' exists
        } catch (error) {
            toast.error('Invalid token.');
            console.error('Token decoding error:', error);
            return;
        }
        

        try {
            const response = await axios.post('http://localhost:3011/batch', {
                batchName,
                startDate,
                endDate
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log(response.data);
            
            toast.success('Batch added successfully!');
            setTimeout(() => {
                navigate('/productjastip'); // Redirect to productjastip page
            }, 1000);
        }
        catch (error) {
            if (error.response) {
                toast.error(error.response.data.message || 'Batch addition failed. Please try again.');
            } else if (error.request) {
                toast.error('No response from server. Please try again later.');
            } else {
                toast.error('An error occurred. Please try again.');
            }
            console.error('Error adding batch:', error);
        }
    };


    return (
        <div className='container-addbatch'>
            <Navbar />
            <div className="batch-form">
                <h2>Add Batch</h2>
                
                {/* Batch Name */}
                <div className="batch-name-row">
                    <label>Batch Name:</label>
                    <input 
                        type="text" 
                        value={batchName} 
                        onChange={(e) => setBatchName(e.target.value)} 
                        placeholder="Enter Batch Name"
                    />
                </div>
                
                {/* Period: Start Date and End Date */}
                <div className="period-section">
                    <label className="period-label">Period:</label>
                    <div className="date-row">
                        <div>
                            <label>Start Date:</label>
                            <input 
                                type="date" 
                                value={startDate} 
                                onChange={(e) => setStartDate(e.target.value)} 
                            />
                        </div>
                        <div>
                            <label>End Date:</label>
                            <input 
                                type="date" 
                                value={endDate} 
                                onChange={(e) => setEndDate(e.target.value)} 
                            />
                        </div>
                    </div>
                </div>
                
                <button onClick={handleAddBatch}>Add</button>

                {/* Toastify Container */}
                
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