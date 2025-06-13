import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const location = useLocation();
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  const isActive = (path: string) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  const toggleGroup = (group: string) => {
    setOpenGroup(openGroup === group ? null : group);
  };

  return (
    <nav className="nav">
      <ul className="nav-list" style={{ flexDirection: 'column', gap: 0 }}>
        <li>
          <Link to="/" className={isActive('/')}>Dashboard</Link>
        </li>
        {/* Customer Group */}
        <li>
          <button
            className="nav-group-btn"
            aria-expanded={openGroup === 'customer'}
            onClick={() => toggleGroup('customer')}
            style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '1rem 0', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}
          >
            Customer {openGroup === 'customer' ? '▲' : '▼'}
          </button>
          {openGroup === 'customer' && (
            <ul className="nav-sublist">
              <li><Link to="/add-customer" className={isActive('/add-customer')}>Add Customer</Link></li>
              <li><Link to="/customers" className={isActive('/customers')}>View Customers</Link></li>
            </ul>
          )}
        </li>
        {/* Employee Group */}
        <li>
          <button
            className="nav-group-btn"
            aria-expanded={openGroup === 'employee'}
            onClick={() => toggleGroup('employee')}
            style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '1rem 0', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}
          >
            Employee {openGroup === 'employee' ? '▲' : '▼'}
          </button>
          {openGroup === 'employee' && (
            <ul className="nav-sublist">
              <li><Link to="/employees" className={isActive('/employees')}>Employees</Link></li>
              <li><Link to="/add-employee" className={isActive('/add-employee')}>Add Employee</Link></li>
              <li><Link to="/attendance" className={isActive('/attendance')}>Attendance</Link></li>
              <li><Link to="/performance" className={isActive('/performance')}>Performance</Link></li>
            </ul>
          )}
        </li>
        {/* Carpet Group */}
        <li>
          <button
            className="nav-group-btn"
            aria-expanded={openGroup === 'carpet'}
            onClick={() => toggleGroup('carpet')}
            style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '1rem 0', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}
          >
            Carpet {openGroup === 'carpet' ? '▲' : '▼'}
          </button>
          {openGroup === 'carpet' && (
            <ul className="nav-sublist">
              <li><Link to="/carpets" className={isActive('/carpets')}>Carpets</Link></li>
              <li><Link to="/add-carpet" className={isActive('/add-carpet')}>Add Carpet</Link></li>
              <li><Link to="/carpet-tracking" className={isActive('/carpet-tracking')}>Carpet Tracking</Link></li>
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
