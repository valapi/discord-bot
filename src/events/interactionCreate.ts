import type { Interaction } from "discord.js";

import * as IngCore from '@ing3kth/core';
import { getLanguageAndUndefined } from "../language/controller";
import { genarateApiKey } from "../utils/crypto";

import type { EventExtraData } from "../interface/EventData";
import type { SlashCommandExtendData, CustomSlashCommands } from "../interface/SlashCommand";

export default {
	name: 'interactionCreate',
	once: false,
	async execute(interaction:Interaction, _extraData:EventExtraData) {
		const createdTime = new Date();

		if (interaction.isCommand()) {
			const command = _extraData.commands.get(interaction.commandName) as CustomSlashCommands;

			if (!command) {
				return;
			};

			try {

				await interaction.deferReply({
					ephemeral: Boolean(command.privateMessage),
				});

				//permissions
				if (command.permissions && Array(command.permissions).length > 0) {
					if (!interaction.memberPermissions?.has(command.permissions)) {
						await interaction.editReply({
							content: `You don't have permission to use this command.`,
						});
						return;
					}
				}

				//log interaction
				await IngCore.Logs.log(`${interaction.user.username}#${interaction.user.discriminator} used /${interaction.commandName}\x1b[0m`, 'info')

				//language
				const _language = getLanguageAndUndefined(await IngCore.Cache.output({ name: 'language', interactionId: String(interaction.guildId) }));

				//run commands
				const _SlashCommandExtendData:SlashCommandExtendData = {
					interaction: interaction,
					DiscordClient: _extraData.client,
					createdTime: createdTime,
					language: _language,
					apiKey: genarateApiKey(interaction.user.id, interaction.user.createdTimestamp, ( interaction.user.username + interaction.user.tag )),
				};

				await command.execute(_SlashCommandExtendData);

				//log time of use
				const command_now = Number(new Date())
				const command_create = Number(createdTime);
				const command_ping = command_now - command_create

				await IngCore.Logs.log(`${interaction.user.username}#${interaction.user.discriminator} used /${interaction.commandName} - ${command_ping} Milliseconds\x1b[0m`, 'info')
			} catch (error) {
				await IngCore.Logs.log(error, 'error');
				await interaction.editReply({
					content: `Something Went Wrong, Please Try Again Later`,
				});
			}
		}
	},
};