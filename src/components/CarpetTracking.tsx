import React, { useState, useEffect } from 'react';
import { Carpet } from '../types/Carpet';
import { Customer } from '../types/Customer';
import { Employee } from '../types/Employee';
import { 
  loadCarpets, 
  getTodayCarpets,
  getEmployeeCarpetWorkload,
  updateCarpetStatus 
} from '../utils/carpetStorage';
import { loadCustomers } from '../utils/storage';
import { loadEmployees } from '../utils/employeeStorage';

const CarpetTracking: React.FC = () => {
  const [carpets, setCarpets] = useState<Carpet[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadData();
  }, [selectedEmployee]);

  const loadData = () => {
    const loadedCarpets = loadCarpets();
    const loadedCustomers = loadCustomers();
    const loadedEmployees = loadEmployees();

    setCarpets(loadedCarpets);
    setCustomers(loadedCustomers);
    setEmployees(loadedEmployees);
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

  const handleStatusChange = (carpetId: string, newStatus: Carpet['status']) => {
    updateCarpetStatus(carpetId, newStatus);
    loadData();
  };

  const getFilteredCarpets = () => {
    if (selectedEmployee === 'all') {
      return carpets.filter(carpet => 
        ['pending', 'in-progress', 'cleaning', 'drying'].includes(carpet.status)
      );
    }
    return getEmployeeCarpetWorkload(selectedEmployee);
  };

  const getTodayCarpets = () => {
    const today = new Date().toISOString().split('T')[0];
    return carpets.filter(carpet => 
      carpet.timeline.dropOff.toISOString().split('T')[0] === today
    );
  };

  const getEmployeeStats = (employeeId: string) => {
    const employeeCarpets = carpets.filter(carpet => carpet.employeeId === employeeId);
    const todayCarpets = getTodayCarpets().filter(carpet => carpet.employeeId === employeeId);
    const activeCarpets = employeeCarpets.filter(carpet => 
      ['pending', 'in-progress', 'cleaning', 'drying'].includes(carpet.status)
    );
    const completedToday = todayCarpets.filter(carpet => 
      ['completed', 'delivered'].includes(carpet.status)
    );

    return {
      total: employeeCarpets.length,
      today: todayCarpets.length,
      active: activeCarpets.length,
      completedToday: completedToday.length,
    };
  };

  const todayCarpets = getTodayCarpets();
  const filteredCarpets = getFilteredCarpets();

  return (
    <div>
      <h2>Carpet Tracking Dashboard</h2>

      {/* Today's Overview */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3>Today's Overview</h3>
        <div className="grid grid-4">
          <div>
            <h4>Total Jobs Today</h4>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea' }}>
              {todayCarpets.length}
            </p>
          </div>
          <div>
            <h4>In Progress</h4>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffc107' }}>
              {todayCarpets.filter(c => ['in-progress', 'cleaning', 'drying'].includes(c.status)).length}
            </p>
          </div>
          <div>
            <h4>Completed Today</h4>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745' }}>
              {todayCarpets.filter(c => ['completed', 'delivered'].includes(c.status)).length}
            </p>
          </div>
          <div>
            <h4>Revenue Today</h4>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745' }}>
              ${todayCarpets
                .filter(c => c.status === 'delivered')
                .reduce((sum, c) => sum + c.pricing.totalPrice, 0)
                .toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Employee Workload */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3>Employee Workload</h3>
        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label htmlFor="employeeFilter" className="form-label">Filter by Employee</label>
          <select
            id="employeeFilter"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="form-select"
            style={{ maxWidth: '300px' }}
          >
            <option value="all">All Employees</option>
            {employees.map(employee => (
              <option key={employee.id} value={employee.id}>
                {employee.firstName} {employee.lastName}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-3">
          {employees.map(employee => {
            const stats = getEmployeeStats(employee.id);
            return (
              <div key={employee.id} className="card" style={{ 
                border: selectedEmployee === employee.id ? '2px solid #667eea' : '1px solid #ddd',
                backgroundColor: selectedEmployee === employee.id ? '#f8f9ff' : 'white'
              }}>
                <h4>{employee.firstName} {employee.lastName}</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '1rem' }}>
                  <div>
                    <small>Total Jobs</small>
                    <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#667eea' }}>
                      {stats.total}
                    </p>
                  </div>
                  <div>
                    <small>Today</small>
                    <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#28a745' }}>
                      {stats.today}
                    </p>
                  </div>
                  <div>
                    <small>Active</small>
                    <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#ffc107' }}>
                      {stats.active}
                    </p>
                  </div>
                  <div>
                    <small>Completed</small>
                    <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#28a745' }}>
                      {stats.completedToday}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Jobs */}
      <div className="card">
        <h3>Active Jobs {selectedEmployee !== 'all' && `- ${getEmployeeName(selectedEmployee)}`}</h3>
        
        {filteredCarpets.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', fontSize: '1.1rem' }}>
            No active carpet jobs found.
          </p>
        ) : (
          <div className="grid grid-1">
            {filteredCarpets.map((carpet) => (
              <div key={carpet.id} className="customer-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h4 style={{ marginBottom: '0.5rem' }}>
                      {carpet.carpetDetails.type.charAt(0).toUpperCase() + carpet.carpetDetails.type.slice(1)} Carpet
                    </h4>
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
                      <strong>Drop-off:</strong> {carpet.timeline.dropOff.toLocaleDateString()} at {carpet.timeline.dropOff.toLocaleTimeString()}
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

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <label style={{ fontWeight: 'bold' }}>Update Status:</label>
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CarpetTracking; 