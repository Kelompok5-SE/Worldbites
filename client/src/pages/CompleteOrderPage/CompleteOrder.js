import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CompleteOrder.css';
import Navbar from '../../components/Navbar/Navbar';

export default function CompleteOrder() {
    const [completedOrders, setCompletedOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCompletedOrders = async () => {
            try {
                const response = await axios.get('http://localhost:3011/seller/completed-orders', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                // Set the completed orders to state
                setCompletedOrders(response.data.orders);
            } catch (error) {
                console.error('Error fetching completed orders:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCompletedOrders();
    }, []);

    return (
        <div className='container-completeorder'>
            <Navbar />
            <div className='completeorder-wrapper'>
                <h2 className='order-title'>Completed Orders</h2>

                {isLoading && <p>Loading...</p>}

                {/* Render completed orders */}
                {completedOrders.map((order) => (
                    <div key={order._id} className='order-details'>
                        <div className='product-info-completeorder'>
                            {order.products.map((product) => (
                                <React.Fragment key={product.productId._id}>
                                    <img
                                        src={`http://localhost:3011/uploads/${product.imageUrl}`}
                                        alt={product.name}
                                        className='product-image-completeorder'
                                    />
                                    <h3>{product.name}</h3>
                                </React.Fragment>
                            ))}
                            <p>IDR {order.totalPrice.toLocaleString()}</p>
                        </div>

                        <div className='info-and-tracking-completeorder'>
                            <div className='customer-info'>
                                {order.user ? (
                                    <>
                                        <p><strong>Name:</strong> {order.user.name}</p>
                                        <p><strong>Phone Number:</strong> {order.user.phoneNumber}</p>
                                        <p><strong>Address:</strong> {order.user.address}</p>
                                    </>
                                ) : (
                                    <p>Loading user info...</p>
                                )}
                                <p><strong>Shipping:</strong> {order.shippingby}</p>
                                <p><strong>Total Payment:</strong> IDR {order.totalPrice.toLocaleString()}</p>
                            </div>  
                        </div>

                        <div className='tracking-status'>
                            <p className='trackingnumber-completeorder'><strong>Tracking Number:</strong> {order.trackingNumber || 'N/A'}</p>
                            <span className='completed-message'>Completed</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
