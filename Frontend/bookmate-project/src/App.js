
import './App.css';
import PrivateRoute from './components/privateRoute';
import Login from './pages/login';
import Register from './pages/register';
import Home from './pages/home';
import MyBooks from './pages/v-home';
import Upload from './pages/v-upload';
import VDashboard from './pages/v-dashboard';
import Earnings from './pages/earnings';
import RentDetails from './pages/rentDetails';
import Rent from './pages/rent';
import DueDateCalender from './pages/calender';
import RentNow from './pages/rent-now';
import Cart from './pages/cart';
import PlaceOrder from './pages/place-order';
import OrderConfirm from './pages/order-confirm';
import MyOrders from './pages/my-orders';
import ClientBook from './pages/client-book'
import ReviewDetails from './pages/reviewDetails';
import BuyNow from './pages/buy-now';
import DirectOrderPlacing from './pages/direcct-orderplace';
import Header from './components/header';

import { Link,Route,Routes, useNavigate } from 'react-router-dom';
import { useContext,useState } from 'react';
import AuthContext from './context/authContext';
function App() {
  const {handleLogout,userState}=useContext(AuthContext)
 
  const navigate=useNavigate()
  console.log('userstate',userState)
  return (
    <div className="App">
     
      {/* <Home searchTerm={searchTerm} /> */}
      <ul className='links'>
      {userState?.user?.role=='client'?<>
     </>:<></>}
      {}
      
        {userState&&userState.isLoggedIn?<>
        {userState.user.role=='vendor'&&<li><Link to ='/vdashboard'>VDashboard</Link></li>}
        {userState.user.role=='vendor'&&<li><Link to="/vhome">MyBooks</Link></li>}
        {userState.user.role=='vendor'&&<li><Link to='/calender'>DueDateCalender</Link></li>}
        {userState.user.role=='vendor'&&<li><Link to='/clientBook'>ClientBook</Link></li>}

        
        
        
       </>:<></>}
       {/* <li><Link to="/login">Login</Link></li>
          <li><Link to="/register">Register</Link></li> */}
       
        
       
       
       
      </ul>
      
      <Routes>
        <Route path='/' element={<PrivateRoute permittedRole={['client']}><Home /></PrivateRoute>} />
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path="/vhome" element={<PrivateRoute permittedRole={['vendor']}><MyBooks/></PrivateRoute>}/>
        <Route path="/upload" element={<PrivateRoute  permittedRole={['vendor']}><Upload/></PrivateRoute>}/>
        <Route path='/vdashboard' element={<PrivateRoute permittedRole={['vendor']}><VDashboard/></PrivateRoute>}/>
        <Route path='/earnings' element={<PrivateRoute><Earnings/></PrivateRoute>}/>
        <Route path='/book/:bid/uploadrentDetails' element={<PrivateRoute><RentDetails/></PrivateRoute>}/>
        <Route path='/book/:bid/rent' element={<PrivateRoute><Rent/></PrivateRoute>}/>
        <Route path='/calender' element={<PrivateRoute><DueDateCalender/></PrivateRoute>}/>
        <Route path='/book/:bid/rentnow' element={<PrivateRoute><RentNow/></PrivateRoute>}/>
        <Route path='/cart' element={<PrivateRoute><Cart/></PrivateRoute>}/>
        <Route path='/order-placing' element={<PrivateRoute><PlaceOrder/></PrivateRoute>}/>
        <Route path='/order-confirm' element={<PrivateRoute><OrderConfirm/></PrivateRoute>}/>
        <Route path='/my-orders' element={<PrivateRoute><MyOrders/></PrivateRoute>}/>
        <Route path='/clientBook' element={<PrivateRoute><ClientBook/></PrivateRoute>}/>
        <Route path='/review/:bid' element={<PrivateRoute><ReviewDetails/></PrivateRoute>}/>
        <Route path='/book/:bid/buynow' element={<PrivateRoute><BuyNow/></PrivateRoute>}/>
        <Route path='/book/:bid/orderplacing' element={<PrivateRoute><DirectOrderPlacing/></PrivateRoute>}/>
      </Routes>
      
    </div>
  );
}

export default App;
