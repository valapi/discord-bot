//import

import type { Client, ClientEvents, Collection, CommandInteraction, MessagePayload, SlashCommandBuilder, WebhookEditMessageOptions } from 'discord.js';
import type { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/v10';

//interface

namespace IEventHandler {
    export interface Input {
        DiscordBot: Client;
        _commands: Collection<any, any>;
        _commandArray: Array<RESTPostAPIApplicationCommandsJSONBody>;
    }

    export interface File<Event extends keyof ClientEvents> {
        name: Event;
        once: boolean;
        execute: (input: IEventHandler.Input, ...args: ClientEvents[Event]) => Promise<void>;
    }
}

namespace ICommandHandler {
    export interface Input {
        interaction: CommandInteraction;
        DiscordBot: Client;
        createdTime: Date;
        apiKey: string;
    }

    export type Category = 'settings' | 'infomation' | 'valorant' | 'miscellaneous';

    export interface File {
        command: SlashCommandBuilder;
        category: ICommandHandler.Category;
        permissions?: Array<bigint>,
        isPrivateMessage?: boolean,
        onlyGuild?: boolean;
        inDevlopment?: boolean;
        execute: (input: ICommandHandler.Input) => Promise<MessagePayload | WebhookEditMessageOptions>;
    }
}

//export

export type {
    IEventHandler,
    ICommandHandler
};