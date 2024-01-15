<script lang="ts">
    import { i18n } from "$lib/i18n";

    export let date: Date | undefined;
	export let fallback: string | undefined = undefined;
	export let withTime = false;

	const relativeFormatter = new Intl.RelativeTimeFormat($i18n.language);
	const absoluteFormatterWithYear = new Intl.DateTimeFormat($i18n.language, {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		weekday: 'long'
	});
	const absoluteFormatterWithoutYear = new Intl.DateTimeFormat($i18n.language, {
		month: 'long',
		day: 'numeric',
		weekday: 'long'
	});
	const currentYear = new Date().getFullYear();

	function formatDate(date: Date): string {
		const deltaDays = (date.getTime() - Date.now()) / (1000 * 3600 * 24);
		let formattedDate: string;
		if (deltaDays > -3) {
			formattedDate = relativeFormatter.format(Math.ceil(deltaDays), "");
		} else {
			if (date.getFullYear() === currentYear) {
				formattedDate = absoluteFormatterWithoutYear.format(date);
			} else {
				formattedDate = absoluteFormatterWithYear.format(date);
			}
		}
		return formattedDate;
	}
</script>

{#if date}
	{formatDate(date)}
{:else if fallback}
	{fallback}
{/if}