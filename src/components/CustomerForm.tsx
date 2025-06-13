import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Customer, CustomerFormData } from '../types/Customer';
import { addCustomer } from '../utils/storage';
import { Employee, WorkAssignment } from '../types/Employee';
import { getPresentEmployeesToday, addAssignment } from '../utils/employeeStorage';

const AVAILABLE_SERVICES = [
  'Basic Wash',
  'Premium Wash',
  'Deluxe Wash',
  'Interior Cleaning',
  'Wax Treatment',
  'Tire Shine',
  'Engine Cleaning',
  'Undercarriage Wash',
];

const CustomerForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CustomerFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: new Date().getFullYear(),
    licensePlate: '',
    vehicleColor: '',
    services: [],
    assignedEmployeeId: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<CustomerFormData>>({});
  const [presentEmployees, setPresentEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    // Load employees who are present today
    const employees = getPresentEmployeesToday();
    setPresentEmployees(employees);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'vehicleYear' ? parseInt(value) || 0 : value,
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof CustomerFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleServiceChange = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service],
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerFormData> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.vehicleMake.trim()) newErrors.vehicleMake = 'Vehicle make is required';
    if (!formData.vehicleModel.trim()) newErrors.vehicleModel = 'Vehicle model is required';
    if (!formData.vehicleYear || formData.vehicleYear < 1900 || formData.vehicleYear > new Date().getFullYear() + 1) {
      newErrors.vehicleYear = 'Valid vehicle year is required';
    }
    if (!formData.licensePlate.trim()) newErrors.licensePlate = 'License plate is required';
    if (formData.services.length === 0) newErrors.services = 'At least one service must be selected';
    if (!formData.assignedEmployeeId) newErrors.assignedEmployeeId = 'Please assign an employee to this vehicle';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const newCustomer: Customer = {
      id: Date.now().toString(),
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      vehicle: {
        make: formData.vehicleMake.trim(),
        model: formData.vehicleModel.trim(),
        year: formData.vehicleYear,
        licensePlate: formData.licensePlate.trim().toUpperCase(),
        color: formData.vehicleColor?.trim(),
      },
      services: formData.services,
      assignedEmployeeId: formData.assignedEmployeeId,
      notes: formData.notes?.trim(),
      createdAt: new Date(),
      lastVisit: new Date(),
      totalVisits: 1,
      preferredServices: formData.services,
    };

    addCustomer(newCustomer);

    // Create work assignment
    if (formData.assignedEmployeeId) {
      const workAssignment: WorkAssignment = {
        id: Date.now().toString(),
        employeeId: formData.assignedEmployeeId,
        customerId: newCustomer.id,
        vehicleLicensePlate: formData.licensePlate.trim().toUpperCase(),
        services: formData.services,
        startTime: new Date(),
        status: 'in-progress',
        notes: formData.notes?.trim(),
      };
      addAssignment(workAssignment);
    }

    navigate('/customers');
  };

  return (
    <div>
      <h2>Add New Customer</h2>
      
      <form onSubmit={handleSubmit} className="card">
        <div className="grid grid-2">
          <div className="form-group">
            <label htmlFor="firstName" className="form-label">First Name *</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter first name"
            />
            {errors.firstName && <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.firstName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="lastName" className="form-label">Last Name *</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter last name"
            />
            {errors.lastName && <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.lastName}</span>}
          </div>
        </div>

        <div className="grid grid-2">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter email address"
            />
            {errors.email && <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">Phone *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter phone number"
            />
            {errors.phone && <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.phone}</span>}
          </div>
        </div>

        <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Vehicle Information</h3>
        
        <div className="grid grid-3">
          <div className="form-group">
            <label htmlFor="vehicleMake" className="form-label">Make *</label>
            <input
              type="text"
              id="vehicleMake"
              name="vehicleMake"
              value={formData.vehicleMake}
              onChange={handleInputChange}
              className="form-input"
              placeholder="e.g., Toyota"
            />
            {errors.vehicleMake && <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.vehicleMake}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="vehicleModel" className="form-label">Model *</label>
            <input
              type="text"
              id="vehicleModel"
              name="vehicleModel"
              value={formData.vehicleModel}
              onChange={handleInputChange}
              className="form-input"
              placeholder="e.g., Camry"
            />
            {errors.vehicleModel && <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.vehicleModel}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="vehicleYear" className="form-label">Year *</label>
            <input
              type="number"
              id="vehicleYear"
              name="vehicleYear"
              value={formData.vehicleYear}
              onChange={handleInputChange}
              className="form-input"
              min="1900"
              max={new Date().getFullYear() + 1}
            />
            {errors.vehicleYear && <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.vehicleYear}</span>}
          </div>
        </div>

        <div className="grid grid-2">
          <div className="form-group">
            <label htmlFor="licensePlate" className="form-label">License Plate *</label>
            <input
              type="text"
              id="licensePlate"
              name="licensePlate"
              value={formData.licensePlate}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter license plate"
              style={{ textTransform: 'uppercase' }}
            />
            {errors.licensePlate && <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.licensePlate}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="vehicleColor" className="form-label">Color</label>
            <input
              type="text"
              id="vehicleColor"
              name="vehicleColor"
              value={formData.vehicleColor}
              onChange={handleInputChange}
              className="form-input"
              placeholder="e.g., Red"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Services *</label>
          <div className="checkbox-group">
            {AVAILABLE_SERVICES.map((service) => (
              <div key={service} className="checkbox-item">
                <input
                  type="checkbox"
                  id={service}
                  checked={formData.services.includes(service)}
                  onChange={() => handleServiceChange(service)}
                />
                <label htmlFor={service}>{service}</label>
              </div>
            ))}
          </div>
          {errors.services && <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.services}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="assignedEmployeeId" className="form-label">Assign Employee *</label>
          <select
            id="assignedEmployeeId"
            name="assignedEmployeeId"
            value={formData.assignedEmployeeId}
            onChange={handleInputChange}
            className="form-select"
          >
            <option value="">Select an employee...</option>
            {presentEmployees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.firstName} {employee.lastName}
              </option>
            ))}
          </select>
          {errors.assignedEmployeeId && <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.assignedEmployeeId}</span>}
          {presentEmployees.length === 0 && (
            <div style={{ marginTop: '0.5rem', padding: '0.5rem', backgroundColor: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '4px' }}>
              <small style={{ color: '#856404' }}>
                No employees are marked as present today. Please mark attendance first.
              </small>
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="notes" className="form-label">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            className="form-textarea"
            placeholder="Any additional notes about the customer or vehicle..."
            rows={4}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button type="submit" className="btn btn-primary">
            Add Customer
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/customers')} 
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;
