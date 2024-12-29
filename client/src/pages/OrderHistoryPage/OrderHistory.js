import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrderHistory.css';
import Navbar from '../../components/Navbar/Navbar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

export default function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [history, setHistory] = useState([]);
    const [activeTab, setActiveTab] = useState('orders');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // State for controlling modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentOrderId, setCurrentOrderId] = useState(null);

    useEffect(() => {
        const fetchOrdersData = async () => {
            try {
                const ordersResponse = await axios.get('http://localhost:3011/orders', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                const allOrders = ordersResponse.data.orders;

                // Filter orders based on status
                const incompleteOrders = allOrders.filter(order => order.status !== 'Completed');
                const completedOrders = allOrders.filter(order => order.status === 'Completed');

                setOrders(incompleteOrders); // Only orders that aren't complete
                setHistory(completedOrders); // Only completed orders

            } catch (error) {
                console.error('Error fetching orders:', error);
                setError('Failed to fetch orders.');
                toast.error('Error fetching orders.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrdersData();
    }, []);

    const isCompleteButtonVisible = (trackingUpdatedAt, status) => {
        if (status === 'Complete') return false;
        if (!trackingUpdatedAt) return false;
        const updateDate = new Date(trackingUpdatedAt);
        const currentDate = new Date();
        const differenceInMinutes = (currentDate - updateDate) / (1000 * 60);
        return differenceInMinutes >= 1;
    };

    // Function to open the modal and set the current order to be completed
    const openCompleteModal = (orderId) => {
        setCurrentOrderId(orderId);
        setIsModalOpen(true);
    };

    // Function to handle confirming the completion of the order
    const handleConfirmCompleteOrder = async () => {
        setIsModalOpen(false); // Close the modal
        const orderId = currentOrderId; // Get the current order ID

        try {
            await axios.get(`http://localhost:3011/orders/${orderId}/complete`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            toast.success("Order completed!");

            // Move the completed order to the history section
            const completedOrder = orders.find(order => order._id === orderId);
            setOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
            setHistory(prevHistory => [...prevHistory, { ...completedOrder, status: 'Complete' }]);

        } catch (error) {
            console.error("Error completing order:", error);
            toast.error("Failed to complete order.");
        }
    };

    // Function to cancel the modal
    const handleCancelCompleteOrder = () => {
        setIsModalOpen(false); // Close the modal
    };


    const handleChatWithSeller = async (sellerId) => {
        if (!sellerId) {
          console.error('Seller ID is missing');
          toast.error('Cannot initiate chat without a valid seller.');
          return;
        }
      
        try {
          const response = await axios.post('http://localhost:3011/chat/startOrFetchChat', 
            { otherUserId: sellerId },
            { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
          );
      
          if (response.status === 201 || response.status === 200) {
            const chat = response.data;
            navigate('/chat', { state: { sellerId, chatId: chat._id } });
          } else {
            throw new Error('Chat creation/fetch unsuccessful');
          }
        } catch (error) {
          console.error('Error starting chat with seller:', error);
          toast.error('Failed to start chat with seller.');
        }
      };
      
    return (
        <div className="order-history-container">
            <Navbar />
            <div className="order-history-inner-container">
                <h2>My Purchases</h2>

                <div className="tab-controls">
                    <button
                        className={activeTab === 'orders' ? 'active' : ''}
                        onClick={() => setActiveTab('orders')}>
                        Orders
                    </button>
                    <button
                        className={activeTab === 'history' ? 'active' : ''}
                        onClick={() => setActiveTab('history')}>
                        History
                    </button>
                </div>

                {isLoading && <p>Loading...</p>}
                {error && <p>{error}</p>}

                {activeTab === 'orders' && orders.map(order => (
                    <div key={order._id} className="order-card">
                        <div className="order-store">
                            <img src={`http://localhost:3011/uploads/${order.storePicture}`} alt={order.store} />
                            <p><strong>{order.store}</strong></p>
                        </div>
                        <div className="order-body">
                            <div className="order-items">
                                {order.products.map(product => (
                                    <div key={product.productId} className="order-item">
                                        <img src={`http://localhost:3011/uploads/${product.imageUrl}`} alt={product.name} />
                                        <div className="order-item-content">
                                            <div className="order-item-info">
                                                <p>{product.name}</p>
                                                <p>IDR {product.price.toLocaleString()}</p>
                                            </div>
                                            <p className="order-item-quantity">{product.quantity} x</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="order-summary">
                                <p><strong>Total Items:</strong> {order.totalItems}</p>
                                <p><strong>Total Price:</strong> IDR {order.totalPrice.toLocaleString()}</p>
                                <p><strong>Tracking Number:</strong> {order.trackingNumber}</p>
                                <p><strong>Status:</strong> {order.status}</p>
                                {isCompleteButtonVisible(order.trackingUpdatedAt, order.status) && (
                                    <button className="complete-button" onClick={() => openCompleteModal(order._id)}>Complete</button>
                                )}
                                <button className="chat-button" onClick={() => handleChatWithSeller(order.seller)}>Chat with Seller</button>
                            </div>
                        </div>
                    </div>
                ))}

                {activeTab === 'history' && history.map(order => (
                    <div key={order._id} className="order-card">
                        <div className="order-store">
                            <img src={`http://localhost:3011/uploads/${order.storePicture}`} alt={order.store} />
                            <p><strong>{order.store}</strong></p>
                        </div>
                        <div className="order-body">
                            <div className="order-items">
                                {order.products.map(product => (
                                    <div key={product.productId} className="order-item">
                                        <img src={`http://localhost:3011/uploads/${product.imageUrl}`} alt={product.name} />
                                        <div className="order-item-content">
                                            <div className="order-item-info">
                                                <p>{product.name}</p>
                                                <p>IDR {product.price.toLocaleString()}</p>
                                            </div>
                                            <p className="order-item-quantity">{product.quantity} x</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="order-summary">
                                <p><strong>Total Items:</strong> {order.totalItems}</p>
                                <p><strong>Total Price:</strong> IDR {order.totalPrice.toLocaleString()}</p>
                                <p><strong>Tracking Number:</strong> {order.trackingNumber}</p>
                                <p><strong>Status:</strong> {order.status}</p>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Modal */}
                {isModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h3>Confirm Completion</h3>
                            <p>Are you sure you have received your items?</p>
                            <div className="modal-buttons">
                                <button className="modal-confirm-btn" onClick={handleConfirmCompleteOrder}>Yes</button>
                                <button className="modal-cancel-btn" onClick={handleCancelCompleteOrder}>No</button>
                            </div>
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
                />
            </div>
        </div>
    );
}
