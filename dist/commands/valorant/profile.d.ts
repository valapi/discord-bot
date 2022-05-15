import { SlashCommandBuilder } from '@discordjs/builders';
import type { SlashCommandExtendData } from '../../interface/SlashCommand';
declare const _default: {
    data: SlashCommandBuilder;
    permissions: bigint[];
    privateMessage: boolean;
    execute({ interaction, language, apiKey, DiscordClient, createdTime }: SlashCommandExtendData): Promise<void>;
};
export default _default;
//# sourceMappingURL=profile.d.ts.map