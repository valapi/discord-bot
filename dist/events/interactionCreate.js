"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@ing3kth/core");
exports.default = {
    name: 'interactionCreate',
    once: false,
    execute(interaction, _extraData) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdTime = new Date();
            if (interaction.isCommand()) {
                const command = _extraData.commands.get(interaction.commandName);
                if (!command)
                    return;
                yield interaction.reply({
                    content: "Loading Message.. ",
                    ephemeral: true
                });
                try {
                    // if (command.permissions && command.permissions.length > 0) {
                    // 	if (!interaction.member.permissions.has(command.permissions)) {
                    // 		await interaction.editReply({
                    // 			content: `You don't have permission to use this command.`,
                    // 		});
                    // 		return;
                    // 	}
                    // }
                    //log interaction
                    yield core_1.Logs.log(`${interaction.user.username}#${interaction.user.discriminator} used /${interaction.commandName}\x1b[0m`, 'info');
                    //run commands
                    yield command.execute(interaction, _extraData.client, createdTime);
                    //log time of use
                    const command_now = Number(new Date());
                    const command_create = Number(createdTime);
                    const command_ping = command_now - command_create;
                    yield core_1.Logs.log(`${interaction.user.username}#${interaction.user.discriminator} used /${interaction.commandName} - ${command_ping} Milliseconds\x1b[0m`, 'info');
                }
                catch (error) {
                    core_1.Logs.log(error, 'error');
                    yield interaction.editReply({
                        content: `Something Went Wrong, Please Try Again Later`,
                    });
                }
            }
        });
    },
};
//# sourceMappingURL=interactionCreate.js.map