import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LandingPage.css';
import Navbar from '../../components/Navbar/Navbar';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; 
import Carousel1 from '../../assets/Carousel1.svg'; 
import Carousel2 from '../../assets/Carousel2.svg';
import Carousel3 from '../../assets/Carousel3.svg';
import Carousel4 from '../../assets/Carousel4.svg';
import { useNavigate } from 'react-router-dom';
import { Loading } from '@carbon/react';
import { Close } from '@carbon/icons-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LandingPage() {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false); // Modal visibility state
    const [selectedCategories, setSelectedCategories] = useState([]); // Categories state
    const [selectedBrands, setSelectedBrands] = useState([]); // Brands state

    const navigate = useNavigate();

    // Fetch all products initially
    const fetchAllProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:3011/getallproducts');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching all products:', error);
        } finally {
            setLoading(false);
        }
    };

    // Search products based on query
    const searchProducts = async (query) => {
        try {
            setLoading(true);
            const response = await axios.post('http://localhost:3011/search', { query });
            setProducts(response.data);
        } catch (error) {
            console.error('Error searching products:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch products on component mount
    useEffect(() => {
        fetchAllProducts();
    }, []);

    // Handle search input
    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.length > 0) {
            searchProducts(query);
        } else {
            fetchAllProducts();
        }
    };

    // Handle product click to navigate to product description
    const handleProductDescription = (productId) => {
        navigate(`/productinfo/${productId}`);
    };

    // Settings for the carousel/slider
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    const displayedProducts = products.slice(0, 7); // Limit displayed products

    // Toggle modal for filters
    const toggleFilterModal = () => {
        setIsFilterModalOpen(!isFilterModalOpen);
    };

    // Handle checkbox changes for categories and brands
    const handleCheckboxChange = (e, type) => {
        const { name, checked } = e.target;
        if (type === 'category') {
            setSelectedCategories(prev =>
                checked ? [...prev, name] : prev.filter(cat => cat !== name)
            );
        } else if (type === 'brand') {
            setSelectedBrands(prev =>
                checked ? [...prev, name] : prev.filter(brand => brand !== name)
            );
        }
    };

    // Filter function (you'll need to implement backend filtering for this)
    const applyFilters = async () => {
        try {
            setLoading(true);
            const response = await axios.post('http://localhost:3011/filter', {
                selectedCategories,
                selectedBrands
            });
            setProducts(response.data);
        } catch (error) {
            console.error('Error applying filters:', error);
        } finally {
            setLoading(false);
            toggleFilterModal(); // Close modal after applying filters
        }
    };

    return (
        <div className='container'>
            <Navbar />
            <div className='search-container'>
                <button className="filter-button" onClick={toggleFilterModal}>Filter</button>
                <div className="searchbar">
                    <input
                        type="text"
                        className="search__input"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                </div>
            </div>

            {loading ? (
                <Loading active={true} description="Loading products..." withOverlay={true} />
            ) : (
                <>
                    {/* Carousel/Slider */}
                    <div className="carousel-container">
                        <Slider {...settings}>
                            <div className="carousel-slide">
                                <img src={Carousel1} alt="Slide 1" />
                            </div>
                            <div className="carousel-slide">
                                <img src={Carousel2} alt="Slide 2" />
                            </div>
                            <div className="carousel-slide">
                                <img src={Carousel3} alt="Slide 3" />
                            </div>
                            <div className="carousel-slide">
                                <img src={Carousel4} alt="Slide 4" />
                            </div>
                        </Slider>
                    </div>

                    {/* Product Display */}
                    <div className='product-container'>
                        {displayedProducts.length > 0 && (
                            displayedProducts.map(product => (
                                <div key={product._id} className="product-box1" onClick={() => handleProductDescription(product._id)}>
                                    <img 
                                        src={`http://localhost:3011/uploads/${product.imageUrl}`} 
                                        alt={product.name} 
                                        className="product-image1" 
                                    />
                                    <div className="product-info">
                                        <h3 className="product-name">{product.name}</h3>
                                        <p className="product-price">Rp {product.price.toLocaleString()}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Filter Modal */}
                    {isFilterModalOpen && (
                        <div className="modal-overlay" onClick={toggleFilterModal}>
                            <div className="filter-modal" onClick={e => e.stopPropagation()}>
                                <button className="close-modal" onClick={toggleFilterModal}><Close size="32" /></button>
                                <h2>Filter</h2>
                                <div className="filter-content">
                                    <div className="category-filter">
                                        <h3>Category</h3>
                                        <ul>
                                            <li>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        name="Fashion Accessories"
                                                        checked={selectedCategories.includes('Fashion Accessories')}
                                                        onChange={(e) => handleCheckboxChange(e, 'category')}
                                                    />
                                                    Fashion Accessories
                                                </label>
                                            </li>
                                            <li>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        name="Snacks & Condiments"
                                                        checked={selectedCategories.includes('Snacks & Condiments')}
                                                        onChange={(e) => handleCheckboxChange(e, 'category')}
                                                    />
                                                    Snacks & Condiments
                                                </label>
                                            </li>
                                            <li>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        name="Health & Beauty"
                                                        checked={selectedCategories.includes('Health & Beauty')}
                                                        onChange={(e) => handleCheckboxChange(e, 'category')}
                                                    />
                                                    Health & Beauty
                                                </label>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="brand-filter">
                                        <h3>Brand</h3>
                                        <ul>
                                            <li>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        name="Coach"
                                                        checked={selectedBrands.includes('Coach')}
                                                        onChange={(e) => handleCheckboxChange(e, 'brand')}
                                                    />
                                                    Coach
                                                </label>
                                            </li>
                                            <li>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        name="Kate Spade"
                                                        checked={selectedBrands.includes('Kate Spade')}
                                                        onChange={(e) => handleCheckboxChange(e, 'brand')}
                                                    />
                                                    Kate Spade
                                                </label>
                                            </li>
                                            <li>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        name="Tory Burch"
                                                        checked={selectedBrands.includes('Tory Burch')}
                                                        onChange={(e) => handleCheckboxChange(e, 'brand')}
                                                    />
                                                    Tory Burch
                                                </label>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="filter-actions">
                                    <button onClick={applyFilters} className="apply-filter-button">Apply Filters</button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
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
