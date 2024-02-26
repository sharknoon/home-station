export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12')
];

export const server_loads = [0];

export const dictionary = {
		"/(sidebar)": [3,[2]],
		"/(sidebar)/account": [4,[2]],
		"/(sidebar)/discover": [~5,[2]],
		"/login": [~11],
		"/(sidebar)/settings/container-engines": [~6,[2]],
		"/(sidebar)/settings/domains-and-hostnames": [~7,[2]],
		"/(sidebar)/settings/logs": [8,[2]],
		"/(sidebar)/settings/tasks": [~9,[2]],
		"/(sidebar)/settings/users": [~10,[2]],
		"/setup": [~12]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),

	reroute: (() => {})
};

export { default as root } from '../root.svelte';