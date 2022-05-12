import type { ErrorEvent } from "discord.js";

import { Logs } from '@ing3kth/core';

export default {
	name: 'error',
	once: false,
	async execute(error:ErrorEvent) {
		await Logs.log(error, 'error');
	},
};