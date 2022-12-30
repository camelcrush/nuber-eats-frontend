/** @type {import('tailwindcss').Config} */
module.exports = {
  // Netflify Deploy 시 필요한 CSS파일만 업로드하기 위해 purge 사용
  purge: ["./src/**/*.tsx"],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
