import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaLeaf, FaSpa, FaUserMd } from 'react-icons/fa';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-ayur-bg text-ayur-text flex flex-col font-body">
      <header className="px-8 py-6 flex items-center justify-between bg-white shadow-sm">
        <div className="flex items-center gap-2">
           <FaLeaf className="text-ayur-primary text-2xl" />
           <div className="font-heading font-bold text-xl tracking-wide text-ayur-dark">AyurAI</div>
        </div>
        <div className="space-x-4">
          <Link to="/login" className="px-5 py-2 rounded-full border border-ayur-primary text-ayur-primary font-semibold hover:bg-ayur-primary hover:text-white transition">
            Login
          </Link>
          <Link to="/register" className="px-5 py-2 rounded-full bg-ayur-primary text-white font-semibold shadow-md hover:bg-ayur-dark transition">
            Get Started
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-ayur-secondary/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-ayur-primary/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

        <motion.h1
          className="text-5xl md:text-6xl font-serif font-bold mb-6 max-w-4xl text-ayur-dark leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Ancient Wisdom,<br/> <span className="text-ayur-primary">Modern Intelligence.</span>
        </motion.h1>
        
        <motion.p
          className="max-w-2xl text-lg text-ayur-muted mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Discover your unique constitution (Dosha), find natural remedies, and consult with our 
          AI assistant grounded in classical Ayurvedic texts.
        </motion.p>
        
        <motion.div
          className="flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link
            to="/chat"
            className="px-8 py-4 rounded-full bg-ayur-primary text-white font-heading font-semibold shadow-lg hover:bg-ayur-dark hover:shadow-xl transition flex items-center gap-2"
          >
            <FaUserMd /> Start Consultation
          </Link>
          <Link
            to="/dosha-quiz"
            className="px-8 py-4 rounded-full bg-white text-ayur-dark border border-ayur-secondary font-heading font-semibold shadow-md hover:bg-ayur-light transition flex items-center gap-2"
          >
            <FaSpa /> Take Dosha Quiz
          </Link>
        </motion.div>

        {/* Feature Cards Preview */}
        <motion.div 
           className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-5xl w-full px-4"
           initial={{ opacity: 0, y: 40 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.4 }}
        >
            {[
              { title: "Personalized Care", desc: "Tailored lifestyle & diet plans based on your Prakriti.", icon: "🧘‍♀️" },
              { title: "Herbal Wisdom", desc: "Access a vast database of herbs and their healing properties.", icon: "🌿" },
              { title: "Symptom Checker", desc: "Instant analysis of imbalances with Ayurvedic diagnosis.", icon: "🔍" }
            ].map((f, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition text-left">
                  <div className="text-4xl mb-4">{f.icon}</div>
                  <h3 className="font-heading font-bold text-lg text-ayur-dark mb-2">{f.title}</h3>
                  <p className="text-sm text-ayur-muted">{f.desc}</p>
              </div>
            ))}
        </motion.div>

      </main>
      
      <footer className="bg-white border-t border-gray-100 py-8 text-center text-sm text-ayur-muted">
        <p>&copy; {new Date().getFullYear()} AyurAI. Harmonizing technology with nature.</p>
      </footer>
    </div>
  );
}

