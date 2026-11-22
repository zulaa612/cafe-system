
"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import { useAuth } from "@clerk/nextjs";
import type { CartItem, CartProduct } from "@/lib/cart-type";

type CartContextType = {
    items: CartItem[];
    count: number;
    total: number;
    ready: boolean;
    addItem: (product: CartProduct) => void;
    increase: (id: string) => void;
    decrease: (id: string) => void;
    removeItem: (id: string) => void;
    clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

const MAX_QUANTITY = 20;

function readCart(key: string): CartItem[] {
    try {
        const stored = localStorage.getItem(key);
        if (!stored) return [];

        const parsed: unknown = JSON.parse(stored);
        if (!Array.isArray(parsed)) return [];

        return parsed.filter(
            (item): item is CartItem =>
                item !== null &&
                typeof item === "object" &&
                typeof item.id === "string" &&
                typeof item.name === "string" &&
                typeof item.price === "number" &&
                Number.isSafeInteger(item.price) &&
                item.price > 0 &&
                (item.imageUrl === null ||
                    typeof item.imageUrl === "string") &&
                Number.isInteger(item.quantity) &&
                item.quantity >= 1 &&
                item.quantity <= MAX_QUANTITY
        );
    } catch {
        return [];
    }
}

export function CartProvider({ children }: { children: ReactNode }) {
    const { isLoaded, userId } = useAuth();
    const key = isLoaded && userId ? `coffee-cart:${userId}` : null;

    const [cart, setCart] = useState<{
        key: string;
        items: CartItem[];
    } | null>(null);

    const ready = key !== null && cart?.key === key;
    const items = ready ? cart.items : [];

    useEffect(() => {
        if (!key) return;

        const timeout = setTimeout(() => {
            setCart({
                key,
                items: readCart(key),
            });
        }, 0);

        return () => clearTimeout(timeout);
    }, [key]);

    useEffect(() => {
        if (!key || !ready || !cart) return;
        localStorage.setItem(key, JSON.stringify(cart.items));
    }, [key, ready, cart]);

    function updateItems(fn: (previous: CartItem[]) => CartItem[]) {
        if (!key) return;

        setCart((previous) => {
            if (!previous || previous.key !== key) return previous;
            return { key, items: fn(previous.items) };
        });
    }

    function addItem(product: CartProduct) {
        updateItems((previous) => {
            const existing = previous.find((item) => item.id === product.id);

            if (existing) {
                return previous.map((item) =>
                    item.id === product.id
                        ? {
                            ...item,
                            quantity: Math.min(item.quantity + 1, MAX_QUANTITY),
                        }
                        : item
                );
            }

            if (previous.length >= 30) return previous;
            return [...previous, { ...product, quantity: 1 }];
        });
    }

    function increase(id: string) {
        updateItems((previous) =>
            previous.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        quantity: Math.min(item.quantity + 1, MAX_QUANTITY),
                    }
                    : item
            )
        );
    }

    function decrease(id: string) {
        updateItems((previous) =>
            previous
                .map((item) =>
                    item.id === id
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    }

    function removeItem(id: string) {
        updateItems((previous) =>
            previous.filter((item) => item.id !== id)
        );
    }

    function clearCart() {
        updateItems(() => []);
    }

    const count = items.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                items,
                count,
                total,
                ready,
                addItem,
                increase,
                decrease,
                removeItem,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error("useCart must be used inside CartProvider");
    }

    return context;
}
