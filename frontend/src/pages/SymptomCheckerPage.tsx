import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaHeartbeat, FaLeaf, FaTimes } from 'react-icons/fa';

type Result = {
  diagnosis: string;
  severity: string;
  dosha_imbalance: string[];
  recommended_actions: string[];
  recommended_herbs: string[];
  disclaimer: string;
};

export const SymptomCheckerPage: React.FC = () => {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAddSymptom = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setSymptoms([...symptoms, input.trim()]);
      setInput('');
    }
  };

  const removeSymptom = (idx: number) => {
    setSymptoms(symptoms.filter((_, i) => i !== idx));
  };

  const analyzeSymptoms = async () => {
    if (symptoms.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch('/api/ai/symptom-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms })
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ayur-bg p-8 flex items-center justify-center">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Input Section */}
        <div className="bg-white p-8 rounded-2xl shadow-xl h-fit">
          <h2 className="text-2xl font-bold text-ayur-dark mb-6 flex items-center gap-2">
            <FaHeartbeat className="text-ayur-primary" /> Symptom Checker
          </h2>
          <p className="text-gray-600 mb-6">
            Enter your symptoms below to get an Ayurvedic assessment.
          </p>

          <form onSubmit={handleAddSymptom} className="flex gap-2 mb-4">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. Headache, Dry Skin"
              className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ayur-primary"
            />
            <button type="submit" className="bg-ayur-secondary text-ayur-dark px-4 py-2 rounded-lg hover:bg-ayur-primary hover:text-white transition">
              Add
            </button>
          </form>

          <div className="flex flex-wrap gap-2 mb-8 min-h-[50px]">
            {symptoms.map((s, i) => (
              <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                {s}
                <button onClick={() => removeSymptom(i)} className="text-gray-400 hover:text-red-500"><FaTimes /></button>
              </span>
            ))}
          </div>

          <button 
            onClick={analyzeSymptoms}
            disabled={symptoms.length === 0 || loading}
            className="w-full bg-ayur-primary text-white py-3 rounded-lg font-semibold hover:bg-ayur-dark disabled:opacity-50 transition"
          >
            {loading ? 'Analyzing...' : 'Analyze Symptoms'}
          </button>
        </div>

        {/* Result Section */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-8 rounded-2xl shadow-xl h-fit"
        >
          {result ? (
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="text-xl font-bold text-ayur-dark mb-1">{result.diagnosis}</h3>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  result.severity === 'High' ? 'bg-red-100 text-red-800' : 
                  result.severity === 'Moderate' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-green-100 text-green-800'
                }`}>
                  Severity: {result.severity}
                </span>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Recommended Actions</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {result.recommended_actions.map((action, i) => (
                    <li key={i}>{action}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaLeaf className="text-ayur-primary" /> Herbal Support
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.recommended_herbs.map((herb, i) => (
                    <span key={i} className="bg-green-50 text-green-700 px-3 py-1 rounded-lg text-sm border border-green-100">
                      {herb}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg text-xs text-yellow-800 mt-6">
                <strong>Disclaimer:</strong> {result.disclaimer}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 py-12">
              <FaHeartbeat className="text-6xl mb-4 opacity-20" />
              <p>Results will appear here</p>
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
};
