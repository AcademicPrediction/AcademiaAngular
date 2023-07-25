/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false,
   },
  prefix: 'tw-',
  important: true,
  content: [    
    "../src/**/*.html"
  ],
  
  theme: {
    extend: {},
  },
  plugins: [],
}