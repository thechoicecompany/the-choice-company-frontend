"use client";
// ─── CART STORE ───────────────────────────────────────────────────────────────
// Global cart state using useReducer + localStorage persistence.
// This is the ONLY source of truth for cart data across the entire app.
// Import useCart() in any component to read/modify cart.
//
// DEMO PURCHASE CONCEPT:
//   - Client buys 1 sample unit (or minimum demo qty: 1–5 units)
//   - Price = sample_price (higher per-unit than bulk, covers production + shipping)
//   - After purchase → CTA to upgrade to bulk order
//   - Payment via Razorpay

import { useReducer, useEffect, useCallback, useMemo, createContext, useContext } from "react";

// ── TYPES ────────────────────────────────────────────────────────────────────
export interface CartItem {
  id:          number;
  name:        string;
  slug:        string;
  image:       string;
  category:    string;
  samplePrice: number;   // per-unit price for demo purchase (higher than bulk)
  quantity:    number;   // qty in cart (1 to maxSampleQty)
  maxSampleQty:number;   // max demo units allowed (e.g. 5)
  moq:         number;   // bulk MOQ (shown as upsell)
}

interface CartState {
  items: CartItem[];
  coupon: string | null;
  discount: number; // percentage
}

type CartAction =
  | { type: "ADD";      item: Omit<CartItem, "quantity"> }
  | { type: "REMOVE";   id: number }
  | { type: "UPDATE";   id: number; quantity: number }
  | { type: "CLEAR" }
  | { type: "SET_COUPON"; code: string; discount: number }
  | { type: "REMOVE_COUPON" }
  | { type: "HYDRATE";  state: CartState };

const STORAGE_KEY = "tcc_cart_v1";

const initialState: CartState = { items: [], coupon: null, discount: 0 };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE": return action.state;

    case "ADD": {
      const exists = state.items.find(i => i.id === action.item.id);
      if (exists) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.item.id
              ? { ...i, quantity: Math.min(i.quantity + 1, i.maxSampleQty) }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.item, quantity: 1 }] };
    }

    case "REMOVE":
      return { ...state, items: state.items.filter(i => i.id !== action.id) };

    case "UPDATE":
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.id
            ? { ...i, quantity: Math.max(1, Math.min(action.quantity, i.maxSampleQty)) }
            : i
        ),
      };

    case "CLEAR":
      return { ...state, items: [], coupon: null, discount: 0 };

    case "SET_COUPON":
      return { ...state, coupon: action.code, discount: action.discount };

    case "REMOVE_COUPON":
      return { ...state, coupon: null, discount: 0 };

    default: return state;
  }
}

// ── CONTEXT ───────────────────────────────────────────────────────────────────
interface CartContextValue {
  items:        CartItem[];
  itemCount:    number;
  subtotal:     number;
  discount:     number;
  coupon:       string | null;
  total:        number;
  addItem:      (item: Omit<CartItem, "quantity">) => void;
  removeItem:   (id: number) => void;
  updateQty:    (id: number, qty: number) => void;
  clearCart:    () => void;
  applyCoupon:  (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  isInCart:     (id: number) => boolean;
  getItem:      (id: number) => CartItem | undefined;
}

const CartContext = createContext<CartContextValue | null>(null);

// ── PROVIDER ──────────────────────────────────────────────────────────────────
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) dispatch({ type: "HYDRATE", state: JSON.parse(saved) });
    } catch {}
  }, []);

  // Persist to localStorage on every change
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }, [state]);

  // Derived values
  const itemCount = useMemo(() => state.items.reduce((s, i) => s + i.quantity, 0), [state.items]);
  const subtotal  = useMemo(() => state.items.reduce((s, i) => s + i.samplePrice * i.quantity, 0), [state.items]);
  const discountAmt = Math.round((subtotal * state.discount) / 100);
  const total     = subtotal - discountAmt;

  const addItem     = useCallback((item: Omit<CartItem, "quantity">) => dispatch({ type: "ADD", item }), []);
  const removeItem  = useCallback((id: number) => dispatch({ type: "REMOVE", id }), []);
  const updateQty   = useCallback((id: number, quantity: number) => dispatch({ type: "UPDATE", id, quantity }), []);
  const clearCart   = useCallback(() => dispatch({ type: "CLEAR" }), []);
  const removeCoupon= useCallback(() => dispatch({ type: "REMOVE_COUPON" }), []);
  const isInCart    = useCallback((id: number) => state.items.some(i => i.id === id), [state.items]);
  const getItem     = useCallback((id: number) => state.items.find(i => i.id === id), [state.items]);

  const applyCoupon = useCallback(async (code: string): Promise<boolean> => {
    // Simple coupon logic — replace with API call in production
    const COUPONS: Record<string, number> = {
      "SAMPLE10": 10,
      "FIRST15":  15,
      "TCC20":    20,
    };
    const discount = COUPONS[code.toUpperCase()];
    if (discount) {
      dispatch({ type: "SET_COUPON", code: code.toUpperCase(), discount });
      return true;
    }
    return false;
  }, []);

  return (
    <CartContext.Provider value={{
      items: state.items, itemCount, subtotal,
      discount: discountAmt, coupon: state.coupon, total,
      addItem, removeItem, updateQty, clearCart,
      applyCoupon, removeCoupon, isInCart, getItem,
    }}>
      {children}
    </CartContext.Provider>
  );
}

// ── HOOK ──────────────────────────────────────────────────────────────────────
export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
