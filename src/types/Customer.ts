export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  vehicle: {
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    color?: string;
  };
  services: string[];
  assignedEmployeeId?: string;
  notes?: string;
  createdAt: Date;
  lastVisit: Date;
  totalVisits: number;
  preferredServices?: string[];
}

export interface CustomerFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  licensePlate: string;
  vehicleColor?: string;
  services: string[];
  assignedEmployeeId?: string;
  notes?: string;
}
