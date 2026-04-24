import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaArrowRight } from "react-icons/fa";
import "./Auth.css";
import { useState } from "react";

export default function LoginPage() {

  const [error, setError] = useState();
  const navigate = useNavigate();

  async function login(event){

    event.preventDefault();
    
    const fd = new FormData(event.target);
    const email = fd.get("email");
    const password = fd.get("password");

    const response = await fetch("http://localhost:8000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    const resData = await response.json();

    if(response.ok){
      localStorage.setItem("token", resData.token);
      localStorage.setItem("user", JSON.stringify(resData));
      return navigate("/");
    } else {
      setError(Object.values(resData.ValidationError));
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-tabs">
          <button className="tab active">Sign In</button>
          <Link to="/signup" className="tab">
            Sign Up
          </Link>
        </div>
        {
          error && <div className="error-message">{error}</div>
        }

        <form className="auth-form" onSubmit={login}>
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" name="email" placeholder="email@example.com" required />
          </div>

          <div className="input-group">
            <div className="label-row">
              <label>Password</label>
              <a href="#" className="forgot-pass">
                Forget Password
              </a>
            </div>
            <div className="password-wrapper">
              <input
                type="password"
                placeholder="at least 8 characters"
                name="password"
                required
              />
              <FaEye className="eye-icon" />
            </div>
          </div>

          <button type="submit" className="submit-btn">
            SIGN IN <FaArrowRight />
          </button>
        </form>
      </div>
    </div>
  );
}
