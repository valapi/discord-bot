import { Events } from "discord.js";

import Event from "../core/event";
import Command from "../core/command";

import admin from "../data/admin.json";

export default new Event(Events.InteractionCreate, async (interaction) => {
    if (interaction.isChatInputCommand()) {
        const command = client.command.get(interaction.commandName);

        if (!command) {
            return;
        }

        if (client.rateLimit(interaction.user.id) === true) {
            await interaction.reply(Command.rateLimitReply);
            return;
        }

        if (command.option.adminOnly === true && !admin.find((value) => value === interaction.user.id)) {
            await interaction.reply(Command.adminReply);
            return;
        }

        try {
            await command.callback(interaction);
        } catch (error) {
            console.error(error);

            if (interaction.replied === true || interaction.deferred === true) {
                await interaction.followUp(Command.errorReply);
            } else {
                await interaction.reply(Command.errorReply);
            }
        }
    }
});
