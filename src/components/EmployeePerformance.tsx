import React, { useState, useEffect } from 'react';
import { Employee, EmployeePerformance } from '../types/Employee';
import { getActiveEmployees, getDailyPerformanceReport, getEmployeeAssignments } from '../utils/employeeStorage';

const EmployeePerformanceComponent: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [performanceData, setPerformanceData] = useState<EmployeePerformance[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPerformanceData();
  }, [selectedDate]);

  const loadPerformanceData = async () => {
    setLoading(true);
    try {
      const activeEmployees = getActiveEmployees();
      const performance = getDailyPerformanceReport(selectedDate);
      setEmployees(activeEmployees);
      setPerformanceData(performance);
    } catch (error) {
      console.error('Error loading performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEmployeeName = (employeeId: string): string => {
    const employee = employees.find(e => e.id === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown Employee';
  };

  const calculateTotalStats = () => {
    const totalAssignments = performanceData.reduce((sum, p) => sum + p.totalAssignments, 0);
    const totalCompleted = performanceData.reduce((sum, p) => sum + p.completedAssignments, 0);
    const averageCompletion = totalAssignments > 0 ? (totalCompleted / totalAssignments) * 100 : 0;
    const activeEmployeesCount = performanceData.filter(p => p.totalAssignments > 0).length;

    return {
      totalAssignments,
      totalCompleted,
      averageCompletion,
      activeEmployeesCount
    };
  };

  const exportPerformanceReport = () => {
    const headers = [
      'Employee Name',
      'Total Assignments',
      'Completed Assignments',
      'Completion Rate (%)',
      'Average Service Time (min)',
      'Date'
    ];

    const csvContent = [
      headers.join(','),
      ...performanceData.map(performance => [
        getEmployeeName(performance.employeeId),
        performance.totalAssignments,
        performance.completedAssignments,
        performance.totalAssignments > 0 
          ? ((performance.completedAssignments / performance.totalAssignments) * 100).toFixed(1)
          : '0',
        performance.averageServiceTime.toFixed(1),
        performance.date
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `employee-performance-${selectedDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalStats = calculateTotalStats();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Employee Performance Report</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="form-input"
            style={{ width: 'auto' }}
          />
          <button onClick={exportPerformanceReport} className="btn btn-secondary">
            Export Report
          </button>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-3" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <h3>Total Assignments</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea' }}>
            {totalStats.totalAssignments}
          </p>
        </div>
        
        <div className="card">
          <h3>Completed</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745' }}>
            {totalStats.totalCompleted}
          </p>
        </div>
        
        <div className="card">
          <h3>Completion Rate</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffc107' }}>
            {totalStats.averageCompletion.toFixed(1)}%
          </p>
        </div>
      </div>

      {loading ? (
        <div className="card">
          <p style={{ textAlign: 'center', color: '#666' }}>Loading performance data...</p>
        </div>
      ) : performanceData.length === 0 ? (
        <div className="card">
          <p style={{ textAlign: 'center', color: '#666', fontSize: '1.1rem' }}>
            No performance data available for {new Date(selectedDate).toLocaleDateString()}.
          </p>
        </div>
      ) : (
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Individual Performance</h3>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
                    Employee
                  </th>
                  <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>
                    Assignments
                  </th>
                  <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>
                    Completed
                  </th>
                  <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>
                    Rate
                  </th>
                  <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>
                    Avg Time (min)
                  </th>
                  <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody>
                {performanceData
                  .sort((a, b) => b.completedAssignments - a.completedAssignments)
                  .map((performance, index) => {
                    const completionRate = performance.totalAssignments > 0 
                      ? (performance.completedAssignments / performance.totalAssignments) * 100 
                      : 0;
                    
                    const getPerformanceColor = (rate: number) => {
                      if (rate >= 90) return '#28a745';
                      if (rate >= 70) return '#ffc107';
                      return '#dc3545';
                    };

                    const getPerformanceLabel = (rate: number) => {
                      if (rate >= 90) return 'Excellent';
                      if (rate >= 70) return 'Good';
                      if (rate >= 50) return 'Average';
                      return 'Needs Improvement';
                    };

                    return (
                      <tr key={performance.employeeId} style={{ borderBottom: '1px solid #dee2e6' }}>
                        <td style={{ padding: '0.75rem' }}>
                          <strong>{getEmployeeName(performance.employeeId)}</strong>
                        </td>
                        <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                          {performance.totalAssignments}
                        </td>
                        <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                          {performance.completedAssignments}
                        </td>
                        <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                          <span style={{ 
                            color: getPerformanceColor(completionRate),
                            fontWeight: 'bold'
                          }}>
                            {completionRate.toFixed(1)}%
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                          {performance.averageServiceTime.toFixed(1)}
                        </td>
                        <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                          <span style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            backgroundColor: `${getPerformanceColor(completionRate)}20`,
                            color: getPerformanceColor(completionRate),
                            fontWeight: 'bold'
                          }}>
                            {getPerformanceLabel(completionRate)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          {performanceData.length > 0 && (
            <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
              <h4 style={{ marginBottom: '0.5rem' }}>Summary for {new Date(selectedDate).toLocaleDateString()}</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <strong>Active Employees:</strong> {totalStats.activeEmployeesCount}
                </div>
                <div>
                  <strong>Total Work Orders:</strong> {totalStats.totalAssignments}
                </div>
                <div>
                  <strong>Completed Orders:</strong> {totalStats.totalCompleted}
                </div>
                <div>
                  <strong>Overall Completion Rate:</strong> {totalStats.averageCompletion.toFixed(1)}%
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EmployeePerformanceComponent;
