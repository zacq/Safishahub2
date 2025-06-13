import { Customer } from '../types/Customer';

const STORAGE_KEY = 'carwash_customers';

export const saveCustomers = (customers: Customer[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
  } catch (error) {
    console.error('Error saving customers to localStorage:', error);
  }
};

export const loadCustomers = (): Customer[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const customers = JSON.parse(stored);
      // Convert date strings back to Date objects
      return customers.map((customer: any) => ({
        ...customer,
        createdAt: new Date(customer.createdAt),
        lastVisit: new Date(customer.lastVisit),
      }));
    }
    return [];
  } catch (error) {
    console.error('Error loading customers from localStorage:', error);
    return [];
  }
};

export const addCustomer = (customer: Customer): void => {
  const customers = loadCustomers();
  customers.push(customer);
  saveCustomers(customers);
};

export const updateCustomer = (updatedCustomer: Customer): void => {
  const customers = loadCustomers();
  const index = customers.findIndex(c => c.id === updatedCustomer.id);
  if (index !== -1) {
    customers[index] = updatedCustomer;
    saveCustomers(customers);
  }
};

export const deleteCustomer = (customerId: string): void => {
  const customers = loadCustomers();
  const filtered = customers.filter(c => c.id !== customerId);
  saveCustomers(filtered);
};

export const searchCustomers = (query: string): Customer[] => {
  const customers = loadCustomers();
  const lowercaseQuery = query.toLowerCase();
  
  return customers.filter(customer => 
    customer.firstName.toLowerCase().includes(lowercaseQuery) ||
    customer.lastName.toLowerCase().includes(lowercaseQuery) ||
    customer.email.toLowerCase().includes(lowercaseQuery) ||
    customer.phone.includes(query) ||
    customer.vehicle.licensePlate.toLowerCase().includes(lowercaseQuery) ||
    customer.vehicle.make.toLowerCase().includes(lowercaseQuery) ||
    customer.vehicle.model.toLowerCase().includes(lowercaseQuery)
  );
};
