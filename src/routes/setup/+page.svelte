<script lang="ts">
	import type { ActionData } from './$types';
	import { Stepper, Step, Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import { Network, Plug2, RefreshCw, Unplug } from 'lucide-svelte';
	import i18n from '$lib/i18n';
	import { enhance } from '$app/forms';
	import { systemTheme } from '$lib/theme';

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
	let connecting = false;

	// Error / Success messages next to the "Connect" button
	let localSuccess = false;
	let localError = '';
	let remoteSuccess = false;
	let remoteError = '';

	// values for the connection testing
	let name = '';
	let type = '';
	let socketPath = '';
	let host = '';
	let ca = '';
	let cert = '';
	let key = '';
</script>

<div class="h-full flex flex-col gap-12 items-center justify-center p-12">
	<h1 class="h1">
		<span
			class="bg-gradient-to-br from-primary-500 to-secondary-500 bg-clip-text text-transparent box-decoration-clone font-bold"
		>
			{$i18n.t('brand.title')}
		</span>
	</h1>

	<form
		method="post"
		enctype="multipart/form-data"
		class="card max-w-[35rem] p-4 overflow-y-auto"
		use:enhance
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
			<Step locked={!localSuccess && !remoteSuccess}>
				<svelte:fragment slot="header">{$i18n.t('setup.connect-container-engine')}</svelte:fragment>
				<p>{$i18n.t('setup.container-engine-explanation')}</p>
				<!-- Repeat all previous step inputs here, because the stepper deletes them from the DOM -->
				<input type="hidden" name="username" bind:value={username} />
				<input type="hidden" name="password" bind:value={password1} />
				<input type="hidden" name="theme" value={$systemTheme} />
				<input type="hidden" name="language" value={$i18n.language} />
				<input type="hidden" name="type" bind:value={type} />
				<Accordion autocollapse>
					<AccordionItem open>
						<svelte:fragment slot="lead"><Plug2 /></svelte:fragment>
						<svelte:fragment slot="summary">
							{$i18n.t('setup.local-container-engine')}
						</svelte:fragment>
						<svelte:fragment slot="content">
							<div class="space-y-4">
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
								<div class="mt-2">
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
														bind:value={socketPath}
													/>
												</label>
											</svelte:fragment>
										</AccordionItem>
									</Accordion>
								</div>
								<!-- TODO replace with svelte 5 snippets -->
								<div class="flex gap-4 items-center mt-4">
									<button
										type="submit"
										class="btn variant-filled-secondary"
										on:click={async () => {
											const timeout = setTimeout(() => (connecting = true), 100);
											const result = await fetch('', {
												method: 'POST',
												headers: {
													'Content-Type': 'application/json'
												},
												body: JSON.stringify({
													type: 'local',
													socketPath
												})
											});
											const data = await result.json();
											if (data.success) {
												localSuccess = true;
												type = 'local';
											} else {
												localError = data.error;
											}
											clearTimeout(timeout);
											connecting = false;
										}}
									>
										{#if !connecting}
											<span><Unplug /></span>
											<span>{$i18n.t('setup.test-connection')}</span>
										{:else}
											<span><RefreshCw class="animate-spin" /></span>
											<span>{$i18n.t('setup.connecting')}</span>
										{/if}
									</button>
									{#if localError}
										<div class="text-error-500-400-token text-sm font-semibold">{localError}</div>
									{:else if localSuccess}
										<div class="text-success-800-100-token text-sm font-semibold">
											{$i18n.t('setup.successfully-connected')}
										</div>
									{/if}
								</div>
							</div>
						</svelte:fragment>
					</AccordionItem>
					<AccordionItem>
						<svelte:fragment slot="lead"><Network /></svelte:fragment>
						<svelte:fragment slot="summary">
							{$i18n.t('setup.remote-container-engine')}
						</svelte:fragment>
						<svelte:fragment slot="content">
							<label class="label">
								<span>{$i18n.t('setup.container-engine-name')}</span>
								<input
									class="input"
									type="text"
									name="name"
									required
									placeholder={$i18n.t('setup.container-engine-name-placeholder')}
								/>
							</label>
							<div class="my-4"></div>
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
							<div class="mt-2">
								<Accordion>
									<AccordionItem>
										<svelte:fragment slot="summary">
											{$i18n.t('setup.more-settings')}
										</svelte:fragment>
										<svelte:fragment slot="content">
											<label class="label">
												<span>{$i18n.t('setup.tls-ca-certificate')}</span>
												<input class="input" type="file" name="ca" bind:value={ca} />
											</label>
											<label class="label">
												<span>{$i18n.t('setup.tls-certificate')}</span>
												<input class="input" type="file" name="cert" bind:value={cert} />
											</label>
											<label class="label">
												<span>{$i18n.t('setup.tls-key')}</span>
												<input class="input" type="file" name="key" bind:value={key} />
											</label>
										</svelte:fragment>
									</AccordionItem>
								</Accordion>
							</div>
							<div class="flex gap-4 items-center mt-4">
								<button
									type="button"
									class="btn variant-filled-secondary"
									disabled={!host}
									on:click={async () => {
										const timeout = setTimeout(() => (connecting = true), 100);
										const result = await fetch('', {
											method: 'POST',
											headers: {
												'Content-Type': 'application/json'
											},
											body: JSON.stringify({
												type: 'remote',
												host,
												ca,
												cert,
												key
											})
										});
										const data = await result.json();
										if (data.success) {
											remoteSuccess = true;
											type = 'remote';
										} else {
											remoteError = data.error;
										}
										clearTimeout(timeout);
										connecting = false;
									}}
								>
									{#if !connecting}
										<span><Unplug /></span>
										<span>{$i18n.t('setup.test-connection')}</span>
									{:else}
										<span><RefreshCw class="animate-spin" /></span>
										<span>{$i18n.t('setup.connecting')}</span>
									{/if}
								</button>
								{#if remoteError}
									<div class="text-error-500-400-token text-sm font-semibold">{remoteError}</div>
								{:else if remoteSuccess}
									<div class="text-success-800-100-token text-sm font-semibold">
										{$i18n.t('setup.successfully-connected')}
									</div>
								{/if}
							</div>
						</svelte:fragment>
					</AccordionItem>
				</Accordion>
				<span class="badge variant-filled">{$i18n.t('setup.tip')}</span>
				<span class="grow text-sm">{$i18n.t('setup.additional-container-engines')}</span>
			</Step>
		</Stepper>
	</form>
</div>
