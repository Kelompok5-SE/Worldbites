import React, { useEffect, useState } from 'react';
import './JoinJastip.css';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from 'jwt-decode';

export default function JoinJastip() {
    const [storeName, setStoreName] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [identityCard, setIdentityCard] = useState('');
    const [description, setDescription] = useState('');
    const [showTerms, setShowTerms] = useState(false);
    const [showPrivacy, setShowPrivacy] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const currentTime = Date.now() / 1000; // Current time in seconds

                if (decoded.exp < currentTime) {
                    console.log('Token has expired');
                    toast.error('Session expired. Please login again.');
                    localStorage.removeItem('token');
                    setIsLoggedIn(false);
                    navigate('/login');

                } else {
                    setIsLoggedIn(true);
                }
            }
            catch (error) {
                console.error('Invalid token');
                setIsLoggedIn(false);
            }
        }
    }, []);


    const handleJoinJastip = async (e) => {

        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3011/joinjastip', {
                storeName: storeName,
                identityCard: identityCard,
                storeDescription: description
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log(response.data);
            toast.success('Registration successful!');
            setTimeout(() => {
                navigate('/homepagejastip');
            }, 1000);
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message || 'Registration failed. Please try again.');
            } else if (error.request) {
                toast.error('No response from server. Please try again later.');
            } else {
                toast.error('An error occurred. Please try again.');
            }
            console.error('Error registering:', error);
        }

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

    const handleBack = () => {
        navigate('/'); // Ganti dengan route yang sesuai
    };


    return (
        <div className='container-join-jastip'>
            <Navbar />
            <div className='join-jastip-wrapper'>
                <h2>REGISTER JASTIP</h2>
                <form className='join-jastip-form' onSubmit={handleJoinJastip}>
                    <div className='input-group-join'>
                        <label htmlFor='storeName'>Store Name <span className='required'>*</span></label>
                        <input 
                            type='text' 
                            id='storeName' 
                            placeholder='Enter Your Store Name' 
                            value={storeName}
                            onChange={(e) => setStoreName(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className='input-group-join'>
                        <label htmlFor='identityCard'>Identity Card <span className='required'>*</span></label>
                        <input 
                            type='text' 
                            id='identityCard' 
                            placeholder='Enter Your Identity Card' 
                            value={identityCard}
                            onChange={(e) => setIdentityCard(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className='input-group-join'>
                        <label htmlFor='storedescription'>Store Description <span className='required'>*</span></label>
                        <textarea 
                        id='storedescription' 
                        placeholder='Enter Your Store Description' 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required 
                        className='description-textarea' // Menambahkan kelas untuk styling khusus
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
                    <button type='submit' className='join-jastip-button'>JOIN</button>
                </form>
                <button onClick={handleBack} className='back-button'>Back</button>
            </div>
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
                        <p>WorldBites reserves the right to change these terms and conditions at any time. Any changes will be communicated through the platform, and continued use of the services after changes are made is considered acceptance of the new terms.</p>
                        <h3>7. Account Termination</h3>
                        <p>WorldBites reserves the right to suspend or terminate a user’s account or access to the platform at any time if these terms are violated or if the platform is misused.</p>
                        <h3>8. Governing Law</h3>
                        <p>These terms and conditions are governed by the laws applicable in [Your Jurisdiction]. Any disputes arising from these terms or the use of the WorldBites platform will be subject to the jurisdiction of the courts in [Your Jurisdiction].</p>
                        <p>By using the WorldBites platform, you acknowledge that you have read, understood, and agreed to these terms and conditions.</p>
                    </div>
                </div>
            )}

           {/* Modal for Privacy Policy */}
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
                            <li>Law enforcement or regulatory authorities if required by law.</li>
                        </ul>
                        <h3>4. Data Security</h3>
                        <p>We take reasonable measures to protect your personal information from unauthorized access, use, or disclosure.</p>
                        <h3>5. Your Rights</h3>
                        <p>You have the right to access, correct, or delete your personal information at any time.</p>
                        <h3>6. Changes to This Privacy Policy</h3>
                        <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on our platform.</p>
                        <h3>7. Contact Us</h3>
                        <p>If you have any questions or concerns about this privacy policy, please contact us at [Your Contact Information].</p>
                        <p>By using our services, you acknowledge that you have read, understood, and agreed to this privacy policy.</p>
                    </div>
                </div>
            )}

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