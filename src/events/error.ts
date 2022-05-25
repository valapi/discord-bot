import { Logs } from '@ing3kth/core';

export default {
	name: 'error',
	once: false,
	async execute(error:Error) {
		await Logs.log(error, 'error');
	},
};