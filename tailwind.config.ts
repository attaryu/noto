import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				'tertiary-1': '#FFDDA4',
				'tertiary-2': '#EFF8B1',
			},
		},
		fontFamily: {
			light: ['"NeueMontrealLight"', 'sans-serif'],
			regular: ['"NeueMontrealRegular"', 'sans-serif'],
			medium: ['"NeueMontrealMedium"', 'sans-serif'],
			bold: ['"NeueMontrealBold"', 'sans-serif'],
		},
	},

	plugins: [],
} satisfies Config;
