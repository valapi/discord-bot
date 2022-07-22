//import

import * as process from 'process';
import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import * as IngCore from '@ing3kth/core';

import { Client, GatewayIntentBits, ActivityType, Collection, RESTPostAPIApplicationCommandsJSONBody } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';

import { ValorDatabase } from './utils/database';

import type { ICommandHandler, IEventHandler } from './modules';

//script

const __DevelopmentMode: boolean = true;

(async () => {
    //.env
    dotenv.config({
        path: path.join(`${process.cwd()}/.env`),
    });

    //database
    //ValorDatabase.create(process.env['MONGO_TOKEN']);

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
        allowedMentions: {
            parse: [ 'users', 'roles' ],
            repliedUser: true, //get ping or not?
        },
        failIfNotExists: __DevelopmentMode,
    });

    //commands
    const _commands = new Collection();
    const _commandArray: Array<RESTPostAPIApplicationCommandsJSONBody> = [];

    for (const _folder of fs.readdirSync(path.join(`${__dirname}/commands`))) {
        for (const _file of fs.readdirSync(path.join(`${__dirname}/commands/${_folder}`))) {
            const command: ICommandHandler.File = require(`./commands/${_folder}/${_file}`).default;

            if (!command) {
                continue;
            }

            _commands.set(command.command.name, command);
            _commandArray.push(command.command.toJSON());
        }
    }

    const rest = new REST({ version: '10' }).setToken(String(process.env['TOKEN']));

    try {
        IngCore.Logs.log('Started refreshing application (/) commands', 'info');

        if (__DevelopmentMode === true) {
            await rest.put(
                Routes.applicationGuildCommands(String(process.env['CLIENT_ID']), String(process.env['GUILD_ID'])),
                {
                    body: _commandArray,
                },
            );
        } else {
            await rest.put(
                Routes.applicationGuildCommands(String(process.env['CLIENT_ID']), String(process.env['GUILD_ID'])),
                {
                    body: [],
                },
            );

            await rest.put(
                Routes.applicationCommands(String(process.env['CLIENT_ID'])),
                {
                    body: _commandArray,
                }
            );
        }

        IngCore.Logs.log('Successfully reloaded application (/) commands', 'info');
    } catch (error) {
        IngCore.Logs.log(error, 'error');
    }

    //events
    DiscordBot.setMaxListeners(50);

    const _EventInput: IEventHandler.Input = {
        DiscordBot,
        _commands,
        _commandArray,
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

    DiscordBot.user?.setActivity({
        name: "ING PROJECT",
        type: ActivityType.Playing,
    });

})();