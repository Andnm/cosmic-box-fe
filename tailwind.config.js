module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cosmic-purple': '#4A1B5C',
        'cosmic-pink': '#E91E63',
        'cosmic-blue': '#3B82F6',
        'cosmic-light': '#E8D5FF',
      },
      backgroundImage: {
        'cosmic-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'purple-gradient': 'linear-gradient(135deg, #4A1B5C 0%, #8B5CF6 100%)',
      }
    },
  },
  plugins: [],
}