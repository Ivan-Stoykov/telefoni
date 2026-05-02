import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './SuccessPage.css';

const SuccessPage = () => {
  const location = useLocation();
  // Взимаме данните от state-а (подадени през navigate). 
  // Ако няма, слагаме празни стойности за защита от крашване.
  const { items = [], total = 0, beforeDiscount = 0, shippingMethod } = location.state || {};
  const shippingCost = shippingMethod.includes("Econt") ? 5 : 0;

  // Функция за форматиране на цената с малки стотинки горе
  const formatPrice = (price) => {
    if (!price) return null;
    const [whole, cents] = Number(price).toFixed(2).split('.');
    return (
      <>
        €{whole}<span className="price-cents">{cents}</span>
      </>
    );
  };

  return (
    <div className="success-page-container">
      <div className="success-card">
        
        {/* Икона за успех (Checkmark) */}
        <div className="success-icon-wrapper">
          <svg className="success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        
        <h2 className="success-title">Order Successful</h2>

        {/* Списък с продукти */}
        <div className="success-summary-list">
          {items.map((item, index) => (
            <div className="success-summary-row" key={index}>
              <span className="success-item-name">{item.name || item.brand + ' ' + item.model} <b>x{item.quantity}</b></span>
              <span className="success-item-price">{formatPrice(item.price * item.quantity)}</span> 
            </div>

          ))}

          <div className="success-summary-row" style={{ marginTop: '15px' }}>
            <span className="success-item-name">
              Shipping <span style={{ color: '#868e96', fontSize: '0.85rem' }}> - {shippingMethod.split(' ')[0]}</span>
            </span>
            <span className="success-item-price">
              {shippingCost > 0 ? formatPrice(shippingCost) : (
                <span style={{ color: '#868e96', fontWeight: 'normal' }}>Free</span>
              )}
            </span>
          </div>

          {/* Total before discount (показва се само ако е подаден) */}
          {beforeDiscount > 0 && (
            <div className="success-summary-row" style={{ marginTop: '10px' }}>
              <span>Total before discount</span>
              <span className="success-item-price">{formatPrice(beforeDiscount)}</span>
            </div>
          )}
        </div>

        <div className="success-divider"></div>

        {/* Крайна сума */}
        <div className="success-total-row">
          <span>TOTAL</span>
          <span className="success-total-price">€{Number(total).toFixed(2)}</span>
        </div>

        {/* Добавяме малък бутон за връщане към магазина */}
        <Link to="/" className="continue-shopping-btn">
          ← Continue shopping
        </Link>
      </div>
    </div>
  );
};

export default SuccessPage;