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

		const email = data.get('email')?.toString();
		let password = data.get('password')?.toString();

		if (!email) {
			return fail(400, { email, missing: true });
		}
		if (!password) {
			return fail(400, { password: 'password', missing: true });
		}

		password = await hash(password, 10);

		const emailExists =
			(await prisma.user.count({
				where: {
					email
				}
			})) > 0;
		if (emailExists) {
			return fail(400, { email, exists: true });
		}

		await prisma.user.create({
			data: {
				email,
				password
			}
		});

		await prisma.system.update({
			where: {
				id: 1
			},
			data: {
				currentSetupStep: 1
			}
		});

		return redirect(303, '/setup/container');
	}
} satisfies Actions;
