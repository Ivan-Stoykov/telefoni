import './Footer.css';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { FiPhoneCall } from 'react-icons/fi';
import { Link } from 'react-router-dom'

export default function Footer () {

  return (
    <footer className="swaphone-footer">
      <div className="footer-container">
        
        <div className="footer-section about-link">
          <Link to="/about">
            <AiOutlineInfoCircle className="footer-icon" />
            <span>About us</span>
          </Link>
        </div>

        <div className="footer-section copyright">
          <span>© Copyright 2026 SwaPhone.bg All Rights Reserved!</span>
        </div>

        <div className="footer-section contact-info">
          <Link>
            <FiPhoneCall className="footer-icon" />
            <span>+359 700 100 100</span>
          </Link>
        </div>

      </div>
    </footer>
  );
};