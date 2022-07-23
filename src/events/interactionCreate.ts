//import

import type { IEventHandler, ICommandHandler, IMenuHandler } from "../modules";

import * as process from 'process';
import * as IngCore from '@ing3kth/core';

import { getLanguageAndUndefined } from "../lang";
import { SlashCommandBuilder } from "discord.js";

import { genarateApiKey } from "../utils/crypto";

//script

const __event: IEventHandler.File<'interactionCreate'> = {
    name: 'interactionCreate',
    once: false,
    async execute({ _SlashCommand, _Menu, _DevelopmentMode, DiscordBot }, interaction) {
        if (_DevelopmentMode === true && interaction.guild?.id !== String(process.env['GUILD_ID'])) {
            return;
        }

        const createdTime = new Date();

        const language = getLanguageAndUndefined(IngCore.Cache.output({ name: 'languages', interactionId: String(interaction.guildId) }));

        if (interaction.isChatInputCommand()) {
            /**
             * Slash Command
             */
            const command: ICommandHandler.File = {
                ...{
                    command: ((new SlashCommandBuilder().setName('default')).setDescription('Default command')),
                    category: 'miscellaneous',
                    permissions: [],
                    onlyGuild: false,
                    inDevlopment: false,
                    execute: (async ({ }) => { return { content: 'This is Default message.', }; }),
                },
                ..._SlashCommand.Collection.get(interaction.commandName)
            }

            interaction.editReply = (async () => {
                throw new Error(
                    `Do not allow to edit reply`
                );
            });

            try {
                //load

                if (command.inDevlopment === true && interaction.user.id !== '549231132382855189') {
                    await interaction.reply({
                        content: language.data['dev_cmd'] || 'This command is in development.',
                    });

                    return;
                }

                if (!interaction.guild && command.onlyGuild === true) {
                    await interaction.reply({
                        content: language.data['not_guild'] || 'Slash Command are only available in server.',
                    });

                    return;
                }

                if (command.echo) {
                    if (command.echo.from) {
                        interaction.commandName = command.echo.from;

                        if (interaction.command) {
                            interaction.command.name = command.echo.from;
                        }
                    }

                    if (command.echo.subCommand && command.echo.subCommand.isSubCommand === true) {
                        interaction.options.getSubcommand = (() => {
                            return String(command.echo?.subCommand?.baseCommand);
                        });
                    }
                }

                if (command.permissions && command.permissions.length > 0 && interaction.guild) {
                    if (!interaction.memberPermissions?.has(command.permissions)) {
                        await interaction.reply({
                            content: language.data['not_permission'] || `You don't have permission to use this command.`,
                        });

                        return;
                    }
                }

                //execute

                IngCore.Logs.log(`<${interaction.user.id}> <command> ${interaction.commandName}\x1b[0m`, 'info');

                const TheCommand = await command.execute({
                    interaction,
                    DiscordBot,
                    createdTime,
                    language,
                    apiKey: genarateApiKey(String(`${interaction.user.id}${interaction.user.createdTimestamp}${interaction.user.username}${interaction.user.tag}`), String(`${interaction.guild?.id}${interaction.guild?.ownerId}`) + String(`${interaction.guild?.createdTimestamp}`), String(process.env['PUBLIC_KEY'])),
                });

                await interaction.reply({
                    ...TheCommand,
                    ...{
                        tts: false,
                        fetchReply: true
                    },
                });

                IngCore.Logs.log(`<${interaction.user.id}> <command> ${interaction.commandName} [${IngCore.DifferenceMillisecond(new Date().getTime(), createdTime)}]\x1b[0m`, 'info');
            } catch (error) {
                //error

                IngCore.Logs.log(error, 'error');

                await interaction.reply({
                    content: language.data.error || `Something Went Wrong, Please Try Again Later`,
                    embeds: [],
                    components: [],
                    files: [],
                    attachments: [],
                });
            }
        } else if (interaction.isSelectMenu()) {
            /**
             * Select Menu
             */
            const menu: IMenuHandler.File = {
                ...{
                    customId: 'default',
                    execute: (async ({ }) => { return { content: 'This is Default message.', }; }),
                },
                ..._Menu.get(interaction.customId)
            }

            interaction.editReply = (async () => {
                throw new Error(
                    `Do not allow to edit reply`
                );
            });

            try {
                //execute

                IngCore.Logs.log(`<${interaction.user.id}> <menu> ${interaction.customId}\x1b[0m`, 'info');

                const TheMenu = await menu.execute({
                    interaction,
                    DiscordBot,
                    _SlashCommand,
                });

                await interaction.reply({ ...TheMenu, ...{ tts: false, fetchReply: true } });

                IngCore.Logs.log(`<${interaction.user.id}> <menu> ${interaction.customId} [${IngCore.DifferenceMillisecond(new Date().getTime(), createdTime)}]\x1b[0m`, 'info');
            } catch (error) {
                //error

                IngCore.Logs.log(error, 'error');

                await interaction.reply({
                    content: language.data.error || `Something Went Wrong, Please Try Again Later`,
                    embeds: [],
                    components: [],
                    files: [],
                    attachments: [],
                });
            }
        }
    },
}

//export

export default __event;