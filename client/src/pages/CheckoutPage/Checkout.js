import { useState, useEffect } from 'react';
import axios from 'axios';
import './Checkout.css';
import Navbar from '../../components/Navbar/Navbar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Checkout() {
    const [userData, setUserData] = useState({
        name: '',
        phone: '',
        email: '',
        address: ''
    });
    const [provinces, setProvinces] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [weight, setWeight] = useState('');
    const [courier, setCourier] = useState('jne');
    const [cost, setCost] = useState(null);
    const [cartItems, setCartItems] = useState([]);  // Cart items for regular checkout
    const [buyNowProduct, setBuyNowProduct] = useState(null);  // Product for "Buy Now"
    const Navigate = useNavigate();
    const location = useLocation();

    // Fetch user data regardless of whether it's a cart checkout or a "Buy Now" flow
    useEffect(() => {
        fetchUserData(); // Always fetch user data
        if (location.state?.product) {
            setBuyNowProduct(location.state.product);
        } else {
            fetchCartItems();
        }
    }, [location]);

    // Fetch user data (common for both scenarios)
    const fetchUserData = async () => {
        try {
            const response = await axios.get('http://localhost:3011/usercheckout', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
            });
            setUserData({
                name: response.data.name,
                phone: response.data.phone,
                email: response.data.email,
                address: response.data.address
            });
        } catch (error) {
            if (error.response && error.response.status === 401) {
                toast.error('Session expired. Please log in again.');
                Navigate('/login');
            } else {
                toast.error('Error fetching user data');
            }
        }
    };

    // Fetch cart items if not in the "Buy Now" flow
    const fetchCartItems = async () => {
        try {
            const response = await axios.get('http://localhost:3011/usercheckout', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
            });
            setCartItems(response.data.cartItems);
        } catch (error) {
            toast.error('Error fetching cart items');
        }
    };

    // Fetch provinces when the component mounts
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await axios.get('http://localhost:3011/provinces', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setProvinces(response.data);
            } catch (error) {
                toast.error('Error fetching provinces');
            }
        };

        fetchProvinces();
    }, []);

    // Fetch cities based on the selected province
    useEffect(() => {
        if (selectedProvince) {
            const fetchCities = async () => {
                try {
                    const response = await axios.get(`http://localhost:3011/cities/${selectedProvince}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    setCities(response.data);
                } catch (error) {
                    toast.error('Error fetching cities');
                }
            };

            fetchCities();
        }
    }, [selectedProvince]);

    // Calculate subtotal for the cart items or "Buy Now" product
    const calculateSubtotal = () => {
        return buyNowProduct
            ? buyNowProduct.price * buyNowProduct.quantity
            : cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    };

    // Calculate admin fee based on the subtotal
    const calculateAdminFee = (subtotal) => {
        return subtotal * 0.1;
    };

    // Calculate final total including shipping
    const calculateFinalTotal = () => {
        const subtotal = calculateSubtotal();
        const shippingCost = cost ? cost[0].costs[0].cost[0].value : 0;
        return subtotal + calculateAdminFee(subtotal) + shippingCost;
    };

    // Function to handle cost calculation for shipping
    const handleCalculateShipping = async () => {
        try {
            const response = await axios.post('http://localhost:3011/ongkir', {
                origin: '457',
                destination: selectedCity,
                weight: parseInt(weight),
                courier: courier
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setCost(response.data);
        } catch (error) {
            toast.error('Error calculating shipping cost');
        }
    };


    const handleCheckout = async () => {
        try {
            

            const checkoutData = {
                store: 'Store Name', // Replace with dynamic store name
                products: buyNowProduct ? [{
                    productId: buyNowProduct.productId,
                    name: buyNowProduct.name,
                    quantity: buyNowProduct.quantity,
                    price: buyNowProduct.price,
                    imageUrl: buyNowProduct.imageUrl
                }] : cartItems.map(item => ({
                    productId: item.productId,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    imageUrl: item.imageUrl
                })),
                totalItems: buyNowProduct ? 1 : cartItems.length,
                subtotalPrice: calculateSubtotal(),
                courier: courier,
                shippingCost: cost[0].costs[0].cost[0].value,
                totalPrice: calculateFinalTotal(),
            };
    
    
            // Send checkout data to the backend
            const response = await axios.post('http://localhost:3011/checkout', checkoutData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}` // Use token from localStorage
                }
            });
    
            // Handle success
            toast.success('Order created successfully!');
            
            setTimeout(() => {
                Navigate('/orderhistory'); // Redirect to orders page
            }, 1000);

            console.log('Order created:', response.data.order);
    
    
        } catch (error) {
            console.error('Error during checkout:', error); // Log the actual error
            toast.error('Error processing checkout.');
        }
    };
    

    const cancelCheckout = () => {
        Navigate('/cart');
    };

    return (
        <div className='container-checkout'>
            <Navbar />

            <div className='checkout-content'>
                <div className='checkout-left'>
                    <div className="checkout-title-header">
                        <h2>Checkout</h2>
                    </div>

                    <div className="cart-table-checkout">
                        <div className="cart-header-checkout">
                            <div className="header-item"></div>
                            <div className="header-item">Product Name</div>
                            <div className="header-item">Price</div>
                            <div className="header-item">Quantity</div>
                            <div className="header-item">Total</div>
                        </div>

                        {/* Conditionally Render Either "Buy Now" Product or Cart Items */}
                        {buyNowProduct ? (
                            <>
                                <div className="cart-item-checkout">
                                    <div className="cart-image-checkout">
                                        <img src={`http://localhost:3011/uploads/${buyNowProduct.imageUrl}`} alt="Product" />
                                    </div>
                                    <div className="product-name-cart-checkout">
                                        <p>{buyNowProduct.name}</p>
                                    </div>
                                    <div className="cart-price">
                                        <p>IDR {buyNowProduct.price.toLocaleString()}</p>
                                    </div>
                                    <div className="quantity-selector-cart-checkout">
                                        <p className="quantity-checkout">{buyNowProduct.quantity}</p>
                                    </div>
                                    <div className="cart-total">
                                        <p>IDR {(buyNowProduct.price * buyNowProduct.quantity).toLocaleString()}</p>
                                    </div>
                                </div>
                            </>
                        ) : (
                            cartItems.length > 0 && (
                                <>
                                    {cartItems.map(item => (
                                        <div key={item._id} className="cart-item-checkout">
                                            <div className="cart-image-checkout">
                                                <img src={`http://localhost:3011/uploads/${item.imageUrl}`} alt="Product" />
                                            </div>
                                            <div className="product-name-cart-checkout">
                                                <p>{item.name}</p>
                                            </div>
                                            <div className="cart-price">
                                                <p>IDR {item.price.toLocaleString()}</p>
                                            </div>
                                            <div className="quantity-selector-cart-checkout">
                                                <p className="quantity-checkout">{item.quantity}</p>
                                            </div>
                                            <div className="cart-total">
                                                <p>IDR {(item.price * item.quantity).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )
                        )}

                        {/* Total Section for Both Buy Now and Cart Checkout */}
                        <div className='total-checkout'>
                            <p>Total: IDR {calculateSubtotal().toLocaleString()}</p>
                        </div>
                    </div>


                    {/* Personal Information Fields */}
                    <div className='checkout-title'>
                        <label>Nama Lengkap</label>
                        <input type="text" value={userData.name} readOnly />
                    </div>
                    <div className='checkout-title'>
                        <label>Phone Number</label>
                        <input type="text" value={userData.phone} readOnly />
                    </div>
                    <div className='checkout-title'>
                        <label>Email</label>
                        <input type="email" value={userData.email} readOnly />
                    </div>
                    <div className='checkout-title'>
                        <label>Address</label>
                        <textarea rows="3" value={userData.address} readOnly></textarea>
                    </div>

                    {/* Province and City Dropdown */}
                    <div className='checkout-title'>
                        <label>Province</label>
                        <select value={selectedProvince} onChange={(e) => setSelectedProvince(e.target.value)}>
                            <option value="">Select Province</option>
                            {provinces.map((province) => (
                                <option key={province.province_id} value={province.province_id}>
                                    {province.province}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className='checkout-title'>
                        <label>City</label>
                        <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} disabled={!selectedProvince}>
                            <option value="">Select City</option>
                            {cities.map((city) => (
                                <option key={city.city_id} value={city.city_id}>
                                    {city.city_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Weight and Courier */}
                    <div className='checkout-title'>
                        <label>Weight (grams)</label>
                        <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Enter weight in grams" />
                    </div>

                    <div className='checkout-title'>
                        <label>Courier</label>
                        <select value={courier} onChange={(e) => setCourier(e.target.value)}>
                            <option value="jne">JNE</option>
                            <option value="pos">POS</option>
                            <option value="tiki">TIKI</option>
                        </select>
                    </div>

                    {/* Calculate Shipping Button */}
                    <div className='button-calculateshipping'>
                        <button onClick={handleCalculateShipping}>Calculate Shipping</button>
                    </div>

                    {/* Display Shipping Cost */}
                    {cost && (
                        <div className='shipping-cost'>
                            <p>Estimated Shipping Cost: IDR {cost[0].costs[0].cost[0].value.toLocaleString()}</p>
                            <p>Estimated Delivery Time: {cost[0].costs[0].cost[0].etd} days</p>
                        </div>
                    )}
                </div>

                {/* Checkout Summary on the Right */}
                <div className='checkout-right'>
                    <p>
                        Subtotal: IDR {calculateSubtotal().toLocaleString()}
                    </p>
                    <p>Shipping: {cost ? `IDR ${cost[0].costs[0].cost[0].value.toLocaleString()}` : 'Calculated after selection'}</p>
                    <p>
                        Admin fee: IDR {calculateAdminFee(calculateSubtotal()).toLocaleString()}
                    </p>
                    <hr />
                    <p>
                        Total: IDR {calculateFinalTotal().toLocaleString()}
                    </p>

                    <div className='button-checkout-cancel'>
                        <button className='cancel-btn' onClick={cancelCheckout}>Cancel</button>
                        <button className='checkout-btn-page' onClick={handleCheckout}>Checkout</button>
                    </div>
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