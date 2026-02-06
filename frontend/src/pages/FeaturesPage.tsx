import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { motion } from 'framer-motion';
import { FaUserMd, FaLeaf, FaSearch, FaRobot, FaBrain, FaMobileAlt } from 'react-icons/fa';

export function FeaturesPage() {
  const features = [
    {
      icon: <FaUserMd />,
      title: "AI-Powered Consultations",
      desc: "Chat with our intelligent assistant trained on classical Ayurvedic texts. Get instant answers to your health queries, diet recommendations, and lifestyle advice tailored to your Dosha."
    },
    {
      icon: <FaBrain />,
      title: "Dosha Analysis",
      desc: "Take our comprehensive quiz to discover your Prakriti (body constitution). Understand your Vata, Pitta, and Kapha balance and how it influences your health."
    },
    {
      icon: <FaSearch />,
      title: "Symptom Checker",
      desc: "Input your symptoms and get an Ayurvedic perspective on potential imbalances. Our system suggests natural remedies and preventive measures."
    },
    {
      icon: <FaLeaf />,
      title: "Herbal Database",
      desc: "Explore a vast library of medicinal herbs. Learn about their properties (Rasa, Virya, Vipaka), uses, and contraindications."
    },
    {
      icon: <FaMobileAlt />,
      title: "Daily Routine (Dinacharya)",
      desc: "Receive personalized daily schedules aligned with the circadian rhythm. From wake-up times to meal plans, optimize your day for maximum energy."
    },
    {
      icon: <FaRobot />,
      title: "Continuous Learning",
      desc: "Our AI constantly learns from new verified sources and user feedback to provide the most accurate and up-to-date wellness guidance."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1A4D2E] font-body flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="px-8 py-20 bg-[#E8F3EB]/30">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              className="text-4xl md:text-5xl font-serif font-bold mb-6 text-[#1A4D2E]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Powerful Features for Your Wellness
            </motion.h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore the tools we've built to help you live a balanced, healthy life through the wisdom of Ayurveda.
            </p>
          </div>
        </section>

        <section className="px-8 py-20 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div 
                key={i}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-14 h-14 bg-[#E8F3EB] rounded-full flex items-center justify-center text-[#1A4D2E] text-2xl mb-6 group-hover:bg-[#1A4D2E] group-hover:text-white transition">
                  {f.icon}
                </div>
                <h3 className="font-heading font-bold text-xl text-[#1A4D2E] mb-3">{f.title}</h3>
                <p className="text-gray-600 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
