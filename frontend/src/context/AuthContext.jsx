import React, { useState, createContext } from 'react';
import { useDispatch } from 'react-redux';
import { loadCart } from '../redux/cartSlice';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("userInfo")) || null
  );

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("userInfo", JSON.stringify(userData));

    // Logged-in user ka cart load karo
    dispatch(loadCart());
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userInfo");

    // Guest cart load karo
    dispatch(loadCart());
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};