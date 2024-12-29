import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddProduct.css';
import Navbar from '../../components/Navbar/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function AddProduct() {
    const location = useLocation();
    const { batchId } = location.state || {};

    const navigate = useNavigate();

    const [selectedFile, setSelectedFile] = useState(null);
    const [productName, setProductName] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [details, setDetails] = useState('');
    const [price, setPrice] = useState('');
    const [batchIdState, setBatchId] = useState(batchId || '');
    const [batches, setBatches] = useState([]);

    const categories = [
        "Food & Beverages",
        "Fashion & Accessories",
        "Beauty & Personal Care",
        "Electronics & Gadgets",
        "Toys & Hobbies",
        "Home & Decoration",
        "Health & Fitness",
        "Books & Stationery",
        "Baby & Kids Products"
    ];

    const availableBrands = [
        // Tas
        "Louis Vuitton", "Gucci", "Hermès", "Prada", "Chanel", "Fendi", "Coach", "Michael Kors", "Balenciaga","Dior",
        
        // Snack
        "Lays", "Doritos", "Pringles", "KitKat", "Oreo", "Toblerone", "Milka", "Snickers", "Cadbury",
        
        // Skincare
        "The Ordinary", "Laneige", "SK-II", "Innisfree", "Clinique", "Cetaphil", "La Roche-Posay", "Neutrogena", "Estee Lauder"
    ];
    

    const [filteredBrands, setFilteredBrands] = useState([]);
    const [isBrandDropdownVisible, setIsBrandDropdownVisible] = useState(false);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleLabelClick = () => {
        document.getElementById('file-input').click();
    };

    // Filter brands based on user input
    const handleBrandSearch = (e) => {
        const input = e.target.value;
        setBrand(input);

        if (input) {
            const filtered = availableBrands.filter((b) =>
                b.toLowerCase().includes(input.toLowerCase())
            );
            setFilteredBrands(filtered);
            setIsBrandDropdownVisible(true);
        } else {
            setFilteredBrands([]);
            setIsBrandDropdownVisible(false);
        }
    };

    const handleBrandSelect = (selectedBrand) => {
        setBrand(selectedBrand);
        setIsBrandDropdownVisible(false);
    };

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append('productName', productName);
            formData.append('price', price);
            formData.append('brand', brand);
            formData.append('category', category);
            formData.append('details', details);
            formData.append('imageUrl', selectedFile);
            formData.append('batchId', batchIdState); // Use the selected batch ID
    
            const response = await axios.post(
                `http://localhost:3011/batch/add-product`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
    
            if (response.status === 200) {
                console.log('Product added successfully', response.data);
                toast.success('Product added successfully!');
                // Reset the form fields
                setProductName('');
                setBrand('');
                setCategory('');
                setDetails('');
                setPrice('');
                setSelectedFile(null); // Clear the selected file
                setBatchId(batchId || ''); // Reset batch ID if needed
                navigate('/productjastip');
            }
        } catch (error) {
            console.error('Error adding product:', error);
            toast.error('Failed to add product. Please try again.');
        }
    };

    return (
        <div className='container-addproduct'>
            <Navbar />
            <div className="wrapper">
                <h2 className="title">Add Product</h2>

                <div className="photo-form-container">
                    <div className="photo-container">
                        <label className="add-photo-box" onClick={handleLabelClick}>
                            {selectedFile ? (
                                <img src={URL.createObjectURL(selectedFile)} alt="Uploaded" className="uploaded-image" />
                            ) : (
                                <>
                                    <span className="plus-icon">+</span>
                                    <p>Add photo</p>
                                </>
                            )}
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            id="file-input"
                            style={{ display: 'none' }}
                        />
                    </div>
                    <div className="form-fields">
                        <div className="label-input-container">
                            <p>Product Name:</p>
                            <input type="text" className="input-field" value={productName} onChange={(e) => setProductName(e.target.value)} />
                        </div>
                        <div className="label-input-container">
                            <p>Brand:</p>
                            <input 
                                type="text" 
                                className="input-field" 
                                value={brand} 
                                onChange={handleBrandSearch} 
                                onFocus={() => setIsBrandDropdownVisible(true)} 
                            />
                            {isBrandDropdownVisible && filteredBrands.length > 0 && (
                                <ul className="brand-dropdown">
                                    {filteredBrands.map((b) => (
                                        <li key={b} onClick={() => handleBrandSelect(b)}>
                                            {b}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="label-input-container">
                            <p>Category:</p>
                            <select className="input-field" value={category} onChange={(e) => setCategory(e.target.value)}>
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="label-input-container">
                            <p>Details:</p>
                            <textarea className="textarea-field" value={details} onChange={(e) => setDetails(e.target.value)} />
                        </div>
                        <div className="label-input-container">
                            <p>Price:</p>
                            <input type="number" placeholder="IDR" className="input-field" value={price} onChange={(e) => setPrice(e.target.value)} />
                        </div>
                        
                    </div>
                    
                </div>
                <button className="add-button" onClick={handleSubmit}>Add</button>
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
                theme="colored"
            />
        </div>
    );
}