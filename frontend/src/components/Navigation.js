import React from 'react';
import { NavLink } from 'react-router-dom';

function Navigation() {
  return (
    <nav className="navigation">
      <div className="nav-tabs">
        <NavLink 
          to="/" 
          className={({ isActive }) => isActive ? 'nav-tab active' : 'nav-tab'}
          end
        >
          Single Analysis
        </NavLink>
        <NavLink 
          to="/compare" 
          className={({ isActive }) => isActive ? 'nav-tab active' : 'nav-tab'}
        >
          Compare Degrees
        </NavLink>
      </div>
    </nav>
  );
}

export default Navigation;