//import

import * as process from 'process';
import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import * as IngCore from '@ing3kth/core';

import { Client, GatewayIntentBits, ActivityType } from 'discord.js';
import { REST } from '@discordjs/rest';

import { ValorDatabase } from './utils/database';

import type { IEventHandler } from './modules';

//script

const __Folders: string = `src`;
const __DevelopmentMode: boolean = true;

(async () => {
    //.env
    dotenv.config({
        path: path.join(`${process.cwd()}/.env`),
    });

    //database
    //ValorDatabase.create(process.env['MONGO_TOKEN']);

    //client
    const DiscordClient = new Client({
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

    //handle event
    DiscordClient.setMaxListeners(50);
    
    for (const _file of fs.readdirSync(`${process.cwd()}/${__Folders}/events`)) {
        const event: IEventHandler.File<any> = require(`./events/${_file}`).default;

        console.log(event)

        if (!event) {
            continue;
        }

        if (event.once) {
            DiscordClient.once(event.name, (async (...args) => {
                try {
                    await event.execute(...args);
                } catch (error) {
                    IngCore.Logs.log(error, 'error');
                }
            }));
        } else {
            DiscordClient.on(event.name, (async (...args) => {
                try {
                    await event.execute(...args);
                } catch (error) {
                    IngCore.Logs.log(error, 'error');
                }
            }));
        }
    }

    //login
    await DiscordClient.login(process.env['TOKEN']);

    DiscordClient.user?.setActivity({
        name: "ING PROJECT",
        type: ActivityType.Playing,
    });

})();