import { Link, Routes, Route } from 'react-router-dom';
import './App.css';
import Register from './pages/register';
import Login from './pages/login';
import Home from './pages/home';
import Dashboard from './pages/dashboard';

function App() {
  return (
    <div className="App">
      <h1>BOOKMATE</h1>
      <ul className='links'>
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/register">Register</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
      </ul>

       <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard/>}/>
        
      </Routes>
    </div>
  );
}

export default App;
