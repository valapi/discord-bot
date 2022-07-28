//import

import type { Client, ClientEvents, Collection, SlashCommandBuilder, SelectMenuInteraction, SlashCommandSubcommandsOnlyBuilder, ChatInputCommandInteraction, WebhookEditMessageOptions, SlashCommandOptionsOnlyBuilder, PermissionResolvable, ModalSubmitInteraction, InteractionReplyOptions } from 'discord.js';
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
        _Modal: Collection<any, any>,
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
        command: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | SlashCommandOptionsOnlyBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
        category: ICommandHandler.Category;
        permissions?: PermissionResolvable;
        isPrivateMessage?: boolean;
        onlyGuild?: boolean;
        inDevlopment?: boolean;
        showDeferReply?: boolean;
        echo?: {
            from?: string,
            data: Array<string | { oldName: string, newName: string }>,
            subCommand?: {
                baseCommand: string,
                isSubCommand: boolean,
            },
        },
        execute: (input: ICommandHandler.Input) => Promise<WebhookEditMessageOptions | undefined>;
    }
}

namespace IMenuHandler {
    export interface Input {
        interaction: SelectMenuInteraction;
        DiscordBot: Client;
        language: ILanguage.File;
        _SlashCommand: {
            Collection: Collection<any, any>,
            List: Array<RESTPostAPIApplicationCommandsJSONBody>,
        };
    }

    export interface File {
        customId: string;
        replyMode?: 'new' | 'edit';
        execute: (input: IMenuHandler.Input) => Promise<WebhookEditMessageOptions>;
    }
}

namespace IModalHandler {
    export interface Input {
        interaction: ModalSubmitInteraction;
        DiscordBot: Client;
        language: ILanguage.File;
    }

    export interface File {
        customId: string;
        execute: (input: IModalHandler.Input) => Promise<InteractionReplyOptions>;
    }
}

//export

export type {
    IEventHandler,
    ICommandHandler,
    IMenuHandler,
    IModalHandler
};