import { navigating } from '$app/stores';
import { derived, type Readable } from 'svelte/store';
import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
import PageLoadModal from '$lib/components/pageloadmodal.svelte';
import { browser } from '$app/environment';

export function init() {
    const modalStore = getModalStore();

    let timer: ReturnType<typeof setTimeout>;
    const longNavigating: Readable<boolean> = derived(navigating, (newValue, set) => {
        if (timer) {
            clearTimeout(timer);
        }
        if (newValue) {
            timer = setTimeout(() => set(true), 500);
        }
        set(false);
    });

    const modal: ModalSettings = {
        type: 'component',
        component: { ref: PageLoadModal }
    };

    if (browser) {
        longNavigating.subscribe((isNavigating) => {
            if (isNavigating) {
                modalStore.trigger(modal);
            } else {
                modalStore.close();
            }
        });
    }
}
