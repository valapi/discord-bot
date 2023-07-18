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
    partials: [Partials.Channel, Partials.GuildMember, Partials.Message, Partials.Reaction, Partials.User]
});

import * as process from "node:process";
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
    // command

    const rest = new REST().setToken(process.env.TOKEN);
    const commands: Array<RESTPostAPIChatInputApplicationCommandsJSONBody> = [];

    const commandDir = path.join(__dirname, "commands");
    for (const commandName of fs.readdirSync(commandDir)) {
        const command: Command = (await import(path.join(commandDir, commandName))).default;

        commands.push(command.command);
        client.command.set(command.command.name, command);
    }

    await rest.put(Routes.applicationGuildCommands(process.env.APPLICATION_ID, process.env.GUILD_ID), {
        body: commands
    });

    // event

    const eventDir = path.join(__dirname, "events");
    for (const eventName of fs.readdirSync(eventDir)) {
        const event: Event = (await import(path.join(eventDir, eventName))).default;

        if (event.option.once === true) {
            client.once(event.name, event.callback);
        } else {
            client.on(event.name, event.callback);
        }
    }

    // client

    await client.login(process.env.TOKEN);
})();
