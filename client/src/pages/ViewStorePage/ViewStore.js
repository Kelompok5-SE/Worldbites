import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import './ViewStore.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

export default function ViewStorePage() {

    const navigate = useNavigate();

    const [storeData, setStoreData] = useState({
        storeName: '',
        storeDescription: '',
        storePicture: '',
        storeJastipFrom: '',
        storeimageUrl: '',
        products: [] // This will hold the list of products
    });


    const handleEditProfile = () => {
        navigate('/editstoreprofile');
    }

    useEffect(() => {
        const fetchStoreProfile = async () => {
            try {
                const response = await axios.get('http://localhost:3011/get-store-profile', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setStoreData((prevData) => ({
                    ...prevData,
                    storeName: response.data.storeName,
                    storeDescription: response.data.storeDescription,
                    storePicture: response.data.storePicture,
                    storeJastipFrom: response.data.JastipFrom,
                    storeimageUrl: response.data.storePicture
                }));
            } catch (error) {
                console.error('Error fetching store profile:', error);
                toast.error('Failed to load store profile.');
            }
        };

        const fetchAllProducts = async () => {
            try {
                const response = await axios.get('http://localhost:3011/batches/products', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const allProducts = response.data.reduce((acc, batch) => acc.concat(batch.products), []);
                setStoreData((prevData) => ({
                    ...prevData,
                    products: allProducts // No limit applied, fetches all products
                }));
            } catch (error) {
                console.error('Error fetching all products:', error);
                toast.error('Failed to load products.');
            }
        };

        fetchStoreProfile();
        fetchAllProducts(); // Fetch all products after fetching store profile
    }, []);

    return (
        <div className="view-store-page">
            <Navbar />
            <div className="view-store-container">
                <div className="store-header">

                    <div className='button-edit-viewstore'>
                        <button onClick={handleEditProfile} className='edit-profile-button'>Edit Profile</button>
                    </div>

                    <div className='store-info-section'>
                        <div className='store-from-stars-container'>
                            <div className="jastipfrom-stars">
                                <p>{storeData.storeJastipFrom}</p>
                                <div className="rating-stars-container">
                                    <span className="rating-star">⭐</span>
                                    <span className="rating-star">⭐</span>
                                    <span className="rating-star">⭐</span>
                                    <span className="rating-star">⭐</span>
                                    <span className="rating-star">⭐</span>
                                </div>
                            </div>
                        </div>
                        <div className='store-name-viewstore'>
                            <img
                                src={`http://localhost:3011/uploads/${storeData.storePicture}`}
                                alt={storeData.storeName}
                                className="store-image"
                            />
                            <h2>{storeData.storeName}</h2>
                        </div>

                        {/* Store Description Container */}
                        <div className='store-description-container'>
                            <div className='store-description'>
                                <p>{storeData.storeDescription}</p>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="product-list-view">
                    {storeData.products.length > 0 ? (
                        storeData.products.map((product) => (
                            <div key={product._id} className="product-card">
                                <div className="product-image-frame">
                                    <img
                                        src={`http://localhost:3011/uploads/${product.imageUrl}`}
                                        alt={product.name}
                                        className="product-image"
                                    />
                                </div>
                                <p className="product-name">{product.name}</p>
                                <p className="product-price">IDR {product.price.toLocaleString()}</p>
                            </div>
                        ))
                    ) : (
                        <p>No products available.</p>
                    )}
                </div>
            </div>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
}
