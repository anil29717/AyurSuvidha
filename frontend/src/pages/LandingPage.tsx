import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaLeaf, FaSpa, FaUserMd, FaSearch, FaShieldAlt, FaArrowRight } from 'react-icons/fa';
import heroImage from '../assets/hero-ayurveda.jpg';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1A4D2E] font-body">
      <Header />

      <main className="flex-1">
        
        {/* Hero Section */}
        <section className="px-8 pt-12 pb-20 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="text-left space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-[#E8F3EB] px-4 py-2 rounded-full text-sm font-medium text-[#1A4D2E]"
            >
              <FaSpa className="text-sm" /> AI-Powered Ayurvedic Wellness
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl font-serif font-bold leading-tight text-[#1A4D2E]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Ancient Wisdom, <br/> Modern Intelligence.
            </motion.h1>
            
            <motion.p
              className="text-lg text-gray-600 leading-relaxed max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Discover your unique constitution, find natural remedies, and consult with our 
              AI assistant grounded in classical Ayurvedic texts.
            </motion.p>
            
            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Link
                to="/chat"
                className="px-8 py-4 rounded-full bg-[#1A4D2E] text-white font-heading font-semibold shadow-lg hover:bg-[#143d23] transition flex items-center gap-2"
              >
                <FaUserMd /> Start Consultation <FaArrowRight className="text-sm" />
              </Link>
              <Link
                to="/dosha-quiz"
                className="px-8 py-4 rounded-full bg-white text-[#1A4D2E] border border-gray-200 font-heading font-semibold shadow-sm hover:shadow-md transition flex items-center gap-2"
              >
                <FaSpa /> Take Dosha Quiz
              </Link>
            </motion.div>
          </div>

          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <img 
              src={heroImage} 
              alt="Ayurvedic Wellness" 
              className="rounded-3xl shadow-2xl w-full object-cover h-[500px]"
            />
            
            <div className="absolute bottom-8 left-8 bg-white p-4 rounded-xl shadow-lg flex items-center gap-4 max-w-xs animate-fade-in-up">
              <div className="bg-[#E8F3EB] p-3 rounded-full text-[#1A4D2E]">
                <FaShieldAlt className="text-xl" />
              </div>
              <div>
                <p className="font-bold text-[#1A4D2E] text-sm">Trusted by Experts</p>
                <p className="text-xs text-gray-500">Verified Ayurvedic Sources</p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-[#FDFBF7] border-y border-[#E8F3EB]">
          <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Years of Wisdom", value: "5000+" },
              { label: "Herbal Remedies", value: "300+" },
              { label: "Users Helped", value: "50K+" },
              { label: "Satisfaction", value: "98%" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-4xl font-serif font-bold text-[#1A4D2E] mb-2">{stat.value}</div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-8 max-w-7xl mx-auto" id="features">
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest text-gray-500 uppercase">What We Offer</span>
            <h2 className="text-4xl font-serif font-bold text-[#1A4D2E] mt-4">Holistic Healing, Reimagined</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Combining millennia of Ayurvedic knowledge with cutting-edge AI to deliver personalized wellness guidance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Personalized Care", desc: "Tailored lifestyle & diet plans based on your unique Prakriti constitution.", icon: <FaUserMd /> },
              { title: "Herbal Wisdom", desc: "Access a vast database of classical herbs and their healing properties.", icon: <FaLeaf /> },
              { title: "Symptom Checker", desc: "Instant Ayurvedic analysis of imbalances with intelligent diagnosis.", icon: <FaSearch /> }
            ].map((f, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition group">
                <div className="w-12 h-12 bg-[#E8F3EB] rounded-full flex items-center justify-center text-[#1A4D2E] text-xl mb-6 group-hover:bg-[#1A4D2E] group-hover:text-white transition">
                  {f.icon}
                </div>
                <h3 className="font-heading font-bold text-xl text-[#1A4D2E] mb-3">{f.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-8 pb-24">
          <div className="max-w-7xl mx-auto bg-[#1A4D2E] rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden">
             {/* Decorative background blur */}
            <div className="absolute top-0 left-0 w-full h-full bg-white/5 pointer-events-none" />
            
            <div className="relative z-10">
              <FaLeaf className="mx-auto text-4xl mb-6 text-white/80" />
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Begin Your Healing Journey</h2>
              <p className="text-white/80 max-w-2xl mx-auto mb-10 text-lg">
                Whether you seek balance, relief, or deeper understanding of your body's needs — AyurSuvidha is your trusted companion.
              </p>
              <Link 
                to="/register" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#1A4D2E] rounded-full font-bold hover:bg-gray-100 transition"
              >
                Get Started Free <FaArrowRight />
              </Link>
            </div>
          </div>
        </section>

      </main>
      
      <Footer />
    </div>
  );
}
