import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaFirstAid, FaSearch, FaSpa, FaCheckCircle, FaWater } from 'react-icons/fa';

type Remedy = {
  name: string;
  ingredients: string[];
  instructions: string;
};

type DetoxProgram = {
  name: string;
  description: string;
  duration: string;
  steps: string[];
};

export const RemediesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'remedies' | 'detox'>('remedies');
  
  // Remedies State
  const [ailment, setAilment] = useState('');
  const [remedies, setRemedies] = useState<Remedy[]>([]);
  const [loadingRemedies, setLoadingRemedies] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Detox State
  const [detoxPrograms, setDetoxPrograms] = useState<DetoxProgram[]>([]);
  const [loadingDetox, setLoadingDetox] = useState(false);

  // Fetch Remedies
  const searchRemedies = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!ailment.trim()) return;

    setLoadingRemedies(true);
    setHasSearched(true);
    try {
      const res = await fetch('/api/ai/remedies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ailment })
      });
      const data = await res.json();
      setRemedies(data.remedies);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRemedies(false);
    }
  };

  // Fetch Detox Programs
  const fetchDetox = async () => {
    if (detoxPrograms.length > 0) return; // Cache check
    setLoadingDetox(true);
    try {
      const res = await fetch('/api/ai/detox');
      const data = await res.json();
      setDetoxPrograms(data.programs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDetox(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'detox') {
      fetchDetox();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-ayur-bg p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-ayur-dark mb-8 flex items-center gap-3">
          <FaFirstAid className="text-ayur-primary" /> Natural Treatments
        </h1>

        {/* Tab Switcher */}
        <div className="flex gap-4 mb-8 border-b border-gray-200 pb-1">
          <button
            onClick={() => setActiveTab('remedies')}
            className={`px-6 py-3 font-semibold transition relative ${
              activeTab === 'remedies' 
                ? 'text-ayur-primary border-b-2 border-ayur-primary' 
                : 'text-gray-500 hover:text-ayur-dark'
            }`}
          >
            Home Remedies
          </button>
          <button
            onClick={() => setActiveTab('detox')}
            className={`px-6 py-3 font-semibold transition relative ${
              activeTab === 'detox' 
                ? 'text-ayur-primary border-b-2 border-ayur-primary' 
                : 'text-gray-500 hover:text-ayur-dark'
            }`}
          >
            Detox Programs
          </button>
        </div>

        {/* Content Area */}
        <div className="min-h-[400px]">
          {activeTab === 'remedies' ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 max-w-2xl">
                <form onSubmit={searchRemedies} className="flex gap-2">
                  <input
                    type="text"
                    value={ailment}
                    onChange={(e) => setAilment(e.target.value)}
                    placeholder="Enter ailment (e.g. Cold, Headache, Stress)"
                    className="flex-1 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ayur-primary"
                  />
                  <button 
                    type="submit" 
                    disabled={loadingRemedies}
                    className="bg-ayur-secondary text-ayur-dark px-6 py-3 rounded-lg font-semibold hover:bg-ayur-primary hover:text-white transition flex items-center gap-2"
                  >
                    {loadingRemedies ? 'Searching...' : <><FaSearch /> Find Remedy</>}
                  </button>
                </form>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {remedies.map((remedy, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-400"
                  >
                    <h3 className="text-xl font-bold text-gray-800 mb-3">{remedy.name}</h3>
                    <div className="mb-4">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Ingredients</h4>
                      <div className="flex flex-wrap gap-2">
                        {remedy.ingredients.map((ing, i) => (
                          <span key={i} className="bg-yellow-50 text-yellow-800 px-2 py-1 rounded text-xs border border-yellow-100">
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Instructions</h4>
                      <p className="text-gray-700 text-sm leading-relaxed">{remedy.instructions}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {hasSearched && remedies.length === 0 && !loadingRemedies && (
                <div className="text-center py-12 text-gray-400">
                  <p>No specific remedies found for "{ailment}". Try broad terms like "Digestion" or "Skin".</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {loadingDetox ? (
                <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ayur-primary"></div></div>
              ) : (
                <div className="space-y-8">
                  {detoxPrograms.map((program, idx) => (
                    <div key={idx} className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">
                      <div className="bg-teal-50 p-8 md:w-1/3 flex flex-col justify-center items-center text-center border-r border-teal-100">
                        <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                          <FaSpa className="text-4xl text-teal-500" />
                        </div>
                        <h3 className="text-xl font-bold text-teal-900 mb-2">{program.name}</h3>
                        <span className="inline-block px-3 py-1 bg-teal-200 text-teal-900 text-xs font-bold rounded-full">
                          {program.duration}
                        </span>
                      </div>
                      <div className="p-8 md:w-2/3">
                        <p className="text-gray-600 italic mb-6">{program.description}</p>
                        <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <FaWater className="text-blue-400" /> Program Steps
                        </h4>
                        <ul className="space-y-3">
                          {program.steps.map((step, sIdx) => (
                            <li key={sIdx} className="flex items-start gap-3 text-gray-700 text-sm">
                              <FaCheckCircle className="mt-1 text-green-500 shrink-0" />
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
