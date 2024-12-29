import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProductDescription.css';
import Navbar from '../../components/Navbar/Navbar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ProductDescription() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [formData, setFormData] = useState({});
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null); // State for image preview
    const navigate = useNavigate();

    const fetchProductDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:3011/getproductdescription/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
            });
            setProduct(response.data);
            setFormData(response.data);
            setImagePreview(`http://localhost:3011/uploads/${response.data.imageUrl}`); // Set initial image preview
        } catch (error) {
            console.error('Error fetching product details:', error);
        }
    };

    useEffect(() => {
        if (id) {
            fetchProductDetails();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file); // Store the selected file
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result); // Set image preview
            };
            reader.readAsDataURL(file);
        }
    };
    

    const handleSave = async () => {

        const hasChanges =
            formData.name !== product.name ||
            formData.price !== product.price ||
            formData.brand !== product.brand ||
            formData.category !== product.category ||
            formData.details !== product.details ||
            (image && image.name !== product.imageUrl);

        if (!hasChanges) {
            toast.error('No changes applied.');
            setTimeout(() => {
                navigate('/productjastip');
            }, 1000);
            return;
        }


        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('price', formData.price);
        formDataToSend.append('brand', formData.brand);
        formDataToSend.append('category', formData.category);
        formDataToSend.append('details', formData.details);
        if (image) {
            formDataToSend.append('productimage', image);
        }

        try {
            const response = await axios.put(`http://localhost:3011/updateproductdescription/${id}`, formDataToSend, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                },
            });
            console.log('Product updated:', response.data);
            toast.success('Product updated successfully!');
            setTimeout(() => {
                navigate('/productjastip');
            }, 1000);
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`http://localhost:3011/deleteproductdescription/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                });
                toast.success('Product deleted successfully!');
                setTimeout(() => {
                    navigate('/productjastip');
                }, 1000);
            } catch (error) {
                    toast.error('Error deleting product. Please try again.');
            }
        }
    };

    return (
        <div className='container-productdescription'>
            <Navbar />
            <div className="product-description-form">
                <h2>Product Description</h2>
                <div className="form-container">
                    <div className="left-section">
                        <div className="add-photo">
                            <img
                                src={imagePreview || `http://localhost:3011/uploads/${product?.imageUrl}`}
                                alt={product?.name}
                            />
                        </div>
                        <input
                            type="file"
                            id="file-input"
                            style={{ display: 'none' }} // Hide the file input
                            onChange={handleImageChange}
                        />
                        <button
                            className="edit-photo-btn"
                            onClick={() => document.getElementById('file-input').click()}
                        >
                            Edit Photo
                        </button>
                    </div>
                    <div className="right-section">
                        <div className="form-group">
                            <label htmlFor="productName">Product Name:</label>
                            <input
                                type="text"
                                id="productName"
                                name="name"
                                value={formData.name || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="brand">Brand:</label>
                            <input
                                type="text"
                                id="brand"
                                name="brand"
                                value={formData.brand || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="category">Category:</label>
                            <input
                                type="text"
                                id="category"
                                name="category"
                                value={formData.category || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="details">Details:</label>
                            <textarea
                                id="details"
                                name="details"
                                value={formData.details || ''}
                                onChange={handleChange}
                            ></textarea>
                        </div>
                        <div className="form-group">
                            <label htmlFor="price">Price:</label>
                            <input
                                type="text"
                                id="price"
                                name="price"
                                value={formData.price || ''}
                                onChange={handleChange}
                                placeholder="IDR"
                            />
                        </div>
                    </div>
                </div>
                <div className="button-group-productdescription">
                    <button type="button" className="save-btn1" onClick={handleSave}>Save</button>
                    <button type="button" className="delete-btn" onClick={handleDelete}>Delete</button>
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
