<script lang="ts">
    import type { SimpleIcon } from 'simple-icons';

    export let icon: SimpleIcon;
    export let color = 'currentColor';
    export let size = 24;
    export let title = icon.title;
</script>

<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill={color} viewBox="0 0 24 24">
    <title>{title}</title>
    <path d={icon.path} />
</svg>
