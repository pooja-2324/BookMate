import { useSelector, useDispatch } from "react-redux";
import { fetchCart } from "../slices/cartSlice";
import AuthContext from "../context/authContext";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Header({ onSearch }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const cartCount = useSelector((state) => state.carts.length);
  const { handleLogout } = useContext(AuthContext);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch(term); // Pass the search term to the parent component (Home)
  };

  const handleCartClick = () => {
    navigate("/cart"); // Navigate to the cart page
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <h1 className="app-name">Bookmate</h1>
      </div>
      <div className="header-center">
        <input
          type="text"
          placeholder="Search by title, author, or genre..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
        />
      </div>
      <div className="header-right">
        <button className="cart-button" onClick={handleCartClick}>
          <span className="cart-icon">🛒</span>
          <span className="cart-count">{cartCount}</span>
        </button>
        <button onClick={()=>{
        const confirm=window.confirm('Logged out?')
        if(confirm){
          handleLogout()
          localStorage.removeItem('token')
          navigate('/login')
        }
       
       }
       }>Logout</button>
      </div>
    </header>
  );
}