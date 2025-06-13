import React, { useState, useEffect } from 'react';
import { Customer } from '../types/Customer';
import { loadCustomers, deleteCustomer, searchCustomers } from '../utils/storage';
import { loadEmployees } from '../utils/employeeStorage';
import { Employee } from '../types/Employee';

const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const loadedCustomers = loadCustomers();
    const loadedEmployees = loadEmployees();
    setCustomers(loadedCustomers);
    setEmployees(loadedEmployees);
    setFilteredCustomers(loadedCustomers);
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchCustomers(searchQuery);
      setFilteredCustomers(results);
    } else {
      setFilteredCustomers(customers);
    }
  }, [searchQuery, customers]);

  const handleDelete = (customerId: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      deleteCustomer(customerId);
      const updatedCustomers = customers.filter(c => c.id !== customerId);
      setCustomers(updatedCustomers);
    }
  };

  const getEmployeeName = (employeeId?: string): string => {
    if (!employeeId) return 'Not assigned';
    const employee = employees.find(e => e.id === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown Employee';
  };

  const exportToCSV = () => {
    const headers = [
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'Vehicle Make',
      'Vehicle Model',
      'Vehicle Year',
      'License Plate',
      'Vehicle Color',
      'Services',
      'Assigned Employee',
      'Total Visits',
      'Last Visit',
      'Notes'
    ];

    const csvContent = [
      headers.join(','),
      ...filteredCustomers.map(customer => [
        customer.firstName,
        customer.lastName,
        customer.email,
        customer.phone,
        customer.vehicle.make,
        customer.vehicle.model,
        customer.vehicle.year,
        customer.vehicle.licensePlate,
        customer.vehicle.color || '',
        `"${customer.services.join('; ')}"`,
        getEmployeeName(customer.assignedEmployeeId),
        customer.totalVisits,
        new Date(customer.lastVisit).toLocaleDateString(),
        `"${customer.notes || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `carwash-customers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Customer List ({filteredCustomers.length})</h2>
        <button onClick={exportToCSV} className="btn btn-secondary">
          Export to CSV
        </button>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search customers by name, email, phone, or license plate..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-input"
        />
      </div>

      {filteredCustomers.length === 0 ? (
        <div className="card">
          <p style={{ textAlign: 'center', color: '#666', fontSize: '1.1rem' }}>
            {customers.length === 0 ? 'No customers found. Add your first customer!' : 'No customers match your search.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-2">
          {filteredCustomers.map((customer) => (
            <div key={customer.id} className="customer-card">
              <div className="customer-name">
                {customer.firstName} {customer.lastName}
              </div>
              
              <div className="customer-info">
                📧 {customer.email}
              </div>
              
              <div className="customer-info">
                📞 {customer.phone}
              </div>
              
              <div className="customer-info">
                🚗 {customer.vehicle.year} {customer.vehicle.make} {customer.vehicle.model}
                {customer.vehicle.color && ` (${customer.vehicle.color})`}
              </div>
              
              <div className="customer-info">
                🏷️ {customer.vehicle.licensePlate}
              </div>
              
              <div className="customer-info">
                📅 Last visit: {new Date(customer.lastVisit).toLocaleDateString()}
              </div>
              
              <div className="customer-info">
                🔢 Total visits: {customer.totalVisits}
              </div>

              <div className="customer-info">
                👷 Assigned to: {getEmployeeName(customer.assignedEmployeeId)}
              </div>

              {customer.services.length > 0 && (
                <div className="services-list">
                  {customer.services.map((service, index) => (
                    <span key={index} className="service-tag">
                      {service}
                    </span>
                  ))}
                </div>
              )}

              {customer.notes && (
                <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                  <strong>Notes:</strong> {customer.notes}
                </div>
              )}

              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => handleDelete(customer.id)}
                  className="btn btn-danger"
                  style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
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

export default CustomerList;
