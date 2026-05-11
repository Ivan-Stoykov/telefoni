import { useState, useEffect } from 'react';
import './AccountPage.css';
import { formatPrice } from '../../utils/currency';

const AccountPage = () => {
  const [activeTab, setActiveTab] = useState('details');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  const storedUser = localStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;

  const [userData, setUserData] = useState({
    name: parsedUser?.name || '',
    email: parsedUser?.email || '',
    phone: parsedUser?.phone || '',
    address: parsedUser?.address || '',
    city: parsedUser?.city || ''
  });

  useEffect(() => {
    const fetchOrders = async () => {
      if (!parsedUser || !parsedUser.id) {
        setIsLoadingOrders(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/api/users/${parsedUser.id}/orders`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          }
        });

        if (response.ok) {
          const data = await response.json();
          setOrders(data || []);
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
  }, [parsedUser?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!parsedUser || !parsedUser.id) {
      alert("Не сте влезли в профила си!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/users/${parsedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: userData.name,
          phone: userData.phone,
          address: userData.address,
          city: userData.city
        })
      });

      if (response.ok) {
        const updatedUserFromDB = await response.json();

        const updatedStorageUser = { ...parsedUser, ...userData };
        localStorage.setItem("user", JSON.stringify(updatedStorageUser));

        alert("Данните са запазени успешно!");
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

          {activeTab === 'orders' && (
            <div>
              {!selectedOrder ? (
                <>
                  <h3 className="account-title">Orders</h3>

                  {isLoadingOrders ? (
                    <p className="text-muted">Loading your orders...</p>
                  ) : orders.length > 0 ? (
                    orders.map((order) => (
                      <div className="order-card" key={order.id}>
                        <div className="order-info">
                          <span className="order-id">Order ORD-2026-{order.id.toString().padStart(3, '0')}</span>
                          <span className="order-price">
                            Date: {formatDate(order.created_at)} &nbsp;|&nbsp; Price: {formatPrice(order.total_price)}
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
                <div>
                  <button className="back-to-orders" onClick={() => setSelectedOrder(null)}>
                    ← Back to orders
                  </button>
                  <h3 className="account-title" style={{ marginBottom: '5px' }}>
                    Order ORD-2026-{selectedOrder.id.toString().padStart(3, '0')}
                  </h3>
                  <p className="text-muted" style={{ marginBottom: '25px', fontSize: '0.9rem' }}>
                    Date: {formatDate(selectedOrder.created_at)} &nbsp;|&nbsp; Status: <strong style={{ textTransform: 'capitalize' }}>{selectedOrder.status}</strong>
                  </p>

                  <div className="order-details-layout">
                    <div className="order-details-items">
                      {(selectedOrder.order_items || selectedOrder.orderItems)?.length > 0 ? (
                        (selectedOrder.order_items || selectedOrder.orderItems).map((item, index) => (
                          <div className="order-item-card" key={item.id || index}>
                            <img src={item.phone?.phone_spec?.imageUrl || 'https://via.placeholder.com/70'} alt="phone" className="order-item-img" />
                            <div className="order-item-info">
                              <div className="order-item-name">{item.phone?.phone_spec?.brand?.name + " " + item.phone?.name || `Phone #${item.phone_id}`}</div>
                              <div className="order-item-specs">Color: {item.color?.color || 'N/A'}</div>
                              <div className="order-item-price-qty">
                                <span className="order-item-price">{formatPrice(item.price)}</span>
                                <span className="order-item-qty">× {item.quantity}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p>No items found for this order.</p>
                      )}
                    </div>

                    <div className="order-details-summary">
                      <h4 className="summary-title">Order Summary</h4>

                      <div className="summary-row">
                        <span>Shipping method</span>
                        <span>{selectedOrder.shipping_method}</span>
                      </div>

                      <div className="summary-row total">
                        <span>TOTAL</span>
                        <span className="total-price">{formatPrice(selectedOrder.total_price)}</span>
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