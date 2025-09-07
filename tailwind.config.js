/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Neutral porcelain base + ink text for premium look
        porcelain: "#F6F7F5",
        ink: "#1C1C1C",
        // Premium golds
        gold: "#C9A227",
        gold2: "#E2C35A",
        // Optional soft mint bands
        mint: "#DFF5E1",
        mintSoft: "#EEF9F2",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "ui-serif", "Georgia"],
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui"],
      },
	   fontSize: {
        base: "1.0625rem", // ~17px (default is 1rem = 16px)
      },
      boxShadow: {
        card: "0 10px 24px rgba(16,24,40,0.08)",
        gold: "0 14px 32px rgba(201,162,39,0.18)",
      },
    },
  },
  plugins: [],
};
