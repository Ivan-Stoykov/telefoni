import { useState } from "react";
import "./AccountPage.css";

const AccountPage = () => {
  const storedUser = localStorage.getItem("user");
  const parsedUser = JSON.parse(storedUser);
  const [userData, setUserData] = useState({
    name: parsedUser.name || "",
    email: parsedUser.email || "",
    phone: parsedUser.phone || "",
    address: parsedUser.address || "",
    city: parsedUser.city || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Данни за запазване:", userData);
    alert("Запазване... (чакаме бекенда да направи endpoint-а)");
  };

  return (
    <div className="account-page-container px-4">
      <div className="account-card">
        <h3 className="account-title">My Account</h3>
        <p className="account-subtitle">
          Manage your personal information and shipping details.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-12 form-group">
              <label>Name and Surname</label>
              <input
                type="text"
                name="name"
                className="custom-input"
                value={userData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                className="custom-input"
                value={userData.email}
                onChange={handleChange}
                disabled
              />
            </div>

            <div className="col-md-6 form-group">
              <label>Phone number</label>
              <input
                type="tel"
                name="phone"
                className="custom-input"
                value={userData.phone}
                onChange={handleChange}
                placeholder="+359..."
              />
            </div>

            <div className="col-12 form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                className="custom-input"
                value={userData.address}
                onChange={handleChange}
                placeholder="Street name, apartment, etc."
              />
            </div>

            <div className="col-md-6 form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                className="custom-input"
                value={userData.city}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" className="save-btn">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default AccountPage;
