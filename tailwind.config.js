/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        whatsapp: {
          green: '#25d366',
          dark: '#075e54',
          light: '#4fbe86',
          teal: '#0da896',
        }
      },
      animation: {
        'pulse-whatsapp': 'pulse-whatsapp 1.2s infinite',
        'bounce-in': 'bounce-in 0.4s both',
        'bounce-out': 'bounce-out 0.4s both',
        'typing': 'typing 1.8s infinite ease-in-out',
      },
      keyframes: {
        'pulse-whatsapp': {
          '0%': {
            'box-shadow': '0 0 0 0 rgba(37, 211, 101, 0.75)'
          },
          '100%': {
            'box-shadow': '0 0 0 15px rgba(37, 211, 101, 0)'
          }
        },
        'bounce-in': {
          '0%': {
            opacity: '0',
            transform: 'scale(0, 0)',
            'transform-origin': 'bottom right'
          },
          '50%': {
            transform: 'scale(1.03, 1.03)',
            'transform-origin': 'bottom right'
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1, 1)',
            'transform-origin': 'bottom right'
          }
        },
        'bounce-out': {
          '0%': {
            opacity: '1',
            transform: 'scale(1, 1)',
            'transform-origin': 'bottom right'
          },
          '100%': {
            opacity: '0',
            transform: 'scale(0, 0)',
            'transform-origin': 'bottom right'
          }
        },
        'typing': {
          '0%': {
            transform: 'translateY(0px)',
            'background-color': 'rgba(20, 105, 69, 0.7)'
          },
          '28%': {
            transform: 'translateY(-7px)',
            'background-color': 'rgba(20, 105, 69, 0.4)'
          },
          '44%': {
            transform: 'translateY(0px)',
            'background-color': 'rgba(20, 105, 69, 0.2)'
          }
        }
      }
    },
  },
  plugins: [],
}