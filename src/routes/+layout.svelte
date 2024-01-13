<script>
	import '../app.css';
	// Sets dark/light mode based on the browser default or the saved theme from a previous visit
	import { init as initTheme } from '$lib/theme';

	initTheme();
</script>

<slot />
