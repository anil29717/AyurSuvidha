import { Request, Response } from 'express';
import axios from 'axios';

const AI_SERVICE_URL = 'http://127.0.0.1:8000/api/v1/ai';

export const getDoshaQuiz = async (req: Request, res: Response) => {
  try {
    const response = await axios.get(`${AI_SERVICE_URL}/dosha-quiz`);
    res.json(response.data);
  } catch (error) {
    console.error('AI Service Error:', error);
    res.status(503).json({ message: 'AI Service Unavailable', questions: [] });
  }
};

export const calculateDosha = async (req: Request, res: Response) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/dosha-calc`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('AI Service Error:', error);
    res.status(503).json({ message: 'AI Service Unavailable' });
  }
};

export const checkSymptoms = async (req: Request, res: Response) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/symptom-check`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('AI Service Error:', error);
    res.status(503).json({ message: 'AI Service Unavailable' });
  }
};

export const getHerbRecommendations = async (req: Request, res: Response) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/herb-recommend`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('AI Service Error:', error);
    res.status(503).json({ message: 'AI Service Unavailable' });
  }
};

export const getLifestyleAdvice = async (req: Request, res: Response) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/lifestyle`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('AI Service Error:', error);
    res.status(503).json({ message: 'AI Service Unavailable' });
  }
};

export const getRemedies = async (req: Request, res: Response) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/remedies`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('AI Service Error:', error);
    res.status(503).json({ message: 'AI Service Unavailable' });
  }
};

export const getDetoxPrograms = async (req: Request, res: Response) => {
  try {
    const response = await axios.get(`${AI_SERVICE_URL}/detox`);
    res.json(response.data);
  } catch (error) {
    console.error('AI Service Error:', error);
    res.status(503).json({ message: 'AI Service Unavailable' });
  }
};
