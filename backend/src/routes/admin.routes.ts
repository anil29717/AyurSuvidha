import { Router } from 'express';
import { getSystemStatus, getAllUsers, updateUserRole, getChatLogs, getAuditLogs } from '../controllers/admin.controller';
import { listDocuments, deleteDocument } from '../controllers/upload.controller';

export const adminRouter = Router();

// In the future this will be protected by auth + role guard
adminRouter.get('/status', getSystemStatus);
adminRouter.get('/users', getAllUsers);
adminRouter.put('/users/:id/role', updateUserRole);
adminRouter.get('/docs', listDocuments);
adminRouter.delete('/docs/:id', deleteDocument);
adminRouter.get('/logs', getChatLogs);
adminRouter.get('/audit', getAuditLogs);

