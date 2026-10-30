import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import{AuthContext} from '../context/AuthContext';
import{useSelector} from 'react-redux';
import "../styles/navbar.css";

const Navbar = () => {
  const {user, logout} = useContext(AuthContext);
  const cartItems =useSelector((state) => state.cart.cartItems);
  const navigate = useNavigate();

  const handleLogout = () =>{
    logout();
    navigate('/login');
  };
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
        <img src="https://i.pinimg.com/736x/d3/f3/77/d3f377afd7264a84ee9e7e13eb66ced0.jpg" alt="ShopNestLogo" className="navbar-logo" />
        ShopNest</Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/shop">Shop</Link></li>
        <li><Link to ="/cart">Cart({cartItems.length})</Link></li>
        
        {user ? (
          <>
            <li><Link to ="/profile">Hi, {user.name}</Link></li>
            {user.role === 'admin' && <li><Link to="/admin">Admin</Link></li>}
            <li>
              <button onClick={handleLogout} className="btn-logout">Logout</button>
            </li>
          </>
        ) : (
          <li><Link to ="/login">Login</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;