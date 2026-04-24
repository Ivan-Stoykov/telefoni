import "./MainNavigation.css";
import logo from "../../assets/logo.png";
import SwapIconImage from "../../assets/swap.png";
import { FiShoppingCart } from "react-icons/fi";
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
import { useState } from "react";

export default function MainNavigation() {
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const navigate = useNavigate();

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

          <div className="search-container">
            <input type="text" placeholder="Search for anything..." />
            <button type="submit">
              <FaSearch />
            </button>
          </div>

          <div className="nav-icons">
            <Link to="#" className="icon-btn">
              <img
                src={SwapIconImage}
                alt="Swap Phones"
                className="custom-swap-icon"
              />{" "}
            </Link>

            <Link to="#" className="icon-btn">
              <FiShoppingCart className="header-icon" />
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
                          navigate("/login");
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
