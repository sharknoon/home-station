<script lang="ts">
	import { Tab, TabGroup } from '@skeletonlabs/skeleton';
	import { writable } from 'svelte/store';
	import i18n from '$lib/i18n';

	let tabSet: number = 0;

	// General tab
    const language = writable<string>($i18n.language);
	language.subscribe($i18n.changeLanguage);
</script>

<TabGroup>
	<Tab bind:group={tabSet} name="tab1" value={0}>{$i18n.t("account.general.general")}</Tab>
	<Tab bind:group={tabSet} name="tab2" value={1}>{$i18n.t("account.password.password")}</Tab>
	<Tab bind:group={tabSet} name="tab3" value={2}>{$i18n.t("account.theme.theme")}</Tab>
	<svelte:fragment slot="panel">
		{#if tabSet === 0}
			<form action="?/updateAccount">
				<label class="label">
					<span>{$i18n.t("account.general.language")}</span>
					<select class="select" bind:value={$language}>
						<option value="cimode">Translation keys</option>
						{#each ($i18n.options.supportedLngs || []).filter((l) => l !== 'cimode').sort() as l}
							<option value={l}>{new Intl.DisplayNames([l], { type: 'language' }).of(l)}</option>
						{/each}
					</select>
				</label>
			</form>
		{:else if tabSet === 1}
			(tab panel 2 contents)
		{:else if tabSet === 2}
			(tab panel 3 contents)
		{/if}
	</svelte:fragment>
</TabGroup>
