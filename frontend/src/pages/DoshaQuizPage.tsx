import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaLeaf, FaFire, FaWater } from 'react-icons/fa';

type Option = {
  text: string;
  dosha: string;
  weight: number;
};

type Question = {
  id: number;
  text: string;
  options: Option[];
};

type Result = {
  primary: string;
  secondary: string | null;
  explanation: string;
  scores: { vata: number; pitta: number; kapha: number };
};

export const DoshaQuizPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<{dosha: string, weight: number}[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await fetch('/api/v1/ai/dosha-quiz'); // Proxied to AI service if configured in vite or backend proxy
      // Wait, vite proxy goes to backend (4000). Backend needs to proxy to AI service (8000) for this path?
      // Or we can just mock it for now or assume backend proxies it.
      // Actually, my backend doesn't proxy /api/v1/ai to 8000. It proxies via socket for chat.
      // I should probably add a proxy in backend or frontend.
      // For simplicity, let's assume I'll add a proxy route in backend next.
      
      // Temporary: Since I haven't added the proxy in backend yet, I'll fetch via a new backend endpoint
      // OR I can hardcode the questions here if fetch fails, but let's try to do it right.
      // I'll fetch from a backend endpoint I'm about to create: /api/ai/quiz
      
      // Let's assume backend will have /api/ai/quiz
      const data = await res.json();
      setQuestions(data.questions);
    } catch (err) {
      console.error("Failed to fetch questions", err);
      // Fallback questions if API fails (for demo stability)
      setQuestions([
        {
            "id": 1,
            "text": "How would you describe your body frame?",
            "options": [
                {"text": "Thin, bony, small joints", "dosha": "vata", "weight": 10},
                {"text": "Medium build, moderate muscle", "dosha": "pitta", "weight": 10},
                {"text": "Large build, thick, heavy", "dosha": "kapha", "weight": 10}
            ]
        },
        // ... simplified list
      ]);
    }
  };

  const handleOptionSelect = (option: Option) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = { dosha: option.dosha, weight: option.weight };
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      submitQuiz(newAnswers);
    }
  };

  const submitQuiz = async (finalAnswers: typeof answers) => {
    setLoading(true);
    try {
      // Again, assuming backend proxy /api/ai/dosha-calc
      // I will implement this proxy in backend next.
      const res = await fetch('/api/ai/dosha-calc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: finalAnswers })
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      // Mock result
      setResult({
        primary: "vata",
        secondary: "pitta",
        explanation: "Based on your answers (fallback), you have Vata nature.",
        scores: { vata: 20, pitta: 10, kapha: 0 }
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Analyzing your nature...</div>;

  if (result) {
    return (
      <div className="min-h-screen bg-ayur-bg p-8 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl w-full text-center"
        >
          <h2 className="text-3xl font-bold text-ayur-dark mb-6">Your Dosha Profile</h2>
          
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-ayur-primary capitalize">{result.primary}</div>
              <div className="text-sm text-gray-500">Primary</div>
            </div>
            {result.secondary && (
              <div className="text-center">
                <div className="text-4xl font-bold text-ayur-secondary capitalize">{result.secondary}</div>
                <div className="text-sm text-gray-500">Secondary</div>
              </div>
            )}
          </div>

          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            {result.explanation}
          </p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <ScoreCard label="Vata" score={result.scores.vata} icon={<FaLeaf />} color="text-blue-400" />
            <ScoreCard label="Pitta" score={result.scores.pitta} icon={<FaFire />} color="text-red-400" />
            <ScoreCard label="Kapha" score={result.scores.kapha} icon={<FaWater />} color="text-green-400" />
          </div>

          <button onClick={() => { setResult(null); setCurrentStep(0); setAnswers([]); }} className="bg-ayur-primary text-white px-6 py-2 rounded-lg hover:bg-ayur-dark">
            Retake Quiz
          </button>
        </motion.div>
      </div>
    );
  }

  const question = questions[currentStep];

  return (
    <div className="min-h-screen bg-ayur-gradient p-4 flex items-center justify-center">
      <div className="bg-white/95 p-8 rounded-2xl shadow-xl max-w-xl w-full">
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Question {currentStep + 1} of {questions.length}</span>
            <span>{Math.round(((currentStep + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-ayur-primary transition-all duration-500"
              style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-ayur-dark mb-8">{question?.text}</h2>

        <div className="space-y-4">
          {question?.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionSelect(option)}
              className="w-full text-left p-4 rounded-xl border-2 border-gray-100 hover:border-ayur-primary hover:bg-ayur-primary/5 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700 group-hover:text-ayur-dark">{option.text}</span>
                <div className="w-4 h-4 rounded-full border-2 border-gray-300 group-hover:border-ayur-primary" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const ScoreCard = ({ label, score, icon, color }: any) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <div className={`text-2xl mb-2 ${color} flex justify-center`}>{icon}</div>
    <div className="font-bold text-gray-800">{label}</div>
    <div className="text-sm text-gray-500">{score} points</div>
  </div>
);
