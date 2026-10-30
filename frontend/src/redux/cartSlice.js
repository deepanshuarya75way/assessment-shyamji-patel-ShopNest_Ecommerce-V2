import { createSlice } from '@reduxjs/toolkit';

// User-wise localStorage key
const getCartKey = () => {
  const user = JSON.parse(localStorage.getItem('userInfo'));
  return user ? `cartItems_${user._id}` : 'cartItems_guest';
};

const loadCartItems = () => {
  const cart = localStorage.getItem(getCartKey());
  return cart ? JSON.parse(cart) : [];
};

const initialState = {
  cartItems: loadCartItems(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,

  reducers: {
    // Login/Logout ke baad correct cart load karega
    loadCart: (state) => {
      state.cartItems = loadCartItems();
    },

    addToCart: (state, action) => {
      const item = action.payload;

      const existItem = state.cartItems.find(
        (x) => x._id === item._id
      );

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === item._id
            ? {
                ...x,
                qty: item.qty
              }
            : x
        );
      } else {
        state.cartItems.push(item);
      }

      localStorage.setItem(
        getCartKey(),
        JSON.stringify(state.cartItems)
      );
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (x) => x._id !== action.payload
      );

      localStorage.setItem(
        getCartKey(),
        JSON.stringify(state.cartItems)
      );
    },

    clearCart: (state) => {
      state.cartItems = [];

      localStorage.setItem(
        getCartKey(),
        JSON.stringify([])
      );
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  loadCart,
} = cartSlice.actions;

export default cartSlice.reducer;