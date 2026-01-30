/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ayur: {
          primary: '#6CA651', // Fresh Green (Vata/Healing)
          secondary: '#BBCB2E', // Light Green/Yellow (Pitta/Energy)
          accent: '#839705', // Deep Olive (Kapha/Grounding)
          dark: '#2C3E50', // Dark Slate (Text/Contrast)
          light: '#F8F9F7', // Off-White (Background)
          text: '#2D3436', // Primary Text
          muted: '#636E72', // Secondary Text
          bg: '#F8F9F7', // Background
        }
      },
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        body: ['Open Sans', 'sans-serif'],
      },
      backgroundImage: {
        'ayur-gradient':
          'linear-gradient(135deg, #F8F9F7 0%, #E8F5E9 100%)',
        'hero-pattern': "url('https://www.transparenttextures.com/patterns/leaves-pattern.png')" // Subtle texture
      }
    }
  },
  plugins: []
};

