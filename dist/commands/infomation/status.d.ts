import { SlashCommandBuilder } from '@discordjs/builders';
import { type Client as DisClient, type CommandInteraction } from 'discord.js';
declare const _default: {
    data: SlashCommandBuilder;
    permissions: bigint[];
    privateMessage: boolean;
    execute(interaction: CommandInteraction, DiscordClient: DisClient, createdTime: Date): Promise<void>;
};
export default _default;
//# sourceMappingURL=status.d.ts.map