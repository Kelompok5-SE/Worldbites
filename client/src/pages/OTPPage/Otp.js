import React, { useState, useEffect } from 'react';
import './Otp.css'; // Assuming you will create a CSS file for styling
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 



export default function OTPPage() {
    const [otp, setOtp] = useState(['', '', '', '']);
    const [timer, setTimer] = useState(30); // Countdown timer starts at 60 seconds
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || ''; // Accessing the passed email

    // Handle OTP input change
    const handleChange = (element, index) => {
        let value = element.value;
        if (value.length <= 1) {
            let newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Move to the next input field if a number is entered
            if (value !== '' && index < 3) {
                document.getElementById(`otp-input-${index + 1}`).focus();
            }

            // Move to the previous input field if the number is removed
            if (value === '' && index > 0) {
                document.getElementById(`otp-input-${index - 1}`).focus();
            }
        }
    };

    // Countdown logic for OTP resend button
    useEffect(() => {
        let interval = null;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else {
            setIsResendDisabled(false);
        }

        return () => clearInterval(interval);
    }, [timer]);

  // Handle OTP submission for verification
const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    console.log('Submitted OTP:', otpValue);

    // Call the verification endpoint
    try {
        const response = await axios.post('http://localhost:3011/verifyotp', {
            email: email,
            otp: otpValue
        });

        if (response.data.success) {
            toast.success(response.data.message); // Show success message

            setTimeout(() => {
                navigate('/resetpassword', { state: { email: email } });
            }
            , 2000);
        } else {
            toast.error(response.data.message); // Show error message if OTP is invalid
        }
    } catch (error) {
        if (error.response) {
            toast.error(error.response.data.message || 'Failed to verify OTP. Please try again.');
        } else {
            toast.error('An error occurred. Please try again later.');
        }
    }
};

  
    // Handle OTP Resend
    const handleResend = async () => {
        try {
            setTimer(30);
            setIsResendDisabled(true);

            const response = await axios.post('http://localhost:3011/resendotp', {
                email: email
            });

            if (response.data.success) {
                toast.success('OTP resent! Please check your email.');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message || 'Failed to resend OTP. Please try again.');
            } else {
                toast.error('An error occurred. Please try again later.');
            }
        }
    };

    return (
        <div className='otp-wrapper'>
            <div className="otp-container">
                <h2 className='titleotp'>Email Verification</h2>
                <p>We have sent a code to your email {email}</p> {/* Display dynamic email */}
                <form onSubmit={handleSubmit}>
                    <div className="otp-inputs">
                        {otp.map((data, index) => (
                            <input
                                key={index}
                                id={`otp-input-${index}`}
                                type="text"
                                maxLength="1"
                                value={otp[index]}
                                onChange={(e) => handleChange(e.target, index)}
                                required
                            />
                        ))}
                    </div>
                    <button type="submit" className="verify-button">
                        Verify
                    </button>
                </form>
                <p>
                    {timer > 0 ? (
                        <span>Resend OTP in {timer} seconds</span>
                    ) : (
                        <span>
                            Didn’t receive the code?{' '}
                            <button
                                className="resend-button"
                                onClick={handleResend}
                                disabled={isResendDisabled}
                            >
                                Resend OTP
                            </button>
                        </span>
                    )}
                </p>
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
