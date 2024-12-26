// @type {import('tailwindcss').Config}
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "bright-blue": "#0096FF",
                "second-black": "#090808",
                "second-gray": "#19191e",
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
