module.exports = {
  purge: ['./components/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: (theme) => {
        return {
          'home-hero': "url('/home-hero.jpg')",
        };
      },
    },
  },
  variants: {},
  plugins: [],
};
