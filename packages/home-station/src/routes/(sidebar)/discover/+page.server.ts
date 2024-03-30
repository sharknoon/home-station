import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import { createMarketplace, deleteMarketplace, updateMarketplace } from '$lib/server/marketplaces';
import { installedApps } from '$lib/server/apps';
import { get } from 'svelte/store';
import { sendNotification } from '$lib/server/notifications';
import { i18n } from '$lib/i18n';

export const load = (async () => {
    const marketplaceApps = await db.query.marketplaceApps.findMany({
        with: { marketplace: { columns: { gitRemoteUrl: true } } }
    });
    const marketplaces = await db.query.marketplaces.findMany({
        columns: { gitPassword: false }
    });
    return { marketplaceApps, marketplaces, installedApps: get(installedApps) };
}) satisfies PageServerLoad;

export const actions: Actions = {
    addMarketplace: async ({ request }) => {
        const data = await request.formData();
        const gitRemoteUrl = data.get('gitRemoteUrl')?.toString();
        const gitUsername = data.get('gitUsername')?.toString();
        const gitPassword = data.get('gitPassword')?.toString();

        if (!gitRemoteUrl) {
            return fail(400, { action: 'addMarketplace', gitRemoteUrl, invalid: true });
        }

        try {
            await createMarketplace(gitRemoteUrl, gitUsername, gitPassword);
            sendNotification('success', get(i18n).t('discover.marketplace-added'));
            return { action: 'addMarketplace', success: true };
        } catch (error) {
            switch ((error as Error).cause) {
                case 'invalid-url':
                    return fail(400, { action: 'addMarketplace', gitRemoteUrl, invalid: true });
                case 'invalid-credentials':
                    sendNotification(
                        'error',
                        get(i18n).t('discover.invalid-marketplace-credentials')
                    );
                    return fail(400, {
                        action: 'addMarketplace',
                        credentials: 'credentials',
                        invalid: true
                    });
                default:
                    return fail(500, { action: 'addMarketplace', gitRemoteUrl, error });
            }
        }
    },
    updateMarketplace: async ({ request }) => {
        const data = await request.formData();
        const gitRemoteUrl = data.get('gitRemoteUrl')?.toString();
        const gitUsername = data.get('gitUsername')?.toString();
        const gitPassword = data.get('gitPassword')?.toString();

        if (!gitRemoteUrl) {
            return fail(400, { action: 'updateMarketplace', gitRemoteUrl, invalid: true });
        }

        try {
            await updateMarketplace(gitRemoteUrl, gitUsername, gitPassword);
            sendNotification('success', get(i18n).t('discover.marketplace-updated'));
            return { action: 'updateMarketplace', success: true };
        } catch (error) {
            switch ((error as Error).cause) {
                case 'marketplace-not-found':
                    return fail(400, { action: 'updateMarketplace', gitRemoteUrl, notFound: true });
                case 'invalid-credentials':
                    sendNotification(
                        'error',
                        get(i18n).t('discover.invalid-marketplace-credentials')
                    );
                    return fail(400, {
                        action: 'updateMarketplace',
                        credentials: 'credentials',
                        invalid: true
                    });
                default:
                    return fail(500, { action: 'updateMarketplace', gitRemoteUrl, error });
            }
        }
    },
    deleteMarketplace: async ({ request }) => {
        const data = await request.formData();
        const gitRemoteUrl = data.get('gitRemoteUrl')?.toString();

        if (!gitRemoteUrl) {
            return fail(400, { action: 'deleteMarketplace', gitRemoteUrl, invalid: true });
        }

        // TODO check if the repository is used by an app
        if (get(installedApps).some((app) => app.marketplaceUrl === gitRemoteUrl)) {
            sendNotification('error', get(i18n).t('discover.marketplace-in-use'));
            return fail(400, { action: 'deleteMarketplace', gitRemoteUrl, used: true });
        }

        await deleteMarketplace(gitRemoteUrl);
        sendNotification('success', get(i18n).t('discover.marketplace-deleted'));
        return { action: 'deleteMarketplace', success: true };
    }
};
