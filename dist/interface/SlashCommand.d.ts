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
interface CustomSlashCommands {
    data: SlashCommandBuilder;
    permissions: Array<bigint>;
    privateMessage: boolean;
    execute(data: SlashCommandExtendData): Promise<void>;
}
export type { SlashCommandExtendData, CustomSlashCommands, };
//# sourceMappingURL=SlashCommand.d.ts.map