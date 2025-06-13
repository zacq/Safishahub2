import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Carpet } from '../types/Carpet';
import { Customer } from '../types/Customer';
import { Employee } from '../types/Employee';
import { 
  loadCarpets, 
  updateCarpetStatus, 
  deleteCarpet, 
  searchCarpets,
  getCarpetsByStatus,
  getCarpetStats 
} from '../utils/carpetStorage';
import { loadCustomers } from '../utils/storage';
import { loadEmployees } from '../utils/employeeStorage';

const CarpetList: React.FC = () => {
  const [carpets, setCarpets] = useState<Carpet[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Carpet['status'] | 'all'>('all');
  const [stats, setStats] = useState({
    totalCarpets: 0,
    todayCarpets: 0,
    pendingCarpets: 0,
    inProgressCarpets: 0,
    completedCarpets: 0,
    deliveredCarpets: 0,
    totalRevenue: 0,
    todayRevenue: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterCarpets();
  }, [searchQuery, statusFilter]);

  const loadData = () => {
    const loadedCarpets = loadCarpets();
    const loadedCustomers = loadCustomers();
    const loadedEmployees = loadEmployees();
    const carpetStats = getCarpetStats();

    setCarpets(loadedCarpets);
    setCustomers(loadedCustomers);
    setEmployees(loadedEmployees);
    setStats(carpetStats);
  };

  const filterCarpets = () => {
    let filtered = loadCarpets();

    if (statusFilter !== 'all') {
      filtered = getCarpetsByStatus(statusFilter);
    }

    if (searchQuery.trim()) {
      filtered = searchCarpets(searchQuery);
    }

    setCarpets(filtered);
  };

  const handleStatusChange = (carpetId: string, newStatus: Carpet['status']) => {
    updateCarpetStatus(carpetId, newStatus);
    loadData();
  };

  const handleDelete = (carpetId: string) => {
    if (window.confirm('Are you sure you want to delete this carpet job?')) {
      deleteCarpet(carpetId);
      loadData();
    }
  };

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? `${customer.firstName} ${customer.lastName}` : 'Unknown Customer';
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(e => e.id === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown Employee';
  };

  const getStatusColor = (status: Carpet['status']) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'in-progress': return '#17a2b8';
      case 'cleaning': return '#007bff';
      case 'drying': return '#6f42c1';
      case 'completed': return '#28a745';
      case 'delivered': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const getStatusLabel = (status: Carpet['status']) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'in-progress': return 'In Progress';
      case 'cleaning': return 'Cleaning';
      case 'drying': return 'Drying';
      case 'completed': return 'Completed';
      case 'delivered': return 'Delivered';
      default: return status;
    }
  };

  const exportToCSV = () => {
    const headers = [
      'ID', 'Customer', 'Employee', 'Type', 'Size', 'Material', 'Color', 
      'Status', 'Drop-off Date', 'Completion Date', 'Total Price'
    ];

    const csvData = carpets.map(carpet => [
      carpet.id,
      getCustomerName(carpet.customerId),
      getEmployeeName(carpet.employeeId),
      carpet.carpetDetails.type,
      `${carpet.carpetDetails.size.length}x${carpet.carpetDetails.size.width} ${carpet.carpetDetails.size.unit}`,
      carpet.carpetDetails.material,
      carpet.carpetDetails.color,
      carpet.status,
      carpet.timeline.dropOff.toLocaleDateString(),
      carpet.timeline.actualCompletion?.toLocaleDateString() || '',
      `$${carpet.pricing.totalPrice.toFixed(2)}`
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `carpet-jobs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Carpet Management</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/add-carpet" className="btn btn-primary">
            Add New Carpet Job
          </Link>
          <button onClick={exportToCSV} className="btn btn-secondary">
            Export to CSV
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <h4>Total Carpets</h4>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>
            {stats.totalCarpets}
          </p>
        </div>
        <div className="card">
          <h4>Today's Jobs</h4>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#28a745' }}>
            {stats.todayCarpets}
          </p>
        </div>
        <div className="card">
          <h4>In Progress</h4>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ffc107' }}>
            {stats.inProgressCarpets}
          </p>
        </div>
        <div className="card">
          <h4>Total Revenue</h4>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#28a745' }}>
            ${stats.totalRevenue.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="grid grid-2">
          <div className="form-group">
            <label htmlFor="search" className="form-label">Search</label>
            <input
              type="text"
              id="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              placeholder="Search by material, color, type, or status..."
            />
          </div>
          <div className="form-group">
            <label htmlFor="statusFilter" className="form-label">Status Filter</label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as Carpet['status'] | 'all')}
              className="form-select"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="cleaning">Cleaning</option>
              <option value="drying">Drying</option>
              <option value="completed">Completed</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>
      </div>

      {/* Carpet List */}
      {carpets.length === 0 ? (
        <div className="card">
          <p style={{ textAlign: 'center', color: '#666', fontSize: '1.1rem' }}>
            No carpet jobs found. <Link to="/add-carpet">Add your first carpet job</Link>
          </p>
        </div>
      ) : (
        <div className="grid grid-1">
          {carpets.map((carpet) => (
            <div key={carpet.id} className="customer-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 className="customer-name">
                    {carpet.carpetDetails.type.charAt(0).toUpperCase() + carpet.carpetDetails.type.slice(1)} Carpet
                  </h3>
                  <p className="customer-info">
                    <strong>Customer:</strong> {getCustomerName(carpet.customerId)}
                  </p>
                  <p className="customer-info">
                    <strong>Employee:</strong> {getEmployeeName(carpet.employeeId)}
                  </p>
                  <p className="customer-info">
                    <strong>Size:</strong> {carpet.carpetDetails.size.length} x {carpet.carpetDetails.size.width} {carpet.carpetDetails.size.unit}
                  </p>
                  <p className="customer-info">
                    <strong>Material:</strong> {carpet.carpetDetails.material} | <strong>Color:</strong> {carpet.carpetDetails.color}
                  </p>
                  <p className="customer-info">
                    <strong>Drop-off:</strong> {carpet.timeline.dropOff.toLocaleDateString()}
                  </p>
                  {carpet.timeline.estimatedCompletion && (
                    <p className="customer-info">
                      <strong>Estimated Completion:</strong> {carpet.timeline.estimatedCompletion.toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ 
                    padding: '0.5rem 1rem', 
                    backgroundColor: getStatusColor(carpet.status),
                    color: 'white',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    marginBottom: '1rem'
                  }}>
                    {getStatusLabel(carpet.status)}
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#667eea' }}>
                    ${carpet.pricing.totalPrice.toFixed(2)}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <span className="service-tag">{carpet.services.cleaning}</span>
                <span className="service-tag">{carpet.services.drying}</span>
                {carpet.services.protection !== 'none' && (
                  <span className="service-tag">{carpet.services.protection}</span>
                )}
              </div>

              {carpet.carpetDetails.stains && carpet.carpetDetails.stains.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Stains:</strong> {carpet.carpetDetails.stains.join(', ')}
                </div>
              )}

              {carpet.carpetDetails.notes && (
                <div style={{ marginBottom: '1rem', fontStyle: 'italic', color: '#666' }}>
                  "{carpet.carpetDetails.notes}"
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <select
                  value={carpet.status}
                  onChange={(e) => handleStatusChange(carpet.id, e.target.value as Carpet['status'])}
                  style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="cleaning">Cleaning</option>
                  <option value="drying">Drying</option>
                  <option value="completed">Completed</option>
                  <option value="delivered">Delivered</option>
                </select>
                <button 
                  onClick={() => handleDelete(carpet.id)}
                  className="btn btn-danger"
                  style={{ padding: '0.5rem 1rem' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CarpetList; 