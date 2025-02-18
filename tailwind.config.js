import { nextui } from '@nextui-org/react';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
        "./src/**/*.{jsx,tsx,ts,js}"
    ],
    theme: {
        extend: {
            fontFamily:{
                "sans":["inter"]
            }
        },
    },
    plugins: [nextui()],
}

