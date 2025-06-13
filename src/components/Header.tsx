import React from 'react';

const Header: React.FC = () => (
  <header className="header">
    <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <span role="img" aria-label="car">🚗</span> Safisha Hub
    </h1>
  </header>
);

export default Header;
