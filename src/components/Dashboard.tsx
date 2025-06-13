import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { loadCustomers } from '../utils/storage';
import { Customer } from '../types/Customer';
import { getActiveEmployees, getTodayAttendance, getTodayAssignments } from '../utils/employeeStorage';
import { Employee, DailyAttendance, WorkAssignment } from '../types/Employee';

const Dashboard: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<DailyAttendance[]>([]);
  const [assignments, setAssignments] = useState<WorkAssignment[]>([]);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalVisits: 0,
    recentCustomers: [] as Customer[],
    totalEmployees: 0,
    presentToday: 0,
    activeAssignments: 0,
  });

  useEffect(() => {
    const loadedCustomers = loadCustomers();
    const loadedEmployees = getActiveEmployees();
    const todayAttendance = getTodayAttendance();
    const todayAssignments = getTodayAssignments();

    setCustomers(loadedCustomers);
    setEmployees(loadedEmployees);
    setAttendance(todayAttendance);
    setAssignments(todayAssignments);

    const totalVisits = loadedCustomers.reduce((sum, customer) => sum + customer.totalVisits, 0);
    const recentCustomers = loadedCustomers
      .sort((a, b) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime())
      .slice(0, 5);

    const presentToday = todayAttendance.filter(record => record.isPresent).length;
    const activeAssignments = todayAssignments.filter(assignment => assignment.status === 'in-progress').length;

    setStats({
      totalCustomers: loadedCustomers.length,
      totalVisits,
      recentCustomers,
      totalEmployees: loadedEmployees.length,
      presentToday,
      activeAssignments,
    });
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>

      {/* Customer Statistics */}
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Customer Statistics</h3>
        <div className="grid grid-3" style={{ marginBottom: '2rem' }}>
          <div className="card">
            <h4>Total Customers</h4>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea' }}>
              {stats.totalCustomers}
            </p>
          </div>

          <div className="card">
            <h4>Total Visits</h4>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea' }}>
              {stats.totalVisits}
            </p>
          </div>

          <div className="card">
            <h4>Average Visits</h4>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea' }}>
              {stats.totalCustomers > 0 ? (stats.totalVisits / stats.totalCustomers).toFixed(1) : '0'}
            </p>
          </div>
        </div>
      </div>

      {/* Employee Statistics */}
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Employee Statistics - Today</h3>
        <div className="grid grid-3" style={{ marginBottom: '2rem' }}>
          <div className="card">
            <h4>Total Employees</h4>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745' }}>
              {stats.totalEmployees}
            </p>
          </div>

          <div className="card">
            <h4>Present Today</h4>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745' }}>
              {stats.presentToday}
            </p>
          </div>

          <div className="card">
            <h4>Active Jobs</h4>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffc107' }}>
              {stats.activeAssignments}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-3">
        <div className="card">
          <h3>Customer Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <Link to="/add-customer" className="btn btn-primary">
              Add New Customer
            </Link>
            <Link to="/customers" className="btn btn-secondary">
              View All Customers
            </Link>
          </div>
        </div>

        <div className="card">
          <h3>Employee Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <Link to="/add-employee" className="btn btn-primary">
              Add New Employee
            </Link>
            <Link to="/attendance" className="btn btn-secondary">
              Mark Attendance
            </Link>
            <Link to="/performance" className="btn btn-secondary">
              View Performance
            </Link>
          </div>
        </div>

        <div className="card">
          <h3>Recent Customers</h3>
          {stats.recentCustomers.length > 0 ? (
            <div style={{ marginTop: '1rem' }}>
              {stats.recentCustomers.map((customer) => (
                <div key={customer.id} style={{ 
                  padding: '0.75rem', 
                  borderBottom: '1px solid #eee',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <strong>{customer.firstName} {customer.lastName}</strong>
                    <br />
                    <small style={{ color: '#666' }}>
                      {customer.vehicle.make} {customer.vehicle.model}
                    </small>
                  </div>
                  <small style={{ color: '#666' }}>
                    {new Date(customer.lastVisit).toLocaleDateString()}
                  </small>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ marginTop: '1rem', color: '#666' }}>No customers yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
