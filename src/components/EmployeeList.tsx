import React, { useState, useEffect } from 'react';
import { Employee } from '../types/Employee';
import { loadEmployees, deleteEmployee, searchEmployees, updateEmployee } from '../utils/employeeStorage';

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    const loadedEmployees = loadEmployees();
    setEmployees(loadedEmployees);
    setFilteredEmployees(loadedEmployees);
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchEmployees(searchQuery);
      setFilteredEmployees(results);
    } else {
      setFilteredEmployees(employees);
    }
  }, [searchQuery, employees]);

  const handleDelete = (employeeId: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      deleteEmployee(employeeId);
      const updatedEmployees = employees.filter(e => e.id !== employeeId);
      setEmployees(updatedEmployees);
    }
  };

  const toggleEmployeeStatus = (employee: Employee) => {
    const updatedEmployee = { ...employee, isActive: !employee.isActive };
    updateEmployee(updatedEmployee);
    const updatedEmployees = employees.map(e => 
      e.id === employee.id ? updatedEmployee : e
    );
    setEmployees(updatedEmployees);
  };

  const exportToCSV = () => {
    const headers = [
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'National ID',
      'Status',
      'Created Date'
    ];

    const csvContent = [
      headers.join(','),
      ...filteredEmployees.map(employee => [
        employee.firstName,
        employee.lastName,
        employee.email,
        employee.phone,
        employee.nationalId,
        employee.isActive ? 'Active' : 'Inactive',
        new Date(employee.createdAt).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `carwash-employees-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const viewNationalId = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  const closeModal = () => {
    setSelectedEmployee(null);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Employee List ({filteredEmployees.length})</h2>
        <button onClick={exportToCSV} className="btn btn-secondary">
          Export to CSV
        </button>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search employees by name, email, phone, or National ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-input"
        />
      </div>

      {filteredEmployees.length === 0 ? (
        <div className="card">
          <p style={{ textAlign: 'center', color: '#666', fontSize: '1.1rem' }}>
            {employees.length === 0 ? 'No employees found. Register your first employee!' : 'No employees match your search.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-2">
          {filteredEmployees.map((employee) => (
            <div key={employee.id} className="customer-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div className="customer-name">
                  {employee.firstName} {employee.lastName}
                </div>
                <span 
                  style={{ 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '12px', 
                    fontSize: '0.75rem',
                    backgroundColor: employee.isActive ? '#e8f5e8' : '#ffeaa7',
                    color: employee.isActive ? '#2d5a2d' : '#b8860b'
                  }}
                >
                  {employee.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div className="customer-info">
                📧 {employee.email}
              </div>
              
              <div className="customer-info">
                📞 {employee.phone}
              </div>
              
              <div className="customer-info">
                🆔 {employee.nationalId}
              </div>
              
              <div className="customer-info">
                📅 Registered: {new Date(employee.createdAt).toLocaleDateString()}
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => viewNationalId(employee)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                >
                  View ID
                </button>
                <button
                  onClick={() => toggleEmployeeStatus(employee)}
                  className={`btn ${employee.isActive ? 'btn-secondary' : 'btn-primary'}`}
                  style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                >
                  {employee.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => handleDelete(employee.id)}
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

      {/* National ID Modal */}
      {selectedEmployee && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            maxWidth: '500px',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>National ID - {selectedEmployee.firstName} {selectedEmployee.lastName}</h3>
              <button
                onClick={closeModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ×
              </button>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ marginBottom: '1rem', color: '#666' }}>
                National ID: {selectedEmployee.nationalId}
              </p>
              <img
                src={selectedEmployee.nationalIdImage}
                alt="National ID"
                style={{
                  maxWidth: '100%',
                  maxHeight: '400px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  objectFit: 'contain'
                }}
              />
            </div>
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <button onClick={closeModal} className="btn btn-primary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
