import React, { useState, useEffect } from 'react';
import './HomepageJastip.css';
import Navbar from '../../components/Navbar/Navbar';
import AddProductImage from '../../assets/addproduct.svg';
import CustomerOrderImage from '../../assets/customerorder.svg';
import CompleteOrderImage from '../../assets/ordercompleted.svg';
import NetIncomeImage from '../../assets/netincome.svg';
import Arrow from '../../assets/Arrow 1.svg';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function HomepageJastip() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [storeInfo, setStoreInfo] = useState({
        storeName: '',
        storeJastipFrom: '',
        storePicture: ''
    });

    // Fetch store profile and products (limit display to 3 products)
    const fetchStoreInfo = async () => {
        try {
            const response = await axios.get('http://localhost:3011/sellerinfo', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setStoreInfo(response.data);
        } catch (error) {
            console.error('Error fetching store info:', error);
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
            setProducts(allProducts.slice(0, 4)); // Limit to 3 products
        } catch (error) {
            console.error('Error fetching all products:', error);
        }
    };

    useEffect(() => {
        fetchStoreInfo();
        fetchAllProducts();
    }, []);

    const handleProductJastip = () => {
        navigate('/productjastip');
    };

    const handleEditStore = () => {
        navigate('/editstoreprofile');
    }

    const handleViewStore = () => {
        navigate('/viewstore');
    }

    const handleCustomerOrder = () => {
        navigate('/customerorder');
    }

    const handleCompleteOrder = () => {
        navigate('/completeorder');
    }

    const handleNetIncome = () => {
        navigate('/netincome');
    }

    return (
        <div className='container-homepagejastip'>
            <Navbar />
            <h1>Welcome, Jastipers!</h1>

            {/* Large Container for Store Information */}
            <div className='container-large'>
                <div className="store-info-section">
                    <div className="store-info">
                        {/* Dynamic store picture */}
                        <img
                            src={`http://localhost:3011/uploads/${storeInfo.storePicture}`}
                            className="store-icon"
                            onClick={handleViewStore}
                            style={{ cursor: 'pointer' }}
                        />
                        <div className="store-details">
                            <h3>{storeInfo.storeName}</h3>
                            <p>{storeInfo.storeJastipFrom}</p>
                            <button className='edit-button' onClick={handleEditStore}>Edit Store</button>
                        </div>
                    </div>
                    <div className="batch-products">
                        <div className="product-list">
                            {products.map((product, index) => (
                                <div key={index} className="product-item">
                                    <img src={`http://localhost:3011/uploads/${product.imageUrl}`} alt="Product" className="product-image" />
                                    <p className="product-name-jastip">{product.name}</p>
                                    <p>IDR {product.price.toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='arrow-view-store'>
                        <img src={Arrow} style={{ cursor: 'pointer' }} alt="Arrow" className="arrow-icon" onClick={handleViewStore} />
                        <p className="view-store-btn" onClick={handleViewStore}>View Store</p>
                    </div>
                </div>
            </div>

            {/* 4 Small Containers */}
            <div className='container-small-wrapper'>
                <div className='container-small' onClick={() => handleProductJastip()}>
                    <img src={AddProductImage} alt="Add Product" className="small-container-image" />
                    <h3>Add Product</h3>
                </div>
                <div className='container-small' onClick={() => handleCustomerOrder()}>
                    <img src={CustomerOrderImage} alt="Customer Order" className="small-container-image" />
                    <h3>Customer Order</h3>
                </div>
                <div className='container-small' onClick={() => handleCompleteOrder()}>
                    <img src={CompleteOrderImage} alt="Order Completed" className="order-completed-image" />
                    <h3>Complete Order</h3>
                </div>
                <div className='container-small' onClick={() => handleNetIncome()}>
                    <img src={NetIncomeImage} alt="Net Income" className="net-income-image" />
                    <h3>Net Income</h3>
                </div>
            </div>
        </div>
    );
}
