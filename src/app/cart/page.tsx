"use client";

import { useCheckout } from "./hooks/use-checkout";
import CartContent from "@/components/cart/cart-content";
import OrderSuccess from "@/components/order/order-success";

export default function CartPage() {
    const checkout = useCheckout();

    if (checkout.orderId) {
        return (
            <OrderSuccess
                orderId={checkout.orderId}
                paying={checkout.paying}
                error={checkout.error}
                onPay={checkout.payOrder}
            />
        );
    }

    return (
        <CartContent
            placing={checkout.placing}
            error={checkout.error}
            onCheckout={checkout.placeOrder}
        />
    );
}