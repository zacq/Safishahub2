import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  return (
    <nav className="nav">
      <ul className="nav-list">
        <li>
          <Link to="/" className={isActive('/')}>
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/add-customer" className={isActive('/add-customer')}>
            Add Customer
          </Link>
        </li>
        <li>
          <Link to="/customers" className={isActive('/customers')}>
            View Customers
          </Link>
        </li>
        <li>
          <Link to="/employees" className={isActive('/employees')}>
            Employees
          </Link>
        </li>
        <li>
          <Link to="/add-employee" className={isActive('/add-employee')}>
            Add Employee
          </Link>
        </li>
        <li>
          <Link to="/attendance" className={isActive('/attendance')}>
            Attendance
          </Link>
        </li>
        <li>
          <Link to="/performance" className={isActive('/performance')}>
            Performance
          </Link>
        </li>
        <li>
          <Link to="/carpets" className={isActive('/carpets')}>
            Carpets
          </Link>
        </li>
        <li>
          <Link to="/add-carpet" className={isActive('/add-carpet')}>
            Add Carpet
          </Link>
        </li>
        <li>
          <Link to="/carpet-tracking" className={isActive('/carpet-tracking')}>
            Carpet Tracking
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
