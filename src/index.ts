//import

import mongoose from 'mongoose';
import * as process from 'process';
import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import * as IngCore from '@ing3kth/core';

import { Client, GatewayIntentBits, Partials, ActivityType, Collection, RESTPostAPIApplicationCommandsJSONBody, SlashCommandBuilder } from 'discord.js';
import { REST } from '@discordjs/rest';
import { ApplicationCommandOptionType, Routes } from 'discord-api-types/v10';

import { ValorDatabase } from './utils/database';

import type { ICommandHandler, IEventHandler, IMenuHandler } from './modules';

//script

const _DevelopmentMode: any = false;

(async () => {
    //.env
    dotenv.config({
        path: path.join(`${process.cwd()}/.env`),
    });

    //database
    mongoose.connection.on("error", (async (error) => {
        IngCore.Logs.log(error, 'error');
    }));

    mongoose.connection.on("connected", (async () => {
        IngCore.Logs.log('Successfully connected to database', 'system');
    }));

    mongoose.connection.on("disconnected", (async () => {
        IngCore.Logs.log('Disconnected from database', 'warning');
    }));

    await mongoose.connect(String(process.env['MONGO_TOKEN']));

    //client
    const DiscordBot = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.DirectMessageReactions,
            GatewayIntentBits.GuildIntegrations,
        ],
        partials: [
            Partials.Channel,
            Partials.GuildMember,
            Partials.Message,
            Partials.Reaction,
            Partials.User,
        ],
        allowedMentions: {
            parse: ['users', 'roles'],
            repliedUser: true, //get ping or not?
        },
        failIfNotExists: _DevelopmentMode,
    });

    //commands
    const _CommandCollection = new Collection();
    const _CommandList: Array<RESTPostAPIApplicationCommandsJSONBody> = [];

    IngCore.Logs.log('Started refreshing application (/) commands', 'info');

    for (const _folder of fs.readdirSync(path.join(`${__dirname}/components/commands`))) {
        for (const _file of fs.readdirSync(path.join(`${__dirname}/components/commands/${_folder}`))) {
            const command: ICommandHandler.File = require(`./components/commands/${_folder}/${_file}`).default;

            if (!command) {
                IngCore.Logs.log(command, 'error');
                
                continue;
            }

            if (command.echo && command.echo.data.length > 0) {
                command.echo.data.forEach((cmd: string | { oldName: string, newName: string }) => {
                    if (typeof cmd === 'string') {
                        _CommandCollection.set(cmd, { ...command, ...{ data: { name: cmd }, echo: { from: command.command.name, data: [] } } });
                        _CommandList.push({ ...command.command.toJSON(), ...{ name: cmd } });
                    } else {
                        let ofNewCommand: RESTPostAPIApplicationCommandsJSONBody = command.command.toJSON();

                        if (ofNewCommand.options) {
                            let OptionCommand = ofNewCommand.options.find(filterCmd => filterCmd.name === cmd.oldName);
                            if (OptionCommand && OptionCommand.type === ApplicationCommandOptionType.Subcommand) {
                                if (!OptionCommand.options) OptionCommand.options = [];

                                const NewSlashCommand = {
                                    ...ofNewCommand,
                                    ...(new SlashCommandBuilder().setName(cmd.newName).setDescription(OptionCommand.description).toJSON()),
                                    ...{
                                        options: OptionCommand.options,
                                    }
                                };

                                _CommandCollection.set(NewSlashCommand.name, { ...command, ...{ data: NewSlashCommand, echo: { from: command.command.name, command: [], subCommand: { baseCommand: OptionCommand.name, isSubCommand: true } } } });
                                _CommandList.push(NewSlashCommand);
                            } else {
                                IngCore.Logs.log(`<${_file}> option command [${cmd.oldName}] not found`, 'error');
                            }
                        }
                    }
                });
            }

            _CommandCollection.set(command.command.name, command);
            _CommandList.push(command.command.toJSON());
        }
    }

    const rest = new REST({ version: '10' }).setToken(String(process.env['TOKEN']));

    try {
        async function RestCommands(GlobalCommands: Array<RESTPostAPIApplicationCommandsJSONBody>, GuildCommands: Array<RESTPostAPIApplicationCommandsJSONBody>) {
            await rest.put(
                Routes.applicationCommands(String(process.env['CLIENT_ID'])),
                {
                    body: GlobalCommands,
                }
            );

            await rest.put(
                Routes.applicationGuildCommands(String(process.env['CLIENT_ID']), String(process.env['GUILD_ID'])),
                {
                    body: GuildCommands,
                },
            );
        }

        if (_DevelopmentMode === true) {
            await RestCommands([], _CommandList);
        } else {
            await RestCommands(_CommandList, []);
        }

        IngCore.Logs.log('Successfully reloaded application (/) commands', 'info');
    } catch (error) {
        IngCore.Logs.log(error, 'error');
    }

    //menu
    const _MenuCollection = new Collection();

    for (const _file of fs.readdirSync(path.join(`${__dirname}/components/menu`))) {
        const menu: IMenuHandler.File = require(`./components/menu/${_file}`).default;

        if (!menu) {
            IngCore.Logs.log(menu, 'error');
            continue;
        }

        _MenuCollection.set(menu.customId, menu);
    }

    //events
    DiscordBot.setMaxListeners(50);

    const _EventInput: IEventHandler.Input = {
        DiscordBot,
        _SlashCommand: {
            Collection: _CommandCollection,
            List: _CommandList,
        },
        _Menu: _MenuCollection,
        _DevelopmentMode,
    };

    for (const _file of fs.readdirSync(path.join(`${__dirname}/events`))) {
        const event: IEventHandler.File<any> = require(`./events/${_file}`).default;

        if (!event) {
            continue;
        }

        if (event.once) {
            DiscordBot.once(event.name, (async (...args) => {
                try {
                    await event.execute(_EventInput, ...args);
                } catch (error) {
                    IngCore.Logs.log(error, 'error');
                }
            }));
        } else {
            DiscordBot.on(event.name, (async (...args) => {
                try {
                    await event.execute(_EventInput, ...args);
                } catch (error) {
                    IngCore.Logs.log(error, 'error');
                }
            }));
        }
    }

    //login
    await DiscordBot.login(process.env['TOKEN']);

    if (_DevelopmentMode === true) {
        DiscordBot.user?.setStatus('invisible');
    } else {
        DiscordBot.user?.setStatus('online');

        DiscordBot.user?.setActivity({
            name: "ING PROJECT",
            type: ActivityType.Playing,
        });
    }

})();