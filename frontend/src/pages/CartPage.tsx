import React, { useState } from "react";
import { Link } from "react-router";
import Navbar from "../components/Navbar";
import CheckoutModal from "../components/CheckoutModal";
import { toast } from "react-hot-toast";
import { baseUrl } from "../utils/baseUrl";

// Import images
// import jerseyBlack from "../assets/images/jersey_black.png";
// import jerseyOrange from "../assets/images/jersey_orange.png";

import { useCart } from "../context/CartContext";

const CartPage: React.FC = () => {
    const { cartItems, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();
    const [promoCode, setPromoCode] = useState("");
    const [promoApplied, setPromoApplied] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // subtotal is now cartTotal from context
    const subtotal = cartTotal;
    const shipping = subtotal > 100 ? 0 : 10;
    const discount = promoApplied ? subtotal * 0.1 : 0;
    const total = subtotal + shipping - discount;

    const handleApplyPromo = () => {
        if (promoCode.toUpperCase() === "SAVE10") {
            setPromoApplied(true);
            toast.success("Promo code applied successfully!");
        } else {
            toast.error("Invalid promo code");
        }
    };

    const handleCheckoutSubmit = async (details: any) => {
        try {
            const orderData = {
                orderItems: cartItems.map(item => ({
                    product: item.id, // Ensure these are valid ObjectIds in a real scenario
                    name: item.name,
                    qty: item.quantity,
                    price: item.price,
                    image: item.image
                })),
                customerDetails: details,
                itemsPrice: subtotal,
                shippingPrice: shipping,
                taxPrice: 0,
                totalPrice: total,
            };

            const response = await fetch(`${baseUrl}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            const data = await response.json();

            if (response.ok) {
                setIsModalOpen(false);
                clearCart();
                toast.success("Order placed successfully! Check your email for details.", {
                    duration: 5000,
                    icon: '🎉',
                });

            } else {
                toast.error(data.message || "Failed to place order");
                console.error("Order failed:", data);
            }
        } catch (error) {
            console.error("Error placing order:", error);
            toast.error("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="cart-page">
            <Navbar />

            {/* Page Header */}
            <section className="cart-header">
                <div className="container">
                    <h1>Shopping Cart</h1>
                    <p>{cartItems.length} items in your cart</p>
                </div>
            </section>

            <section className="cart-content">
                <div className="container">
                    {cartItems.length > 0 ? (
                        <div className="cart-grid">
                            {/* Cart Items */}
                            <div className="cart-items-section">
                                <div className="cart-items-header">
                                    <span className="col-product">Product</span>
                                    <span className="col-price">Price</span>
                                    <span className="col-quantity">Quantity</span>
                                    <span className="col-total">Total</span>
                                    <span className="col-action"></span>
                                </div>

                                {cartItems.map(item => (
                                    <div key={`${item.id}-${item.size}-${item.color}`} className="cart-item">
                                        <div className="item-product">
                                            <div className="item-image">
                                                <img src={item.image} alt={item.name} />
                                            </div>
                                            <div className="item-details">
                                                <h4>{item.name}</h4>
                                                <p>Size: {item.size} | Color: {item.color}</p>
                                            </div>
                                        </div>
                                        <div className="item-price">
                                            ${item.price}.00
                                        </div>
                                        <div className="item-quantity">
                                            <button onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}>
                                                <i className="fa-solid fa-minus"></i>
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}>
                                                <i className="fa-solid fa-plus"></i>
                                            </button>
                                        </div>
                                        <div className="item-total">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </div>
                                        <button className="item-remove" onClick={() => removeFromCart(item.id, item.size, item.color)}>
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </div>
                                ))}

                                <div className="cart-actions">
                                    <Link to="/products" className="continue-shopping">
                                        <i className="fa-solid fa-arrow-left"></i>
                                        Continue Shopping
                                    </Link>
                                    <button className="clear-cart" onClick={clearCart}>
                                        Clear Cart
                                    </button>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="order-summary">
                                <h3>Order Summary</h3>

                                <div className="summary-row">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Shipping</span>
                                    <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                                </div>
                                {promoApplied && (
                                    <div className="summary-row discount">
                                        <span>Discount (10%)</span>
                                        <span>-${discount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="summary-divider"></div>
                                <div className="summary-row total">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>

                                <div className="promo-section">
                                    <input
                                        type="text"
                                        placeholder="Enter promo code"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value)}
                                        disabled={promoApplied}
                                    />
                                    <button onClick={handleApplyPromo} disabled={promoApplied}>
                                        {promoApplied ? 'Applied' : 'Apply'}
                                    </button>
                                </div>

                                <button className="checkout-btn" onClick={() => setIsModalOpen(true)}>
                                    <i className="fa-solid fa-lock"></i>
                                    Proceed to Checkout
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="empty-cart">
                            <div className="empty-cart-icon">
                                <i className="fa-solid fa-cart-shopping"></i>
                            </div>
                            <h2>Your cart is empty</h2>
                            <p>Looks like you haven't added any items to your cart yet.</p>
                            <Link to="/products" className="shop-now-btn">
                                Start Shopping
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            <CheckoutModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCheckoutSubmit}
                totalAmount={total}
            />
        </div>
    );
};

export default CartPage;
