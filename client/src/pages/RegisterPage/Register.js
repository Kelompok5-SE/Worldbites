// src/pages/Register/Register.js

import React, { useState } from 'react'; 
import './Register.css'; 
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the styles

export default function Register() {
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const [showTerms, setShowTerms] = useState(false);
    const [showPrivacy, setShowPrivacy] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();

        // Check if passwords match
        if (password !== confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3011/register', {
                email,
                phoneNumber,
                password
            });

            console.log(response.data);
            toast.success('User registered successfully! Redirecting to login...');
            // Redirect after a short delay to allow the toast to show
            setTimeout(() => {
                navigate('/login');
            }, 1000);
        } catch (error) {
            if (error.response) {
                // Server responded with a status other than 2xx
                toast.error(error.response.data.message || 'Registration failed. Please try again.');
            } else if (error.request) {
                // Request was made but no response received
                toast.error('No response from server. Please try again later.');
            } else {
                // Something else happened
                toast.error('An error occurred. Please try again.');
            }
            console.error('Error registering user:', error);
        }

    };

    const handleLogin = () => {
        navigate('/login'); 
    };

    const handleTermsClick = () => {
        setShowTerms(true);
    };
    
    const handlePrivacyClick = () => {
        setShowPrivacy(true);
    };
    
    const closeModal = () => {
        setShowTerms(false);
        setShowPrivacy(false);
    };

    return (
        <div className='container-register'>
            <Navbar />
            <div className='register-wrapper'> 
                <h2>REGISTER</h2>
                <form className='register-form' onSubmit={handleRegister}>
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
                        <label htmlFor='phone'>Phone Number <span className='required'>*</span></label>
                        <input 
                            type='text' 
                            id='phone' 
                            placeholder='Enter Your Phone Number' 
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)} 
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
                    <div className='input-group'>
                        <label htmlFor='confirm-password'>Confirmation Password <span className='required'>*</span></label>
                        <input 
                            type='password' 
                            id='confirm-password' 
                            placeholder='Confirm Your Password' 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className='terms'>
                        <input type='checkbox' id='terms' required />
                        <label htmlFor='terms'>
                            I Agree with
                            <span className='link' onClick={handleTermsClick}> Terms & Conditions</span> and the applicable
                            <span className='link' onClick={handlePrivacyClick}> Privacy Policy</span>.
                        </label>
                    </div>
                    <button type='submit' className='register-button'>OK</button>
                    <p className='login' onClick={handleLogin}>I already have an account</p>
                </form>
                {/* Modal for Terms & Conditions */}
                {showTerms && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={closeModal}>&times;</span>
                            <h2>Terms & Conditions</h2>
                            <p>Welcome to WorldBites. By accessing or using our platform, you agree to comply with and be bound by the following terms and conditions. Please read these terms carefully before using our services.</p>
                            <h3>1. Introduction</h3>
                            <p>WorldBites is a platform that connects customers seeking products through personal shopping services (jastip) with personal shoppers (jastippers). By using this platform, both customers and jastippers agree to adhere to the terms and conditions in effect.</p>
                            <h3>2. Services for Customers</h3>
                            <ul>
                                <li>Customers can search for and order items offered by jastippers through the WorldBites platform.</li>
                                <li>Customers are responsible for ensuring the details of the products offered, including price, availability, and shipping terms.</li>
                                <li>Payments are made via transfer to the official WorldBites bank account. Funds will be held until the items are received and verified by the customer.</li>
                                <li>If the received items do not match the description or are damaged, customers can request a refund through the WorldBites platform.</li>
                                 <li>Refunds will be processed after verification and approval by WorldBites.</li>
                                 <li>Customers agree to use this platform responsibly and not engage in illegal or fraudulent activities.</li>
                            </ul>
                            <h3>3. Services for Jastippers</h3>
                            <ul>
                                <li>Jastippers must register and create an account on WorldBites to offer their services.</li>
                                <li>Jastippers are responsible for the accuracy of the product information and services offered, including price, availability, and shipping terms.</li>
                                <li>Legal obligations such as taxes, shipping, and product quality are entirely the responsibility of the jastipper.</li>
                                <li>Jastippers agree to communicate with customers professionally and fulfill agreed-upon terms.</li>
                            </ul>
                            <h3>4. User Accounts</h3>
                            <p>Both customers and jastippers must create accounts to use certain features on WorldBites. You agree to provide accurate and truthful information when creating an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.</p>
                            <h3>5. Liability</h3>
                            <p>WorldBites acts as an intermediary connecting customers and jastippers. We are not responsible for disputes, issues, or losses that may arise between customers and jastippers.</p>
                            <h3>6. Modification of Terms</h3>
                            <p>WorldBites reserves the right to change these terms and conditions at any time. Any changes will be communicated through the platform, and continued use of the services after changes are made is considered acceptance of the new terms.</p><h3>7. Account Termination</h3>
                            <p>WorldBites reserves the right to suspend or terminate a user’s account or access to the platform at any time if these terms are violated or if the platform is misused.</p>
                            <h3>8. Governing Law</h3>
                            <p>These terms and conditions are governed by the laws applicable in [Your Jurisdiction]. Any disputes arising from these terms or the use of the WorldBites platform will be subject to the jurisdiction of the courts in [Your Jurisdiction].</p>
                            <p>By using the WorldBites platform, you acknowledge that you have read, understood, and agreed to these terms and conditions.</p>
                        </div>
                    </div>
                )}
                {showPrivacy && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={closeModal}>&times;</span>
                            <h2>Privacy Policy</h2>
                            <p>Your privacy is important to us. This privacy policy explains how we collect, use, and share information about you when you use our services.</p>
                            <h3>1. Information We Collect</h3>
                            <p>We may collect personal information such as your name, email address, phone number, and other information that you provide to us.</p>
                            <h3>2. How We Use Your Information</h3>
                            <p>Your information may be used to:</p>
                            <ul>
                                <li>Provide and maintain our services.</li>
                                <li>Communicate with you, including sending you updates and promotional materials.</li>
                                <li>Improve our services based on user feedback.</li>
                            </ul>
                            <h3>3. Sharing Your Information</h3>
                            <p>We do not sell or rent your personal information to third parties. We may share your information with:</p>
                            <ul>
                                <li>Service providers who help us operate our services.</li>
                                <li>Law enforcement or other government agencies, as required by law.</li>
                            </ul>
                            <h3>4. Your Rights</h3>
                            <p>You have the right to:</p>
                            <ul>
                                <li>Access the personal information we hold about you.</li>
                                <li>Request corrections to your personal information.</li>
                                <li>Request deletion of your personal information.</li>
                            </ul>
                            <h3>5. Changes to This Policy</h3>
                            <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on our website.</p>
                            <p>By using our services, you consent to the collection and use of your information as described in this privacy policy.</p>
                        </div>
                    </div>
                )}
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
