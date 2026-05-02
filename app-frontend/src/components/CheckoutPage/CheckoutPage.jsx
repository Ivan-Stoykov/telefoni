import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./CheckoutPage.css";

const CheckoutPage = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  // НОВО: State за съхранение на грешките
  const [errors, setErrors] = useState({});

  const storedUser = localStorage.getItem("user");
  const userData = JSON.parse(storedUser);

  const [formData, setFormData] = useState({
    userId: userData?.id || 0,
    name: userData.name || "",
    phone: userData.phone || "",
    email: userData.email || "",
    address: userData.address || "",
    city: userData.city || "",
    shipping: "Speedy - free delivery",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Ако потребителят започне да пише, махаме грешката за това поле
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // НОВО: Функция за валидация
  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      tempErrors.name = "Name and Surname are required";
      isValid = false;
    }

    // Телефон: позволява опционален +, следван от 9 до 15 цифри (игнорира интервали)
    const phoneRegex = /^\+?[0-9\s]{9,15}$/;
    if (!formData.phone.trim()) {
      tempErrors.phone = "Phone number is required";
      isValid = false;
    } else if (!phoneRegex.test(formData.phone.replace(/[-\s]/g, ""))) {
      tempErrors.phone = "Please enter a valid phone number (e.g. 0888123456)";
      isValid = false;
    }

    // Имейл: стандартна проверка
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      tempErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (formData.address.trim().length < 5) {
      tempErrors.address = "Address is required (min 5 characters)";
      isValid = false;
    }

    if (!formData.city.trim()) {
      tempErrors.city = "City is required";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const orderValue = cartItems.reduce((total, item) => {
    const price = Number(item.price || item.phone_spec?.price || 0);
    return total + price * item.quantity;
  }, 0);

  // НОВО: Изчисляваме цената на доставката
  const shippingCost = formData.shipping.includes("Econt") ? 5 : 0;

  // НОВО: Крайната цена
  const finalTotal = orderValue + shippingCost;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Преди да продължим, проверяваме дали всичко е попълнено правилно
    if (validateForm()) {
      console.log("Order Data:", {
        items: cartItems,
        shippingDetails: formData,
        userId: formData.userId,
        totalPrice: finalTotal,
      });
      alert(
        "Към плащане... (тук ще извикаме бекенда за създаване на поръчката)",
      );
    }
  };

  return (
    <div className="checkout-page-container py-5">
      <div className="container px-4 px-lg-5" style={{ maxWidth: "1200px" }}>
        {/* Слагаме noValidate, за да скрием грозните системни съобщения на браузъра */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="row g-5">
            {/* ЛЯВА ЧАСТ: Shipping Form */}
            <div className="col-lg-7 col-xl-8">
              <div className="checkout-card">
                <h3 className="checkout-title">Shipping</h3>
                <h5 className="section-title">Shipping details</h5>

                <div className="row">
                  {/* Name */}
                  <div className="col-md-6 form-group">
                    <label>Name and Surname</label>
                    <input
                      type="text"
                      name="name"
                      className={`custom-input ${errors.name ? "input-error" : ""}`}
                      value={formData.name}
                      onChange={handleChange}
                    />
                    {errors.name && (
                      <span className="error-text">{errors.name}</span>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="col-md-6 form-group">
                    <label>Phone number</label>
                    <input
                      type="tel"
                      name="phone"
                      className={`custom-input ${errors.phone ? "input-error" : ""}`}
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+359..."
                    />
                    {errors.phone && (
                      <span className="error-text">{errors.phone}</span>
                    )}
                  </div>

                  {/* Email */}
                  <div className="col-12 form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      className={`custom-input ${errors.email ? "input-error" : ""}`}
                      value={formData.email}
                      onChange={handleChange}
                    />
                    {errors.email && (
                      <span className="error-text">{errors.email}</span>
                    )}
                  </div>

                  {/* Address */}
                  <div className="col-12 form-group">
                    <label>Address</label>
                    <input
                      type="text"
                      name="address"
                      className={`custom-input ${errors.address ? "input-error" : ""}`}
                      value={formData.address}
                      onChange={handleChange}
                    />
                    {errors.address && (
                      <span className="error-text">{errors.address}</span>
                    )}
                  </div>

                  {/* City */}
                  <div className="col-md-6 form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      className={`custom-input ${errors.city ? "input-error" : ""}`}
                      value={formData.city}
                      onChange={handleChange}
                    />
                    {errors.city && (
                      <span className="error-text">{errors.city}</span>
                    )}
                  </div>

                  {/* Select Shipping */}
                  <div className="col-md-6 form-group">
                    <label>Select shipping</label>
                    <select
                      name="shipping"
                      className="custom-input pe-4"
                      value={formData.shipping}
                      onChange={handleChange}
                    >
                      <option value="Speedy - free delivery">
                        Speedy - free delivery
                      </option>
                      <option value="Econt - 5.00 EUR">Econt - 5.00 EUR</option>
                    </select>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-5 pt-3 border-top">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => navigate("/cart")}
                  >
                    Cancel order
                  </button>
                  <button type="submit" className="payment-btn">
                    Payment
                  </button>
                </div>
              </div>
            </div>

            {/* ДЯСНА ЧАСТ: Order Summary */}
            <div className="col-lg-5 col-xl-4">
              <div className="checkout-card">
                <h4
                  className="checkout-title"
                  style={{ fontSize: "1.25rem", marginBottom: "40px" }}
                >
                  Order Summary
                </h4>

                <div className="mb-4">
                  {cartItems.map((item) => (
                    <div className="summary-item-row" key={item.id}>
                      <span className="pe-2">
                        {item.phone_spec?.name || item.name}
                        {item.quantity > 1 ? ` x${item.quantity}` : ""}
                      </span>
                      <span className="fw-medium text-dark text-nowrap">
                        €
                        {(
                          (item.price || item.phone_spec?.price || 0) *
                          item.quantity
                        ).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="summary-item-row mt-4">
                  <span>Total before discount</span>
                  <span>€{orderValue.toFixed(2)}</span>
                </div>

                {/* НОВО: Ред за цената на доставката */}
                <div className="summary-item-row">
                  <span>Shipping</span>
                  <span>
                    {shippingCost === 0
                      ? "Free"
                      : `€${shippingCost.toFixed(2)}`}
                  </span>
                </div>

                <div className="summary-total-row">
                  <span>TOTAL</span>
                  {/* ПРОМЯНА: Тук вече показваме finalTotal, а не orderValue */}
                  <span className="text-primary fs-3">
                    €{finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
