import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CustomerOrder.css';
import Navbar from '../../components/Navbar/Navbar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CustomerOrder() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [trackingInput, setTrackingInput] = useState({});
    const [showSubmit, setShowSubmit] = useState({});

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:3011/seller/orders', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
    
                // Check if the orders exist
                if (response.data.orders && response.data.orders.length > 0) {
                    // Filter out orders that are not complete
                    const activeOrders = response.data.orders.filter(order => order.status !== 'Completed');
                    setOrders(activeOrders);
                } else {
                    // Handle case when no orders are found, but don't treat it as an error
                    setOrders([]);
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    // Handle 404 error when no orders are found (if that's how your API signals it)
                    setOrders([]);
                } else {
                    console.error('Error fetching orders:', error);
                    toast.error('Failed to fetch orders. Please try again later.');
                }
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchOrders();
    }, []);
    

    const handleTrackingInputChange = (orderId, value) => {
        setTrackingInput(prev => ({ ...prev, [orderId]: value }));
        setShowSubmit(prev => ({ ...prev, [orderId]: value.length > 0 }));
    };

    const handleUpdateTracking = async (orderId) => {
        try {
            const trackingNumber = trackingInput[orderId];
            const response = await axios.put(`http://localhost:3011/orders/${orderId}/trackingnumber`,
                { trackingNumber },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            setTrackingInput(prev => ({ ...prev, [orderId]: trackingNumber }));
            toast.success(response.data.message);
            setShowSubmit(prev => ({ ...prev, [orderId]: false }));
        } catch (error) {
            console.error('Error updating tracking number:', error);
            toast.error('Failed to update tracking number.');
        }
    };

    return (
        <div className='container-customerorder'>
            <Navbar />
            <div className='customerorder-wrapper'>
                <h2 className='order-title'>Customer Orders</h2>
                {!isLoading && orders.length === 0 && (
                    <>
                        <hr className='title-separator' /> {/* Separator line below the title */}
                        <p className='no-orders-message'>No orders available at the moment.</p>
                    </>
                )}

                {isLoading && <p>Loading...</p>}

                {orders.map((order) => (
                    <div key={order._id} className='order-details'>
                        <div className='product-info-customerorder'>
                            {order.products.map((product) => (
                                <React.Fragment key={product.productId}>
                                    <img
                                        src={`http://localhost:3011/uploads/${product.imageUrl}`}
                                        alt={product.name}
                                        className='product-image-customerorder'
                                    />
                                    <h3>{product.name}</h3>
                                </React.Fragment>
                            ))}
                            <p>IDR {order.totalPrice.toLocaleString()}</p>
                        </div>

                        <div className='info-and-tracking-customerorder'>
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

                        <div className='tracking-input'>
                            <label htmlFor={`tracking-number-${order._id}`}><strong>Input Tracking Number:</strong></label>
                            <input
                                type='text'
                                id={`tracking-number-${order._id}`}
                                placeholder='Enter tracking number'
                                value={trackingInput[order._id] || (order.trackingNumber && order.trackingNumber !== 'xxxxxxx' ? order.trackingNumber : '')}
                                onChange={(e) => handleTrackingInputChange(order._id, e.target.value)}
                            />
                            {showSubmit[order._id] && (
                                <button onClick={() => handleUpdateTracking(order._id)}>Submit</button>
                            )}
                        </div>
                    </div>
                ))}

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
                />
            </div>
        </div>
    );
}
