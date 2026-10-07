export type DisasterType = 
  | 'wildfire' 
  | 'flood' 
  | 'hurricane' 
  | 'earthquake' 
  | 'tsunami' 
  | 'landslide' 
  | 'chemical_leak';

export type SeverityLevel = 'Catastrophic' | 'Severe' | 'Moderate' | 'Advisory';

export type IncidentStatus = 'active' | 'contained' | 'monitoring' | 'resolved';

export type EvacuationOrder = 
  | 'Mandatory Evacuation' 
  | 'Voluntary Evacuation' 
  | 'Shelter-in-Place' 
  | 'Normal / Standby';

export interface IncidentTelemetry {
  windSpeedKmH?: number;
  radiusKm: number;
  tempC?: number;
  waterLevelM?: number;
  magnitudeRichter?: number;
  airQualityAqi?: number;
}

export interface DispatchedResources {
  sarTeams: number;
  fireEngines: number;
  medicalUnits: number;
  helicopters: number;
  amphibiousVehicles: number;
}

export interface ActionLogEntry {
  id: string;
  time: string;
  message: string;
  author: string;
}

export interface DisasterIncident {
  id: string;
  title: string;
  type: DisasterType;
  severity: SeverityLevel;
  status: IncidentStatus;
  region: string;
  coordinates: {
    lat: number;
    lng: number;
    x: number; // Normalized 0-100 on tactical map canvas
    y: number; // Normalized 0-100 on tactical map canvas
  };
  affectedPopulation: number;
  displacedPersons: number;
  casualties: {
    injured: number;
    missing: number;
    confirmedSafe: number;
  };
  evacuationStatus: EvacuationOrder;
  telemetry: IncidentTelemetry;
  dispatchedUnits: DispatchedResources;
  reportedAt: string;
  lastUpdate: string;
  description: string;
  incidentCommander: string;
  actionLog: ActionLogEntry[];
}

export interface SOSBeacon {
  id: string;
  citizenName: string;
  contact: string;
  locationText: string;
  x: number; // tactical map x (0-100)
  y: number; // tactical map y (0-100)
  priority: 'Critical' | 'Urgent' | 'Standard';
  peopleCount: number;
  hasMedicalNeed: boolean;
  isTrapped: boolean;
  notes: string;
  timestamp: string;
  status: 'pending' | 'responding' | 'rescued';
  assignedSquad?: string;
}

export interface Shelter {
  id: string;
  name: string;
  address: string;
  x: number; // map coord
  y: number;
  capacity: number;
  currentOccupancy: number;
  hasMedicalStaff: boolean;
  isPetFriendly: boolean;
  powerStatus: 'Grid Operational' | 'Generator Active' | 'Battery Auxiliary';
  suppliesDaysRemaining: number;
  contactPhone: string;
  managerName: string;
}

export interface ReliefItem {
  id: string;
  name: string;
  category: 'Water' | 'Food Rations' | 'Medical' | 'Power/Fuel' | 'Shelter Kits';
  inStock: number;
  unit: string;
  criticalThreshold: number;
  assignedSector: string;
}

export interface EmergencyBroadcast {
  id: string;
  headline: string;
  severity: 'Catastrophic' | 'Severe' | 'Advisory';
  disasterType: DisasterType;
  issuedAt: string;
  expiresAt: string;
  targetCounties: string[];
  mandatoryInstructions: string;
  activeChannels: ('Cell Broadcast' | 'NOAA Radio' | 'Sirens' | 'Digital Signs')[];
  acknowledgedCount: number;
}
