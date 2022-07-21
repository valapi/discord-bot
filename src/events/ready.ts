import type { Client } from "discord.js";
import { Logs } from '@ing3kth/core';

export default {
	name: 'ready',
	once: true,
	async execute(client: Client) {
		Logs.log(`Ready! Logged in as ${client.user?.tag}`, 'system');
	},
};