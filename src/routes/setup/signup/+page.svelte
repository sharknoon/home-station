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
		<Input type="password" name="password" label="Password" />
		<Input type="password" name="password2" label="Confirm password" />
		<input type="hidden" name="theme" value="dark" /><!-- TODO -->
		<input type="hidden" name="language" value="en" /><!-- TODO -->
		{#if form?.username}
			{#if form.exists}
				<p class="text-red-500 text-sm">Username {form?.username} already exists</p>
			{:else if form?.invalid}
				<p class="text-red-500 text-sm">
					Username must be at least 3 characters and at most 31 characters long
				</p>
			{/if}
		{/if}
		{#if form?.password && form?.invalid}
			<p class="text-red-500 text-sm">Password must be at least 6 characters long</p>
		{/if}
		<div class="mt-6">
			<Button type="submit">Sign up</Button>
		</div>
	</form>
</div>
