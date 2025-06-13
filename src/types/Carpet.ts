export interface Carpet {
  id: string;
  customerId: string;
  employeeId: string;
  carpetDetails: {
    type: 'area' | 'runner' | 'oriental' | 'berber' | 'shag' | 'other';
    size: {
      length: number;
      width: number;
      unit: 'feet' | 'meters';
    };
    material: string;
    color: string;
    condition: 'excellent' | 'good' | 'fair' | 'poor';
    stains?: string[];
    notes?: string;
  };
  services: {
    cleaning: 'basic' | 'deep' | 'stain-removal' | 'sanitization';
    drying: 'air-dry' | 'dehumidifier' | 'fan-assisted';
    protection: 'stain-guard' | 'anti-microbial' | 'none';
  };
  status: 'pending' | 'in-progress' | 'cleaning' | 'drying' | 'completed' | 'delivered';
  timeline: {
    dropOff: Date;
    estimatedCompletion?: Date;
    actualCompletion?: Date;
    pickup?: Date;
  };
  pricing: {
    basePrice: number;
    additionalServices: number;
    totalPrice: number;
    deposit?: number;
    balance?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CarpetFormData {
  customerId: string;
  employeeId: string;
  carpetType: 'area' | 'runner' | 'oriental' | 'berber' | 'shag' | 'other';
  length: number;
  width: number;
  unit: 'feet' | 'meters';
  material: string;
  color: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  stains: string[];
  cleaningService: 'basic' | 'deep' | 'stain-removal' | 'sanitization';
  dryingService: 'air-dry' | 'dehumidifier' | 'fan-assisted';
  protectionService: 'stain-guard' | 'anti-microbial' | 'none';
  notes?: string;
  deposit?: number;
} 