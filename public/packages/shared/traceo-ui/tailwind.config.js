module.exports = {
  important: true,
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        primary: "#F7F8FB",
        secondary: "rgba(36, 41, 46, 0.3)",
        canvas: "#ffffff",
        link: "#6e9fff",
        contrast: "#ffffff",
      },
      textColor: {
        primary: "#2d2d2d",
        secondary: "#2d2d2d",
      },
      fontSize: {
        "2xs": "11px",
      },
    },
  },
  plugins: [],
};
