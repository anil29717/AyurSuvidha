import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSun, FaMoon, FaUtensils, FaPrayingHands, FaClock, FaSnowflake } from 'react-icons/fa';

type RoutineItem = {
  time: string;
  activity: string;
  description: string;
};

type LifestyleResponse = {
  routine: {
    morning: RoutineItem[];
    midday: RoutineItem[];
    evening: RoutineItem[];
  };
  seasonal_tips: string[];
};

export const LifestylePage: React.FC = () => {
  const [dosha, setDosha] = useState('Vata');
  const [season, setSeason] = useState('Winter');
  const [data, setData] = useState<LifestyleResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchLifestyle = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/lifestyle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dosha, season })
      });
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  React.useEffect(() => {
    fetchLifestyle();
  }, []);

  const RoutineSection = ({ title, items, icon }: { title: string, items: RoutineItem[], icon: React.ReactNode }) => (
    <div className="mb-8">
      <h3 className="text-xl font-bold text-ayur-dark mb-4 flex items-center gap-2">
        {icon} {title}
      </h3>
      <div className="space-y-4">
        {items.map((item, idx) => (
          <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-ayur-primary flex gap-4">
            <div className="min-w-[120px] font-semibold text-ayur-primary flex items-center gap-1 text-sm">
              <FaClock className="text-gray-400" /> {item.time}
            </div>
            <div>
              <h4 className="font-bold text-gray-800">{item.activity}</h4>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-ayur-bg p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-ayur-dark mb-8 flex items-center gap-3">
          <FaPrayingHands className="text-ayur-primary" /> Ayurvedic Lifestyle (Dinacharya)
        </h1>

        {/* Controls */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 flex flex-wrap gap-6 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Your Dosha</label>
            <div className="flex gap-2">
              {['Vata', 'Pitta', 'Kapha'].map(d => (
                <button
                  key={d}
                  onClick={() => setDosha(d)}
                  className={`px-4 py-2 rounded-full border transition ${
                    dosha === d 
                      ? 'bg-ayur-primary text-white border-ayur-primary' 
                      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Season</label>
            <select 
              value={season} 
              onChange={(e) => setSeason(e.target.value)}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ayur-primary bg-white min-w-[150px]"
            >
              <option value="Winter">Winter</option>
              <option value="Spring">Spring</option>
              <option value="Summer">Summer</option>
              <option value="Autumn">Autumn</option>
            </select>
          </div>

          <button 
            onClick={fetchLifestyle}
            disabled={loading}
            className="ml-auto bg-ayur-secondary text-ayur-dark px-6 py-2 rounded-lg hover:bg-ayur-primary hover:text-white transition font-semibold"
          >
            {loading ? 'Updating...' : 'Update Routine'}
          </button>
        </div>

        {data && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Routine Column */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 space-y-2"
            >
              <RoutineSection 
                title="Morning Routine" 
                items={data.routine.morning} 
                icon={<FaSun className="text-orange-400" />} 
              />
              <RoutineSection 
                title="Midday Routine" 
                items={data.routine.midday} 
                icon={<FaUtensils className="text-red-400" />} 
              />
              <RoutineSection 
                title="Evening Routine" 
                items={data.routine.evening} 
                icon={<FaMoon className="text-indigo-400" />} 
              />
            </motion.div>

            {/* Sidebar / Seasonal Tips */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-2xl shadow-md border border-green-200 sticky top-6">
                <h3 className="text-xl font-bold text-emerald-800 mb-4 flex items-center gap-2">
                  <FaSnowflake className="text-emerald-600" /> Seasonal Wisdom
                </h3>
                <p className="text-sm text-emerald-700 mb-4 font-medium">
                  Tips for {season} Season
                </p>
                <ul className="space-y-3">
                  {data.seasonal_tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-emerald-900 text-sm">
                      <span className="w-2 h-2 mt-1.5 bg-emerald-500 rounded-full shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-3">Why Dinacharya?</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Aligning your daily activities with nature's rhythms (circadian rhythms) balances the Doshas, improves digestion, and promotes longevity.
                </p>
              </div>
            </motion.div>

          </div>
        )}
      </div>
    </div>
  );
};
