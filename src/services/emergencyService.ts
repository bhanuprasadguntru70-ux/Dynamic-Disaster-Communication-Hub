import { EmergencyRecord, EmergencyStatus, EmergencyCategory, SeverityLevel } from '../models/emergency';
import { SEED_EMERGENCIES } from '../data/seedData';
import { notificationService } from './dataService';

const STORAGE_KEY = 'disaster_emergencies';
const MY_EMERGENCIES_KEY = 'disaster_my_emergencies';

class EmergencyService {
  private getStorage(): EmergencyRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed reading emergencies from storage', e);
    }
    // Seed default
    this.saveStorage(SEED_EMERGENCIES);
    return SEED_EMERGENCIES;
  }

  private saveStorage(records: EmergencyRecord[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (e) {
      console.error('Failed saving emergencies to storage', e);
    }
  }

  public getMyEmergencyIds(): string[] {
    try {
      const raw = localStorage.getItem(MY_EMERGENCIES_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error('Failed reading my emergencies', e);
    }
    return ['EMG-DEMO-0001']; // default user session owns the initial active SOS
  }

  public addMyEmergencyId(id: string): void {
    try {
      const ids = this.getMyEmergencyIds();
      if (!ids.includes(id)) {
        const next = [id, ...ids];
        localStorage.setItem(MY_EMERGENCIES_KEY, JSON.stringify(next));
      }
    } catch (e) {
      console.error('Failed saving my emergency id', e);
    }
  }

  public getEmergencies(): EmergencyRecord[] {
    return this.getStorage();
  }

  public getAll(): EmergencyRecord[] {
    return this.getEmergencies();
  }

  public getMyEmergencies(): EmergencyRecord[] {
    const myIds = this.getMyEmergencyIds();
    const all = this.getEmergencies();
    return all.filter(e => myIds.includes(e.id));
  }

  public getEmergencyById(id: string): EmergencyRecord | undefined {
    return this.getStorage().find(e => e.id === id);
  }

  public getById(id: string): EmergencyRecord | undefined {
    return this.getEmergencyById(id);
  }

  public generateId(): string {
    const records = this.getStorage();
    let maxNum = 6;
    records.forEach(r => {
      const match = r.id.match(/EMG-DEMO-(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (!isNaN(num) && num > maxNum) maxNum = num;
      }
    });
    const nextNum = maxNum + 1;
    return `EMG-DEMO-${String(nextNum).padStart(4, '0')}`;
  }

  public createEmergency(payload: {
    type: EmergencyCategory;
    description: string;
    severity: SeverityLevel;
    location: {
      latitude: number;
      longitude: number;
      accuracy?: number;
      address?: string;
      source: 'GPS' | 'MANUAL' | 'DEFAULT';
    };
    peopleAffected?: number;
    injuredCount?: number;
    contactNumber?: string;
    reportedBy?: string;
    isSOS?: boolean;
  }): EmergencyRecord {
    const records = this.getStorage();
    const id = this.generateId();
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + now.toLocaleDateString();

    const newRecord: EmergencyRecord = {
      id,
      type: payload.type,
      description: payload.description,
      severity: payload.severity,
      location: payload.location,
      status: 'ACTIVE',
      createdAt: timeFormatted,
      updatedAt: timeFormatted,
      peopleAffected: payload.peopleAffected || 1,
      injuredCount: payload.injuredCount || 0,
      contactNumber: payload.contactNumber || '+91 99999 00000',
      reportedBy: payload.reportedBy || 'Citizen User',
      isSOS: !!payload.isSOS,
      notes: [`${payload.isSOS ? 'SOS broadcast' : 'Emergency report'} generated at ${now.toLocaleTimeString()}`],
    };

    const updated = [newRecord, ...records];
    this.saveStorage(updated);
    this.addMyEmergencyId(id);

    // Exact notification requirements:
    // When an SOS is created: "Your SOS request EMG-DEMO-XXXX was created successfully."
    notificationService.add({
      title: payload.isSOS ? '🚨 SOS Request Created' : '📝 Emergency Report Submitted',
      message: payload.isSOS 
        ? `Your SOS request ${newRecord.id} was created successfully.` 
        : `Your emergency report ${newRecord.id} was submitted successfully.`,
      type: payload.isSOS ? 'sos' : 'emergency',
    });

    return newRecord;
  }

  public create(payload: Parameters<EmergencyService['createEmergency']>[0]): EmergencyRecord {
    return this.createEmergency(payload);
  }

  public updateEmergency(id: string, updates: Partial<EmergencyRecord>): EmergencyRecord | undefined {
    const records = this.getStorage();
    let updatedRecord: EmergencyRecord | undefined;

    const nextRecords = records.map(record => {
      if (record.id === id) {
        updatedRecord = {
          ...record,
          ...updates,
          updatedAt: 'Just now',
          notes: [
            ...(record.notes || []),
            updates.status ? `Status updated to ${updates.status} at ${new Date().toLocaleTimeString()}` : 'Record updated',
          ],
        };
        return updatedRecord;
      }
      return record;
    });

    if (updatedRecord) {
      this.saveStorage(nextRecords);
      notificationService.add({
        title: 'Emergency Updated',
        message: `${id} status updated to: ${updatedRecord.status}`,
        type: 'rescue',
      });
    }

    return updatedRecord;
  }

  public updateStatus(id: string, status: EmergencyStatus, assignedTeam?: string): EmergencyRecord | undefined {
    return this.updateEmergency(id, { 
      status, 
      assignedTeam: assignedTeam !== undefined ? assignedTeam : undefined 
    });
  }

  public deleteEmergency(id: string): boolean {
    const records = this.getStorage();
    const filtered = records.filter(r => r.id !== id);
    if (filtered.length !== records.length) {
      this.saveStorage(filtered);
      return true;
    }
    return false;
  }

  public resetToDefault(): void {
    this.saveStorage(SEED_EMERGENCIES);
    try {
      localStorage.removeItem(MY_EMERGENCIES_KEY);
    } catch {
      // ignore
    }
  }
}

export const emergencyService = new EmergencyService();
