import { Employee, DailyAttendance, WorkAssignment, EmployeePerformance } from '../types/Employee';

const EMPLOYEES_KEY = 'carwash_employees';
const ATTENDANCE_KEY = 'carwash_attendance';
const ASSIGNMENTS_KEY = 'carwash_assignments';
const PERFORMANCE_KEY = 'carwash_performance';

// Employee Management
export const saveEmployees = (employees: Employee[]): void => {
  try {
    localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(employees));
  } catch (error) {
    console.error('Error saving employees to localStorage:', error);
  }
};

export const loadEmployees = (): Employee[] => {
  try {
    const stored = localStorage.getItem(EMPLOYEES_KEY);
    if (stored) {
      const employees = JSON.parse(stored);
      return employees.map((employee: any) => ({
        ...employee,
        createdAt: new Date(employee.createdAt),
      }));
    }
    return [];
  } catch (error) {
    console.error('Error loading employees from localStorage:', error);
    return [];
  }
};

export const addEmployee = (employee: Employee): void => {
  const employees = loadEmployees();
  employees.push(employee);
  saveEmployees(employees);
};

export const updateEmployee = (updatedEmployee: Employee): void => {
  const employees = loadEmployees();
  const index = employees.findIndex(e => e.id === updatedEmployee.id);
  if (index !== -1) {
    employees[index] = updatedEmployee;
    saveEmployees(employees);
  }
};

export const deleteEmployee = (employeeId: string): void => {
  const employees = loadEmployees();
  const filtered = employees.filter(e => e.id !== employeeId);
  saveEmployees(filtered);
};

export const getActiveEmployees = (): Employee[] => {
  return loadEmployees().filter(employee => employee.isActive);
};

export const searchEmployees = (query: string): Employee[] => {
  const employees = loadEmployees();
  const lowercaseQuery = query.toLowerCase();
  
  return employees.filter(employee => 
    employee.firstName.toLowerCase().includes(lowercaseQuery) ||
    employee.lastName.toLowerCase().includes(lowercaseQuery) ||
    employee.email.toLowerCase().includes(lowercaseQuery) ||
    employee.phone.includes(query) ||
    employee.nationalId.includes(query)
  );
};

// Attendance Management
export const saveAttendance = (attendance: DailyAttendance[]): void => {
  try {
    localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(attendance));
  } catch (error) {
    console.error('Error saving attendance to localStorage:', error);
  }
};

export const loadAttendance = (): DailyAttendance[] => {
  try {
    const stored = localStorage.getItem(ATTENDANCE_KEY);
    if (stored) {
      const attendance = JSON.parse(stored);
      return attendance.map((record: any) => ({
        ...record,
        checkInTime: record.checkInTime ? new Date(record.checkInTime) : undefined,
        checkOutTime: record.checkOutTime ? new Date(record.checkOutTime) : undefined,
      }));
    }
    return [];
  } catch (error) {
    console.error('Error loading attendance from localStorage:', error);
    return [];
  }
};

export const markAttendance = (employeeId: string, isPresent: boolean, notes?: string): void => {
  const today = new Date().toISOString().split('T')[0];
  const attendance = loadAttendance();
  
  // Remove existing record for today if any
  const filtered = attendance.filter(record => 
    !(record.employeeId === employeeId && record.date === today)
  );
  
  // Add new record
  const newRecord: DailyAttendance = {
    id: Date.now().toString(),
    employeeId,
    date: today,
    isPresent,
    checkInTime: isPresent ? new Date() : undefined,
    notes,
  };
  
  filtered.push(newRecord);
  saveAttendance(filtered);
};

export const getTodayAttendance = (): DailyAttendance[] => {
  const today = new Date().toISOString().split('T')[0];
  return loadAttendance().filter(record => record.date === today);
};

export const getPresentEmployeesToday = (): Employee[] => {
  const todayAttendance = getTodayAttendance();
  const presentEmployeeIds = todayAttendance
    .filter(record => record.isPresent)
    .map(record => record.employeeId);
  
  const allEmployees = getActiveEmployees();
  return allEmployees.filter(employee => presentEmployeeIds.includes(employee.id));
};

// Work Assignment Management
export const saveAssignments = (assignments: WorkAssignment[]): void => {
  try {
    localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(assignments));
  } catch (error) {
    console.error('Error saving assignments to localStorage:', error);
  }
};

export const loadAssignments = (): WorkAssignment[] => {
  try {
    const stored = localStorage.getItem(ASSIGNMENTS_KEY);
    if (stored) {
      const assignments = JSON.parse(stored);
      return assignments.map((assignment: any) => ({
        ...assignment,
        startTime: new Date(assignment.startTime),
        endTime: assignment.endTime ? new Date(assignment.endTime) : undefined,
      }));
    }
    return [];
  } catch (error) {
    console.error('Error loading assignments from localStorage:', error);
    return [];
  }
};

export const addAssignment = (assignment: WorkAssignment): void => {
  const assignments = loadAssignments();
  assignments.push(assignment);
  saveAssignments(assignments);
};

export const updateAssignment = (updatedAssignment: WorkAssignment): void => {
  const assignments = loadAssignments();
  const index = assignments.findIndex(a => a.id === updatedAssignment.id);
  if (index !== -1) {
    assignments[index] = updatedAssignment;
    saveAssignments(assignments);
  }
};

export const getTodayAssignments = (): WorkAssignment[] => {
  const today = new Date().toISOString().split('T')[0];
  return loadAssignments().filter(assignment => 
    assignment.startTime.toISOString().split('T')[0] === today
  );
};

export const getEmployeeAssignments = (employeeId: string, date?: string): WorkAssignment[] => {
  const assignments = loadAssignments();
  const targetDate = date || new Date().toISOString().split('T')[0];
  
  return assignments.filter(assignment => 
    assignment.employeeId === employeeId &&
    assignment.startTime.toISOString().split('T')[0] === targetDate
  );
};

// Performance Management
export const savePerformance = (performance: EmployeePerformance[]): void => {
  try {
    localStorage.setItem(PERFORMANCE_KEY, JSON.stringify(performance));
  } catch (error) {
    console.error('Error saving performance to localStorage:', error);
  }
};

export const loadPerformance = (): EmployeePerformance[] => {
  try {
    const stored = localStorage.getItem(PERFORMANCE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading performance from localStorage:', error);
    return [];
  }
};

export const calculateDailyPerformance = (employeeId: string, date?: string): EmployeePerformance => {
  const targetDate = date || new Date().toISOString().split('T')[0];
  const assignments = getEmployeeAssignments(employeeId, targetDate);
  
  const completedAssignments = assignments.filter(a => a.status === 'completed');
  const totalServiceTime = completedAssignments.reduce((total, assignment) => {
    if (assignment.endTime) {
      return total + (assignment.endTime.getTime() - assignment.startTime.getTime());
    }
    return total;
  }, 0);
  
  const averageServiceTime = completedAssignments.length > 0 
    ? totalServiceTime / completedAssignments.length / (1000 * 60) // Convert to minutes
    : 0;
  
  return {
    employeeId,
    date: targetDate,
    totalAssignments: assignments.length,
    completedAssignments: completedAssignments.length,
    totalRevenue: 0, // This would need to be calculated based on service pricing
    averageServiceTime,
  };
};

export const getDailyPerformanceReport = (date?: string): EmployeePerformance[] => {
  const targetDate = date || new Date().toISOString().split('T')[0];
  const presentEmployees = getPresentEmployeesToday();
  
  return presentEmployees.map(employee => 
    calculateDailyPerformance(employee.id, targetDate)
  );
};
