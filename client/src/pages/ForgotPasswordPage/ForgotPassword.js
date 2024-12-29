import React, { useState } from 'react'; 
import './ForgotPassword.css'; 
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3011/forgotpassword', {
                email: email
            });

            console.log(response.data);
            toast.success('Reset link sent to your email! Check your inbox.');
            // Redirect after a short delay to allow the toast to show
            setTimeout(() => {
               navigate('/otp', { state: { email: email } });
            }, 1000);
        } catch (error) {
            if (error.response) {
                // Server responded with a status 404
                toast.error(error.response.data || 'Email not found. Please try again.');
            } else if (error.request) {
                // Request was made but no response received
                toast.error('No response from server. Please try again later.');
            } else {
                // Something else happened
                toast.error('An error occurred. Please try again.');
            }
            console.error('Error sending reset link:', error);
        }
    };


    const handleBack = () => {
        navigate('/login'); 
    };

    return (
        <div className='container-forgot-password'>
            <Navbar />
            <div className='forgot-password-wrapper'> 
                <h2>FORGOT PASSWORD</h2>
                <form className='forgot-password-form' onSubmit={handleForgotPassword}>
                    <div className='input-group-forgot'>
                        <label htmlFor='email'>Email <span className='required'>*</span></label>
                        <input 
                            type='email' 
                            id='email' 
                            placeholder='Enter Your Email Address' 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type='submit' className='send-reset-code-button'>SEND RESET CODE</button>
                </form>
                <button onClick={handleBack} className='back-button'>Back</button>
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
