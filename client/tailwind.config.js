/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Include all relevant files for Tailwind CSS
  ],
  theme: {
    screens: {
      xs: "475px",       // Extra small devices (e.g., small phones)
      sm: "640px",       // Small devices (e.g., larger phones)
      md: "768px",       // Medium devices (e.g., tablets)
      lg: "1024px",      // Large devices (e.g., small laptops)
      xl: "1280px",      // Extra large devices (e.g., desktops)
      "2xl": "1536px",   // Double extra large devices (e.g., larger desktops)
    },
    extend: {
      spacing: {
        "128": "32rem",
        "144": "36rem",
      },
      colors: {
        primary: "#1E3A8A",   // Custom Primary Color (Blue)
        secondary: "#9333EA", // Custom Secondary Color (Purple)
        neutral: "#64748B",   // Neutral Gray Tone
      },
      fontSize: {
        xs: ["0.75rem", "1rem"],  // Custom small font size
        sm: ["0.875rem", "1.25rem"],
        base: ["1rem", "1.5rem"],
        lg: ["1.125rem", "1.75rem"],
        xl: ["1.25rem", "1.75rem"],
        "2xl": ["1.5rem", "2rem"],
        "3xl": ["1.875rem", "2.25rem"],
        "4xl": ["2.25rem", "2.5rem"],
        "5xl": ["3rem", "1"],
        "6xl": ["3.75rem", "1"],
        "7xl": ["4.5rem", "1"],
        "8xl": ["6rem", "1"],
        "9xl": ["8rem", "1"],
      },
    },
  },
  plugins: [],
};
