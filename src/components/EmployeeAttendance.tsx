import React, { useState, useEffect } from 'react';
import { Employee, DailyAttendance } from '../types/Employee';
import { getActiveEmployees, getTodayAttendance, markAttendance } from '../utils/employeeStorage';

const EmployeeAttendance: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<DailyAttendance[]>([]);
  const [notes, setNotes] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const activeEmployees = getActiveEmployees();
    const todayAttendance = getTodayAttendance();
    setEmployees(activeEmployees);
    setAttendance(todayAttendance);
  };

  const handleAttendanceChange = async (employeeId: string, isPresent: boolean) => {
    setLoading(prev => ({ ...prev, [employeeId]: true }));
    
    try {
      const employeeNotes = notes[employeeId] || '';
      markAttendance(employeeId, isPresent, employeeNotes);
      
      // Reload attendance data
      loadData();
      
      // Clear notes for this employee
      setNotes(prev => ({ ...prev, [employeeId]: '' }));
    } catch (error) {
      console.error('Error marking attendance:', error);
    } finally {
      setLoading(prev => ({ ...prev, [employeeId]: false }));
    }
  };

  const handleNotesChange = (employeeId: string, value: string) => {
    setNotes(prev => ({ ...prev, [employeeId]: value }));
  };

  const getEmployeeAttendance = (employeeId: string): DailyAttendance | undefined => {
    return attendance.find(record => record.employeeId === employeeId);
  };

  const getTodayStats = () => {
    const present = attendance.filter(record => record.isPresent).length;
    const absent = attendance.filter(record => !record.isPresent).length;
    const notMarked = employees.length - attendance.length;
    
    return { present, absent, notMarked, total: employees.length };
  };

  const stats = getTodayStats();
  const today = new Date().toLocaleDateString();

  return (
    <div>
      <h2>Employee Attendance - {today}</h2>
      
      {/* Statistics Cards */}
      <div className="grid grid-3" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <h3>Present</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745' }}>
            {stats.present}
          </p>
        </div>
        
        <div className="card">
          <h3>Absent</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc3545' }}>
            {stats.absent}
          </p>
        </div>
        
        <div className="card">
          <h3>Not Marked</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffc107' }}>
            {stats.notMarked}
          </p>
        </div>
      </div>

      {employees.length === 0 ? (
        <div className="card">
          <p style={{ textAlign: 'center', color: '#666', fontSize: '1.1rem' }}>
            No active employees found. Please register employees first.
          </p>
        </div>
      ) : (
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Mark Attendance</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {employees.map((employee) => {
              const employeeAttendance = getEmployeeAttendance(employee.id);
              const isLoading = loading[employee.id];
              
              return (
                <div 
                  key={employee.id} 
                  style={{ 
                    padding: '1rem', 
                    border: '1px solid #e0e0e0', 
                    borderRadius: '8px',
                    backgroundColor: employeeAttendance 
                      ? (employeeAttendance.isPresent ? '#f8fff8' : '#fff8f8')
                      : '#fffef8'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div>
                      <strong>{employee.firstName} {employee.lastName}</strong>
                      <div style={{ fontSize: '0.875rem', color: '#666' }}>
                        {employee.email} • {employee.phone}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {employeeAttendance && (
                        <span style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          backgroundColor: employeeAttendance.isPresent ? '#d4edda' : '#f8d7da',
                          color: employeeAttendance.isPresent ? '#155724' : '#721c24'
                        }}>
                          {employeeAttendance.isPresent ? 'Present' : 'Absent'}
                          {employeeAttendance.checkInTime && (
                            <span style={{ marginLeft: '0.5rem' }}>
                              ({employeeAttendance.checkInTime.toLocaleTimeString()})
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  {employeeAttendance?.notes && (
                    <div style={{ 
                      fontSize: '0.875rem', 
                      color: '#666', 
                      fontStyle: 'italic',
                      marginBottom: '0.5rem',
                      padding: '0.5rem',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '4px'
                    }}>
                      Note: {employeeAttendance.notes}
                    </div>
                  )}

                  {!employeeAttendance && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <div style={{ marginBottom: '0.5rem' }}>
                        <input
                          type="text"
                          placeholder="Add notes (optional)"
                          value={notes[employee.id] || ''}
                          onChange={(e) => handleNotesChange(employee.id, e.target.value)}
                          className="form-input"
                          style={{ fontSize: '0.875rem' }}
                        />
                      </div>
                      
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleAttendanceChange(employee.id, true)}
                          disabled={isLoading}
                          className="btn btn-primary"
                          style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                        >
                          {isLoading ? 'Marking...' : 'Mark Present'}
                        </button>
                        <button
                          onClick={() => handleAttendanceChange(employee.id, false)}
                          disabled={isLoading}
                          className="btn btn-danger"
                          style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                        >
                          {isLoading ? 'Marking...' : 'Mark Absent'}
                        </button>
                      </div>
                    </div>
                  )}

                  {employeeAttendance && (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to change this attendance record?')) {
                            // Remove the current record and allow re-marking
                            const updatedAttendance = attendance.filter(record => 
                              !(record.employeeId === employee.id && record.date === new Date().toISOString().split('T')[0])
                            );
                            setAttendance(updatedAttendance);
                          }
                        }}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.875rem', padding: '0.25rem 0.5rem' }}
                      >
                        Change
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeAttendance;
