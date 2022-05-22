import type { Client, ButtonInteraction } from 'discord.js';
import type { ILanguage } from '../language/interface';
interface CustomButtonExtendData {
    interaction: ButtonInteraction;
    DiscordClient: Client;
    createdTime: Date;
    language: ILanguage;
}
interface CustomButton {
    customId: string;
    privateMessage?: boolean;
    showDeferReply?: boolean;
    execute(data: CustomButtonExtendData): Promise<void | string>;
}
export type { CustomButtonExtendData, CustomButton, };
//# sourceMappingURL=Button.d.ts.map