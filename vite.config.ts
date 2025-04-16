import { paraglideVitePlugin } from '@inlang/paraglide-js'
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [
		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/paraglide',
			strategy: ['cookie', 'preferredLanguage', 'baseLocale']
		}),
		sveltekit(),
		SvelteKitPWA({
			strategies: 'injectManifest',
			srcDir: 'src',
			filename: 'service-worker.ts',
			registerType: 'prompt',
			injectRegister: false,
			useCredentials: true,

			pwaAssets: {
				disabled: false,
				config: true,
			},

			manifest: {
				name: 'Notō: Secure note web-based app',
				short_name: 'Notō',
				description:
					"Web-based note-taking application with security in the hands of the user. Even the server doesn't know anything about the user's notes.",
				theme_color: '#ffffff',
				display: 'standalone',
				start_url: '/app',
				prefer_related_applications: true,
				orientation: 'portrait-primary',
				screenshots: [
					{
						src: 'slide-1.png',
						sizes: '842x494',
						type: 'image/png',
						form_factor: 'wide'
					},
					{
						src: 'slide-1.png',
						sizes: '842x494',
						type: 'image/png',
					},
				],
			},

			injectManifest: {
				globPatterns: [
					'client/**/*.{js,css,ico,png,svg,webp,webmanifest}',
					'prerendered/**/*.html',
				],
			},

			devOptions: {
				// ? pwa development flag
				enabled: true,
				suppressWarnings: true,
				navigateFallback: '/',
				navigateFallbackAllowlist: [/^\/$/],
				type: 'module',
			},
		}),
	],

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
	},
});
