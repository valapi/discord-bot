//import

import type { Client, ClientEvents, Collection, CommandInteraction, SlashCommandBuilder, InteractionReplyOptions } from 'discord.js';
import type { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/v10';

//interface

namespace IEventHandler {
    export interface Input {
        DiscordBot: Client;
        _SlashCommand: {
            commands: Collection<any, any>,
            commandArray: Array<RESTPostAPIApplicationCommandsJSONBody>,
        };
        _DevelopmentMode: boolean;
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
        permissions?: Array<bigint>;
        onlyGuild?: boolean;
        inDevlopment?: boolean;
        execute: (input: ICommandHandler.Input) => Promise<InteractionReplyOptions>;
    }
}

//export

export type {
    IEventHandler,
    ICommandHandler
};