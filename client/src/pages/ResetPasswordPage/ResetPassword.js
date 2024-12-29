import React, { useState } from 'react';
import './ResetPassword.css'; 
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function ResetPassword() {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || ''; // Retrieve the email from location state

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleResetPassword = async (e) => { // Ensure this is async
        e.preventDefault();
    
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }
    
        // Log the data to check its structure
        console.log('Sending data:', { email: email, newPassword: newPassword });
    
        try {
            const response = await axios.post('http://localhost:3011/resetpassword', {
                email: email,
                newPassword: newPassword // Ensure correct property name
            });
    
            console.log(response.data);
            toast.success('Password reset successful! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message || 'Password reset failed. Please try again.');
            } else if (error.request) {
                toast.error('No response from server. Please try again later.');
            } else {
                toast.error('An error occurred. Please try again.');
            }
            console.error('Error resetting password:', error);
        }
    };
    

    return (
        <div className='container-reset-password'>
            <div className='reset-password-wrapper'>
                <h2>RESET PASSWORD</h2>
                <form className='reset-password-form' onSubmit={handleResetPassword}>
                    <div className='input-group'>
                        <label htmlFor='newPassword'>New Password <span className='required'>*</span></label>
                        <input 
                            type='password' 
                            id='newPassword' 
                            placeholder='Enter New Password' 
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className='input-group'>
                        <label htmlFor='confirmPassword'>Confirm Password <span className='required'>*</span></label>
                        <input 
                            type='password' 
                            id='confirmPassword' 
                            placeholder='Confirm Your New Password' 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type='submit' className='reset-password-button'>Confirm</button>
                </form>
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
