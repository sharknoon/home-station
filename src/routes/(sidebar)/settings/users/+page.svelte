<script lang="ts">
	import type { PageData } from './$types';
	import { i18n } from '$lib/i18n';

	export let data: PageData;

	const languageNames = new Intl.DisplayNames([$i18n.language], { type: 'language' });
</script>

<h2 class="h2 mb-4">Users</h2>

<div class="table-container">
	<table class="table table-hover [&_td]:!align-middle">
		<thead>
			<tr>
				<th>Username</th>
				<th>Language</th>
				<th></th>
			</tr>
		</thead>
		<tbody>
			{#each data.users as user}
				<tr>
					<td>{user.username}</td>
					<td>{languageNames.of(user.language)}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
