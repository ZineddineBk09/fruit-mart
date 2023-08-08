import { Product } from "@/interfaces/products";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem extends Product {
  quantity: number;
}

type CartState = {
  items: CartItem[];
  total: number;
  numberOfItems: number;
};

const initialState: CartState = {
  items: [],
  total: 0,
  numberOfItems: 0,
};

const loadCartFromLocalStorage = () => {
  const cartData = localStorage.getItem("cart");
  if (cartData) {
    return JSON.parse(cartData);
  }
  return initialState;
};

export const cart = createSlice({
  name: "cart",
  initialState: initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const { id, name, price, quantity } = action.payload;
      const existingItem = state.items.find((item: any) => item.id === id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          ...action.payload,
          quantity,
        });
      }

      state.total += price * quantity;
      state.numberOfItems += quantity;

      // save to local storage
      //localStorage.setItem("cart", JSON.stringify(state));
    },

    removeItem: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      const removedItem: any = state.items.find(
        (item: any) => item.id === itemId
      );

      if (removedItem) {
        state.total -= removedItem.price * removedItem.quantity;
        state.numberOfItems -= removedItem.quantity;
        state.items = state.items.filter((item: any) => item.id !== itemId);
      }

      // save to local storage
     // localStorage.setItem("cart", JSON.stringify(state));
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item: any) => item.id === id);

      if (item) {
        state.total -= item.price * item.quantity;
        state.numberOfItems -= item.quantity;

        item.quantity = quantity;

        state.total += item.price * item.quantity;
        state.numberOfItems += item.quantity;
      }

      // save to local storage
      //localStorage.setItem("cart", JSON.stringify(state));
    },

    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.numberOfItems = 0;

      // save to local storage
      localStorage.setItem("cart", JSON.stringify(state));
    },

    // load cart from local storage
    loadCart: (state) => {
      const cart = localStorage.getItem("cart");

      if (cart) {
        const { items, total, numberOfItems } = JSON.parse(cart);
        state.items = items;
        state.total = total;
        state.numberOfItems = numberOfItems;
      }
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart, loadCart } =
  cart?.actions;
export default cart?.reducer;
