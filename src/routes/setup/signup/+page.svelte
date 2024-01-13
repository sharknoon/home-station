<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import Input from '$lib/components/input.svelte';
	import Button from '$lib/components/button.svelte';

	export let form: ActionData;
</script>

<div class="p-4 flex flex-col text-center">
	<h1 class="text-xl font-bold mb-2">Welcome to Home Station</h1>
	<span class="text-sm font-semibold">Get started by creating an account</span>
	<form method="post" action="?/signup" class="flex flex-col gap-2 p-4" use:enhance>
		<Input type="text" name="username" label="Username" />
		<Input type="password" name="password1" label="Password" />
		<Input type="password" name="password2" label="Confirm password" />
		<input type="hidden" name="theme">
		{#if form?.username && form.exists}
			<p class="text-red-500 text-sm">Username {form?.username} already exists</p>
		{/if}
		{#if form?.password && form?.mismatch}
			<p class="text-red-500 text-sm">Passwords doesn't match</p>
		{/if}
		<div class="mt-6">
			<Button type="submit">Sign up</Button>
		</div>
	</form>
</div>
