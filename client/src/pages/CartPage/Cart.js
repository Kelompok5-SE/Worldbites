import './Cart.css';
import Navbar from '../../components/Navbar/Navbar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [checkedItems, setCheckedItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await axios.get('http://localhost:3011/getcart', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setCartItems(response.data);
                setCheckedItems(response.data.map(item => item._id));
            } catch (error) {
                console.error('Error fetching cart items:', error);
                toast.error('Failed to fetch cart items');
            } finally {
                setLoading(false);
            }
        };

        fetchCartItems();
    }, []);

    const calculateTotalPrice = () => {
        return cartItems.reduce((total, item) => {
            // Only include the item in the total if it is checked
            if (item.isChecked) {
                return total + item.price * item.quantity;
            }
            return total;
        }, 0);  // Start with a total of 0
    };

    const updateQuantity = async (id, action) => {
        const currentItem = cartItems.find(item => item._id === id);

        if (currentItem.quantity === 1 && action === 'decrease') {
            // Show error toast if trying to decrease below 1
            toast.error('Quantity cannot be less than 1');
            return;
        }

        const updatedQuantity = action === 'increase'
            ? currentItem.quantity + 1
            : currentItem.quantity - 1;

        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item._id === id
                    ? { ...item, quantity: updatedQuantity }
                    : item
            )
        );

        try {
            await axios.put(`http://localhost:3011/updatecartquantity/${id}`, { quantity: updatedQuantity }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            toast.success('Quantity updated successfully');
        } catch (error) {
            console.error('Error updating quantity:', error);
            toast.error('Failed to update quantity');
        }
    };


    const handleCheckboxChange = async (id) => {
        // Update the local state first to reflect changes immediately in the UI
        const updatedItems = cartItems.map(item => {
            if (item._id === id) {
                return { ...item, isChecked: !item.isChecked };  // Toggle isChecked value
            }
            return item;
        });
    
        setCartItems(updatedItems);  // Update state locally for immediate UI feedback
    
        // Find the updated item with the new isChecked value
        const updatedItem = updatedItems.find(item => item._id === id);
    
        // Now send the updated isChecked value to the backend
        try {
            await axios.put(`http://localhost:3011/cart/updateIsChecked/${id}`, {
                isChecked: updatedItem.isChecked  // Send the updated isChecked value
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            toast.success('Item selection updated');
        } catch (error) {
            console.error('Error updating checkbox status:', error);
            toast.error('Failed to update checkbox status');
        }
    };


    const checkoutHandle = () => {
        // Check if there are any checked items
        const hasCheckedItems = cartItems.some(item => item.isChecked);
        
        if (!hasCheckedItems) {
            // If no items are checked, show an error and prevent checkout
            toast.error('Please select at least one item to proceed to checkout');
            return;
        }

        // Proceed to the checkout page if items are checked
        navigate('/checkout');
    };

    const removeItem = async (id) => {
        try {
            await axios.delete(`http://localhost:3011/cart/remove/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setCartItems((prevItems) => prevItems.filter((item) => item._id !== id));
            setCheckedItems((prevCheckedItems) => prevCheckedItems.filter(itemId => itemId !== id));
            toast.success('Item removed from cart');
        } catch (error) {
            console.error('Error removing item from cart:', error);
            toast.error('Failed to remove item from cart');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }


    return (
        <div className="container-cart">
            <Navbar />
            <div className="cart-content">
                <h2 className="cart-title">CART</h2>
                <div className="cart-table">
                    <div className="cart-header">
                        <div className="header-item"></div>
                        <div className="header-item"></div>
                        <div className="header-item">Product Name</div>
                        <div className="header-item">Price</div>
                        <div className="header-item">Quantity</div>
                        <div className="header-item">Total</div>
                    </div>
                    {cartItems.map((item) => (
                        <div key={item._id} className="cart-item">
                            <div className="cart-checklist">
                                <input
                                    className="checkbox"
                                    type="checkbox"
                                    onChange={() => handleCheckboxChange(item._id)}
                                    checked={item.isChecked}
                                />
                            </div>
                            <div className="cart-image">
                                <img src={`http://localhost:3011/uploads/${item.imageUrl}`} alt="Product" />
                            </div>
                            <div className="product-name-cart">
                                <p>{item.name}</p>
                                <button className="remove-btn" onClick={() => removeItem(item._id)}>Remove</button>
                            </div>
                            <div className="cart-price">
                                <p>IDR {item.price.toLocaleString()}</p>
                            </div>
                            <div className="quantity-selector-cart">
                                <button className="decrease-quantity" onClick={() => updateQuantity(item._id, 'decrease')}>-</button>
                                <span className="quantity">{item.quantity}</span>
                                <button className="increase-quantity" onClick={() => updateQuantity(item._id, 'increase')}>+</button>
                            </div>
                            <div className="cart-total">
                                <p>IDR {(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                    <div className="cart-summary">
                        <p>Total: IDR {calculateTotalPrice().toLocaleString()}</p>
                        <button className="checkout-btn" onClick={checkoutHandle}>Checkout</button>
                    </div>
                </div>
            </div>
            <ToastContainer
                position='top-center'
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
