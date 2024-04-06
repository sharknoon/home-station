import { db } from '$lib/server/db';
import { settings } from '$lib/server/schema';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { eq } from 'drizzle-orm';

export const load = (async () => {
    const httpsEnabled =
        (
            await db.query.settings.findFirst({
                where: eq(settings.key, 'httpsEnabled')
            })
        )?.value === 'true';
    const certificateEmail =
        (
            await db.query.settings.findFirst({
                where: eq(settings.key, 'certificateEmail')
            })
        )?.value ?? '';
    const domains = await db.query.domains.findMany();
    return { httpsEnabled, certificateEmail, domains };
}) satisfies PageServerLoad;

export const actions: Actions = {
    setHttps: async ({ request }) => {
        const data = await request.formData();
        const httpsEnabled = data.get('httpsEnabled') === 'on';
        const certificateEmail = data.get('email')?.toString() ?? '';
        if (httpsEnabled && !certificateEmail)
            return fail(400, { email: certificateEmail, missing: true });
        await db
            .insert(settings)
            .values({ key: 'httpsEnabled', value: String(httpsEnabled) })
            .onConflictDoUpdate({ target: settings.key, set: { value: String(httpsEnabled) } });
        await db
            .insert(settings)
            .values({ key: 'certificateEmail', value: certificateEmail })
            .onConflictDoUpdate({ target: settings.key, set: { value: certificateEmail } });
        return { success: true };
    }
};
