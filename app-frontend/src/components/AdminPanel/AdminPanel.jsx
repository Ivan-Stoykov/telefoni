import { useState, useEffect } from 'react';
import './AdminPanel.css';
import ProductAddForm from './ProductAddForm/ProductAddForm';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('phones');

  // --- РЕАЛНИ СТЕЙТОВЕ ЗА ДАННИТЕ ---
  const [phones, setPhones] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [phoneRenders, setPhoneRenders] = useState('list');
  const [isLoading, setIsLoading] = useState(true);

    // State за следене кой потребител се редактира в момента (пази ID-то му)
  const [editingUserId, setEditingUserId] = useState(null);
  
  // State за данните във формата за редакция
  const [editUserForm, setEditUserForm] = useState({ name: '', role: '' });

  const [selectedAdminOrder, setSelectedAdminOrder] = useState(null);
  
  // State за формата с данните за доставка
  const [orderEditForm, setOrderEditForm] = useState({
    status: '',
    shipping_name: '',
    shipping_email: '',
    shipping_phone: '',
    shipping_address: '',
    shipping_city: ''
  });

  // --- ЗАРЕЖДАНЕ НА ДАННИТЕ ОТ БЕКЕНДА ---
  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        // Забележка: Провери точните URL адреси с бекенд колегите си!
        const headers = {
          'Accept': 'application/json',
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
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

  const handleDeleteUser = async (id) => {
    // Питаме за потвърждение, за да няма случайни изтривания
    if (!window.confirm("Сигурни ли сте, че искате да изтриете този потребител?")) return;

    try {
      const response = await fetch(`http://localhost:8000/api/users/${id}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        setUsers(prev => prev.filter(user => user.id !== id));
      } else {
        alert("Възникна грешка при изтриването.");
      }
    } catch (error) {
      console.error("Грешка при триене:", error);
    }
  };

  // --- СТАРТИРАНЕ НА РЕДАКЦИЯ ---
  const handleEditClick = (user) => {
    setEditingUserId(user.id);
    // Зареждаме isAdmin (ако е true/1 е админ, иначе е 0)
    setEditUserForm({ 
      name: user.name, 
      isAdmin: user.isAdmin ? 1 : 0 
    });
  };

  // --- ПРОМЯНА НА ПОЛЕТАТА ПРИ РЕДАКЦИЯ ---
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditUserForm(prev => ({ 
      ...prev, 
      [name]: name === 'isAdmin' ? Number(value) : value 
    }));
  };

  // --- ЗАПАЗВАНЕ НА ПРОМЕНИТЕ ---
  const handleSaveUser = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(editUserForm)
      });

      if (response.ok) {
        // Обновяваме данните в таблицата
        setUsers(prev => prev.map(user => 
          user.id === id ? { ...user, ...editUserForm } : user
        ));
        setEditingUserId(null); // Затваряме режима за редакция
      } else {
        alert("Грешка при запазване на промените.");
      }
    } catch (error) {
      console.error("Грешка при запазване:", error);
    }
  };

  const handleViewOrderDetails = (order) => {
    setSelectedAdminOrder(order);
    // Зареждаме текущите данни във формата
    setOrderEditForm({
      status: order.status || 'pending',
      shipping_name: order.shipping_name || '',
      shipping_email: order.shipping_email || '',
      shipping_phone: order.shipping_phone || '',
      shipping_address: order.shipping_address || '',
      shipping_city: order.shipping_city || ''
    });
  };

  // --- СМЯНА НА СТАТУСА (С БУТОН) ---
  const handleAdvanceStatus = async () => {
    let newStatus = 'pending';
    const currentStatus = orderEditForm.status.toLowerCase();
    
    // Логика на прогресията
    if (currentStatus === 'pending') newStatus = 'sent';
    else if (currentStatus === 'sent') newStatus = 'delivered';
    else return;

    try {
      // Пращаме PUT заявка към бекенда
      const response = await fetch(`http://localhost:8000/api/orders/${selectedAdminOrder.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ ...orderEditForm, status: newStatus })
      });

      if (response.ok) {
        // Обновяваме state-овете, за да се смени веднага на екрана
        setOrderEditForm(prev => ({ ...prev, status: newStatus }));
        setOrders(prev => prev.map(o => o.id === selectedAdminOrder.id ? { ...o, status: newStatus } : o));
        setSelectedAdminOrder(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error("Грешка при смяна на статуса:", error);
    }
  };

  // --- ЗАПАЗВАНЕ НА РЕДАКТИРАНИТЕ ДАННИ ЗА ДОСТАВКА ---
  const handleOrderFormChange = (e) => {
    const { name, value } = e.target;
    setOrderEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveOrderLogistics = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/api/orders/${selectedAdminOrder.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(orderEditForm)
      });

      if (response.ok) {
        setOrders(prev => prev.map(o => o.id === selectedAdminOrder.id ? { ...o, ...orderEditForm } : o));
        setSelectedAdminOrder(prev => ({ ...prev, ...orderEditForm }));
      }
    } catch (error) {
      console.error("Грешка при запазване:", error);
    }
  };

  async function handleDeletePhone(id) {
    const response = await fetch(`http://localhost:8000/api/phones/${id}`, {
      method: 'DELETE',
      headers: {'Content-Type':'application/json', 'Accept':'application/json'}
    });
    if(response.ok)
    {
      setPhones(prevPhones => prevPhones.filter(phone => phone.id !== id))
    }
  }

  // --- РЕНДЕР ФУНКЦИИ ЗА ТАБЛИЦИТЕ ---
  const renderPhonesList = () => (
    <>
    {phoneRenders === 'list' && <>
      <div className="admin-header">
        <h2 className="admin-title">Manage Phones</h2>
        <button className="admin-add-btn" onClick={()=>{setPhoneRenders('add-form')}}>+ Add New Phone</button>
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
                  <button className="action-btn delete" onClick={()=>handleDeletePhone(phone.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div></>}
      {phoneRenders === 'add-form' && <ProductAddForm setPhoneRenders={setPhoneRenders} />}
    </>
  );

  const renderOrdersList = () => {
    // АКО ИМА ИЗБРАНА ПОРЪЧКА - ПОКАЗВАМЕ ДЕТАЙЛИТЕ И ФОРМАТА
    if (selectedAdminOrder) {
      return (
        <div className="admin-order-details">
          <button className="back-to-orders" onClick={() => setSelectedAdminOrder(null)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', marginBottom: '20px', fontSize: '1rem' }}>
            ← Back to Orders
          </button>
          
          <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="admin-title">Order ORD-2026-{selectedAdminOrder.id.toString().padStart(3, '0')}</h2>
            
            {/* БУТОН ЗА СТАТУСА */}
            <div className="status-controller" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ fontWeight: '600', color: '#64748b' }}>Current Status: <span className={`admin-badge badge-${orderEditForm.status.toLowerCase()}`}>{orderEditForm.status.toUpperCase()}</span></span>
              
              {orderEditForm.status.toLowerCase() === 'pending' && (
                <button onClick={handleAdvanceStatus} style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Mark as SENT 📦</button>
              )}
              {orderEditForm.status.toLowerCase() === 'sent' && (
                <button onClick={handleAdvanceStatus} style={{ padding: '8px 16px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Mark as DELIVERED ✅</button>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '30px', marginTop: '20px' }}>
            {/* ЛЯВА КОЛОНА: Продукти (Списък) */}
            <div style={{ flex: '1', background: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <h4 style={{ marginTop: 0, marginBottom: '20px', color: '#1e293b' }}>Order Items</h4>
              {(selectedAdminOrder.order_items || selectedAdminOrder.orderItems)?.length > 0 ? (
                (selectedAdminOrder.order_items || selectedAdminOrder.orderItems).map((item, index) => (
                  <div key={index} style={{ display: 'flex', gap: '15px', borderBottom: '1px solid #f1f5f9', paddingBottom: '15px', marginBottom: '15px' }}>
                    <img src={item.phone?.phone_spec?.imageUrl || item.phone?.phoneSpec?.imageUrl || 'https://via.placeholder.com/60'} alt="phone" style={{ width: '60px', height: '60px', objectFit: 'contain', top:0 }} />
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#0f172a' }}>{item.phone?.name || item.phone?.model || `Phone #${item.phone_id}`}</div>
                      <div style={{ color: '#64748b', fontSize: '0.85rem', margin: '4px 0' }}>Color: {item.color?.color || 'N/A'}</div>
                      <div style={{ color: '#3b82f6', fontWeight: '600' }}>€{Number(item.price).toFixed(2)} <span style={{ color: '#94a3b8' }}>x{item.quantity}</span></div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No items found.</p>
              )}
              <div style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '1.2rem', marginTop: '20px' }}>
                Total: €{Number(selectedAdminOrder.total_price).toFixed(2)}
              </div>
            </div>

            {/* ДЯСНА КОЛОНА: Форма за редакция на доставката */}
            <div style={{ flex: '1', background: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <h4 style={{ marginTop: 0, marginBottom: '20px', color: '#1e293b' }}>Logistics & Shipping Details</h4>
              <form onSubmit={handleSaveOrderLogistics} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '5px' }}>Recipient Name</label>
                  <input type="text" name="shipping_name" value={orderEditForm.shipping_name} onChange={handleOrderFormChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '5px' }}>Email</label>
                    <input type="email" name="shipping_email" value={orderEditForm.shipping_email} onChange={handleOrderFormChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '5px' }}>Phone</label>
                    <input type="text" name="shipping_phone" value={orderEditForm.shipping_phone} onChange={handleOrderFormChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '5px' }}>Address</label>
                  <input type="text" name="shipping_address" value={orderEditForm.shipping_address} onChange={handleOrderFormChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '5px' }}>City</label>
                  <input type="text" name="shipping_city" value={orderEditForm.shipping_city} onChange={handleOrderFormChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                </div>
                
                <button type="submit" style={{ marginTop: '10px', padding: '12px', background: '#0b1a30', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Save Logistics
                </button>
              </form>
            </div>
          </div>
        </div>
      );
    }

    // АКО НЯМА ИЗБРАНА ПОРЪЧКА - РЕНДЕРИРАМЕ ТАБЛИЦАТА
    return (
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
                  <td>{order.shipping_name || order.user?.name || `User #${order.user_id}`}</td>
                  <td>{formatDate(order.created_at)}</td>
                  <td>€{Number(order.total_price).toFixed(2)}</td>
                  <td>
                    <span className={`admin-badge badge-${order.status?.toLowerCase() || 'pending'}`}>
                      {(order.status || 'pending').toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <button className="action-btn" onClick={() => handleViewOrderDetails(order)}>View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  };

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
                
                {editingUserId === user.id ? (
                  <>
                    <td>
                      <input 
                        type="text" 
                        name="name" 
                        value={editUserForm.name} 
                        onChange={handleEditFormChange} 
                        style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
                      />
                    </td>
                    <td className="text-muted">{user.email}</td>
                    <td>
                      <select 
                        name="isAdmin" 
                        value={editUserForm.isAdmin} 
                        onChange={handleEditFormChange}
                        style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
                      >
                        <option value={0}>USER</option>
                        <option value={1}>ADMIN</option>
                      </select>
                    </td>
                    <td>
                      <button className="action-btn" onClick={() => handleSaveUser(user.id)} style={{ color: '#16a34a' }}>Save</button>
                      <button className="action-btn delete" onClick={() => setEditingUserId(null)}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={{ fontWeight: '600' }}>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      {/* Проверяваме user.isAdmin (ако е 1 -> admin, ако е 0 -> user) */}
                      <span className={`admin-badge badge-${user.isAdmin ? 'admin' : 'user'}`}>
                        {user.isAdmin ? 'ADMIN' : 'USER'}
                      </span>
                    </td>
                    <td>
                      <button className="action-btn" onClick={() => handleEditClick(user)}>Edit</button>
                      {/* Бутонът Ban се показва само ако НЕ е админ */}
                      {!user.isAdmin && (
                        <button className="action-btn delete" onClick={() => handleDeleteUser(user.id)}>Delete</button>
                      )}
                    </td>
                  </>
                )}
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