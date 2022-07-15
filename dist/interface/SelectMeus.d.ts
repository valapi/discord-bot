import type { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/v10';
import type { Client, Collection, SelectMenuInteraction } from 'discord.js';
import type { ILanguage } from '../language/interface';
interface CustomMenuExtendData {
    interaction: SelectMenuInteraction;
    DiscordClient: Client;
    createdTime: Date;
    language: ILanguage;
    command: {
        collection: Collection<any, any>;
        array: Array<RESTPostAPIApplicationCommandsJSONBody>;
    };
}
interface CustomMenu {
    customId: string;
    privateMessage?: boolean;
    showDeferReply?: boolean;
    execute(data: CustomMenuExtendData): Promise<void | string>;
}
export type { CustomMenuExtendData, CustomMenu, };
