/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Strict premium color tokens mapping
        bg: {
          primary: "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
          card: "var(--bg-card)",
          hover: "var(--bg-hover)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
          // fallbacks
          DEFAULT: "var(--text-primary)",
          2: "var(--text-secondary)",
          3: "var(--text-muted)",
          4: "var(--text-secondary)",
        },
        border: {
          primary: "var(--border)",
          DEFAULT: "var(--border)",
        },
        success: "var(--success)",
        warning: "var(--warning)",
        danger: "var(--danger)",
        accent: "var(--accent)",

        // Constant indicators
        sage: {
          DEFAULT: "var(--accent)",
          light: "var(--accent-light)",
          dark: "var(--accent-dark)",
        },
        orange: "var(--warning)",
        blue: "var(--info)",
        red: "var(--danger)",
        green: "var(--success)",
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "sans-serif"],
        syne: ["var(--font-syne)", "sans-serif"],
        serif: ["var(--font-playfair-display)", "serif"],
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        glow: "var(--shadow-glow)",
      },
      spacing: {
        xs: "var(--space-xs)",   // 8px
        sm: "var(--space-sm)",   // 12px
        md: "var(--space-md)",   // 16px
        lg: "var(--space-lg)",   // 24px
        xl: "var(--space-xl)",   // 32px
        "2xl": "var(--space-2xl)", // 48px
      },
      borderRadius: {
        xs: "var(--radius-xs)",  // 8px
        sm: "var(--radius-sm)",  // 12px
        md: "var(--radius-md)",  // 16px
        lg: "var(--radius-lg)",  // 20px
        xl: "var(--radius-xl)",  // 24px
        full: "var(--radius-full)",
      },
    },
  },
  plugins: [],
}
