import { browser } from '$app/environment';
import de from '$lib/locales/de/translation.json';
import en from '$lib/locales/en/translation.json';
import def, { type i18n as I18n } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { get, writable } from 'svelte/store';
import 'cronstrue/locales/en';
import 'cronstrue/locales/de';

export const i18n = writable<I18n>();

/**
 * This is a wrapper around a string that can be localized.
 * The english language is required, all other languages are optional.
 * This is mainly being used in the app.yml files.
 */
export type LocalizedString = {
	en: string;
	de?: string;
};

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

/**
 * This function is similar to the t() function, but for LocalizedStrings.
 * @param localizedString The localiozed string to be translated
 * @returns The localized string in the current language
 */
export function ls(localizedString: LocalizedString): string {
	const language = get(i18n).language;
	if (language in localizedString && localizedString[language as keyof LocalizedString]) {
		return localizedString[language as keyof LocalizedString] as string;
	} else {
		return localizedString.en;
	}
}