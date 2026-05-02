import React, { useState, useEffect } from 'react';
import './AccountPage.css';

// По-богати фалшиви данни за поръчките (включващи продукти)
const MOCK_ORDERS = [
  { 
    id: 'ORD-2026-001', 
    date: '28 Apr 2026', 
    shippingCost: 0,
    total: 3299.98,
    status: 'Processing',
    items: [
      {
        id: 1,
        name: 'Samsung Galaxy S26 Ultra 512GB - Black',
        specs: '512GB - 12GB',
        price: 1649.99,
        quantity: 2,
        image: 'https://cdn.dummyjson.com/product-images/1/thumbnail.jpg' // Слагаме примерна картинка
      }
    ]
  },
  { 
    id: 'ORD-2026-002', 
    date: '15 Mar 2026', 
    shippingCost: 5.00,
    total: 1254.50,
    status: 'Delivered',
    items: [
      {
        id: 2,
        name: 'iPhone 15 Pro Max - Natural Titanium',
        specs: '256GB - 8GB',
        price: 1249.50,
        quantity: 1,
        image: 'https://cdn.dummyjson.com/product-images/2/thumbnail.jpg'
      }
    ]
  }
];

const AccountPage = () => {
  const [activeTab, setActiveTab] = useState('details'); 
  // НОВО: State за следене на отворената поръчка
  const [selectedOrder, setSelectedOrder] = useState(null); 
  
  const [userData, setUserData] = useState({
    name: '', email: '', phone: '', address: '', city: ''
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserData({
          name: parsedUser.name || '',
          email: parsedUser.email || '',
          phone: parsedUser.phone || '',
          address: parsedUser.address || '',
          city: parsedUser.city || ''
        });
      } catch (error) {
        console.error("Грешка при прочитане:", error);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Данни за запазване:", userData);
    alert("Запазване... (чакаме бекенда)");
  };

  // Функция за смяна на табовете (нулира избраната поръчка)
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedOrder(null);
  };

  return (
    <div className="account-page-container">
      <div className="account-page-inner">
        
        {/* ЛЯВА КОЛОНА (Меню) */}
        <div className="account-card">
          <div className="sidebar-menu">
            <div 
              className={`sidebar-item ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => handleTabChange('details')}
            >
              Details
            </div>
            <div 
              className={`sidebar-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => handleTabChange('orders')}
            >
              Orders
            </div>
          </div>
        </div>

        {/* ДЯСНА КОЛОНА (Съдържание) */}
        <div className="account-card">
          
          {/* === ТАБ: ДЕТАЙЛИ === */}
          {activeTab === 'details' && (
            <div>
              <h3 className="account-title">Details</h3>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-12 form-group">
                    <label>Name and Surname</label>
                    <input type="text" name="name" className="custom-input" value={userData.name} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6 form-group">
                    <label>Email</label>
                    <input type="email" name="email" className="custom-input" value={userData.email} onChange={handleChange} disabled />
                  </div>
                  <div className="col-md-6 form-group">
                    <label>Phone number</label>
                    <input type="tel" name="phone" className="custom-input" value={userData.phone} onChange={handleChange} placeholder="+359..." />
                  </div>
                  <div className="col-12 form-group">
                    <label>Address</label>
                    <input type="text" name="address" className="custom-input" value={userData.address} onChange={handleChange} placeholder="Street name, apartment, etc." />
                  </div>
                  <div className="col-md-6 form-group">
                    <label>City</label>
                    <input type="text" name="city" className="custom-input" value={userData.city} onChange={handleChange} />
                  </div>
                </div>
                <button type="submit" className="save-btn">Save Changes</button>
              </form>
            </div>
          )}

          {/* === ТАБ: ПОРЪЧКИ === */}
          {activeTab === 'orders' && (
            <div>
              {/* Ако НЯМАМЕ избрана поръчка -> показваме списъка */}
              {!selectedOrder ? (
                <>
                  <h3 className="account-title">Orders</h3>
                  {MOCK_ORDERS.length > 0 ? (
                    MOCK_ORDERS.map((order) => (
                      <div className="order-card" key={order.id}>
                        <div className="order-info">
                          <span className="order-id">Order {order.id}</span>
                          <span className="order-price">
                            Date: {order.date} &nbsp;|&nbsp; Price: €{order.total.toFixed(2)}
                          </span>
                        </div>
                        <button 
                          className="view-btn"
                          onClick={() => setSelectedOrder(order)} // Задаваме коя поръчка да се отвори
                        >
                          View
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted">You don't have any orders yet.</p>
                  )}
                </>
              ) : (
                /* Ако ИМАМЕ избрана поръчка -> показваме детайлния изглед (Read-only Cart) */
                <div>
                  <button className="back-to-orders" onClick={() => setSelectedOrder(null)}>
                    ← Back to orders
                  </button>
                  <h3 className="account-title" style={{ marginBottom: '5px' }}>
                    Order {selectedOrder.id}
                  </h3>
                  <p className="text-muted" style={{ marginBottom: '25px', fontSize: '0.9rem' }}>
                    Date: {selectedOrder.date} &nbsp;|&nbsp; Status: <strong>{selectedOrder.status}</strong>
                  </p>

                  <div className="order-details-layout">
                    {/* Лява част - Списък с продукти */}
                    <div className="order-details-items">
                      {selectedOrder.items.map((item) => (
                        <div className="order-item-card" key={item.id}>
                          <img src={item.image} alt={item.name} className="order-item-img" />
                          <div className="order-item-info">
                            <div className="order-item-name">{item.name}</div>
                            <div className="order-item-specs">{item.specs}</div>
                            <div className="order-item-price-qty">
                              <span className="order-item-price">€{item.price.toFixed(2)}</span>
                              {/* ПРОМЯНАТА Е ТУК: Слагаме знак за умножение вместо Qty: */}
                              <span className="order-item-qty">× {item.quantity}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Дясна част - Order Summary */}
                    <div className="order-details-summary">
                      <h4 className="summary-title">Order Summary</h4>
                      
                      <div className="summary-row">
                        <span>Order value</span>
                        <span>€{(selectedOrder.total - selectedOrder.shippingCost).toFixed(2)}</span>
                      </div>
                      <div className="summary-row">
                        <span>Shipping</span>
                        <span>{selectedOrder.shippingCost === 0 ? 'Free' : `€${selectedOrder.shippingCost.toFixed(2)}`}</span>
                      </div>
                      
                      <div className="summary-row total">
                        <span>TOTAL</span>
                        <span className="total-price">€{selectedOrder.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AccountPage;