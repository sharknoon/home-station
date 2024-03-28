import { initializeStores, type ModalComponent } from '@skeletonlabs/skeleton';
import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
import { storePopup } from '@skeletonlabs/skeleton';
import AppLaunchOptionsModal from '$lib/components/AppLaunchOptionsModal.svelte';

export function init(): Record<string, ModalComponent> {
    initializeStores();
    storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

    return {
        appLaunchOptionsModal: { ref: AppLaunchOptionsModal }
    };
}
