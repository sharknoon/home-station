<script lang="ts">
	import { Tab, TabGroup } from '@skeletonlabs/skeleton';
	import { writable } from 'svelte/store';
	import i18n from '$lib/i18n';
	import { Save } from 'lucide-svelte';
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	export let form: ActionData;

	let tabSet: number = 0;

	// General tab
	const language = writable<string>($i18n.language);
	$: if (form?.language && form?.success) $i18n.changeLanguage(form.language);

	// Password tab
	let password1: string;
	let password2: string;
	$: passwordCorrect = (password1?.length || 0) >= 8;
	$: passwordsEqual = password1 === password2;
</script>

<TabGroup>
	<Tab bind:group={tabSet} name="tab1" value={0}>{$i18n.t('account.general.general')}</Tab>
	<Tab bind:group={tabSet} name="tab2" value={1}>{$i18n.t('account.password.password')}</Tab>
	<Tab bind:group={tabSet} name="tab3" value={2}>{$i18n.t('account.theme.theme')}</Tab>
	<svelte:fragment slot="panel">
		{#if tabSet === 0}
			<form method="post" action="?/updateAccount" use:enhance>
				<label class="label">
					<span>{$i18n.t('account.general.language')}</span>
					<select class="select" name="language" bind:value={$language}>
						<option value="cimode">Translation keys</option>
						{#each ($i18n.options.supportedLngs || []).filter((l) => l !== 'cimode').sort() as l}
							<option value={l}>{new Intl.DisplayNames([l], { type: 'language' }).of(l)}</option>
						{/each}
					</select>
				</label>
				<button type="submit" class="btn variant-filled-primary mt-4">
					<Save class="mr-2" />{$i18n.t('account.general.save')}
				</button>
			</form>
		{:else if tabSet === 1}
			<form method="post" action="?/updatePassword" class="space-y-4" use:enhance>
				<label class="label">
					<span>{$i18n.t('account.password.new')}</span>
					<input class="input" type="password" name="password" bind:value={password1} />
					<span class="text-sm text-surface-600-300-token">
						{$i18n.t('account.password.requirements')}
					</span>
				</label>
				<label class="label">
					<span>{$i18n.t('account.password.confirm')}</span>
					<input class="input" type="password" bind:value={password2} />
				</label>
				<button
					type="submit"
					class="btn variant-filled-primary"
					disabled={!passwordsEqual || !passwordCorrect}
				>
					<Save class="mr-2" />{$i18n.t('account.password.save')}
				</button>
			</form>
		{:else if tabSet === 2}
			(tab panel 3 contents)
		{/if}
	</svelte:fragment>
</TabGroup>
