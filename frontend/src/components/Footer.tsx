import { FaLeaf } from 'react-icons/fa';

export function Footer() {
  return (
    <footer className="bg-[#143d23] text-white py-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-8 flex flex-col items-center justify-center text-center">
        <div className="flex items-center gap-2 mb-4">
           <FaLeaf className="text-white text-xl" />
           <span className="font-heading font-bold text-lg">AyurSuvidha</span>
        </div>
        <p className="text-white/60 text-sm">
          &copy; {new Date().getFullYear()} AyurSuvidha. Bridging ancient wisdom with modern technology.
        </p>
      </div>
    </footer>
  );
}
