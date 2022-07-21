import { Logs } from '@ing3kth/core';

export default {
	name: 'error',
	once: false,
	async execute(error: Error) {
		Logs.log(error, 'error');
	},
};