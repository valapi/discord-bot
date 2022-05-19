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
    subCommandName: string,
    newCommandName: string,
}

interface CustomSlashCommands {
    data: SlashCommandBuilder,
    permissions?: Array<bigint>,
    privateMessage?: boolean,
    showDeferReply?: boolean,
    echo?: {
        from?: string,
        command: Array<string | EchoSubCommand>,
        isSubCommand?: boolean,
    },
    execute(data: SlashCommandExtendData): Promise<void | string>,
}

export type {
    SlashCommandExtendData,
    EchoSubCommand,
    CustomSlashCommands,
}