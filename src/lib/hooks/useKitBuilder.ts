"use client";
import { useReducer, useMemo, useCallback } from "react";

export interface KitProduct {
  id: number; name: string; icon: string; price: number; category: string; image?: string;
}

export interface KitBuilderState {
  step:             1 | 2 | 3 | 4 | 5;
  occasion:         string;
  budget:           string;
  quantity:         number;
  selectedProducts: Set<number>;
  logoFile:         File | null;
  logoUrl:          string | null;
  brandingStyle:    string;
  aiRecommendation: string | null;
  isAILoading:      boolean;
}

type Action =
  | { type: "SET_STEP";       step: 1|2|3|4|5 }
  | { type: "SET_OCCASION";   occasion: string }
  | { type: "SET_BUDGET";     budget: string }
  | { type: "SET_QUANTITY";   quantity: number }
  | { type: "TOGGLE_PRODUCT"; id: number }
  | { type: "SET_LOGO";       file: File; url: string }
  | { type: "REMOVE_LOGO" }
  | { type: "SET_BRANDING";   style: string }
  | { type: "AI_LOADING" }
  | { type: "AI_DONE";        recommendation: string }
  | { type: "RESET" };

const initial: Omit<KitBuilderState, "selectedProducts"> = {
  step: 1, occasion: "", budget: "", quantity: 100,
  logoFile: null, logoUrl: null, brandingStyle: "Screen Print",
  aiRecommendation: null, isAILoading: false,
};

function reducer(state: KitBuilderState, action: Action): KitBuilderState {
  switch (action.type) {
    case "SET_STEP":       return { ...state, step: action.step };
    case "SET_OCCASION":   return { ...state, occasion: action.occasion };
    case "SET_BUDGET":     return { ...state, budget: action.budget };
    case "SET_QUANTITY":   return { ...state, quantity: Math.max(50, action.quantity) };
    case "SET_LOGO":       return { ...state, logoFile: action.file, logoUrl: action.url };
    case "REMOVE_LOGO":    return { ...state, logoFile: null, logoUrl: null };
    case "SET_BRANDING":   return { ...state, brandingStyle: action.style };
    case "AI_LOADING":     return { ...state, isAILoading: true };
    case "AI_DONE":        return { ...state, isAILoading: false, aiRecommendation: action.recommendation };
    case "RESET":          return { ...initial, selectedProducts: new Set() };
    case "TOGGLE_PRODUCT": {
      const s = new Set(state.selectedProducts);
      s.has(action.id) ? s.delete(action.id) : s.add(action.id);
      return { ...state, selectedProducts: s };
    }
    default: return state;
  }
}

export function useKitBuilder() {
  const [state, dispatch] = useReducer(reducer, {
    ...initial,
    selectedProducts: new Set<number>(),
  });

  const selectedCount = useMemo(() => state.selectedProducts.size, [state.selectedProducts]);

  const setStep       = useCallback((step: 1|2|3|4|5) => dispatch({ type: "SET_STEP",     step }),      []);
  const setOccasion   = useCallback((occasion: string) => dispatch({ type: "SET_OCCASION", occasion }), []);
  const setBudget     = useCallback((budget: string)   => dispatch({ type: "SET_BUDGET",   budget }),   []);
  const setQuantity   = useCallback((qty: number)      => dispatch({ type: "SET_QUANTITY", quantity: qty }), []);
  const toggleProduct = useCallback((id: number)       => dispatch({ type: "TOGGLE_PRODUCT", id }),     []);
  const setLogo       = useCallback((file: File, url: string) => dispatch({ type: "SET_LOGO", file, url }), []);
  const removeLogo    = useCallback(() => dispatch({ type: "REMOVE_LOGO" }), []);
  const setBranding   = useCallback((style: string)    => dispatch({ type: "SET_BRANDING", style }),    []);
  const reset         = useCallback(() => dispatch({ type: "RESET" }), []);

  const generateAICombo = useCallback(async (allProducts: KitProduct[]) => {
    dispatch({ type: "AI_LOADING" });
    try {
      const selected = allProducts.filter((p) => state.selectedProducts.has(p.id));
      const res = await fetch("/api/ai/generate-combo", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          products: selected.map((p) => ({ id: p.id, name: p.name, price: p.price, category: p.category })),
          occasion: state.occasion,
          budget:   state.budget,
          quantity: state.quantity,
        }),
      });
      const data = await res.json();
      dispatch({
        type:           "AI_DONE",
        recommendation: data.recommendation || "Your selected products make an excellent kit!",
      });
    } catch {
      dispatch({
        type:           "AI_DONE",
        recommendation: "AI recommendation unavailable. Your selected products look great together!",
      });
    }
  }, [state.selectedProducts, state.occasion, state.budget, state.quantity]);

  return {
    ...state,
    selectedCount,
    setStep, setOccasion, setBudget, setQuantity,
    toggleProduct, setLogo, removeLogo, setBranding,
    generateAICombo, reset,
  };
}

export type KitBuilderHook = ReturnType<typeof useKitBuilder>;
