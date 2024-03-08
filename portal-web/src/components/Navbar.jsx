// Navbar.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MenuItems } from './MenuItems';
import './Navbar.css';
import Login from './login';
import SearchBar from './SearchBar';
import DateTimeDisplay from './DateTimeDisplay';
import Dropdown from './Dropdown';

const Navbar = ({ onSearch }) => {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false); // Added state for mobile menu
  const location = useLocation();
  const logged = window.localStorage.getItem("userLogged");
  const userType = window.localStorage.getItem("userType");

  const handleScroll = () => {
    const currentScrollPos = window.scrollY;

    if (currentScrollPos === 0) {
      setVisible(true);
    } else if (prevScrollPos < currentScrollPos && visible) {
      setVisible(false);
    } else if (prevScrollPos > currentScrollPos && !visible) {
      setVisible(true);
    }

    setPrevScrollPos(currentScrollPos);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prevScrollPos, visible]);

  const excludePaths = ['/', '/admin', '/politics', '/business', '/sports', '/entertainment', '/login', '/register', '/subscription', '/business','/crime','/pahadi','/health','/science','/esports','/trading','/crypto'];

  return (
    <nav className={`NavbarItem ${visible ? '' : 'scrolled'}`}>
      <div className='menu-icons'>
        <i className='fa fa-bars' onClick={toggleMobileMenu}></i>
      </div>
      <div className='nav-logo-container'>
        <h1 className='navbar-logo'>The News Portal</h1>
        <DateTimeDisplay />
      </div>
     

      {excludePaths.indexOf(location.pathname) === -1 && (
        <div className='search-icon-container'>
        </div>
      )}

      {excludePaths.indexOf(location.pathname) === -1 && <SearchBar onSearch={onSearch} />}

      <ul className={`nav-menu ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
        <li>
          {userType === "Admin" && <Link className="nav-links" to="/admin">
            <i className="fa-solid fa-user"></i> Admin
          </Link>
          }
        </li>
        {MenuItems.map((item, index) => (

          <li key={index}>
            <Link className={item.cName} to={item.url}>
              <i className={item.icon}></i> {item.title}
              
            </Link>
          </li>
        ))}
          <Dropdown title="More" items={[
            { title:'Entertainment', url: '/entertainment' },
            { title: 'Trading', url: '/trading' },
            { title: 'Crypto', url: '/crypto' },
            { title: 'Crime', url: '/crime' },
            { title: 'Esports', url: '/esports' },
            { title: 'Science', url: '/science' },
            { title: 'Health', url: '/health' },
            { title: 'Pahadi', url: '/pahadi' },
          ]} />
        {logged === "false" &&
          <li>
            <Link type='button' className='nav-mobile' to='/login'>
              Login
            </Link>
          </li>}
        {logged === "true" &&
          <li>
            <Link type='button' className='nav-mobile' to='/login' onClick={() => window.localStorage.clear(  )}>
              Logout
            </Link>
          </li>}
      </ul>
    </nav>
  );
};

export default Navbar;
