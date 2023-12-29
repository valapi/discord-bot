import { SlashCommandBuilder } from "discord.js";
import type {
    RESTPostAPIChatInputApplicationCommandsJSONBody,
    SlashCommandSubcommandsOnlyBuilder,
    ChatInputCommandInteraction,
    InteractionReplyOptions
} from "discord.js";

export interface CommandOption {
    adminOnly?: boolean;
}

export default class Command {
    public command: RESTPostAPIChatInputApplicationCommandsJSONBody;
    public callback: (interaction: ChatInputCommandInteraction) => Promise<void>;
    public option: Required<CommandOption>;

    public constructor(
        command: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand">,
        callback: (interaction: ChatInputCommandInteraction) => Promise<void>,
        option?: CommandOption
    ) {
        this.command = command.toJSON();
        this.callback = callback;
        this.option = {
            ...{
                adminOnly: false
            },
            ...option
        };
    }

    public static rateLimitReply: InteractionReplyOptions = {
        content: "calm down, Bro!",
        ephemeral: true
    };

    public static adminReply: InteractionReplyOptions = {
        content: "You don't have permission to do this",
        ephemeral: true
    };

    public static errorReply: InteractionReplyOptions = {
        content: "Something went wrong",
        ephemeral: true
    };
}
