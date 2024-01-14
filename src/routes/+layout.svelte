<script lang="ts">
	import '../app.css';
	import type { LayoutData } from './$types';

	// Initializes the language based on browser language or the saved language from a previous visit
	import { init as initI18n } from '$lib/i18n';
	// Sets dark/light mode based on the browser default or the saved theme from a previous visit
	import { init as initTheme } from '$lib/theme';

	import PageLoadSpinner from '$lib/components/pageloadspinner.svelte';

	export let data: LayoutData;

	initI18n(data.language);
	initTheme(data.theme);
</script>

<slot />

<PageLoadSpinner />