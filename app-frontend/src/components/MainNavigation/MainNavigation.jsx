import './MainNavigation.css'
import logo from '../../assets/logo.png'
import SwapIconImage from '../../assets/swap.png'
import { FiShoppingCart } from "react-icons/fi";
import { LuUserRound } from "react-icons/lu";
import { FaFacebook, FaYoutube, FaInstagram, FaTwitter, FaChevronDown, FaSearch } from "react-icons/fa";
import { Link } from 'react-router-dom';


export default function MainNavigation() {
return <header>
    <div className="top-bar">
        <div className="container">
            <div>
                <span>Welcome to SwaPhone online eCommerce store.</span>
            </div>
            <div className="top-bar-right">
                <div className="social-links">
                    <span>Follow us:</span>
                    <Link to="#"><FaTwitter/></Link>
                    <Link to="#"><FaFacebook /></Link>
                    <Link to="#"><FaYoutube/></Link>
                    <Link to="#"><FaInstagram/></Link>
                </div>
                <div className="language-selector">
                    <span>Eng</span>
                    <FaChevronDown/>
                </div>
            </div>
        </div>
    </div>

    <div className="main-nav">
        <div className="container">
            <div className="logo">
                <Link to="/"><img src={logo} alt="SWAPHONE" /></Link>
            </div>

            <div className="search-container">
                <input type="text" placeholder="Search for anything..." />
                <button type="submit"><FaSearch/></button>
            </div>

            <div className="nav-icons">
                <Link to="#" className="icon-btn">
                    <img 
              src={SwapIconImage} 
              alt="Swap Phones" 
              className="custom-swap-icon" 
            /> </Link>
                <Link to="#" className="icon-btn">
                    <FiShoppingCart className="header-icon"/>
                </Link>
                <Link to="#" className="icon-btn">
                    <LuUserRound className="header-icon"/>
                </Link>
            </div>
        </div>
    </div>
</header>
}