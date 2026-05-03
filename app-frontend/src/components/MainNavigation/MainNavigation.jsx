import "./MainNavigation.css";
import logo from "../../assets/logo.png";
import SwapIconImage from "../../assets/swap.png";
import { FiShoppingCart, FiShield } from "react-icons/fi";
import { LuUserRound } from "react-icons/lu";
import {
  FaFacebook,
  FaYoutube,
  FaInstagram,
  FaTwitter,
  FaChevronDown,
  FaSearch,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";

export default function MainNavigation() {
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const navigate = useNavigate();

  const { cartItems } = useCart();
  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const storedUser = localStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;

  const isAdmin = parsedUser && (parsedUser.isAdmin === 1 || parsedUser.isAdmin === true);

  // --- НОВО: ЛОГИКА ЗА ТЪРСАЧКАТА ---
  const [searchQuery, setSearchQuery] = useState("");
  const [allPhones, setAllPhones] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // 1. Взимаме всички телефони при зареждане на навигацията
  useEffect(() => {
    async function fetchPhones() {
      try {
        const response = await fetch("http://localhost:8000/api/phones");
        if (response.ok) {
          const data = await response.json();
          setAllPhones(data);
        }
      } catch (error) {
        console.error("Грешка при зареждане на телефони за търсачката:", error);
      }
    }
    fetchPhones();
  }, []);

  // 2. Функция, която филтрира докато пишем
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length > 0) {
      const filtered = allPhones.filter((phone) => {
        const phoneName = phone.phone_spec?.name || phone.name || "";
        return phoneName.toLowerCase().includes(query.toLowerCase());
      });
      setSearchResults(filtered);
      setIsSearchOpen(true);
    } else {
      setSearchResults([]);
      setIsSearchOpen(false);
    }
  };
  // ----------------------------------

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    fetch("http://localhost:8000/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setIsAccountOpen(false);
    navigate("/login");
  }

  return (
    <header>
      <div className="top-bar">
        <div className="container">
          <div>
            <span>Welcome to SwaPhone online eCommerce store.</span>
          </div>
          <div className="top-bar-right">
            <div className="social-links">
              <span>Follow us:</span>
              <Link to="#">
                <FaTwitter />
              </Link>
              <Link to="#">
                <FaFacebook />
              </Link>
              <Link to="#">
                <FaYoutube />
              </Link>
              <Link to="#">
                <FaInstagram />
              </Link>
            </div>
            <div className="language-selector">
              <span>Eng</span>
              <FaChevronDown />
            </div>
          </div>
        </div>
      </div>

      <div className="main-nav">
        <div className="container">
          <div className="logo">
            <Link to="/">
              <img src={logo} alt="SWAPHONE" />
            </Link>
          </div>

          {/*КОНТЕЙНЕР ЗА ТЪРСАЧКА */}
          <div className="search-container position-relative">
            <input
              type="text"
              placeholder="Search for anything..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => {
                if (searchQuery.length > 0) setIsSearchOpen(true);
              }}
              onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
              /* 1. ХВАЩАМЕ НАТИСКАНЕТО НА ENTER */
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery.trim().length > 0) {
                  setIsSearchOpen(false);
                  // Пренасочваме към страницата с продуктите + параметър за търсене
                  navigate(`/?search=${searchQuery}`);
                }
              }}
            />

            <button
              type="submit"
              onClick={() => {
                if (searchQuery.trim().length > 0) {
                  setIsSearchOpen(false);
                  navigate(`/?search=${searchQuery}`);
                }
              }}
            >
              <FaSearch />
            </button>

            {/* ПАДАЩО МЕНЮ С РЕЗУЛТАТИТЕ */}
            {isSearchOpen && (
              <div
                className="position-absolute bg-white border rounded shadow mt-2"
                style={{
                  top: "100%",
                  left: 0,
                  width: "100%",
                  maxHeight: "300px",
                  overflowY: "auto",
                  zIndex: 1050,
                }}
              >
                {searchResults.length > 0 ? (
                  searchResults.map((phone) => (
                    <div
                      key={phone.id}
                      className="d-flex align-items-center p-2 border-bottom"
                      style={{
                        cursor: "pointer",
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#f8f9fa")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery("");
                        navigate(`/product/${phone.slug}`);
                      }}
                    >
                      <img
                        src={phone.phone_spec?.imageUrl || "/images/asni.jpg"}
                        alt="phone"
                        style={{
                          width: "40px",
                          height: "40px",
                          minWidth: "40px",
                          objectFit: "contain",
                          marginRight: "10px",
                          top: "0",
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/images/asni.jpg";
                        }}
                      />
                      <div className="d-flex flex-column text-start">
                        <span className="small fw-bold text-dark mb-0 leading-tight">
                          {phone.phone_spec?.name ||
                            phone.name ||
                            "Unknown Model"}
                        </span>
                        <span
                          className="text-primary fw-bold"
                          style={{ fontSize: "0.8rem" }}
                        >
                          €
                          {Number(
                            phone.price || phone.phone_spec?.price || 0,
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center text-muted small">
                    Няма намерени резултати за "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>
          {/* КРАЙ НА ТЪРСАЧКАТА */}

          <div className="nav-icons">
            {isAdmin && (
              <Link to="/admin" className="icon-btn" title="Admin Panel">
                <FiShield className="header-icon" />
              </Link>
            )}

            {/* <Link to="#" className="icon-btn">
              <img
                src={SwapIconImage}
                alt="Swap Phones"
                className="custom-swap-icon"
              />{" "}
            </Link> */}

            <Link to="/cart" className="icon-btn position-relative">
              <FiShoppingCart className="header-icon" />

              {totalItems > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{ fontSize: "0.65rem", padding: "0.3em 0.5em" }}
                >
                  {totalItems}
                </span>
              )}
            </Link>

            <div className="user-menu-container">
              <button
                onClick={() => {
                  setIsAccountOpen((open) => !open);
                }}
                className="icon-btn user-btn"
              >
                <LuUserRound className="header-icon" />
              </button>
              {isAccountOpen && !localStorage.getItem("token") && (
                <div className="user-dropdown">
                  <div className="dropdown-arrow"></div>
                  <ul className="dropdown-list">
                    <li>
                      <button
                        onClick={() => {
                          setIsAccountOpen(false);
                          navigate("/login");
                        }}
                      >
                        Login
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setIsAccountOpen(false);
                          navigate("/signup");
                        }}
                      >
                        Register
                      </button>
                    </li>
                  </ul>
                </div>
              )}
              {isAccountOpen && localStorage.getItem("token") && (
                <div className="user-dropdown">
                  <div className="dropdown-arrow"></div>
                  <ul className="dropdown-list">
                    <li>
                      <button
                        onClick={() => {
                          setIsAccountOpen(false);
                          navigate("/account");
                        }}
                      >
                        Account
                      </button>
                    </li>
                    <li>
                      <button onClick={logout}>Logout</button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
