import { initializeStores } from '@skeletonlabs/skeleton';
import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
import { storePopup } from '@skeletonlabs/skeleton';

export function init() {
    initializeStores();
    storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
}
