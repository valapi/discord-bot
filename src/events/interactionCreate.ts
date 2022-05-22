import { Interaction, Permissions } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

import * as process from "process";
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
			const GetSlashCommand = _extraData.commands.get(interaction.commandName) as CustomSlashCommands;

			if (!GetSlashCommand) {
				return;
			};

			const _defaultCommandAddto:CustomSlashCommands = {
				data: (new SlashCommandBuilder().setName('default')).setDescription('Default command'),
				type: 'miscellaneous',
				execute: (async ({ interaction }) => { await interaction.editReply('This is Default message.') }),
				permissions: [],
				privateMessage: false,
				showDeferReply: true,
				echo: {
					from: 'default',
					command: [],
					subCommand: {
						baseCommand: 'default',
						isSubCommand: false,
					}
				},
			}

			const command = new Object({ ..._defaultCommandAddto, ...GetSlashCommand }) as CustomSlashCommands;

			//language
			const _language = getLanguageAndUndefined(await IngCore.Cache.output({ name: 'language', interactionId: String(interaction.guildId) }));

			//script
			try {

				// Loading Command //

				if(command.showDeferReply){
					await interaction.deferReply({
						ephemeral: Boolean(command.privateMessage),
					});
				}

				if(!interaction.guild) {
					interaction.editReply({
						content: _language.data.not_guild || 'Slash Command are only available in server.',
					})
					return;
				}

				// Sub Command //

				//echo
				if(command.echo?.subCommand && command.echo?.subCommand.isSubCommand === true) {
					interaction.options.getSubcommand = ((required?:boolean) => {
						return String(command.echo?.subCommand?.baseCommand);
					});
				}

				// Permissions //
				if (command.permissions && Array(command.permissions).length > 0) {
					if (!interaction.memberPermissions?.has(command.permissions)) {
						await interaction.editReply({
							content: _language.data.not_permission || `You don't have permission to use this command.`,
						});
						return;
					}
				}

				// Interaction //

				//logs
				await IngCore.Logs.log(`<${interaction.user.id}> <start> /${interaction.commandName}\x1b[0m`, 'info');

				//run commands
				const _SlashCommandExtendData:SlashCommandExtendData = {
					interaction: interaction,
					DiscordClient: _extraData.client,
					createdTime: createdTime,
					language: _language,
					apiKey: genarateApiKey((interaction.user.id + interaction.user.createdTimestamp + interaction.user.username + interaction.user.tag), ( interaction.guild.id + interaction.guild.ownerId + interaction.guild.createdTimestamp ), process.env['PUBLIC_KEY']),
					command: {
						collection: _extraData.commands,
						array: _extraData.commandArray,
					},
				};

				const CommandExecute = await command.execute(_SlashCommandExtendData);
				if(typeof CommandExecute === 'string') {
					await interaction.editReply({ content: CommandExecute });
				}

				//log time of use
				const command_now = new Date().getTime();
				const command_create = Number(createdTime);
				const command_ping = command_now - command_create;

				await IngCore.Logs.log(`<${interaction.user.id}> <end - ${command_ping}> /${interaction.commandName}\x1b[0m`, 'info');
			} catch (error) {
				await IngCore.Logs.log(error, 'error');
				await interaction.editReply({
					content: _language.data.error || `Something Went Wrong, Please Try Again Later`,
				});
			}
		}
	},
};