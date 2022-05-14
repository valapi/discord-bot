import type { Client, CommandInteraction } from 'discord.js';
import type { ILanguage } from '../language/interface';
interface SlashCommandExtendData {
    interaction: CommandInteraction;
    DiscordClient: Client;
    createdTime: Date;
    language: ILanguage;
    apiKey: string;
}
export type { SlashCommandExtendData, };
//# sourceMappingURL=SlashCommand.d.ts.map