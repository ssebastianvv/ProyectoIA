import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        black: '#000000',
        blue: '#14213D',
        yellow: '#FCA311',
        grey: '#E5E5E5',
        white: '#FFFFFF',
      },
    },
  },
  plugins: [],
} satisfies Config;
