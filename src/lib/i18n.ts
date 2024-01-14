import { browser } from '$app/environment';
import de from '$lib/locales/de/translation.json';
import en from '$lib/locales/en/translation.json';
import def, { type i18n as I18n } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { writable } from 'svelte/store';

export const i18n = writable<I18n>();

// In case new languages are being added, don't forget to also add them to `i18next-parser-config.ts`

export function init(languageFromDb?: string) {
	def.on('loaded', () => {
		i18n.set(def);
	});
	def.on('added', () => {
		i18n.set(def);
	});
	def.on('languageChanged', (lng) => {
		i18n.set(def);
		if (browser) {
			document.documentElement.setAttribute('lang', lng);
		}
	});

	const languageDetector = new LanguageDetector();
	languageDetector.addDetector({
		name: 'db',
		lookup: () => languageFromDb
	});

	def.use(languageDetector).init({
		resources: {
			en: { translation: en },
			de: { translation: de }
		},
		fallbackLng: ['en'],
		supportedLngs: ['en', 'de'],
		detection: {
			order: ['db', 'navigator']
		},
		interpolation: {
			skipOnVariables: false
		}
	});

	i18n.set(def);
}

export default i18n;