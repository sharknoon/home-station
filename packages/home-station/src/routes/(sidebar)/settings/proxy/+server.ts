import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDomainIp, getPublicIp } from '$lib/server/network';
import { db } from '$lib/server/db';
import { domains } from '$lib/server/schema';

export const POST: RequestHandler = async ({ url }) => {
    const domain = url.searchParams.get('domain')?.toString();
    if (!domain) error(400, 'Missing domain');

    const homeStationIp = await getPublicIp();
    const domainIp = await getDomainIp(domain);
    if (homeStationIp !== domainIp) {
        return new Response('Domain does not resolve to this server', { status: 400 });
    }

    await db.insert(domains).values({ domain }).onConflictDoNothing();
    return new Response('Domain added');
};
