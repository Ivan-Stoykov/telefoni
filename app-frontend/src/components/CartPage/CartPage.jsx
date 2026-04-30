import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { FiTrash2 } from 'react-icons/fi';
import './CartPage.css';

const CartPage = () => {
    const { cartItems, removeFromCart, addToCart, decreaseQuantity } = useCart();

    // Пресмятаме общата сума на всички продукти в количката
    const orderValue = cartItems.reduce((total, item) => {
        // Взимаме цената (подсигуряваме се, че е число)
        const price = Number(item.price || item.phone_spec?.price || 0);
        return total + (price * item.quantity);
    }, 0);

    const fallbackImage = "/images/asni.jpg";

    return (
        <div className="cart-page-container py-5">
            <div className="container-fluid px-4 px-lg-5" style={{ maxWidth: '1600px' }}>

                {/* АКО КОЛИЧКАТА Е ПРАЗНА */}
                {cartItems.length === 0 ? (
                    <div className="text-center py-5">
                        <h2 className="fw-bold mb-4">Your cart is empty</h2>
                        <Link to="/" className="btn btn-outline-primary px-4 py-2 rounded-pill">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    /* АКО ИМА ПРОДУКТИ */
                    <div className="row g-4">

                        {/* ЛЯВА КОЛОНА: Списък с продукти */}
                        <div className="col-lg-7 col-xl-8">
                            <div className="cart-card">
                                <h4 className="cart-title">Cart</h4>

                                {cartItems.map((item) => (
                                    <div className="cart-item-box d-flex align-items-center" key={item.id}>

                                        {/* Снимка */}
                                        <div className="cart-image-wrapper me-4">
                                            <img
                                                src={item.phone_spec?.imageUrl || fallbackImage}
                                                alt={item.phone_spec?.name}
                                                className="cart-item-img"
                                                onError={(e) => { e.target.src = fallbackImage }}
                                            />
                                        </div>

                                        {/* Информация за продукта */}
                                        <div className="flex-grow-1">
                                            <div className="cart-item-title">
                                                { item.name + " - " + item.color || 'Unknown Phone'}
                                                {/* Махнахме стария бадж "x2", защото вече имаме хубави бутони! */}
                                            </div>

                                            <div className="cart-item-specs">
                                                {item.Storage || 'N/A'} - {item.RAM || 'N/A'}
                                            </div>

                                            {/* НОВО: Контейнер за цената и контролера за бройка */}
                                            <div className="d-flex align-items-center gap-4 mt-2">
                                                <div className="cart-item-price mb-0">
                                                    €{Number(item.price || 0).toFixed(2)}
                                                </div>

                                                {/* Бутони + / - */}
                                                <div className="d-flex align-items-center border rounded">
                                                    <button
                                                        className="btn btn-sm btn-light border-0 px-2 text-muted fw-bold"
                                                        onClick={() => decreaseQuantity(item.id)}
                                                        disabled={item.quantity <= 1}
                                                        style={{ background: 'transparent' }}
                                                    >
                                                        -
                                                    </button>

                                                    <span className="px-3 fw-bold text-dark" style={{ fontSize: '0.9rem' }}>
                                                        {item.quantity}
                                                    </span>

                                                    <button
                                                        className="btn btn-sm btn-light border-0 px-2 text-muted fw-bold"
                                                        onClick={() => addToCart({phone:item})}
                                                        style={{ background: 'transparent' }}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Бутон за изтриване */}
                                        <button
                                            className="delete-btn ms-3"
                                            onClick={() => removeFromCart(item.id)}
                                            title="Remove from cart"
                                        >
                                            <FiTrash2 />
                                        </button>

                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ДЯСНА КОЛОНА: Резюме на поръчката */}
                        <div className="col-lg-5 col-xl-4">
                            <div className="summary-card">
                                <h4 className="cart-title">Order Summary</h4>

                                <div className="summary-row mt-4">
                                    <span>Order value</span>
                                    <span>€{orderValue.toFixed(2)}</span>
                                </div>

                                <div className="summary-row">
                                    <span>Total before discount</span>
                                    <span>€{orderValue.toFixed(2)}</span>
                                </div>

                                <div className="summary-total">
                                    <span>TOTAL</span>
                                    <span className="summary-total-price">€{orderValue.toFixed(2)}</span>
                                </div>

                                <button className="btn w-100 mt-4 checkout-btn">
                                    To checkout &raquo;
                                </button>

                                <p className="text-center text-muted mt-3 mb-0" style={{ fontSize: '0.75rem' }}>
                                    *Custom orders need a few working days to be created. More info <Link to="#">here</Link>
                                </p>
                            </div>
                        </div>

                    </div>
                )}

            </div>
        </div>
    );
};

export default CartPage;