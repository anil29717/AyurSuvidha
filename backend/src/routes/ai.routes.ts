import { Router } from 'express';
import multer from 'multer';
import { getDoshaQuiz, calculateDosha, checkSymptoms, getHerbRecommendations, getLifestyleAdvice, getRemedies, getDetoxPrograms } from '../controllers/ai.controller';
import { uploadDocument } from '../controllers/upload.controller';

const upload = multer({ dest: 'uploads/' });

export const aiRouter = Router();

aiRouter.get('/quiz', getDoshaQuiz); // Frontend calls /api/ai/quiz -> Backend calls AI /dosha-quiz
aiRouter.post('/dosha-calc', calculateDosha); // Frontend calls /api/ai/dosha-calc
aiRouter.post('/symptom-check', checkSymptoms); // Frontend calls /api/ai/symptom-check
aiRouter.post('/herbs', getHerbRecommendations); // Frontend calls /api/ai/herbs
aiRouter.post('/lifestyle', getLifestyleAdvice); // Frontend calls /api/ai/lifestyle
aiRouter.post('/remedies', getRemedies); // Frontend calls /api/ai/remedies
aiRouter.get('/detox', getDetoxPrograms); // Frontend calls /api/ai/detox
aiRouter.post('/upload', upload.single('file'), uploadDocument); // Upload PDF/Text
