<script lang="ts">
    import '../app.css';
    import type { LayoutData } from './$types';
    import { Toast, Modal, Drawer } from '@skeletonlabs/skeleton';
    import { init as initUiFramework } from '$lib/uiframwork';
    import { init as initI18n } from '$lib/i18n';
    import { init as initPageLoadSpinner } from '$lib/pageloadspinner';
    import { init as initNotifications } from '$lib/notifications';

    export let data: LayoutData;

    // Initializes the ui framework skeleton
    initUiFramework();
    // Initializes the language based on browser language or the saved language from a previous visit
    initI18n(data.user?.language);
    // Initializes a page load spinner that starts popping up after 500ms of navigating
    initPageLoadSpinner();
    // Initializes the notification system
    initNotifications();
</script>

<Toast />
<Modal />
<Drawer />

<slot />
