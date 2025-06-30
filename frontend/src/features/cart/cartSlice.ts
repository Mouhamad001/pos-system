import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  taxRate: number;
  discountAmount: number;
  paymentMethod: 'cash' | 'card' | 'mobile_payment';
}

const initialState: CartState = {
  items: [],
  taxRate: 0.1, // 10% tax
  discountAmount: 0,
  paymentMethod: 'cash',
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) => item.product === action.payload.product
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item.product !== action.payload
      );
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ product: string; quantity: number }>
    ) => {
      const item = state.items.find(
        (item) => item.product === action.payload.product
      );
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    setDiscountAmount: (state, action: PayloadAction<number>) => {
      state.discountAmount = action.payload;
    },
    setPaymentMethod: (
      state,
      action: PayloadAction<'cash' | 'card' | 'mobile_payment'>
    ) => {
      state.paymentMethod = action.payload;
    },
    clearCart: (state) => {
      state.items = [];
      state.discountAmount = 0;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  setDiscountAmount,
  setPaymentMethod,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;