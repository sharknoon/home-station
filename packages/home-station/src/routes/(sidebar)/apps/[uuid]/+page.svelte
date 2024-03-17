<script lang="ts">
    import { onMount } from 'svelte';
    import '@xterm/xterm/css/xterm.css';

    let terminal: HTMLDivElement;

    onMount(async () => {
        const xterm = await import('@xterm/xterm');
        const addonFit = await import('@xterm/addon-fit');
        const term = new xterm.Terminal();
        const fitAddon = new addonFit.FitAddon();
        term.loadAddon(fitAddon);
        term.onData(() => {}); // Do nothing (read only)
        term.onKey(() => {}); // Do nothing (read only)
        term.open(terminal);
        fitAddon.fit();
        term.write('\x1b[?25l'); // Hide cursor
        term.write('Hello, World!\r\n');

        window.addEventListener('resize', () => fitAddon.fit());
    });
</script>

<div bind:this={terminal} class="h-full w-full bg-black rounded-container-token p-4" />
