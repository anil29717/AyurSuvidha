import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { motion } from 'framer-motion';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1A4D2E] font-body flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="px-8 py-20 max-w-4xl mx-auto text-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-serif font-bold mb-8 text-[#1A4D2E]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            About AyurSuvidha
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-600 leading-relaxed mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            AyurSuvidha is bridging the gap between ancient Ayurvedic wisdom and modern artificial intelligence. 
            Our mission is to make personalized holistic wellness accessible to everyone, everywhere.
          </motion.p>
        </section>

        <section className="px-8 py-16 bg-white">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-serif font-bold mb-6 text-[#1A4D2E]">Our Story</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Born from a desire to preserve and modernize the 5,000-year-old science of Ayurveda, AyurSuvidha started as a project to digitize classical texts. 
                We realized that the complexity of Ayurveda made it inaccessible to many.
              </p>
              <p className="text-gray-600 leading-relaxed">
                By integrating advanced AI models with verified Ayurvedic knowledge bases, we created a platform that understands your unique constitution (Prakriti) 
                and provides tailored recommendations that adapt to your lifestyle.
              </p>
            </div>
            <div className="bg-[#E8F3EB] h-80 rounded-2xl flex items-center justify-center">
              {/* Placeholder for an image */}
              <span className="text-[#1A4D2E]/40 font-serif italic text-2xl">Our Journey Image</span>
            </div>
          </div>
        </section>

        <section className="px-8 py-20 max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-serif font-bold mb-12 text-[#1A4D2E]">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Authenticity", desc: "Rooted in classical texts like Charaka Samhita and Sushruta Samhita." },
              { title: "Accessibility", desc: "Making holistic health available to everyone through technology." },
              { title: "Personalization", desc: "Treating the individual, not just the symptoms." }
            ].map((value, i) => (
              <div key={i} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-xl mb-3 text-[#1A4D2E]">{value.title}</h3>
                <p className="text-gray-600">{value.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
