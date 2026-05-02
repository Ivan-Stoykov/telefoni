import React, { useState, useEffect } from 'react';
import './AccountPage.css';

const AccountPage = () => {
  const [activeTab, setActiveTab] = useState('details'); 
  const [selectedOrder, setSelectedOrder] = useState(null); 
  
  // --- НОВИ STATE-ове ЗА РЕАЛНИ ДАННИ ---
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  // Взимаме логнатия потребител
  const storedUser = localStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;

  const [userData, setUserData] = useState({
    name: parsedUser?.name || '',
    email: parsedUser?.email || '',
    phone: parsedUser?.phone || '',
    address: parsedUser?.address || '',
    city: parsedUser?.city || ''
  });

  // --- ЗАРЕЖДАНЕ НА ПОРЪЧКИТЕ ОТ БЕКЕНДА ---
  useEffect(() => {
    const fetchOrders = async () => {
      if (!parsedUser || !parsedUser.id) {
        setIsLoadingOrders(false);
        return;
      }

      try {
        // Забележка: Попитай бекенд колегите дали това е точният линк за поръчките на потребител!
        // Често е нещо като: /api/orders?user_id=1 ИЛИ /api/users/1/orders
        const response = await fetch(`http://localhost:8000/api/orders?user_id=${parsedUser.id}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            // 'Authorization': `Bearer ${localStorage.getItem('token')}` // Ако ползвате токени
          }
        });

        if (response.ok) {
          const data = await response.json();
          // Очакваме бекендът да върне масив с поръчки
          setOrders(data.orders || data); 
        } else {
          console.error("Грешка при зареждане на поръчките");
        }
      } catch (error) {
        console.error("Fetch грешка:", error);
      } finally {
        setIsLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [parsedUser?.id]); // Извиква се само веднъж при зареждане на страницата

  // --- РЕДАКТИРАНЕ НА ДАННИТЕ ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  // --- ЗАПАЗВАНЕ НА РЕАЛНИ ДАННИ ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Забележка: Попитай колегите за точния линк за ъпдейт на юзър
      const response = await fetch(`http://localhost:8000/api/users/${parsedUser.id}`, {
        method: 'PUT', // или POST в зависимост от бекенда
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        alert("Данните са запазени успешно!");
        // Обновяваме и localStorage, за да се помнят новите данни
        localStorage.setItem("user", JSON.stringify({ ...parsedUser, ...userData }));
      } else {
        alert("Грешка при запазване на данните.");
      }
    } catch (error) {
      console.error("Грешка:", error);
      alert("Сървърна грешка. Опитайте отново.");
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedOrder(null);
  };

  // Помощна функция за красиво форматиране на датата (от timestamp към нормална дата)
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
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
              {!selectedOrder ? (
                <>
                  <h3 className="account-title">Orders</h3>
                  
                  {/* Показваме "Зареждане", докато чакаме бекенда */}
                  {isLoadingOrders ? (
                    <p className="text-muted">Loading your orders...</p>
                  ) : orders.length > 0 ? (
                    orders.map((order) => (
                      <div className="order-card" key={order.id}>
                        <div className="order-info">
                          <span className="order-id">Order ORD-2026-{order.id.toString().padStart(3, '0')}</span>
                          <span className="order-price">
                            {/* Използваме created_at и total_price, защото така са в базата */}
                            Date: {formatDate(order.created_at)} &nbsp;|&nbsp; Price: €{Number(order.total_price).toFixed(2)}
                          </span>
                        </div>
                        <button 
                          className="view-btn"
                          onClick={() => setSelectedOrder(order)} 
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
                /* ДЕТАЙЛЕН ИЗГЛЕД НА ПОРЪЧКАТА */
                <div>
                  <button className="back-to-orders" onClick={() => setSelectedOrder(null)}>
                    ← Back to orders
                  </button>
                  <h3 className="account-title" style={{ marginBottom: '5px' }}>
                    Order ORD-2026-{selectedOrder.id.toString().padStart(3, '0')}
                  </h3>
                  <p className="text-muted" style={{ marginBottom: '25px', fontSize: '0.9rem' }}>
                    Date: {formatDate(selectedOrder.created_at)} &nbsp;|&nbsp; Status: <strong style={{textTransform: 'capitalize'}}>{selectedOrder.status}</strong>
                  </p>

                  <div className="order-details-layout">
                    {/* Лява част - Списък с продукти */}
                    <div className="order-details-items">
                      {/* Проверяваме дали има items, за да не гръмне, ако бекендът ги забрави */}
                      {selectedOrder.items && selectedOrder.items.length > 0 ? (
                        selectedOrder.items.map((item, index) => (
                          <div className="order-item-card" key={item.id || index}>
                            {/* Слагаме placeholder картинка, ако бекендът не ни прати */}
                            <img src={item.phone?.image || 'https://via.placeholder.com/70'} alt="phone" className="order-item-img" />
                            <div className="order-item-info">
                              {/* Опитваме да вземем името на телефона от релацията, ако го няма - пишем просто Phone */}
                              <div className="order-item-name">{item.phone?.name || item.phone?.model || `Phone #${item.phone_id}`}</div>
                              <div className="order-item-specs">Color: {item.color?.color || 'N/A'}</div>
                              <div className="order-item-price-qty">
                                <span className="order-item-price">€{Number(item.price).toFixed(2)}</span>
                                <span className="order-item-qty">× {item.quantity}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p>No items found for this order.</p>
                      )}
                    </div>

                    {/* Дясна част - Order Summary */}
                    <div className="order-details-summary">
                      <h4 className="summary-title">Order Summary</h4>
                      
                      <div className="summary-row">
                        <span>Shipping method</span>
                        <span>{selectedOrder.shipping_method}</span>
                      </div>
                      
                      <div className="summary-row total">
                        <span>TOTAL</span>
                        <span className="total-price">€{Number(selectedOrder.total_price).toFixed(2)}</span>
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