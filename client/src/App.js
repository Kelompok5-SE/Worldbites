
import './App.css';
import Homepage from './pages/LandingPage/LandingPage';
import Login from './pages/LoginPage/Login';
import Register from './pages/RegisterPage/Register';
import Cart from './pages/CartPage/Cart';
import Chat from './pages/ChatPage/Chat';
import ForgotPassword from './pages/ForgotPasswordPage/ForgotPassword';
import ResetPassword from './pages/ResetPasswordPage/ResetPassword';
import OtpPage from './pages/OTPPage/Otp';
import EditProfile from './pages/EditProfilePage/EditProfile';
import JoinJastip from './pages/JoinJastipPage/JoinJastip';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChangePassword from './pages/ChangePasswordPage/ChangePassword';
import HomepageJastip from './pages/HomepageJastipPage/HomepageJastip';
import ProductJastip from './pages/ProductJastipPage/ProductJastip';
import AddBatch from './pages/AddBatchPage/AddBatch';
import AddProduct from './pages/AddProductPage/AddProduct';
import ProductDescription from './pages/ProductDescriptionPage/ProductDescription';
import ProductInfo from './pages/ProductInfoPage/ProductInfo';
import EditStoreProfile from './pages/EditStoreProfilePage/EditStoreProfile';
import ViewStore from './pages/ViewStorePage/ViewStore';
import Checkout from './pages/CheckoutPage/Checkout';
import OrderHistory from './pages/OrderHistoryPage/OrderHistory';
import CustomerOrder from './pages/CustomerOrderPage/CustomerOrder'
import CompleteOrder from './pages/CompleteOrderPage/CompleteOrder';
import NetIncome from './pages/NetIncomePage/NetIncome';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />}/>
        <Route path="/cart" element={<Cart />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/otp" element={<OtpPage />} />
        <Route path="/editprofile" element={<EditProfile/>} />
        <Route path="/changepassword" element={<ChangePassword/>} />
        <Route path="/joinjastip" element={<JoinJastip />} />
        <Route path="/homepagejastip" element={<HomepageJastip />} />
        <Route path="/productjastip" element= {<ProductJastip/>} />
        <Route path="/addbatch" element={<AddBatch />} />
        <Route path="/addproduct" element={<AddProduct />} />
        <Route path="/productdescription/:id" element={<ProductDescription />} />
        <Route path="/productinfo/:id" element={<ProductInfo />} />
        <Route path="/editstoreprofile" element={<EditStoreProfile />} />
        <Route path="/viewstore" element={<ViewStore />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orderhistory" element={<OrderHistory />} />
        <Route path="/customerorder" element={<CustomerOrder />}/>
        <Route path="/completeorder" element={<CompleteOrder/>}/>
        <Route path="/netincome" element={<NetIncome/>}/>
      </Routes>
    </Router>
  );
}

export default App;

