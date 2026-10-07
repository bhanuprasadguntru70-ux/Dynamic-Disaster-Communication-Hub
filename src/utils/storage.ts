import { DisasterIncident, SOSBeacon, Shelter, ReliefItem, EmergencyBroadcast } from '../types/disaster';
import { 
  INITIAL_INCIDENTS, 
  INITIAL_BEACONS, 
  INITIAL_SHELTERS, 
  INITIAL_RELIEF_ITEMS, 
  INITIAL_BROADCASTS 
} from './mockData';

const STORAGE_KEYS = {
  INCIDENTS: 'aegis_incidents_v1',
  BEACONS: 'aegis_beacons_v1',
  SHELTERS: 'aegis_shelters_v1',
  RELIEF: 'aegis_relief_v1',
  BROADCASTS: 'aegis_broadcasts_v1',
  GOBAG_CHECKLIST: 'aegis_gobag_v1',
};

export function loadIncidents(): DisasterIncident[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INCIDENTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading stored incidents', e);
  }
  return INITIAL_INCIDENTS;
}

export function saveIncidents(incidents: DisasterIncident[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(incidents));
  } catch (e) {
    console.error('Failed saving incidents', e);
  }
}

export function loadBeacons(): SOSBeacon[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BEACONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading stored beacons', e);
  }
  return INITIAL_BEACONS;
}

export function saveBeacons(beacons: SOSBeacon[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.BEACONS, JSON.stringify(beacons));
  } catch (e) {
    console.error('Failed saving beacons', e);
  }
}

export function loadShelters(): Shelter[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SHELTERS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading shelters', e);
  }
  return INITIAL_SHELTERS;
}

export function saveShelters(shelters: Shelter[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.SHELTERS, JSON.stringify(shelters));
  } catch (e) {
    console.error('Failed saving shelters', e);
  }
}

export function loadReliefItems(): ReliefItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RELIEF);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading relief inventory', e);
  }
  return INITIAL_RELIEF_ITEMS;
}

export function saveReliefItems(items: ReliefItem[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.RELIEF, JSON.stringify(items));
  } catch (e) {
    console.error('Failed saving relief inventory', e);
  }
}

export function loadBroadcasts(): EmergencyBroadcast[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BROADCASTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading broadcasts', e);
  }
  return INITIAL_BROADCASTS;
}

export function saveBroadcasts(broadcasts: EmergencyBroadcast[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.BROADCASTS, JSON.stringify(broadcasts));
  } catch (e) {
    console.error('Failed saving broadcasts', e);
  }
}

export function resetAllToBaseline() {
  try {
    localStorage.removeItem(STORAGE_KEYS.INCIDENTS);
    localStorage.removeItem(STORAGE_KEYS.BEACONS);
    localStorage.removeItem(STORAGE_KEYS.SHELTERS);
    localStorage.removeItem(STORAGE_KEYS.RELIEF);
    localStorage.removeItem(STORAGE_KEYS.BROADCASTS);
    localStorage.removeItem(STORAGE_KEYS.GOBAG_CHECKLIST);
  } catch (e) {
    console.error('Failed clearing storage', e);
  }
}
