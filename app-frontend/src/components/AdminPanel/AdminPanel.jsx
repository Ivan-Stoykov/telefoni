import React, { useState, useEffect } from 'react';
import './AdminPanel.css';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('phones');

  // --- РЕАЛНИ СТЕЙТОВЕ ЗА ДАННИТЕ ---
  const [phones, setPhones] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- ЗАРЕЖДАНЕ НА ДАННИТЕ ОТ БЕКЕНДА ---
  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        // Забележка: Провери точните URL адреси с бекенд колегите си!
        const headers = {
          'Accept': 'application/json',
          // 'Authorization': `Bearer ${localStorage.getItem('token')}` // Разкоментирай, ако админът ползва токен за достъп
        };

        // Изпращаме трите заявки едновременно за максимална бързина
        const [phonesRes, ordersRes, usersRes] = await Promise.all([
          fetch('http://localhost:8000/api/phones', { headers }), // Може да е /api/products
          fetch('http://localhost:8000/api/orders', { headers }),
          fetch('http://localhost:8000/api/users', { headers })
        ]);

        // Ако заявките са успешни, парсваме JSON-а
        if (phonesRes.ok) {
          const phonesData = await phonesRes.json();
          // Ако бекендът връща пагинация, може да е phonesData.data
          setPhones(phonesData.data || phonesData); 
        }
        
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setOrders(ordersData.data || ordersData);
        }
        
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUsers(usersData.data || usersData);
        }

      } catch (error) {
        console.error("Грешка при изтегляне на данните за Админ панела:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Помощна функция за форматиране на дати
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // --- РЕНДЕР ФУНКЦИИ ЗА ТАБЛИЦИТЕ ---
  const renderPhonesList = () => (
    <>
      <div className="admin-header">
        <h2 className="admin-title">Manage Phones</h2>
        <button className="admin-add-btn">+ Add New Phone</button>
      </div>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Model</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {phones.map(phone => (
              <tr key={phone.id}>
                <td>#{phone.id}</td>
                <td style={{ fontWeight: '600' }}>{phone.model || phone.name}</td>
                <td>€{Number(phone.price).toFixed(2)}</td>
                <td>
                  <button className="action-btn">Edit</button>
                  <button className="action-btn delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderOrdersList = () => (
    <>
      <div className="admin-header">
        <h2 className="admin-title">Recent Orders</h2>
      </div>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td style={{ fontWeight: '600' }}>ORD-2026-{order.id.toString().padStart(3, '0')}</td>
                {/* Използваме shipping_name или името на юзъра от релацията */}
                <td>{order.shipping_name || order.user?.name || `User #${order.user_id}`}</td>
                <td>{formatDate(order.created_at)}</td>
                <td>€{Number(order.total_price).toFixed(2)}</td>
                <td>
                  <span className={`admin-badge badge-${order.status?.toLowerCase() || 'pending'}`}>
                    {(order.status || 'pending').toUpperCase()}
                  </span>
                </td>
                <td>
                  <button className="action-btn">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderUsersList = () => (
    <>
      <div className="admin-header">
        <h2 className="admin-title">Registered Users</h2>
      </div>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>#{user.id}</td>
                <td style={{ fontWeight: '600' }}>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`admin-badge badge-${user.role || 'user'}`}>
                    {(user.role || 'user').toUpperCase()}
                  </span>
                </td>
                <td>
                  <button className="action-btn">Edit</button>
                  {user.role !== 'admin' && <button className="action-btn delete">Ban</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  return (
    <div className="admin-container">
      {/* СТРАНИЧНА ЛЕНТА */}
      <div className="admin-sidebar">
        <div className="admin-sidebar-header">
          Swa<span>Phone</span> Admin
        </div>
        <div className="admin-nav">
          <button 
            className={`admin-nav-btn ${activeTab === 'phones' ? 'active' : ''}`}
            onClick={() => setActiveTab('phones')}
          >
            📱 Phones Inventory
          </button>
          <button 
            className={`admin-nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            🛒 Orders Management
          </button>
          <button 
            className={`admin-nav-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👥 Users & Roles
          </button>
        </div>
      </div>

      {/* ОСНОВНА РАБОТНА ПЛОЩ */}
      <div className="admin-content">
        {isLoading ? (
          <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '1.2rem', color: '#64748b' }}>
            ⏳ Зареждане на данните от базата...
          </div>
        ) : (
          <>
            {activeTab === 'phones' && renderPhonesList()}
            {activeTab === 'orders' && renderOrdersList()}
            {activeTab === 'users' && renderUsersList()}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;