import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './Chat.css';
import Navbar from '../../components/Navbar/Navbar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Chat() {
    const [conversations, setConversations] = useState([]);
    const [filteredConversations, setFilteredConversations] = useState([]); // New state for filtered conversations
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const [isSellerMode, setIsSellerMode] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const isJastipLoggedIn = localStorage.getItem('isJastipLoggedIn') === 'true';
        setIsSellerMode(isJastipLoggedIn);

        if (token) {
            const decodedToken = jwtDecode(token);
            setLoggedInUserId(decodedToken.userId);
            fetchConversations(isJastipLoggedIn);
        }
    }, []);

    const fetchConversations = async (isSellerMode) => {
        try {
            const response = await axios.get(`http://localhost:3011/chat/conversations`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                params: { isSellerMode }
            });
            setConversations(response.data); // Set original conversations
            setFilteredConversations(response.data); // Initialize filtered conversations
        } catch (error) {
            console.error('Error fetching conversations:', error);
            toast.error('Failed to load conversations.');
        }
    };

    const fetchMessages = async (chatId) => {
        try {
            const response = await axios.get(`http://localhost:3011/chat/${chatId}/messages`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
            toast.error('Failed to load messages.');
        }
    };

    const selectConversation = (conversation) => {
        setSelectedConversation(conversation);
        fetchMessages(conversation._id);
    };

    const handleSearch = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        if (searchTerm.trim() === "") {
            setFilteredConversations(conversations); // Reset to all conversations if search is cleared
        } else {
            const filtered = conversations.filter(convo =>
                isSellerMode
                    ? convo.buyer?.name?.toLowerCase().includes(searchTerm)
                    : convo.seller?.storeName?.toLowerCase().includes(searchTerm)
            );
            setFilteredConversations(filtered);
        }
    };

    const handleSendMessage = async () => {
        if (newMessage.trim() === '') return;

        try {
            const response = await axios.post(`http://localhost:3011/chat/${selectedConversation._id}/sendMessage`, 
                { message: newMessage },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );

            // Add the new message to the messages array with the correct sender
            setMessages([...messages, { ...response.data.message, sender: { _id: loggedInUserId } }]);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message.');
        }
    };

    return (
        <div className="container-chat">
            <Navbar />
            <div className="chat-wrapper">
                <div className="chat-sidebar">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search"
                        onChange={handleSearch} // Use the new search handler
                    />
                    <div className="user-list">
                        {filteredConversations.map((convo) => (
                            <div key={convo._id} className="user-item" onClick={() => selectConversation(convo)}>
                                <img
                                    src={`http://localhost:3011/uploads/${isSellerMode ? convo.buyer?.profilePicture : convo.seller?.storePicture}`}
                                    alt="avatar"
                                    className="user-avatar"
                                />
                                <div className="user-info">
                                    <p className="user-name">
                                        {isSellerMode ? convo.buyer?.name : convo.seller?.storeName}
                                    </p>
                                    <p className="user-last-message">{convo.lastMessage}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="chat-content">
                    {selectedConversation ? (
                        <>
                            <h2 className="chat-header">
                                Messages with {isSellerMode ? selectedConversation.buyer?.name : selectedConversation.seller?.storeName}
                            </h2>
                            <div className="message-list">
                                {messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`chat-message ${msg.sender._id === loggedInUserId ? 'sent' : 'received'}`}
                                    >
                                        <p>{msg.message}</p>
                                        <span className="message-time">
                                            {new Date(msg.timestamp).toLocaleTimeString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="chat-input">
                                <input
                                    type="text"
                                    placeholder="Type your message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <button className="send-button" onClick={handleSendMessage}>Send</button>
                            </div>
                        </>
                    ) : (
                        <h2 className="chat-header">Select a conversation to start chatting</h2>
                    )}
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
