export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationalId: string;
  nationalIdImage: string; // Base64 encoded image
  createdAt: Date;
  isActive: boolean;
}

export interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationalId: string;
  nationalIdImage: string;
}

export interface DailyAttendance {
  id: string;
  employeeId: string;
  date: string; // YYYY-MM-DD format
  isPresent: boolean;
  checkInTime?: Date;
  checkOutTime?: Date;
  notes?: string;
}

export interface WorkAssignment {
  id: string;
  employeeId: string;
  customerId: string;
  vehicleLicensePlate: string;
  services: string[];
  startTime: Date;
  endTime?: Date;
  status: 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
}

export interface EmployeePerformance {
  employeeId: string;
  date: string; // YYYY-MM-DD format
  totalAssignments: number;
  completedAssignments: number;
  totalRevenue: number;
  averageServiceTime: number; // in minutes
  customerRatings?: number[];
  notes?: string;
}
