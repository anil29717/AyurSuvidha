import { AuditLog } from '../models/AuditLog';

interface LogEntry {
  action: string;
  actor: {
    id?: string;
    email?: string;
    role?: string;
    ip?: string;
  };
  target?: string;
  details?: any;
}

export const logAudit = async (entry: LogEntry) => {
  try {
    // Fire and forget - don't await to avoid slowing down main request
    AuditLog.create(entry).catch(err => console.error('Audit Log Error:', err));
  } catch (error) {
    console.error('Failed to create audit log', error);
  }
};
