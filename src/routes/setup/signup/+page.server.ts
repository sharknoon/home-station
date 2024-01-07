import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import prisma from '$lib/server/prisma';
import { hash } from 'bcrypt';

export const load = (async () => {
	const system = await prisma.system.findFirst();
	if (system?.currentSetupStep !== 0) {
		return redirect(303, '/setup');
	}
	return {};
}) satisfies PageServerLoad;

export const actions = {
	signup: async ({ request }) => {
		const data = await request.formData();

		const username = data.get('username')?.toString();
		let password = data.get('password')?.toString();

		if (!username) {
			return fail(400, { username, missing: true });
		}
		if (!password) {
			return fail(400, { password: 'password', missing: true });
		}

		password = await hash(password, 10);

		const usernameExists =
			(await prisma.user.count({
				where: {
					username
				}
			})) > 0;
		if (usernameExists) {
			return fail(400, { username, exists: true });
		}

		await prisma.user.create({
			data: {
				username,
				password
			}
		});

		await prisma.system.upsert({
			where: { id: 1 },
			create: { currentSetupStep: 1 },
			update: { currentSetupStep: 1 }
		});

		return redirect(303, '/setup/container');
	}
} satisfies Actions;
