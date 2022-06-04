import type { SlashCommandBuilder } from '@discordjs/builders';
import type { Client, CommandInteraction } from 'discord.js';
import type { ILanguage } from '../language/interface';
interface SlashCommandExtendData {
    interaction: CommandInteraction;
    DiscordClient: Client;
    createdTime: Date;
    language: ILanguage;
    apiKey: string;
}
interface EchoSubCommand {
    subCommandName: string;
    newCommandName: string;
}
declare type CustomSlashCommandsCategory = 'settings' | 'infomation' | 'valorant' | 'miscellaneous';
interface CustomSlashCommands {
    data: SlashCommandBuilder;
    type: CustomSlashCommandsCategory;
    permissions?: Array<bigint>;
    privateMessage?: boolean;
    showDeferReply?: boolean;
    onlyGuild?: boolean;
    inDevlopment?: boolean;
    timeOut?: number;
    echo?: {
        from?: string;
        command: Array<string | EchoSubCommand>;
        subCommand?: {
            baseCommand: string;
            isSubCommand: boolean;
        };
    };
    execute(data: SlashCommandExtendData): Promise<void | string>;
}
export type { SlashCommandExtendData, EchoSubCommand, CustomSlashCommandsCategory, CustomSlashCommands, };
//# sourceMappingURL=SlashCommand.d.ts.map