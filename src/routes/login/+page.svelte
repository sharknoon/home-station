<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import i18n from '$lib/i18n';

	export let form: ActionData;
</script>

<div class="h-full flex flex-col gap-12 justify-center items-center p-12">
	<h1 class="h1">
		<span
			class="bg-gradient-to-br from-primary-500 to-secondary-500 bg-clip-text text-transparent box-decoration-clone font-bold"
		>
			{$i18n.t('brand.title')}
		</span>
	</h1>

	<div class="card p-4">
		<h3 class="h3 text-center mb-2">{$i18n.t('login.login-to-continue')}</h3>
		<form method="post" class="space-y-4" use:enhance>
			<label class="label">
				<span>{$i18n.t('login.username')}</span>
				<input class="input" type="text" name="username" placeholder={$i18n.t('login.username')} />
			</label>
			<label class="label">
				<span>{$i18n.t('login.password')}</span>
				<input
					class="input"
					type="password"
					name="password"
					placeholder={$i18n.t('login.password')}
				/>
			</label>
			{#if form?.incorrect}
				<p class="text-error-500-400-token text-sm">
					{$i18n.t('login.incorrect-username-or-password')}
				</p>
			{/if}
			<button type="submit" class="btn variant-filled-primary">{$i18n.t('login.login')}</button>
		</form>
	</div>
</div>
