import { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const location = useLocation();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [showGroups, setShowGroups] = useState(false);
  const [hoveringDashboard, setHoveringDashboard] = useState(false);
  const [hoveringMenu, setHoveringMenu] = useState(false);
  const [toggledByClick, setToggledByClick] = useState(false);
  const menuTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isActive = (path: string) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  const toggleGroup = (group: string) => {
    setOpenGroup(openGroup === group ? null : group);
  };

  // Show menu groups on hover or click over Dashboard (home page only)
  const handleDashboardMouseEnter = () => {
    if (location.pathname === '/') {
      setHoveringDashboard(true);
      setShowGroups(true);
      if (menuTimeout.current) clearTimeout(menuTimeout.current);
    }
  };
  const handleDashboardMouseLeave = () => {
    if (location.pathname === '/') {
      setHoveringDashboard(false);
      // Delay hiding to allow moving to menu
      menuTimeout.current = setTimeout(() => {
        if (!hoveringMenu && !toggledByClick) setShowGroups(false);
      }, 100);
    }
  };
  const handleDashboardClick = (e: React.MouseEvent) => {
    if (location.pathname === '/') {
      e.preventDefault();
      setToggledByClick((prev) => {
        const newState = !prev;
        setShowGroups(newState);
        return newState;
      });
    }
  };
  const handleMenuMouseEnter = () => {
    setHoveringMenu(true);
    if (menuTimeout.current) clearTimeout(menuTimeout.current);
    setShowGroups(true);
  };
  const handleMenuMouseLeave = () => {
    setHoveringMenu(false);
    // Delay hiding to allow moving back to Dashboard
    menuTimeout.current = setTimeout(() => {
      if (!hoveringDashboard && !toggledByClick) setShowGroups(false);
    }, 100);
  };

  const renderMenuGroups = () => (
    <div
      onMouseEnter={handleMenuMouseEnter}
      onMouseLeave={handleMenuMouseLeave}
      style={{ width: '100%' }}
    >
      <ul style={{ flexDirection: 'column', gap: 0, margin: 0, padding: 0 }}>
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
    </div>
  );

  return (
    <nav className="nav">
      <ul className="nav-list" style={{ flexDirection: 'column', gap: 0 }}>
        <li
          onMouseEnter={handleDashboardMouseEnter}
          onMouseLeave={handleDashboardMouseLeave}
        >
          <Link
            to="/"
            className={isActive('/')}
            style={{ cursor: 'pointer' }}
            onClick={handleDashboardClick}
          >
            Dashboard
          </Link>
        </li>
        {/* Only show menu groups if not on home, or if on home and showGroups is true */}
        {location.pathname !== '/' || showGroups ? renderMenuGroups() : null}
      </ul>
    </nav>
  );
};

export default Navigation;
