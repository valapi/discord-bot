//import

import type { Client, ClientEvents, Collection, CommandInteraction, SlashCommandBuilder, InteractionReplyOptions, SelectMenuInteraction, SlashCommandSubcommandsOnlyBuilder, SlashCommandSubcommandGroupBuilder, ChatInputCommandInteraction } from 'discord.js';
import type { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/v10';

import type { ILanguage } from './lang';

//interface

namespace IEventHandler {
    export interface Input {
        DiscordBot: Client;
        _SlashCommand: {
            Collection: Collection<any, any>,
            List: Array<RESTPostAPIApplicationCommandsJSONBody>,
        };
        _Menu: Collection<any, any>,
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
        interaction: ChatInputCommandInteraction;
        DiscordBot: Client;
        createdTime: Date;
        language: ILanguage.File;
        apiKey: string;
    }

    export type Category = 'settings' | 'infomation' | 'valorant' | 'miscellaneous';

    export interface File {
        command: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;
        category: ICommandHandler.Category;
        permissions?: Array<bigint>;
        onlyGuild?: boolean;
        inDevlopment?: boolean;
        echo?: {
            from?: string,
            data: Array<string | { oldName: string, newName: string }>,
            subCommand?: {
                baseCommand: string,
                isSubCommand: boolean,
            },
        },
        execute: (input: ICommandHandler.Input) => Promise<InteractionReplyOptions>;
    }
}

namespace IMenuHandler {
    export interface Input {
        interaction: SelectMenuInteraction;
        DiscordBot: Client;
        _SlashCommand: {
            Collection: Collection<any, any>,
            List: Array<RESTPostAPIApplicationCommandsJSONBody>,
        };
    }

    export interface File {
        customId: string;
        execute: (input: IMenuHandler.Input) => Promise<InteractionReplyOptions>;
    }
}

//export

export type {
    IEventHandler,
    ICommandHandler,
    IMenuHandler
};