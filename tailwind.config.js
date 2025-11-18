module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(0, 0%, 90%)",
        input: "hsl(0, 0%, 90%)",
        ring: "hsl(210, 80%, 50%)",
        background: "hsl(0, 0%, 98%)",
        foreground: "hsl(0, 0%, 12%)",
        primary: {
          DEFAULT: "hsl(210, 80%, 45%)",
          foreground: "hsl(0, 0%, 100%)",
        },
        secondary: {
          DEFAULT: "hsl(210, 60%, 70%)",
          foreground: "hsl(0, 0%, 5%)",
        },
        tertiary: {
          DEFAULT: "hsl(210, 40%, 94%)",
          foreground: "hsl(210, 30%, 20%)",
        },
        neutral: {
          DEFAULT: "hsl(0, 0%, 98%)",
          foreground: "hsl(0, 0%, 12%)",
        },
        success: {
          DEFAULT: "hsl(145, 60%, 40%)",
          foreground: "hsl(0, 0%, 100%)",
        },
        warning: {
          DEFAULT: "hsl(35, 90%, 55%)",
          foreground: "hsl(0, 0%, 100%)",
        },
        gray: {
          50: "hsl(0, 0%, 98%)",
          100: "hsl(0, 0%, 95%)",
          200: "hsl(0, 0%, 90%)",
          300: "hsl(0, 0%, 80%)",
          400: "hsl(0, 0%, 65%)",
          500: "hsl(0, 0%, 50%)",
          600: "hsl(0, 0%, 35%)",
          700: "hsl(0, 0%, 25%)",
          800: "hsl(0, 0%, 15%)",
          900: "hsl(0, 0%, 8%)",
        },
        muted: {
          DEFAULT: "hsl(0, 0%, 95%)",
          foreground: "hsl(0, 0%, 35%)",
        },
        accent: {
          DEFAULT: "hsl(0, 0%, 10%)",
          foreground: "hsl(0, 0%, 100%)",
        },
        destructive: {
          DEFAULT: "hsl(0, 84%, 60%)",
          foreground: "hsl(0, 0%, 100%)",
        },
        card: {
          DEFAULT: "hsl(0, 0%, 100%)",
          foreground: "hsl(0, 0%, 12%)",
        },
        popover: {
          DEFAULT: "hsl(0, 0%, 100%)",
          foreground: "hsl(0, 0%, 12%)",
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      borderRadius: {
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
      },
      spacing: {
        '4': '1rem',
        '8': '2rem',
        '12': '3rem',
        '16': '4rem',
        '24': '6rem',
        '32': '8rem',
        '48': '12rem',
        '64': '16rem',
      },
      backgroundImage: {
        'gradient-1': 'linear-gradient(135deg, hsl(210, 80%, 50%) 0%, hsl(210, 70%, 40%) 100%)',
        'gradient-2': 'linear-gradient(135deg, hsl(210, 80%, 45%) 0%, hsl(210, 60%, 55%) 100%)',
        'button-border-gradient': 'linear-gradient(135deg, hsl(210, 80%, 45%) 0%, hsl(210, 90%, 55%) 100%)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
