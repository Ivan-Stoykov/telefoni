import "./AdminPanel.css";
import { Outlet, useLocation, Link } from "react-router-dom";

const AdminPanel = () => {
  const {pathname} = useLocation();
  console.log(pathname);
  const activeTab = pathname.split("/").pop();

  return (
    <div className="admin-container">
      {/* СТРАНИЧНА ЛЕНТА */}
      <div className="admin-sidebar">
        <div className="admin-sidebar-header">
          Swa<span>Phone</span> Admin
        </div>
        <div className="admin-nav">
          <Link to="/admin/phones"
            className={`admin-nav-btn ${activeTab === "phones" ? "active" : ""}`}
          >
            📱 Phones Inventory
          </Link>
          <Link to="/admin/orders"
            className={`admin-nav-btn ${activeTab === "orders" ? "active" : ""}`}
          >
            🛒 Orders Management
          </Link>
          <Link to="/admin/users"
            className={`admin-nav-btn ${activeTab === "users" ? "active" : ""}`}
          >
            👥 Users & Roles
          </Link>
        </div>
      </div>

      <div className="admin-content"><Outlet /></div>
      
    </div>
  );
};

export default AdminPanel;
