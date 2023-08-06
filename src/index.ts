import os from "node:os";
import * as process from "node:process";

import { open } from "lmdb";
import type { RootDatabase, Key } from "lmdb";
import type { AuthCore } from "valorant.ts";

import config from "./data/config.json";

declare global {
    // eslint-disable-next-line no-var
    var database: RootDatabase<AuthCore.Json, Key>;
}

global.database = open<AuthCore.Json>({
    commitDelay: 250,
    compression: true,
    dupSort: false,
    encoding: "json",
    name: config.database.name,
    path: os.tmpdir()
});

import { GatewayIntentBits, Partials, REST, Routes } from "discord.js";
import type { RESTPostAPIChatInputApplicationCommandsJSONBody } from "discord.js";

import Client from "./core/client";
import Event from "./core/event";
import Command from "./core/command";

declare global {
    // eslint-disable-next-line no-var
    var client: Client;
}

global.client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.MessageContent
    ],
    partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message,
        Partials.Reaction,
        Partials.User
    ]
});

import * as path from "node:path";

import * as fs from "fs-extra";

import * as dotenv from "dotenv";
dotenv.config();

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            readonly APPLICATION_ID: string;
            readonly CLIENT_ID: string;
            readonly CLIENT_SECRET: string;
            readonly GUILD_ID: string;
            readonly MONGO_TOKEN: string;
            readonly PUBLIC_KEY: string;
            readonly TOKEN: string;
        }
    }
}

(async () => {
    client.setMaxListeners(50);

    // command

    const rest = new REST().setToken(process.env.TOKEN);
    const commands: Array<RESTPostAPIChatInputApplicationCommandsJSONBody> = [];

    const commandDirectory = path.join(__dirname, "commands");
    for (const commandName of fs.readdirSync(commandDirectory)) {
        const command: Command = (await import(path.join(commandDirectory, commandName))).default;

        commands.push(command.command);
        client.command.set(command.command.name, command);
    }

    await rest.put(
        Routes.applicationGuildCommands(process.env.APPLICATION_ID, process.env.GUILD_ID),
        {
            body: commands
        }
    );

    // event

    const eventDirectory = path.join(__dirname, "events");
    for (const eventName of fs.readdirSync(eventDirectory)) {
        const event: Event = (await import(path.join(eventDirectory, eventName))).default;

        if (event.option.once === true) {
            client.once(event.name, event.callback);
        } else {
            client.on(event.name, event.callback);
        }
    }

    // client

    await client.login(process.env.TOKEN);
})();
