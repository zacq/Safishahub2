import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Employee, EmployeeFormData } from '../types/Employee';
import { addEmployee } from '../utils/employeeStorage';

const EmployeeForm: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<EmployeeFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nationalId: '',
    nationalIdImage: '',
  });

  const [errors, setErrors] = useState<Partial<EmployeeFormData>>({});
  const [imagePreview, setImagePreview] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof EmployeeFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, nationalIdImage: 'Please select a valid image file' }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, nationalIdImage: 'Image size must be less than 5MB' }));
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        setFormData(prev => ({ ...prev, nationalIdImage: base64String }));
        setImagePreview(base64String);
        setErrors(prev => ({ ...prev, nationalIdImage: undefined }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<EmployeeFormData> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.nationalId.trim()) newErrors.nationalId = 'National ID is required';
    if (!formData.nationalIdImage) newErrors.nationalIdImage = 'National ID image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const newEmployee: Employee = {
      id: Date.now().toString(),
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      nationalId: formData.nationalId.trim(),
      nationalIdImage: formData.nationalIdImage,
      createdAt: new Date(),
      isActive: true,
    };

    addEmployee(newEmployee);
    navigate('/employees');
  };

  const clearImage = () => {
    setFormData(prev => ({ ...prev, nationalIdImage: '' }));
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <h2>Register New Employee</h2>
      
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

        <div className="form-group">
          <label htmlFor="nationalId" className="form-label">National ID *</label>
          <input
            type="text"
            id="nationalId"
            name="nationalId"
            value={formData.nationalId}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Enter National ID number"
          />
          {errors.nationalId && <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.nationalId}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="nationalIdImage" className="form-label">National ID Image *</label>
          <input
            type="file"
            id="nationalIdImage"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageUpload}
            className="form-input"
          />
          {errors.nationalIdImage && <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.nationalIdImage}</span>}
          
          {imagePreview && (
            <div style={{ marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: '500' }}>Preview:</span>
                <button
                  type="button"
                  onClick={clearImage}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.875rem', padding: '0.25rem 0.5rem' }}
                >
                  Remove Image
                </button>
              </div>
              <img
                src={imagePreview}
                alt="National ID Preview"
                style={{
                  maxWidth: '300px',
                  maxHeight: '200px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  objectFit: 'contain'
                }}
              />
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button type="submit" className="btn btn-primary">
            Register Employee
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/employees')} 
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
