<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1>Welcome to Home Station Studio</h1>

<div>{data.username}</div>

<a href="/apps/new">Create a new app</a><br />

<form method="post" action="?/logout" use:enhance>
	<button>Sign out</button>
</form>
