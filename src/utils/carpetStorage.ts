import { Carpet } from '../types/Carpet';

const CARPETS_KEY = 'carwash_carpets';

// Carpet Management
export const saveCarpets = (carpets: Carpet[]): void => {
  try {
    localStorage.setItem(CARPETS_KEY, JSON.stringify(carpets));
  } catch (error) {
    console.error('Error saving carpets to localStorage:', error);
  }
};

export const loadCarpets = (): Carpet[] => {
  try {
    const stored = localStorage.getItem(CARPETS_KEY);
    if (stored) {
      const carpets = JSON.parse(stored);
      return carpets.map((carpet: any) => ({
        ...carpet,
        timeline: {
          ...carpet.timeline,
          dropOff: new Date(carpet.timeline.dropOff),
          estimatedCompletion: carpet.timeline.estimatedCompletion ? new Date(carpet.timeline.estimatedCompletion) : undefined,
          actualCompletion: carpet.timeline.actualCompletion ? new Date(carpet.timeline.actualCompletion) : undefined,
          pickup: carpet.timeline.pickup ? new Date(carpet.timeline.pickup) : undefined,
        },
        createdAt: new Date(carpet.createdAt),
        updatedAt: new Date(carpet.updatedAt),
      }));
    }
    return [];
  } catch (error) {
    console.error('Error loading carpets from localStorage:', error);
    return [];
  }
};

export const addCarpet = (carpet: Carpet): void => {
  const carpets = loadCarpets();
  carpets.push(carpet);
  saveCarpets(carpets);
};

export const updateCarpet = (updatedCarpet: Carpet): void => {
  const carpets = loadCarpets();
  const index = carpets.findIndex(c => c.id === updatedCarpet.id);
  if (index !== -1) {
    carpets[index] = { ...updatedCarpet, updatedAt: new Date() };
    saveCarpets(carpets);
  }
};

export const deleteCarpet = (carpetId: string): void => {
  const carpets = loadCarpets();
  const filtered = carpets.filter(c => c.id !== carpetId);
  saveCarpets(filtered);
};

export const updateCarpetStatus = (id: string, status: Carpet['status']): void => {
  const carpets = loadCarpets();
  const index = carpets.findIndex(c => c.id === id);
  if (index !== -1) {
    carpets[index].status = status;
    carpets[index].updatedAt = new Date();
    
    // Update timeline based on status
    if (status === 'completed') {
      carpets[index].timeline.actualCompletion = new Date();
    } else if (status === 'delivered') {
      carpets[index].timeline.pickup = new Date();
    }
    
    saveCarpets(carpets);
  }
};

export const getCarpetsByStatus = (status: Carpet['status']): Carpet[] => {
  return loadCarpets().filter(carpet => carpet.status === status);
};

export const getCarpetsByCustomer = (customerId: string): Carpet[] => {
  return loadCarpets().filter(carpet => carpet.customerId === customerId);
};

export const getCarpetsByEmployee = (employeeId: string): Carpet[] => {
  return loadCarpets().filter(carpet => carpet.employeeId === employeeId);
};

export const getEmployeeCarpetWorkload = (employeeId: string): Carpet[] => {
  return loadCarpets().filter(carpet => 
    carpet.employeeId === employeeId && 
    ['pending', 'in-progress', 'cleaning', 'drying'].includes(carpet.status)
  );
};

export const searchCarpets = (query: string): Carpet[] => {
  const carpets = loadCarpets();
  const lowercaseQuery = query.toLowerCase();
  
  return carpets.filter(carpet => 
    carpet.carpetDetails.material.toLowerCase().includes(lowercaseQuery) ||
    carpet.carpetDetails.color.toLowerCase().includes(lowercaseQuery) ||
    carpet.carpetDetails.type.toLowerCase().includes(lowercaseQuery) ||
    carpet.status.toLowerCase().includes(lowercaseQuery)
  );
};

export const getTodayCarpets = (): Carpet[] => {
  const today = new Date().toISOString().split('T')[0];
  return loadCarpets().filter(carpet => 
    carpet.timeline.dropOff.toISOString().split('T')[0] === today
  );
};

export const getCarpetStats = () => {
  const carpets = loadCarpets();
  const today = new Date().toISOString().split('T')[0];
  
  const todayCarpets = carpets.filter(carpet => 
    carpet.timeline.dropOff.toISOString().split('T')[0] === today
  );
  
  const pendingCarpets = carpets.filter(carpet => carpet.status === 'pending');
  const inProgressCarpets = carpets.filter(carpet => 
    ['in-progress', 'cleaning', 'drying'].includes(carpet.status)
  );
  const completedCarpets = carpets.filter(carpet => carpet.status === 'completed');
  const deliveredCarpets = carpets.filter(carpet => carpet.status === 'delivered');
  
  const totalRevenue = carpets
    .filter(carpet => carpet.status === 'delivered')
    .reduce((sum, carpet) => sum + carpet.pricing.totalPrice, 0);
  
  const todayRevenue = todayCarpets
    .filter(carpet => carpet.status === 'delivered')
    .reduce((sum, carpet) => sum + carpet.pricing.totalPrice, 0);
  
  return {
    totalCarpets: carpets.length,
    todayCarpets: todayCarpets.length,
    pendingCarpets: pendingCarpets.length,
    inProgressCarpets: inProgressCarpets.length,
    completedCarpets: completedCarpets.length,
    deliveredCarpets: deliveredCarpets.length,
    totalRevenue,
    todayRevenue,
  };
}; 