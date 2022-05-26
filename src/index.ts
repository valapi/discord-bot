import * as dotenv from 'dotenv';
import * as process from 'process';
import * as fs from 'fs';

import discordModals from 'discord-modals';
import type { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/v10';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { Client as DisClient, Collection, Intents } from 'discord.js';
import EventEmitter from 'events';

import { Logs } from '@ing3kth/core';
import { EventExtraData } from './interface/EventData';
import { ValData } from './utils/database';
import type { CustomSlashCommands, EchoSubCommand } from './interface/SlashCommand';

const DEVELOPMENT_MODE:boolean = false;

async function START_ENGINE() {
    //dotenv
    dotenv.config({
        path: process.cwd() + '/.env'
    });


    //database
    await ValData.verify(process.env['MONGO_TOKEN']);

    //client
    const DiscordClient: DisClient = new DisClient({
        intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
            Intents.FLAGS.DIRECT_MESSAGES,
        ],
    });

    EventEmitter.defaultMaxListeners = 35;
    DiscordClient.setMaxListeners(50);

    discordModals(DiscordClient);

    //handle command
    const commandFolders = fs.readdirSync(`${process.cwd()}/dist/commands/slash`);
    const rest = new REST({ version: '10' }).setToken(String(process.env['TOKEN']));

    const _commands: Collection<any, any> = new Collection();
    const _commandArray: Array<RESTPostAPIApplicationCommandsJSONBody> = [];

    for (const folder of commandFolders) {
        const commandFiles = fs.readdirSync(`${process.cwd()}/dist/commands/slash/${folder}`).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(`${process.cwd()}/dist/commands/slash/${folder}/${file.replace('.js', '')}`).default as CustomSlashCommands;

            if (!command) {
                continue;
            }

            if (command.echo && command.echo.command.length > 0) {
                command.echo.command.forEach((cmd: string | EchoSubCommand) => {
                    if (typeof cmd === 'string') {
                        _commands.set(cmd, new Object({ ...command, ...{ data: { name: cmd }, echo: { from: command.data.name, command: [] }, privateMessage: !!command.privateMessage } }) as CustomSlashCommands);
                        _commandArray.push(new Object({ ...command.data.toJSON(), ...{ name: cmd } }) as RESTPostAPIApplicationCommandsJSONBody);
                    } else {
                        let ofNewCommand: RESTPostAPIApplicationCommandsJSONBody = command.data.toJSON();

                        if (ofNewCommand.options) {
                            let OptionCommand = ofNewCommand.options.find(filterCmd => filterCmd.name === cmd.subCommandName);
                            if (OptionCommand && OptionCommand.type === 1) {
                                if (!OptionCommand.options) OptionCommand.options = [];

                                let NewSlashCommand = new Object({ ...ofNewCommand, ...{
                                    type: OptionCommand.type,
                                    name: cmd.newCommandName,
                                    description: OptionCommand.description,
                                    options: OptionCommand.options,
                                } }) as RESTPostAPIApplicationCommandsJSONBody;

                                _commands.set(NewSlashCommand.name, new Object({ ...command, ...{ data: NewSlashCommand, echo: { from: command.data.name, command: [], subCommand: { baseCommand: OptionCommand.name, isSubCommand: true } }, privateMessage: !!command.privateMessage } }) as CustomSlashCommands);
                                _commandArray.push(NewSlashCommand);
                            } else {
                                Logs.log(`<${file}> option command [${cmd.subCommandName}] not found`, 'error');
                            }
                        }
                    }
                });
            }
            
            _commands.set(command.data.name, command);
            _commandArray.push(command.data.toJSON());
        }
    }

    try {
        await Logs.log('Started refreshing application (/) commands.', 'info');

        if(DEVELOPMENT_MODE) {
            await rest.put(
                Routes.applicationGuildCommands(String(process.env['CLIENT_ID']), String(process.env['GUILD_ID'])),
                { body: _commandArray },
            );
        } else {
            await rest.put(
                Routes.applicationGuildCommands(String(process.env['CLIENT_ID']), String(process.env['GUILD_ID'])),
                { body: [] },
            );
    
            await rest.put(
                Routes.applicationCommands(String(process.env['CLIENT_ID'])),
                { body: _commandArray },
            );
        }

        await Logs.log('Successfully reloaded application (/) commands.', 'info');
    } catch (error) {
        await Logs.log(error, 'error');
    }

    //handle events
    const eventFiles = fs.readdirSync(process.cwd() + '/dist/events').filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const event = require(`./events/${file.replace('.js', '')}`).default;

        if (!event) {
            continue;
        }

        const _extraData: EventExtraData = {
            client: DiscordClient,
            commands: _commands,
            commandArray: _commandArray,
        };

        if (event.once) {
            DiscordClient.once(event.name, (async (...args) => {
                try {
                    await event.execute(...args, _extraData)
                } catch (error) {
                    await Logs.log(error, 'error');
                }
            }));
        } else {
            DiscordClient.on(event.name, (async (...args) => {
                try {
                    await event.execute(...args, _extraData)
                } catch (error) {
                    await Logs.log(error, 'error');
                }
            }));
        }
    }

    //login
    await DiscordClient.login(process.env['TOKEN']);
    DiscordClient.user?.setActivity("ING PROJECT", {
        type: "PLAYING"
    });

    DiscordClient.setMaxListeners(100);
};

async function LOAD_ENGINE() {
    try {
        await START_ENGINE();
    }
    catch (error) {
        await Logs.log(error, 'error');
        setTimeout((async () => { await LOAD_ENGINE() }), 1000);
    }
}

(async () => {
    //the loop will run 3 time on error
    await LOAD_ENGINE();
})();