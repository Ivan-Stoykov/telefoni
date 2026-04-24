import MainNavigation from '../MainNavigation/MainNavigation.jsx';
import Footer from '../Footer/Footer.jsx';
import './Layout.css';

export default function Layout({ children }) {
    return (<div className="app-wrapper">
      <MainNavigation />
      
      <main className="main-content">
        {children}
      </main>

      <Footer />
    </div>);
    
}