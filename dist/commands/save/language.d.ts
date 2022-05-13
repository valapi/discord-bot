import { SlashCommandBuilder } from '@discordjs/builders';
import { type CommandInteraction } from 'discord.js';
declare const _default: {
    data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
    permissions: bigint[];
    privateMessage: boolean;
    execute(interaction: CommandInteraction): Promise<void>;
};
export default _default;
//# sourceMappingURL=language.d.ts.map