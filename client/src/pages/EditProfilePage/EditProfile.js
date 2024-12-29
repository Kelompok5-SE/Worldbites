import React, { useState, useEffect } from "react";
import axios from "axios";
import './EditProfile.css';
import Navbar from '../../components/Navbar/Navbar';
import profileImage from '../../assets/profile.svg';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EditProfile() {

  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    profilePicture: ''
  });
  const [photo, setPhoto] = useState(null);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:3011/user', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const userData = response.data;
      setProfile({
        name: userData.name || '',
        phone: userData.phoneNumber || '',
        email: userData.email,
        address: userData.address || '',
        profilePicture: userData.profilePicture || '',
      });
    } catch (error) {
      console.error('Error fetching user data', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const selectedPhoto = e.target.files[0];
    setPhoto(selectedPhoto);

    if (selectedPhoto) {
      const imageUrl = URL.createObjectURL(selectedPhoto);
      setProfile((prevProfile) => ({ ...prevProfile, profilePicture: imageUrl }));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', profile.name);
    formData.append('phone', profile.phone);
    formData.append('email', profile.email);
    formData.append('address', profile.address);

    if (photo) {
      formData.append('profilePicture', photo);
    }

    try {
      const response = await axios.post('http://localhost:3011/updateprofile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      toast.success('Profile updated successfully!');
      window.location.reload();
      setProfile(response.data);
    } catch (error) {
      console.error('Error saving profile', error);
      toast.error('Error saving profile');
    }
  };

  return (
    <div className="container-editprofile">
      <Navbar />
      <div className="edit-profile-wrapper">
        <div className="edit-profile-content">
          <div className="profile-section">
            <div className="profile-pic">
              <img
                src={profile.profilePicture || profileImage}
                alt="Profile"
              />
            </div>
            <button
              type="button"
              className="change-photo-btn"
              onClick={() => document.getElementById('photo-upload').click()}
            >
              Change Photo
            </button>
            <input
              id="photo-upload"
              type="file"
              onChange={handlePhotoChange}
              style={{ display: 'none' }}
            />
          </div>

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="input-group">
              <label>Name</label>
              <input type="text" name="name" value={profile.name} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Phone Number</label>
              <input type="text" name="phone" value={profile.phone} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Email</label>
              <input type="email" name="email" value={profile.email} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Address</label>
              <textarea name="address" value={profile.address} onChange={handleChange}></textarea>
            </div>

          </form>
        </div>
        <div className="button-section">
          <button type="submit" className="save-btn" onClick={handleSubmit}>SAVE</button>
        </div>
      </div>
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
