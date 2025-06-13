import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Carpet, CarpetFormData } from '../types/Carpet';
import { Customer } from '../types/Customer';
import { Employee } from '../types/Employee';
import { addCarpet } from '../utils/carpetStorage';
import { loadCustomers } from '../utils/storage';
import { getPresentEmployeesToday } from '../utils/employeeStorage';

const CARPET_TYPES = [
  { value: 'area', label: 'Area Rug' },
  { value: 'runner', label: 'Runner' },
  { value: 'oriental', label: 'Oriental' },
  { value: 'berber', label: 'Berber' },
  { value: 'shag', label: 'Shag' },
  { value: 'other', label: 'Other' },
];

const CLEANING_SERVICES = [
  { value: 'basic', label: 'Basic Cleaning', price: 25 },
  { value: 'deep', label: 'Deep Cleaning', price: 45 },
  { value: 'stain-removal', label: 'Stain Removal', price: 35 },
  { value: 'sanitization', label: 'Sanitization', price: 30 },
];

const DRYING_SERVICES = [
  { value: 'air-dry', label: 'Air Dry', price: 0 },
  { value: 'dehumidifier', label: 'Dehumidifier', price: 15 },
  { value: 'fan-assisted', label: 'Fan Assisted', price: 10 },
];

const PROTECTION_SERVICES = [
  { value: 'none', label: 'No Protection', price: 0 },
  { value: 'stain-guard', label: 'Stain Guard', price: 25 },
  { value: 'anti-microbial', label: 'Anti-Microbial', price: 20 },
];

const CarpetForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CarpetFormData>({
    customerId: '',
    employeeId: '',
    carpetType: 'area',
    length: 0,
    width: 0,
    unit: 'feet',
    material: '',
    color: '',
    condition: 'good',
    stains: [],
    cleaningService: 'basic',
    dryingService: 'air-dry',
    protectionService: 'none',
    notes: '',
    deposit: 0,
  });

  const [errors, setErrors] = useState<Partial<CarpetFormData>>({});
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [presentEmployees, setPresentEmployees] = useState<Employee[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const loadedCustomers = loadCustomers();
    const employees = getPresentEmployeesToday();
    setCustomers(loadedCustomers);
    setPresentEmployees(employees);
  }, []);

  useEffect(() => {
    calculateTotalPrice();
  }, [formData.cleaningService, formData.dryingService, formData.protectionService, formData.length, formData.width]);

  const calculateTotalPrice = () => {
    const basePrice = CLEANING_SERVICES.find(s => s.value === formData.cleaningService)?.price || 0;
    const dryingPrice = DRYING_SERVICES.find(s => s.value === formData.dryingService)?.price || 0;
    const protectionPrice = PROTECTION_SERVICES.find(s => s.value === formData.protectionService)?.price || 0;
    
    const area = formData.length * formData.width;
    const areaMultiplier = area > 100 ? 1.5 : area > 50 ? 1.2 : 1;
    
    const total = (basePrice + dryingPrice + protectionPrice) * areaMultiplier;
    setTotalPrice(total);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'length' || name === 'width' || name === 'deposit' ? parseFloat(value) || 0 : value,
    }));
    
    if (errors[name as keyof CarpetFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleStainChange = (stain: string) => {
    setFormData(prev => ({
      ...prev,
      stains: prev.stains.includes(stain)
        ? prev.stains.filter(s => s !== stain)
        : [...prev.stains, stain],
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CarpetFormData> = {};

    if (!formData.customerId) newErrors.customerId = 'Customer is required';
    if (!formData.employeeId) newErrors.employeeId = 'Employee is required';
    if (!formData.length || formData.length <= 0) newErrors.length = 'Valid length is required';
    if (!formData.width || formData.width <= 0) newErrors.width = 'Valid width is required';
    if (!formData.material.trim()) newErrors.material = 'Material is required';
    if (!formData.color.trim()) newErrors.color = 'Color is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const selectedCustomer = customers.find(c => c.id === formData.customerId);
    const selectedEmployee = presentEmployees.find(e => e.id === formData.employeeId);

    if (!selectedCustomer || !selectedEmployee) {
      alert('Invalid customer or employee selection');
      return;
    }

    const newCarpet: Carpet = {
      id: Date.now().toString(),
      customerId: formData.customerId,
      employeeId: formData.employeeId,
      carpetDetails: {
        type: formData.carpetType,
        size: {
          length: formData.length,
          width: formData.width,
          unit: formData.unit,
        },
        material: formData.material.trim(),
        color: formData.color.trim(),
        condition: formData.condition,
        stains: formData.stains,
        notes: formData.notes?.trim(),
      },
      services: {
        cleaning: formData.cleaningService,
        drying: formData.dryingService,
        protection: formData.protectionService,
      },
      status: 'pending',
      timeline: {
        dropOff: new Date(),
        estimatedCompletion: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      },
      pricing: {
        basePrice: CLEANING_SERVICES.find(s => s.value === formData.cleaningService)?.price || 0,
        additionalServices: (DRYING_SERVICES.find(s => s.value === formData.dryingService)?.price || 0) +
                           (PROTECTION_SERVICES.find(s => s.value === formData.protectionService)?.price || 0),
        totalPrice: totalPrice,
        deposit: formData.deposit || 0,
        balance: totalPrice - (formData.deposit || 0),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    addCarpet(newCarpet);
    navigate('/carpets');
  };

  return (
    <div>
      <h2>Add New Carpet Cleaning Job</h2>
      
      <form onSubmit={handleSubmit} className="card">
        <div className="grid grid-2">
          <div className="form-group">
            <label htmlFor="customerId" className="form-label">Customer *</label>
            <select
              id="customerId"
              name="customerId"
              value={formData.customerId}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="">Select Customer</option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.firstName} {customer.lastName} - {customer.vehicle.licensePlate}
                </option>
              ))}
            </select>
            {errors.customerId && <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.customerId}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="employeeId" className="form-label">Assigned Employee *</label>
            <select
              id="employeeId"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="">Select Employee</option>
              {presentEmployees.map(employee => (
                <option key={employee.id} value={employee.id}>
                  {employee.firstName} {employee.lastName}
                </option>
              ))}
            </select>
            {errors.employeeId && <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.employeeId}</span>}
          </div>
        </div>

        <div className="grid grid-2">
          <div className="form-group">
            <label htmlFor="carpetType" className="form-label">Carpet Type</label>
            <select
              id="carpetType"
              name="carpetType"
              value={formData.carpetType}
              onChange={handleInputChange}
              className="form-select"
            >
              {CARPET_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="condition" className="form-label">Condition</label>
            <select
              id="condition"
              name="condition"
              value={formData.condition}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </select>
          </div>
        </div>

        <div className="grid grid-3">
          <div className="form-group">
            <label htmlFor="length" className="form-label">Length *</label>
            <input
              type="number"
              id="length"
              name="length"
              value={formData.length}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter length"
              step="0.1"
              min="0"
            />
            {errors.length && <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.length}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="width" className="form-label">Width *</label>
            <input
              type="number"
              id="width"
              name="width"
              value={formData.width}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter width"
              step="0.1"
              min="0"
            />
            {errors.width && <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.width}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="unit" className="form-label">Unit</label>
            <select
              id="unit"
              name="unit"
              value={formData.unit}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="feet">Feet</option>
              <option value="meters">Meters</option>
            </select>
          </div>
        </div>

        <div className="grid grid-2">
          <div className="form-group">
            <label htmlFor="material" className="form-label">Material *</label>
            <input
              type="text"
              id="material"
              name="material"
              value={formData.material}
              onChange={handleInputChange}
              className="form-input"
              placeholder="e.g., Wool, Nylon, Polyester"
            />
            {errors.material && <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.material}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="color" className="form-label">Color *</label>
            <input
              type="text"
              id="color"
              name="color"
              value={formData.color}
              onChange={handleInputChange}
              className="form-input"
              placeholder="e.g., Beige, Blue, Red"
            />
            {errors.color && <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.color}</span>}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Stains (if any)</label>
          <div className="checkbox-group">
            {['Coffee', 'Wine', 'Pet Urine', 'Oil', 'Mud', 'Blood', 'Ink'].map(stain => (
              <div key={stain} className="checkbox-item">
                <input
                  type="checkbox"
                  id={`stain-${stain}`}
                  checked={formData.stains.includes(stain)}
                  onChange={() => handleStainChange(stain)}
                />
                <label htmlFor={`stain-${stain}`}>{stain}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-3">
          <div className="form-group">
            <label htmlFor="cleaningService" className="form-label">Cleaning Service</label>
            <select
              id="cleaningService"
              name="cleaningService"
              value={formData.cleaningService}
              onChange={handleInputChange}
              className="form-select"
            >
              {CLEANING_SERVICES.map(service => (
                <option key={service.value} value={service.value}>
                  {service.label} - ${service.price}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="dryingService" className="form-label">Drying Service</label>
            <select
              id="dryingService"
              name="dryingService"
              value={formData.dryingService}
              onChange={handleInputChange}
              className="form-select"
            >
              {DRYING_SERVICES.map(service => (
                <option key={service.value} value={service.value}>
                  {service.label} - ${service.price}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="protectionService" className="form-label">Protection Service</label>
            <select
              id="protectionService"
              name="protectionService"
              value={formData.protectionService}
              onChange={handleInputChange}
              className="form-select"
            >
              {PROTECTION_SERVICES.map(service => (
                <option key={service.value} value={service.value}>
                  {service.label} - ${service.price}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-2">
          <div className="form-group">
            <label htmlFor="deposit" className="form-label">Deposit Amount</label>
            <input
              type="number"
              id="deposit"
              name="deposit"
              value={formData.deposit}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter deposit amount"
              step="0.01"
              min="0"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Total Price</label>
            <div style={{ 
              padding: '0.75rem', 
              backgroundColor: '#f8f9fa', 
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              color: '#667eea'
            }}>
              ${totalPrice.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="notes" className="form-label">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            className="form-textarea"
            placeholder="Additional notes about the carpet..."
            rows={3}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button type="submit" className="btn btn-primary">
            Add Carpet Job
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate('/carpets')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CarpetForm; 