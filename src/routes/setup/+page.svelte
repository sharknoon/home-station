<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import i18n from '$lib/i18n';
	import { enhance } from '$app/forms';
	import { systemTheme } from '$lib/theme';
	import { Stepper, Step, Accordion, AccordionItem, FileButton } from '@skeletonlabs/skeleton';
	import { Network, Plug2, RefreshCcw, Unplug } from 'lucide-svelte';

	export let data: PageData;
	export let form: ActionData;

	// Loading state for the "Connect" button to test the connection to the container engines
	let connecting = false;

	let username = '';
	let password1 = '';
	let password2 = '';

	$: usernameCorrect = /[a-zA-Z0-9_]{4,31}/.test(username);
	$: passwordCorrect = password1.length >= 8;
	$: passwordsEqual = password1 === password2;
</script>

<div class="absolute inset-0 flex flex-col gap-12 justify-center items-center p-12">
	<h1 class="h1 leading-8">
		<span
			class="bg-gradient-to-br from-primary-500 to-secondary-500 bg-clip-text text-transparent box-decoration-clone font-bold"
		>
			{$i18n.t('brand.title')}
		</span>
	</h1>

	<div class="card max-w-[35rem] p-4">
		<Stepper
			stepTerm={$i18n.t('setup.step')}
			buttonBackLabel={$i18n.t('setup.back')}
			buttonNextLabel={$i18n.t('setup.next')}
		>
			<Step locked={!usernameCorrect || !passwordCorrect || !passwordsEqual}>
				<svelte:fragment slot="header">{$i18n.t('setup.welcome')}</svelte:fragment>
				<p>{$i18n.t('setup.get-started-account')}</p>
				<form method="post" class="space-y-4" use:enhance>
					<label class="label">
						<span>{$i18n.t('setup.username')}</span>
						<input
							class="input {form?.username || (usernameCorrect === false && username.length > 0)
								? '[&:not(:focus)]:input-error'
								: ''}"
							type="text"
							name="username"
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
							name="password"
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
							class="input {passwordsEqual === false && password2.length > 0 ? '[&:not(:focus)]:input-error' : ''}"
							type="password"
							name="password2"
							required
							placeholder={$i18n.t('setup.password')}
							bind:value={password2}
						/>
					</label>
					<input type="hidden" name="theme" value={$systemTheme} />
					<input type="hidden" name="language" value={$i18n.language} />
					{#if form?.username}
						{#if form?.exists}
							<p class="text-error-500-400-token text-sm">
								{$i18n.t('setup.username-already-exists', { username: form?.username })}
							</p>
						{:else if form?.invalid}
							<p class="text-error-500-400-token text-sm">{$i18n.t('setup.username-requirements')}</p>
						{/if}
					{/if}
					{#if form?.password}
						<p class="text-error-500-400-token text-sm">{$i18n.t('setup.password-requirements')}</p>
					{/if}
				</form>
				<!-- This is to remove the first "Back" button -->
				<svelte:fragment slot="navigation">{''}</svelte:fragment>
			</Step>
			<Step>
				<svelte:fragment slot="header">{$i18n.t('setup.connect-container-engine')}</svelte:fragment>
				<p>{$i18n.t("setup.container-engine-explanation")}</p>
				<Accordion autocollapse>
					<AccordionItem open>
						<svelte:fragment slot="lead"><Plug2 /></svelte:fragment>
						<svelte:fragment slot="summary">{$i18n.t("setup.local-container-engine")}</svelte:fragment>
						<svelte:fragment slot="content">
							<form
								method="post"
								action="?/connectLocal"
								class="space-y-4"
								use:enhance={() => {
									const timeout = setTimeout(() => (connecting = true), 100);
									return async ({ update }) => {
										clearTimeout(timeout);
										connecting = false;
										update();
									};
								}}
							>
								<label class="label">
									<span>{$i18n.t("setup.container-engine-name")}</span>
									<input
										class="input"
										required
										type="text"
										name="name"
										placeholder={$i18n.t("setup.container-engine-name-placeholder")}
									/>
								</label>
								<div class="mt-2">
									<Accordion>
										<AccordionItem>
											<svelte:fragment slot="summary">{$i18n.t("setup.more-settings")}</svelte:fragment>
											<svelte:fragment slot="content">
												<label class="label">
													<span>{$i18n.t("setup.override-socket")}</span>
													<input
														class="input"
														type="text"
														name="socketPath"
														placeholder={$i18n.t("setup.override-socket-placeholder")}
													/>
												</label>
											</svelte:fragment>
										</AccordionItem>
									</Accordion>
								</div>
                                <!-- TODO replace with svelte 5 snippets -->
								<div class="flex gap-4 items-center mt-4">
									<button type="submit" class="btn variant-filled-secondary">
										{#if !connecting}
											<span><Unplug /></span>
											<span>{$i18n.t("setup.test-connection")}</span>
										{:else}
											<span><RefreshCcw class="animate-spin" /></span>
											<span>{$i18n.t("setup.connecting")}</span>
										{/if}
									</button>
									{#if form?.type === 'local' && form?.error}
										<div class="text-error-500-400-token text-sm font-semibold">{form.error}</div>
									{:else if form?.type === 'local' && form?.success}
										<div class="text-success-500-400-token text-sm font-semibold">
											{$i18n.t("setup.successfully-connected")}
										</div>
									{/if}
								</div>
							</form>
						</svelte:fragment>
					</AccordionItem>
					<AccordionItem>
						<svelte:fragment slot="lead"><Network /></svelte:fragment>
						<svelte:fragment slot="summary">{$i18n.t("setup.remote-container-engine")}</svelte:fragment>
						<svelte:fragment slot="content">
							<form
								enctype="multipart/form-data"
								method="post"
								action="?/connectRemote"
								use:enhance={() => {
									const timeout = setTimeout(() => (connecting = true), 100);
									return async ({ update }) => {
										clearTimeout(timeout);
										connecting = false;
										update();
									};
								}}
							>
								<label class="label">
									<span>{$i18n.t("setup.container-engine-name")}</span>
									<input
										class="input"
										required
										type="text"
										name="name"
										placeholder={$i18n.t("setup.container-engine-name-placeholder")}
									/>
								</label>
								<div class="my-4"></div>
								<label class="label">
									<span>{$i18n.t("setup.docker-api-url")}</span>
									<input
										class="input"
										required
										type="text"
										name="host"
										placeholder={$i18n.t("setup.docker-api-url-placeholder")}
									/>
								</label>
								<div class="mt-2">
									<Accordion>
										<AccordionItem>
											<svelte:fragment slot="summary">{$i18n.t("setup.more-settings")}</svelte:fragment>
											<svelte:fragment slot="content">
												<label class="label">
													<span>{$i18n.t("setup.tls-ca-certificate")}</span>
                                                    <input class="input" type="file" name="ca" />
												</label>
												<label class="label">
													<span>{$i18n.t("setup.tls-certificate")}</span>
													<input class="input" type="file" name="cert" />
												</label>
												<label class="label">
													<span>{$i18n.t("setup.tls-key")}</span>
													<input class="input" type="file" name="key" />
												</label>
											</svelte:fragment>
										</AccordionItem>
									</Accordion>
								</div>
								<div class="flex gap-4 items-center mt-4">
									<button type="submit" class="btn variant-filled-secondary">
										{#if !connecting}
											<span><Unplug /></span>
											<span>{$i18n.t("setup.test-connection")}</span>
										{:else}
											<span><RefreshCcw class="animate-spin" /></span>
											<span>{$i18n.t("setup.connecting")}</span>
										{/if}
									</button>
									{#if form?.type === 'remote' && form?.error}
										<div class="text-red-500 text-sm font-semibold">{form.error}</div>
									{:else if form?.type === 'remote' && form?.success}
										<div class="text-green-500 text-sm font-semibold">
											{$i18n.t("setup.successfully-connected")}
										</div>
									{/if}
								</div>
							</form>
						</svelte:fragment>
					</AccordionItem>
				</Accordion>
				<span class="badge variant-filled">{$i18n.t("setup.tip")}</span>
				<span class="grow text-sm">{$i18n.t("setup.additional-container-engines")}</span>
			</Step>
		</Stepper>
	</div>
</div>
