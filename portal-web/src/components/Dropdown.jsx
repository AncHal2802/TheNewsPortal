import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "./Dropdown.css";

const Dropdown = ({ title, items }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  return (
    <div className="dropdown" onMouseLeave={closeDropdown}>
      <div className="dropdown-toggle" onClick={toggleDropdown}>
        {title} <i className={`fa-solid fa-caret-${isOpen ? 'up' : 'down'}`}></i>
      </div>
      {isOpen && (
        <div className="dropdown-content">
          {items.map((item, index) => (
            <Link key={index} to={item.url} onClick={closeDropdown}>
              {item.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
