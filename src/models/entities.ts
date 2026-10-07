export interface Hospital {
  id: string;
  name: string;
  location: string;
  coordinates: { latitude: number; longitude: number };
  emergencyAvailability: 'Available' | 'High Occupancy' | 'Full';
  totalBeds: number;
  availableICU: number;
  availableGeneral: number;
  services: string[];
  contact: string;
  ambulanceAvailable: number;
  status: 'OPEN' | 'EMERGENCY_ONLY' | 'OVERWHELMED';
}

export interface Shelter {
  id: string;
  name: string;
  location: string;
  coordinates: { latitude: number; longitude: number };
  capacity: number;
  currentOccupancy: number;
  availableSpaces: number;
  foodSupplyDays: number;
  waterSupplyDays: number;
  hasMedicalSupport: boolean;
  contact: string;
  status: 'AVAILABLE' | 'LIMITED' | 'FULL';
}

export interface Volunteer {
  id: string;
  name: string;
  phone: string;
  skills: string[];
  location: string;
  availability: 'AVAILABLE' | 'BUSY' | 'OFFLINE';
  assignedZone?: string;
  registeredDate: string;
}

export interface ResourceItem {
  id: string;
  name: string;
  category: 'Ambulances' | 'Rescue Boats' | 'Fire Trucks' | 'Medical Kits' | 'Food' | 'Water' | 'Blankets' | 'First Aid Kits';
  total: number;
  available: number;
  inUse: number;
  location: string;
  condition: 'Optimal' | 'Deployed' | 'Maintenance';
}

export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFORMATION';

export interface DisasterAlert {
  id: string;
  title: string;
  description: string;
  location: string;
  time: string;
  severity: AlertSeverity;
  source: string;
  targetCounties?: string[];
  isAcknowledged?: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'sos' | 'emergency' | 'rescue' | 'alert' | 'system';
  isRead: boolean;
}
