import * as dotenv from 'dotenv';
import * as process from 'process';
import * as fs from 'fs';
import * as events from 'events'

import type { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/v10';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { Client as DisClient, Collection, Intents } from 'discord.js';

import { Logs } from '@ing3kth/core';
import { EventExtraData } from './interface/EventData';
import { ValData } from './utils/database';

(async () => {
    //set maxListeners Limit
    events.EventEmitter.defaultMaxListeners = 35;

    //dotenv
    dotenv.config({
        path: process.cwd() + '/.env'
    })

    //database
    await ValData.verify(process.env['MONGO_TOKEN']);

    //client
    const DiscordClient:DisClient = new DisClient({
        intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
            Intents.FLAGS.DIRECT_MESSAGES,
        ],
    });

    //handle command
    const commandFolders = fs.readdirSync(process.cwd() + '/dist/commands');
    const rest = new REST({ version: '10' }).setToken(String(process.env['TOKEN']));

    const _commands = new Collection();
    const _commandArray:Array<{
        data: RESTPostAPIApplicationCommandsJSONBody,
        execute: Function,
    }> = [];

    for (const folder of commandFolders) {
        const commandFiles = fs.readdirSync(process.cwd() + `/dist/commands/${folder}`).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(`./commands/${folder}/${file}`).default;

            if(!command){
                continue;
            }

            _commands.set(command.data.name, command);
            _commandArray.push(command.data.toJSON());
        }
    }

    try {
        await Logs.log('Started refreshing application (/) commands.', 'info');

        await rest.put(
            Routes.applicationCommands(String(process.env['CLIENT_ID'])),
            { body: _commandArray },
        );

        await Logs.log('Successfully reloaded application (/) commands.', 'info');
    } catch (error) {
        await Logs.log(error, 'error');
    }

    //handle events
    const eventFiles = fs.readdirSync(process.cwd() + '/dist/events').filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const event = require(`./events/${file}`).default;

        if(!event){
            continue;
        }

        const _extraData:EventExtraData = {
            client: DiscordClient,
            commands: _commands,
            commandArray: _commandArray,
        };

        if (event.once) {
            DiscordClient.once(event.name, (...args) => event.execute(...args, _extraData));
        } else {
            DiscordClient.on(event.name, (...args) => event.execute(...args, _extraData));
        }
    }

    //login
    await DiscordClient.login(process.env['TOKEN']);
    await DiscordClient.user?.setActivity("ING PROJECT", {
        type: "PLAYING"
    });
})();