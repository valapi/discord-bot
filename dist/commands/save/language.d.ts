import { SlashCommandBuilder } from '@discordjs/builders';
import type { SlashCommandExtendData } from '../../interface/SlashCommand';
declare const _default: {
    data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
    permissions: bigint[];
    privateMessage: boolean;
    execute({ interaction }: SlashCommandExtendData): Promise<void>;
};
export default _default;
//# sourceMappingURL=language.d.ts.map