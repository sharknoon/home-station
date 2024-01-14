<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import i18n from '$lib/i18n';
	import { systemTheme } from '$lib/theme';
	import Box from '$lib/components/box.svelte';
	import Input from '$lib/components/input.svelte';
	import Button from '$lib/components/button.svelte';

	export let form: ActionData;
</script>

<div class="bg-[url('/wallpapers/background.jpg')] bg-cover bg-center bg-no-repeat h-full">
	<div class="absolute inset-0 bg-gradient-to-b from-slate-800/50 to-slate-900"></div>
</div>
<div class="absolute inset-0 flex flex-col gap-4 justify-center items-center p-12">
	<img src="/logo.png" alt="logo" class="h-20 w-20" />
	<h1>{$i18n.t('brand.title')}</h1>
	<Box>
		<div class="p-4 flex flex-col text-center">
			<h1 class="text-xl font-bold">{$i18n.t('login.login-to-continue')}</h1>
			<form method="post" class="flex flex-col gap-2 p-4" use:enhance>
				<Input type="text" name="username" label={$i18n.t('login.username')} />
				<Input type="password" name="password" label={$i18n.t('login.password')} />
				<input type="hidden" name="theme" value={$systemTheme} />
				{#if form?.password && form?.invalid}
					<p class="text-red-500 text-sm">{$i18n.t('login.incorrect-password')}</p>
				{/if}
				<div class="mt-6 flex justify-end">
					<Button type="submit">{$i18n.t('login.login')}</Button>
				</div>
			</form>
		</div>
	</Box>
</div>
