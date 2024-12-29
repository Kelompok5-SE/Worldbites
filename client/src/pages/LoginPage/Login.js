// src/pages/Login/Login.js

import React, { useState } from 'react'; 
import './Login.css'; 
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the styles

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.post('http://localhost:3011/login', {
                email: email,
                password: password
            });
    
            // If login is successful, store the JWT token in localStorage
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                toast.success('Login successful!');
                
                // Redirect after a short delay to allow the toast to show
                setTimeout(() => {
                    navigate('/');
                }, 1000);
            } else {
                // If for some reason no token is returned (edge case)
                toast.error('No token received. Please contact support.');
            }
        } catch (error) {
            if (error.response) {
                // Server responded with a status other than 2xx
                toast.error(error.response.data.message || 'Login failed. Please try again.');
            } else if (error.request) {
                // Request was made but no response received
                toast.error('No response from server. Please try again later.');
            } else {
                // Any other error
                toast.error('An error occurred. Please try again.');
            }
            console.error('Error logging in:', error);
        }
    };
    

    const handleRegister = () => {
        navigate('/register'); 
    };

    const handleForgotPassword = () => {
        navigate('/forgotpassword'); 
    };

    return (
        <div className='container-login'>
            <Navbar />
            <div className='login-wrapper'> 
                <h2>LOGIN MEMBER</h2>
                <form className='login-form' onSubmit={handleLogin}>
                    <div className='input-group'>
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
                    <div className='input-group'>
                        <label htmlFor='password'>Password <span className='required'>*</span></label>
                        <input 
                            type='password' 
                            id='password' 
                            placeholder='Enter Your Password' 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <p className='forgot-password' onClick={handleForgotPassword}>Forgot Password?</p>
                    <button type='submit' className='login-button'>OK</button>
                    <p className='register' onClick={handleRegister}>Don’t have an account yet?</p>
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
