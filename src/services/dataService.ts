import { Hospital, Shelter, Volunteer, ResourceItem, DisasterAlert, AppNotification } from '../models/entities';
import { 
  SEED_HOSPITALS, 
  SEED_SHELTERS, 
  SEED_VOLUNTEERS, 
  SEED_RESOURCES, 
  SEED_ALERTS, 
  SEED_NOTIFICATIONS 
} from '../data/seedData';

const KEYS = {
  HOSPITALS: 'disaster_hub_hospitals_v2',
  SHELTERS: 'disaster_hub_shelters_v2',
  VOLUNTEERS: 'disaster_hub_volunteers_v2',
  RESOURCES: 'disaster_hub_resources_v2',
  ALERTS: 'disaster_hub_alerts_v2',
  NOTIFICATIONS: 'disaster_notifications',
};

// Generic storage helper
function getStored<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(`Error reading ${key}`, e);
  }
  try {
    localStorage.setItem(key, JSON.stringify(defaultValue));
  } catch {
    // ignore
  }
  return defaultValue;
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key}`, e);
  }
}

export const hospitalService = {
  getAll: (): Hospital[] => getStored<Hospital[]>(KEYS.HOSPITALS, SEED_HOSPITALS),
  saveAll: (list: Hospital[]) => setStored(KEYS.HOSPITALS, list),
};

export const shelterService = {
  getAll: (): Shelter[] => getStored<Shelter[]>(KEYS.SHELTERS, SEED_SHELTERS),
  saveAll: (list: Shelter[]) => setStored(KEYS.SHELTERS, list),
  updateOccupancy: (id: string, newOccupancy: number): Shelter | undefined => {
    const shelters = shelterService.getAll();
    let updated: Shelter | undefined;
    const next = shelters.map(s => {
      if (s.id === id) {
        const occ = Math.max(0, Math.min(s.capacity + 200, newOccupancy));
        const avail = Math.max(0, s.capacity - occ);
        const status: 'AVAILABLE' | 'LIMITED' | 'FULL' = 
          avail === 0 ? 'FULL' : occ / s.capacity >= 0.85 ? 'LIMITED' : 'AVAILABLE';
        updated = { ...s, currentOccupancy: occ, availableSpaces: avail, status };
        return updated;
      }
      return s;
    });
    shelterService.saveAll(next);
    return updated;
  },
};

export const volunteerService = {
  getAll: (): Volunteer[] => getStored<Volunteer[]>(KEYS.VOLUNTEERS, SEED_VOLUNTEERS),
  saveAll: (list: Volunteer[]) => setStored(KEYS.VOLUNTEERS, list),
  register: (payload: Omit<Volunteer, 'id' | 'registeredDate'>): Volunteer => {
    const list = volunteerService.getAll();
    const newVol: Volunteer = {
      ...payload,
      id: `VOL-${String(list.length + 1).padStart(3, '0')}`,
      registeredDate: new Date().toISOString().split('T')[0],
    };
    volunteerService.saveAll([newVol, ...list]);
    notificationService.add({
      title: 'New Volunteer Registered',
      message: `${newVol.name} added to voluntary disaster response registry.`,
      type: 'system',
    });
    return newVol;
  },
  updateAvailability: (id: string, availability: 'AVAILABLE' | 'BUSY' | 'OFFLINE'): Volunteer | undefined => {
    const list = volunteerService.getAll();
    let updated: Volunteer | undefined;
    const next = list.map(v => {
      if (v.id === id) {
        updated = { ...v, availability };
        return updated;
      }
      return v;
    });
    volunteerService.saveAll(next);
    return updated;
  },
};

export const resourceService = {
  getAll: (): ResourceItem[] => getStored<ResourceItem[]>(KEYS.RESOURCES, SEED_RESOURCES),
  saveAll: (list: ResourceItem[]) => setStored(KEYS.RESOURCES, list),
  allocate: (id: string, quantity: number): ResourceItem | undefined => {
    const list = resourceService.getAll();
    let updated: ResourceItem | undefined;
    const next = list.map(r => {
      if (r.id === id && r.available >= quantity) {
        updated = {
          ...r,
          available: r.available - quantity,
          inUse: r.inUse + quantity,
        };
        return updated;
      }
      return r;
    });
    if (updated) {
      resourceService.saveAll(next);
      notificationService.add({
        title: 'Resource Dispatched',
        message: `${quantity} unit(s) of ${updated.name} allocated to field operations.`,
        type: 'rescue',
      });
    }
    return updated;
  },
};

export const alertService = {
  getAll: (): DisasterAlert[] => getStored<DisasterAlert[]>(KEYS.ALERTS, SEED_ALERTS),
  saveAll: (list: DisasterAlert[]) => setStored(KEYS.ALERTS, list),
  create: (alert: Omit<DisasterAlert, 'id' | 'time'>): DisasterAlert => {
    const list = alertService.getAll();
    const newAlert: DisasterAlert = {
      ...alert,
      id: `ALT-2026-${String(list.length + 1).padStart(3, '0')}`,
      time: 'Just now',
    };
    alertService.saveAll([newAlert, ...list]);
    notificationService.add({
      title: `⚠️ Alert Issued: ${newAlert.title}`,
      message: `${newAlert.description.slice(0, 80)}...`,
      type: 'alert',
    });
    return newAlert;
  },
};

export const notificationService = {
  getAll: (): AppNotification[] => getStored<AppNotification[]>(KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS),
  saveAll: (list: AppNotification[]) => setStored(KEYS.NOTIFICATIONS, list),
  add: (payload: { title: string; message: string; type: AppNotification['type'] }): AppNotification => {
    const list = notificationService.getAll();
    const newNotif: AppNotification = {
      id: `NOTIF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: payload.title,
      message: payload.message,
      type: payload.type,
      timestamp: 'Just now',
      isRead: false,
    };
    notificationService.saveAll([newNotif, ...list]);
    return newNotif;
  },
  markAllRead: (): void => {
    const list = notificationService.getAll().map(n => ({ ...n, isRead: true }));
    notificationService.saveAll(list);
  },
  clearAll: (): void => {
    notificationService.saveAll([]);
  },
};

export const resetAllServices = () => {
  localStorage.removeItem(KEYS.HOSPITALS);
  localStorage.removeItem(KEYS.SHELTERS);
  localStorage.removeItem(KEYS.VOLUNTEERS);
  localStorage.removeItem(KEYS.RESOURCES);
  localStorage.removeItem(KEYS.ALERTS);
  localStorage.removeItem(KEYS.NOTIFICATIONS);
  localStorage.removeItem('disaster_hub_emergencies_v2');
};
