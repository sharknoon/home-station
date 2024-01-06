<script lang="ts">
	export let type: 'submit' | 'reset' | 'button' | undefined | null = undefined;
</script>

<button class="rounded bg-emerald-700 px-4 py-2 border border-emerald-600 text-sm font-semibold" {type}><slot /></button>
