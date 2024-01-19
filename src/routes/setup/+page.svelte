<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { Stepper, Step, Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import { Minus, Network, Plug2, Plus, RefreshCw, Unplug, AlertTriangle } from 'lucide-svelte';
	import i18n from '$lib/i18n';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';

	export let data: PageData;
	export let form: ActionData;

	// Step 1 Signup

	let username = '';
	let password1 = '';
	let password2 = '';

	$: usernameCorrect = /[a-zA-Z0-9_]{4,31}/.test(username);
	$: passwordCorrect = password1.length >= 8;
	$: passwordsEqual = password1 === password2;

	// Step 2 Connect container engine

	// Loading state for the "Connect" button to test the connection to the container engines
	let loading = false;

	let name = '';
	let host = '';

	// Step 3 Add domains and hostnames

	let hostnameInput: string;
	let hostnames = data.detectedHostnames.map((hostname) => ({ hostname, autoDetected: true }));
	page.subscribe((page) => {
		if (
			page.form?.hostname &&
			page.form?.success &&
			!hostnames.some((h) => h.hostname === page.form?.hostname)
		) {
			hostnames = [...hostnames, { hostname: page.form.hostname, autoDetected: true }];
		}
	});
	$: hostnamesOnly = hostnames.map((h) => h.hostname).join(',');
</script>

<div class="h-full flex flex-col gap-12 items-center justify-center p-12">
	<h1 class="h1">
		<span
			class="bg-gradient-to-br from-primary-500 to-secondary-500 bg-clip-text text-transparent box-decoration-clone font-bold"
		>
			{$i18n.t('brand.title')}
		</span>
	</h1>

	{#if !data.appDataPersistent.isPersistent}
		<aside class="alert variant-filled-warning max-w-[35rem]">
			<div><AlertTriangle /></div>
			<div class="alert-message">
				<p>{$i18n.t('setup.missing-mount', { path: data.appDataPersistent.defaultAppDataPath })}</p>
			</div>
		</aside>
	{/if}

	<form
		method="post"
		action="?/signup"
		enctype="multipart/form-data"
		class="card max-w-[35rem] p-4 overflow-y-auto"
		use:enhance={() => {
			// Skip loading animations if the duration is under 100ms to prevent flickering
			const timeout = setTimeout(() => (loading = true), 100);
			return async ({ update }) => {
				clearTimeout(timeout);
				loading = false;
				update({ reset: false });
			};
		}}
	>
		<Stepper
			stepTerm={$i18n.t('setup.step')}
			buttonBackLabel={$i18n.t('setup.back')}
			buttonNextLabel={$i18n.t('setup.next')}
			buttonCompleteLabel={$i18n.t('setup.complete')}
			buttonCompleteType="submit"
		>
			<Step locked={!usernameCorrect || !passwordCorrect || !passwordsEqual}>
				<svelte:fragment slot="header">{$i18n.t('setup.welcome')}</svelte:fragment>
				<p>{$i18n.t('setup.get-started-account')}</p>
				<div class="space-y-4">
					<label class="label">
						<span>{$i18n.t('setup.username')}</span>
						<input
							class="input {form?.username || (usernameCorrect === false && username.length > 0)
								? '[&:not(:focus)]:input-error'
								: ''}"
							type="text"
							required
							placeholder={$i18n.t('setup.username')}
							bind:value={username}
						/>
						<span class="text-sm text-surface-600-300-token">
							{$i18n.t('setup.username-requirements')}
						</span>
					</label>
					<label class="label">
						<span>{$i18n.t('setup.password')}</span>
						<input
							class="input {form?.password || (passwordCorrect === false && password1.length > 0)
								? '[&:not(:focus)]:input-error'
								: ''}"
							type="password"
							required
							placeholder={$i18n.t('setup.password')}
							bind:value={password1}
						/>
						<span class="text-sm text-surface-600-300-token">
							{$i18n.t('setup.password-requirements')}
						</span>
					</label>
					<label class="label">
						<span>{$i18n.t('setup.repeat-password')}</span>
						<input
							class="input {passwordsEqual === false && password2.length > 0
								? '[&:not(:focus)]:input-error'
								: ''}"
							type="password"
							required
							placeholder={$i18n.t('setup.password')}
							bind:value={password2}
						/>
					</label>
				</div>
				<!-- This is to remove the first "Back" button -->
				<svelte:fragment slot="navigation">{''}</svelte:fragment>
			</Step>
			<Step locked={!form?.success || name?.length === 0}>
				<svelte:fragment slot="header">{$i18n.t('setup.connect-container-engine')}</svelte:fragment>
				<p>{$i18n.t('setup.container-engine-explanation')}</p>
				<Accordion autocollapse class="bg-surface-200-700-token rounded-container-token">
					<AccordionItem open>
						<svelte:fragment slot="lead"><Plug2 /></svelte:fragment>
						<svelte:fragment slot="summary">
							{$i18n.t('setup.local-container-engine')}
						</svelte:fragment>
						<svelte:fragment slot="content">
							<div class="space-y-2">
								<label class="label">
									<span>{$i18n.t('setup.container-engine-name')}</span>
									<input
										class="input"
										type="text"
										name="name"
										required
										placeholder={$i18n.t('setup.container-engine-name-placeholder')}
										bind:value={name}
									/>
								</label>
								<Accordion>
									<AccordionItem>
										<svelte:fragment slot="summary">
											{$i18n.t('setup.more-settings')}
										</svelte:fragment>
										<svelte:fragment slot="content">
											<label class="label">
												<span>{$i18n.t('setup.override-socket')}</span>
												<input
													class="input"
													type="text"
													name="socketPath"
													placeholder={$i18n.t('setup.override-socket-placeholder')}
												/>
											</label>
										</svelte:fragment>
									</AccordionItem>
								</Accordion>
								<!-- TODO replace with svelte 5 snippets -->
								<div class="flex gap-4 items-center">
									<button
										type="submit"
										formaction="?/connectLocal"
										class="btn variant-filled-secondary"
									>
										{#if !loading}
											<span><Unplug /></span>
											<span>{$i18n.t('setup.test-connection')}</span>
										{:else}
											<span><RefreshCw class="animate-spin" /></span>
											<span>{$i18n.t('setup.connecting')}</span>
										{/if}
									</button>
									{#if form?.type === 'local' && form?.error}
										<div class="text-error-500-400-token text-sm font-semibold">{form.error}</div>
									{:else if form?.type === 'local' && form?.success}
										<div class="text-success-800-100-token text-sm font-semibold">
											{$i18n.t('setup.successfully-connected')}
										</div>
									{/if}
								</div>
								{#if form?.type === 'local' && (form?.error?.includes('/var/run/docker.sock') || form?.error?.includes('//./pipe/docker_engine'))}
									<span class="badge variant-filled-warning">{$i18n.t('setup.note')}</span>
									<span class="grow text-sm">{$i18n.t('setup.note-mounted-docker-socket')}</span>
								{/if}
							</div>
						</svelte:fragment>
					</AccordionItem>
					<AccordionItem>
						<svelte:fragment slot="lead"><Network /></svelte:fragment>
						<svelte:fragment slot="summary">
							{$i18n.t('setup.remote-container-engine')}
						</svelte:fragment>
						<svelte:fragment slot="content">
							<div class="space-y-2 mb-2">
								<label class="label">
									<span>{$i18n.t('setup.container-engine-name')}</span>
									<input
										class="input"
										type="text"
										name="name"
										required
										placeholder={$i18n.t('setup.container-engine-name-placeholder')}
										bind:value={name}
									/>
								</label>
								<label class="label">
									<span>{$i18n.t('setup.container-engine-api-url')}</span>
									<input
										class="input"
										type="text"
										name="host"
										required
										placeholder={$i18n.t('setup.container-engine-api-url-placeholder')}
										bind:value={host}
									/>
								</label>
								<Accordion>
									<AccordionItem>
										<svelte:fragment slot="summary">
											{$i18n.t('setup.more-settings')}
										</svelte:fragment>
										<svelte:fragment slot="content">
											<label class="label">
												<span>{$i18n.t('setup.tls-ca-certificate')}</span>
												<input class="input" type="file" name="ca" />
											</label>
											<label class="label">
												<span>{$i18n.t('setup.tls-certificate')}</span>
												<input class="input" type="file" name="cert" />
											</label>
											<label class="label">
												<span>{$i18n.t('setup.tls-key')}</span>
												<input class="input" type="file" name="key" />
											</label>
										</svelte:fragment>
									</AccordionItem>
								</Accordion>
								<div class="flex gap-4 items-center">
									<button
										type="submit"
										formaction="?/connectRemote"
										class="btn variant-filled-secondary"
										disabled={!host}
									>
										{#if !loading}
											<span><Unplug /></span>
											<span>{$i18n.t('setup.test-connection')}</span>
										{:else}
											<span><RefreshCw class="animate-spin" /></span>
											<span>{$i18n.t('setup.connecting')}</span>
										{/if}
									</button>
									{#if form?.type === 'remote' && form?.error}
										<div class="text-error-500-400-token text-sm font-semibold">{form.error}</div>
									{:else if form?.type === 'remote' && form?.success}
										<div class="text-success-800-100-token text-sm font-semibold">
											{$i18n.t('setup.successfully-connected')}
										</div>
									{/if}
								</div>
							</div>
						</svelte:fragment>
					</AccordionItem>
				</Accordion>
				<span class="badge variant-filled">{$i18n.t('setup.tip')}</span>
				<span class="grow text-sm">{$i18n.t('setup.additional-container-engines')}</span>
			</Step>
			<Step>
				<svelte:fragment slot="header">{$i18n.t('setup.add-domains-and-hostnames')}</svelte:fragment
				>
				<!-- Repeat all previous step inputs here, because the stepper deletes them from the DOM -->
				<input type="hidden" name="username" bind:value={username} />
				<input type="hidden" name="password" bind:value={password1} />
				<input type="hidden" name="language" value={$i18n.language} />
				<input type="hidden" name="hostnames" bind:value={hostnamesOnly} />
				<ul class="list">
					{#each hostnames as { hostname, autoDetected }}
						<li>
							<code class="code text-base">{hostname}</code>
							{#if autoDetected}
								<span class="badge variant-filled">{$i18n.t('setup.auto-detected')}</span>
							{/if}
							<span class="flex-auto"></span>
							<button
								type="button"
								class="btn btn-sm variant-filled-error"
								on:click={() => (hostnames = hostnames.filter((h) => h.hostname !== hostname))}
							>
								<Minus />
							</button>
						</li>
					{/each}
				</ul>
				<div>
					<p>{$i18n.t('setup.add-domain-or-hostname')}</p>
					<div class="input-group input-group-divider grid-cols-[1fr_auto]">
						<input
							type="text"
							placeholder={$i18n.t('setup.domain-hostname-placeholder')}
							bind:value={hostnameInput}
						/>
						<button
							type="button"
							class="variant-filled-secondary"
							on:click={() => {
								if (!hostnames.some((h) => h.hostname === hostnameInput)) {
									hostnames = [...hostnames, { hostname: hostnameInput, autoDetected: false }];
								}
							}}
						>
							<Plus />
						</button>
					</div>
				</div>
				<span class="badge variant-filled">{$i18n.t('setup.tip')}</span>
				<span class="grow text-sm">{$i18n.t('setup.additional-domains-or-hostnames')}</span>
			</Step>
		</Stepper>
	</form>
</div>
