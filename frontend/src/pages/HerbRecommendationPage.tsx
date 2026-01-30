import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaLeaf, FaSearch, FaExclamationTriangle } from 'react-icons/fa';

type Herb = {
  name: string;
  sanskrit_name: string;
  dosha_effect: string;
  benefits: string[];
  dosage: string;
  contraindications: string[];
  image_url: string;
};

export const HerbRecommendationPage: React.FC = () => {
  const [dosha, setDosha] = useState('');
  const [symptom, setSymptom] = useState('');
  const [results, setResults] = useState<Herb[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const fetchRecommendations = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dosha && !symptom) return;
    
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch('/api/ai/herbs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dosha, symptom })
      });
      const data = await res.json();
      setResults(data.recommendations);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ayur-bg p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-ayur-dark mb-8 flex items-center gap-3">
          <FaLeaf className="text-ayur-primary" /> Herbal Recommender
        </h1>

        {/* Search Section */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
          <form onSubmit={fetchRecommendations} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Dosha</label>
              <select 
                value={dosha} 
                onChange={(e) => setDosha(e.target.value)}
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ayur-primary bg-white"
              >
                <option value="">Any Dosha</option>
                <option value="Vata">Vata</option>
                <option value="Pitta">Pitta</option>
                <option value="Kapha">Kapha</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Symptom</label>
              <input 
                type="text"
                value={symptom}
                onChange={(e) => setSymptom(e.target.value)}
                placeholder="e.g. Stress, Digestion"
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ayur-primary"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="bg-ayur-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-ayur-dark transition flex items-center justify-center gap-2"
            >
              {loading ? 'Searching...' : <><FaSearch /> Find Herbs</>}
            </button>
          </form>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((herb, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition border border-gray-100"
            >
              <div className="h-48 bg-gray-200 relative overflow-hidden group">
                 {/* Placeholder for real image or fallback */}
                 <div className="absolute inset-0 flex items-center justify-center bg-green-50 text-green-200 text-6xl">
                    <FaLeaf />
                 </div>
                 {herb.image_url && !herb.image_url.includes("example.com") && (
                   <img src={herb.image_url} alt={herb.name} className="w-full h-full object-cover" />
                 )}
                 <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <h3 className="text-white text-xl font-bold">{herb.name}</h3>
                    <p className="text-white/80 text-sm italic">{herb.sanskrit_name}</p>
                 </div>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full mb-2">
                        {herb.dosha_effect}
                    </span>
                    <h4 className="font-semibold text-gray-700 mb-1">Key Benefits:</h4>
                    <ul className="list-disc list-inside text-gray-600 text-sm mb-4">
                        {herb.benefits.slice(0, 3).map((b, i) => <li key={i}>{b}</li>)}
                    </ul>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800 mb-3">
                    <strong>Dosage:</strong> {herb.dosage}
                </div>

                {herb.contraindications.length > 0 && (
                    <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 p-3 rounded-lg">
                        <FaExclamationTriangle className="mt-0.5 shrink-0" />
                        <div>
                            <strong>Caution:</strong> {herb.contraindications.join(", ")}
                        </div>
                    </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {searched && results.length === 0 && !loading && (
            <div className="text-center py-12 text-gray-500">
                <p>No herbs found matching your criteria.</p>
            </div>
        )}
      </div>
    </div>
  );
};
