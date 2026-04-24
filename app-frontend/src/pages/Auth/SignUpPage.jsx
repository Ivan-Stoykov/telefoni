import { FaEye, FaArrowRight } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import { useState } from "react";

export default function SignUpPage() {
  const [error, setError] = useState();
  const navigate = useNavigate();

  async function signup(event) {
    event.preventDefault();

    const fd = new FormData(event.target);
    const name = fd.get("name");
    const email = fd.get("email");
    const password = fd.get("password");
    const password_confirmation = fd.get("password_confirmation");
    if (password !== password_confirmation) {
      return setError(["Password and Confirm Password must be same."]);
    }
    const response = await fetch("http://localhost:8000/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });
    const resData = await response.json();
    console.log(resData);
    if (resData.token) {
      localStorage.setItem("token", resData.token);
      localStorage.setItem("user", JSON.stringify(resData));
      return navigate("/");
    } else {
      if (resData.ValidationError) {
      setError(Object.values(resData.ValidationError));
    }
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-tabs">
          <Link to="/login" className="tab">
            Sign In
          </Link>
          <button className="tab active">Sign Up</button>
        </div>

        <form className="auth-form" onSubmit={signup}>
          {error && (
            <div className="error-message">
              {error.map((e) => (
                <p key={e}>{e}</p>
              ))}
            </div>
          )}
          <div className="input-group">
            <label>Name</label>
            <input name="name" type="text" placeholder="Your Name" required />
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <input name="email" type="email" placeholder="email@example.com" required />
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                name="password"
                type="password"
                placeholder="at least 8 characters"
                required
              />
              <FaEye className="eye-icon" />
            </div>
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <div className="password-wrapper">
              <input
                name="password_confirmation"
                type="password"
                placeholder="Confirm your password"
                required
              />
              <FaEye className="eye-icon" />
            </div>
          </div>

          <div className="checkbox-group">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">
              Are you agree to SwaPhone <a href="#">Terms of Condition</a> and{" "}
              <a href="#">Privacy Policy</a>.
            </label>
          </div>

          <button type="submit" className="submit-btn">
            SIGN UP <FaArrowRight />
          </button>
        </form>
      </div>
    </div>
  );
}
