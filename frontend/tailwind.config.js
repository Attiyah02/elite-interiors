export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream:   '#f8f5f0',
        stone:   { 100:'#f0ebe3', 200:'#e4ddd3', 400:'#b5a99a', 600:'#7c6f63', 900:'#1c1a18' },
        accent:  '#9c7d5a',
        charcoal:'#2d2b28',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:    ['Jost', 'sans-serif'],
      },
    },
  },
  plugins: [],
};