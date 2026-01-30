import { Request, Response } from 'express';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { logAudit } from '../services/audit.service';

const AI_SERVICE_URL = 'http://127.0.0.1:8000/api/v1/ai';

export const uploadDocument = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { doc_id, category } = req.body;
    
    // Create FormData for Python Service
    const form = new FormData();
    form.append('file', fs.createReadStream(req.file.path), req.file.originalname);
    form.append('doc_id', doc_id || `doc_${Date.now()}`);
    form.append('category', category || 'general');

    // Forward to AI Service
    const response = await axios.post(`${AI_SERVICE_URL}/upload`, form, {
      headers: {
        ...form.getHeaders()
      }
    });

    // Clean up local file (optional: keep it for backup)
    fs.unlinkSync(req.file.path);

    logAudit({
      action: 'UPLOAD_DOC',
      actor: { id: (req as any).user?.userId, role: (req as any).user?.role, ip: req.ip },
      target: `Doc: ${doc_id || req.file.originalname}`,
      details: { category, size: req.file.size }
    });

    res.json(response.data);
  } catch (error) {
    console.error('AI Service Upload Error:', error);
    res.status(503).json({ message: 'AI Service Unavailable or Upload Failed' });
  }
};

export const listDocuments = async (req: Request, res: Response) => {
  try {
    const response = await axios.get(`${AI_SERVICE_URL}/docs`);
    res.json(response.data.documents);
  } catch (error) {
    console.error('AI Service Error:', error);
    res.status(503).json({ message: 'AI Service Unavailable' });
  }
};

export const deleteDocument = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // id is expected to be the source/filename based on our current logic
    const response = await axios.post(`${AI_SERVICE_URL}/docs/delete`, { doc_id: id });
    
    logAudit({
      action: 'DELETE_DOC',
      actor: { id: (req as any).user?.userId, role: (req as any).user?.role, ip: req.ip },
      target: `Doc: ${id}`,
      details: {}
    });

    res.json(response.data);
  } catch (error) {
    console.error('AI Service Error:', error);
    res.status(503).json({ message: 'AI Service Unavailable' });
  }
};
