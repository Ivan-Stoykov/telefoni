import './Footer.css';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { FiPhoneCall } from 'react-icons/fi';

export default function Footer () {

  return (
    <footer className="swaphone-footer">
      <div className="footer-container">
        
        <div className="footer-section about-link">
          <a href="/about">
            <AiOutlineInfoCircle className="footer-icon" />
            <span>About us</span>
          </a>
        </div>

        <div className="footer-section copyright">
          <span>© Copyright 2026 SwaPhone.bg All Rights Reserved!</span>
        </div>

        <div className="footer-section contact-info">
          <a>
            <FiPhoneCall className="footer-icon" />
            <span>+359 700 100 100</span>
          </a>
        </div>

      </div>
    </footer>
  );
};