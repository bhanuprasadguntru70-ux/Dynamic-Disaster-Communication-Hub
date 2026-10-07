export type EmergencyCategory =
  | 'Medical'
  | 'Fire'
  | 'Flood'
  | 'Accident'
  | 'Trapped'
  | 'Missing Person'
  | 'Earthquake'
  | 'Cyclone'
  | 'Landslide'
  | 'Other';

export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type EmergencyStatus =
  | 'ACTIVE'
  | 'ACKNOWLEDGED'
  | 'ASSIGNED'
  | 'RESCUE IN PROGRESS'
  | 'RESOLVED';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
  address?: string;
  source: 'GPS' | 'MANUAL' | 'DEFAULT';
}

export interface EmergencyRecord {
  id: string; // e.g. EMG-DEMO-0001
  type: EmergencyCategory;
  description: string;
  severity: SeverityLevel;
  location: LocationCoordinates;
  status: EmergencyStatus;
  createdAt: string;
  updatedAt: string;
  peopleAffected?: number;
  injuredCount?: number;
  contactNumber?: string;
  reportedBy?: string;
  assignedTeam?: string;
  notes?: string[];
  isSOS: boolean;
}
