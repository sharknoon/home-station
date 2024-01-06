<script lang="ts">
	import Input from '$lib/components/input.svelte';
    import Button from '$lib/components/button.svelte';
    import type { PageData } from './$types';
	import type { ActionData } from './$types';
    
    export let data: PageData;
    
	export let form: ActionData;
</script>

<div class="p-4 flex flex-col text-center">
    <h1 class="text-xl font-bold mb-2">Welcome to Home Station</h1>
    <span class="text-sm font-semibold">Get started by creating an account</span>
    <form method="post" action="?/signup" class="flex flex-col gap-2 p-4">
        <Input type="email" name="email" label="Email" />
        <Input type="password" name="password" label="Password" />
        <div class="mt-6">
            <Button type="submit">Sign up</Button>
        </div>
    </form>
</div>