import { type Interaction, Permissions } from "discord.js";

import { Logs } from '@ing3kth/core';
import type { EventExtraData } from "../interface/EventData";

export default {
	name: 'interactionCreate',
	once: false,
	async execute(interaction:Interaction, _extraData:EventExtraData) {
		const createdTime = new Date();

		if (interaction.isCommand()) {
			const command = _extraData.commands.get(interaction.commandName);

			if (!command) {
				return;
			};

			try {

				await interaction.deferReply({
					ephemeral: Boolean(command.privateMessage),
				});

				if (command.permissions && Array(command.permissions).length > 0) {
					if (!interaction.memberPermissions?.has(command.permissions as Array<Permissions>)) {
						await interaction.editReply({
							content: `You don't have permission to use this command.`,
						});
						return;
					}
				}

				//log interaction
				await Logs.log(`${interaction.user.username}#${interaction.user.discriminator} used /${interaction.commandName}\x1b[0m`, 'info')

				//run commands
				await command.execute(interaction, _extraData.client, createdTime);

				//log time of use
				const command_now = Number(new Date())
				const command_create = Number(createdTime);
				const command_ping = command_now - command_create

				await Logs.log(`${interaction.user.username}#${interaction.user.discriminator} used /${interaction.commandName} - ${command_ping} Milliseconds\x1b[0m`, 'info')
			} catch (error) {
				Logs.log(error, 'error');
				await interaction.editReply({
					content: `Something Went Wrong, Please Try Again Later`,
				});
			}
		}
	},
};