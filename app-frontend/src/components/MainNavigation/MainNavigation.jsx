import './MainNavigation.css'
import logo from '../../assets/logo.png'
import SwapIconImage from '../../assets/swap.png'
import { FiShoppingCart } from "react-icons/fi";
import { LuUserRound } from "react-icons/lu";
import { FaFacebook, FaYoutube, FaInstagram, FaTwitter, FaChevronDown, FaSearch } from "react-icons/fa";


export default function MainNavigation() {
return <header>
    <div class="top-bar">
        <div class="container">
            <div>
                <span>Welcome to SwaPhone online eCommerce store.</span>
            </div>
            <div class="top-bar-right">
                <div class="social-links">
                    <span>Follow us:</span>
                    <a href="#"><FaTwitter/></a>
                    <a href="#"><FaFacebook /></a>
                    <a href="#"><FaYoutube/></a>
                    <a href="#"><FaInstagram/></a>
                </div>
                <div class="language-selector">
                    <span>Eng</span>
                    <FaChevronDown/>
                </div>
            </div>
        </div>
    </div>

    <div class="main-nav">
        <div class="container">
            <div class="logo">
                <img src={logo} alt="SWAPHONE" />
            </div>

            <div class="search-container">
                <input type="text" placeholder="Search for anything..." />
                <button type="submit"><FaSearch/></button>
            </div>

            <div class="nav-icons">
                <a href="#" class="icon-btn">
                    <img 
              src={SwapIconImage} 
              alt="Swap Phones" 
              className="custom-swap-icon" 
            /> </a>
                <a href="#" class="icon-btn">
                    <FiShoppingCart class="header-icon"/>
                </a>
                <a href="#" class="icon-btn">
                    <LuUserRound class="header-icon"/>
                </a>
            </div>
        </div>
    </div>
</header>
}