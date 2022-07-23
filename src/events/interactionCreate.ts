//import

import type { IEventHandler, ICommandHandler } from "../modules";

import * as process from 'process';
import * as IngCore from '@ing3kth/core';

import { InteractionType, SlashCommandBuilder } from "discord.js";

import { genarateApiKey } from "../utils/crypto";

//script

const __event: IEventHandler.File<'interactionCreate'> = {
    name: 'interactionCreate',
    once: false,
    async execute({ _SlashCommand, _DevelopmentMode, DiscordBot }, interaction) {
        if (_DevelopmentMode === true && interaction.guild?.id !== String(process.env['GUILD_ID'])) {
            return;
        }

        const createdTime = new Date();

        // Slash Command
        if (interaction.type === InteractionType.ApplicationCommand) {
            const command: ICommandHandler.File = {
                ...{
                    command: ((new SlashCommandBuilder().setName('default')).setDescription('Default command')),
                    category: 'miscellaneous',
                    permissions: [],
                    onlyGuild: false,
                    inDevlopment: false,
                    execute: (async ({ interaction }) => { await interaction.editReply('This is Default message.'); }),
                },
                ..._SlashCommand.commands.get(interaction.commandName)
            }

            try {
                //load

                if (command.inDevlopment === true && interaction.user.id !== '549231132382855189') {
                    await interaction.reply({
                        content: 'This command is in development.',
                    });

                    return;
                }

                if (!interaction.guild && command.onlyGuild === true) {
                    await interaction.reply({
                        content: 'Slash Command are only available in server.',
                    });

                    return;
                }

                if (command.permissions && command.permissions.length > 0 && interaction.guild) {
                    if (!interaction.memberPermissions?.has(command.permissions)) {
                        await interaction.reply({
                            content: `You don't have permission to use this command.`,
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
                    apiKey: genarateApiKey(String(`${interaction.user.id}${interaction.user.createdTimestamp}${interaction.user.username}${interaction.user.tag}`), String(`${interaction.guild?.id}${interaction.guild?.ownerId}`) + String(`${interaction.guild?.createdTimestamp}`), String(process.env['PUBLIC_KEY'])),
                });

                if (interaction.isRepliable() === true) {
                    await interaction.reply({ ...TheCommand, ...{ tts: false } });
                }

                IngCore.Logs.log(`<${interaction.user.id}> <command> ${interaction.commandName} [${IngCore.DifferenceMillisecond(new Date().getTime(), createdTime)}]\x1b[0m`, 'info');
            } catch (error) {
                IngCore.Logs.log(error, 'error');

                await interaction.reply({
                    tts: false,
                    content: `Something Went Wrong, Please Try Again Later`,
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