import { Link, useLocation } from 'react-router-dom';
import { FaLeaf } from 'react-icons/fa';

export function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="sticky top-0 z-50 bg-[#FDFBF7]/90 backdrop-blur-md shadow-sm transition-all duration-300">
      <div className="px-8 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
        <Link to="/" className="flex items-center gap-2">
           <FaLeaf className="text-[#1A4D2E] text-2xl" />
           <div className="font-heading font-bold text-xl tracking-wide text-[#1A4D2E]">AyurSuvidha</div>
        </Link>
        
        <nav className="hidden md:flex space-x-8 text-sm font-medium text-gray-600">
          <Link to="/features" className="hover:text-[#1A4D2E] transition">Features</Link>
          <Link to="/about" className="hover:text-[#1A4D2E] transition">About</Link>
          <Link to="/" className="hover:text-[#1A4D2E] transition">Impact</Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Link to="/login" className="px-6 py-2 rounded-full border border-[#1A4D2E] text-[#1A4D2E] font-semibold hover:bg-[#1A4D2E] hover:text-white transition text-sm">
            Login
          </Link>
          <Link to="/register" className="px-6 py-2 rounded-full bg-[#1A4D2E] text-white font-semibold shadow-md hover:bg-[#143d23] transition text-sm">
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
