import { Interaction, Permissions } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

import * as fs from 'fs';
import * as process from "process";
import * as IngCore from '@ing3kth/core';
import { getLanguageAndUndefined } from "../language/controller";
import { genarateApiKey } from "../utils/crypto";
import msANDms from "../utils/msANDms";

import type { EventExtraData } from "../interface/EventData";
import type { SlashCommandExtendData, CustomSlashCommands } from "../interface/SlashCommand";
import type { CustomButton, CustomButtonExtendData } from "../interface/Button";
import type { CustomMenu, CustomMenuExtendData } from "../interface/SelectMeus";

export default {
	name: 'interactionCreate',
	once: false,
	async execute(interaction: Interaction, _extraData: EventExtraData) {
		const createdTime = new Date();

		//language
		const _language = getLanguageAndUndefined(await IngCore.Cache.output({ name: 'language', interactionId: String(interaction.guildId) }));

		//script
		if (interaction.isCommand()) {
			/**
			 * SLASH COMMAND
			 */

			const GetSlashCommand = _extraData.commands.get(interaction.commandName) as CustomSlashCommands;

			if (!GetSlashCommand) {
				return;
			};

			const _defaultCommandAddto: CustomSlashCommands = {
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

			//script
			try {

				// Loading Command //

				if (command.showDeferReply) {
					await interaction.deferReply({
						ephemeral: Boolean(command.privateMessage),
					});
				}

				if (!interaction.guild) {
					interaction.editReply({
						content: _language.data.not_guild || 'Slash Command are only available in server.',
					})
					return;
				}

				// Sub Command //

				//echo
				if (command.echo?.subCommand && command.echo?.subCommand.isSubCommand === true) {
					interaction.options.getSubcommand = ((required?: boolean) => {
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
				await IngCore.Logs.log(`<${interaction.user.id}> <command> ${interaction.commandName}\x1b[0m`, 'info');

				//run commands
				const _SlashCommandExtendData: SlashCommandExtendData = {
					interaction: interaction,
					DiscordClient: _extraData.client,
					createdTime: createdTime,
					language: _language,
					apiKey: genarateApiKey((interaction.user.id + interaction.user.createdTimestamp + interaction.user.username + interaction.user.tag), (interaction.guild.id + interaction.guild.ownerId + interaction.guild.createdTimestamp), process.env['PUBLIC_KEY']),
				};

				const CommandExecute = await command.execute(_SlashCommandExtendData);
				if (typeof CommandExecute === 'string') {
					await interaction.editReply({ content: CommandExecute });
				}

				//end
				await IngCore.Logs.log(`<${interaction.user.id}> <command> ${interaction.commandName} [${msANDms(new Date().getTime(), createdTime)}]\x1b[0m`, 'info');
			} catch (error) {
				await IngCore.Logs.log(error, 'error');
				await interaction.editReply({
					content: _language.data.error || `Something Went Wrong, Please Try Again Later`,
				});
			}
		} else if (interaction.isButton()) {
			/**
			 * B U T T O N
			 */
			
			await IngCore.Logs.log(`<${interaction.user.id}> <button> ${interaction.customId}\x1b[0m`, 'info');

			const ButtonFolder = await fs.readdirSync(`${process.cwd()}/dist/commands/button`).filter(file => file.endsWith('.js'));

			ButtonFolder.forEach(async (file) => {
				const _getButtonFile = require(`${process.cwd()}/dist/commands/button/${file.replace('.js', '')}`).default as CustomButton;
				
				if (_getButtonFile.customId === interaction.customId) {
					const _defaultButtonFile:CustomButton = {
						customId: 'default',
						privateMessage: false,
						showDeferReply: true,
						execute: (async ({ interaction }) => { await interaction.editReply('This is Default message.') }),
					}
					const _file = new Object({ ..._defaultButtonFile, ..._getButtonFile }) as CustomButton;

					// SCRIPT //
					if(_file.showDeferReply){
						await interaction.deferReply({
							ephemeral: Boolean(_file.privateMessage),
						});
					}

					const _ButtonExtendData: CustomButtonExtendData = {
						interaction: interaction,
						DiscordClient: _extraData.client,
						createdTime: createdTime,
						language: _language,
					}

					await _file.execute(_ButtonExtendData);
					return;
				}
			});

			//end
			await IngCore.Logs.log(`<${interaction.user.id}> <button> ${interaction.customId} [${msANDms(new Date().getTime(), createdTime)}]\x1b[0m`, 'info');
		} else if (interaction.isSelectMenu()) {
			/**
			 * M E N U
			 */
			
			 await IngCore.Logs.log(`<${interaction.user.id}> <menu> ${interaction.customId}\x1b[0m`, 'info');

			 const MenusFolder = await fs.readdirSync(`${process.cwd()}/dist/commands/menu`).filter(file => file.endsWith('.js'));
 
			 MenusFolder.forEach(async (file) => {
				 const _getMenuFile = require(`${process.cwd()}/dist/commands/menu/${file.replace('.js', '')}`).default as CustomMenu;
				 
				 if (_getMenuFile.customId === interaction.customId) {
					 const _defaultMenuFile:CustomMenu = {
						 customId: 'default',
						 privateMessage: false,
						 showDeferReply: true,
						 execute: (async ({ interaction }) => { await interaction.editReply('This is Default message.') }),
					 }
					 const _file = new Object({ ..._defaultMenuFile, ..._getMenuFile }) as CustomMenu;
 
					 // SCRIPT //
					 if(_file.showDeferReply){
						 await interaction.deferUpdate();
					 }
 
					 const _MenuExtendData: CustomMenuExtendData = {
						 interaction: interaction,
						 DiscordClient: _extraData.client,
						 createdTime: createdTime,
						 language: _language,
						 command: {
							 collection: _extraData.commands,
							 array: _extraData.commandArray,
						 }
					 }
 
					 await _file.execute(_MenuExtendData);
					 return;
				 }
			 });
 
			 //end
			 await IngCore.Logs.log(`<${interaction.user.id}> <menu> ${interaction.customId} [${msANDms(new Date().getTime(), createdTime)}]\x1b[0m`, 'info');
		}
	},
};