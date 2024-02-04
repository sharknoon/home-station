<script lang="ts">
    import '../app.css';
    import type { LayoutData } from './$types';
    import { Toast, Modal, Drawer } from '@skeletonlabs/skeleton';

    // Initializes the ui framework skeleton
    import { init as initUiFramework } from '$lib/uiframwork';
    // Initializes the language based on browser language or the saved language from a previous visit
    import { init as initI18n } from '$lib/i18n';
    // Initializes a page load spinner that starts popping up after 500ms of navigating
    import { init as initPageLoadSpinner } from '$lib/pageloadspinner';

    export let data: LayoutData;

    initUiFramework();
    initI18n(data.language);
    initPageLoadSpinner();
</script>

<Toast />
<Modal />
<Drawer />

<slot />
