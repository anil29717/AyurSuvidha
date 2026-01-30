import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  action: string;
  actor: {
    id?: string;
    email?: string;
    role?: string;
    ip?: string;
  };
  target?: string;
  details?: any;
  timestamp: Date;
}

const AuditLogSchema: Schema = new Schema({
  action: { type: String, required: true },
  actor: {
    id: { type: String },
    email: { type: String },
    role: { type: String },
    ip: { type: String }
  },
  target: { type: String }, // e.g., "User: john@doe.com" or "Doc: Charaka"
  details: { type: Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now, expires: '30d' } // Auto-delete after 30 days
});

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
