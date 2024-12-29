import React, { useState } from 'react'; 
import './ChangePassword.css'; 
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error('New password and confirm password do not match.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3011/changepassword', {
                currentPassword: currentPassword,
                newPassword: newPassword
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            console.log(response.data);
            toast.success('Password updated successfully!');
            setTimeout(() => {
                navigate('/');
            }, 1000);
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message || 'Password update failed. Please try again.');
            } else if (error.request) {
                toast.error('No response from server. Please try again later.');
            } else {
                toast.error('An error occurred. Please try again.');
            }
            console.error('Error updating password:', error);
    }};

    const handleBack = () => {
        navigate('/'); 
    };

    return (
        <div className='container-change-password'>
            <Navbar />
            <div className='change-password-wrapper'> 
                <h2>CHANGE PASSWORD</h2>
                <form className='change-password-form' onSubmit={handleChangePassword}>
                    <div className='input-group-change'>
                        <label htmlFor='currentPassword'>Current Password <span className='required'>*</span></label>
                        <input 
                            type='password' 
                            id='currentPassword' 
                            placeholder='Enter Current Password' 
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className='input-group-change'>
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
                    <div className='input-group-change'>
                        <label htmlFor='confirmPassword'>Confirm Password <span className='required'>*</span></label>
                        <input 
                            type='password' 
                            id='confirmPassword' 
                            placeholder='Confirm New Password' 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    
                </form>

                <div className='button-group'>
                <button type='submit' className='change-password-button' onClick={handleChangePassword}>Update Password</button>
                </div>

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
