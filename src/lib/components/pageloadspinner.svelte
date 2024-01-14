<script lang="ts">
	import { navigating } from '$app/stores';
	import { derived, type Readable } from 'svelte/store';
	import { onMount } from 'svelte';

	let timer: ReturnType<typeof setTimeout>;
	export const longNavigating: Readable<boolean> = derived(navigating, (newValue, set) => {
		if (timer) {
			clearTimeout(timer);
		}
		if (newValue) {
			timer = setTimeout(() => set(true), 500);
		}
		set(false);
	});

	let modal: HTMLDialogElement;
	onMount(() => {
		longNavigating.subscribe((isNavigating) => {
			if (isNavigating) {
				modal.showModal();
			} else {
				modal.close();
			}
		});
	});
</script>

<!-- TODO -->
<dialog bind:this={modal} class="modal">
	<form method="dialog" class="modal-box w-auto">
		<span class="loading loading-spinner loading-lg text-primary" />
	</form>
</dialog>