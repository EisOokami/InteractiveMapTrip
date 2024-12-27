// @type {import('tailwindcss').Config}
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "bright-blue": "#0096FF",
                "dark-mode-black": "#09090B",
                "dark-mode-gray": "#B5B5B6",
                "dark-mode-gray-2": "#27272A",
            },
            spacing: {
                97: "385px",
            },
        },
        fontFamily: {
            mono: ["Montserrat", "sans-serif"],
        },
    },
    plugins: [],
};
