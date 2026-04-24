import { Outlet } from 'react-router-dom';
import MainNavigation from '../MainNavigation/MainNavigation.jsx';
import Footer from '../Footer/Footer.jsx';
import './Layout.css';

export default function Layout() {
    return (<div className="app-wrapper">
      <MainNavigation />
      
      <main className="main-content">
        <Outlet/>
      </main>

      <Footer />
    </div>);
    
}