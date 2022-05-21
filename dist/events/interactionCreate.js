"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const builders_1 = require("@discordjs/builders");
const process = __importStar(require("process"));
const IngCore = __importStar(require("@ing3kth/core"));
const controller_1 = require("../language/controller");
const crypto_1 = require("../utils/crypto");
exports.default = {
    name: 'interactionCreate',
    once: false,
    execute(interaction, _extraData) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const createdTime = new Date();
            if (interaction.isCommand()) {
                const GetSlashCommand = _extraData.commands.get(interaction.commandName);
                if (!GetSlashCommand) {
                    return;
                }
                ;
                const _defaultCommandAddto = {
                    data: (new builders_1.SlashCommandBuilder().setName('default')).setDescription('Default command'),
                    execute: (({ interaction }) => __awaiter(this, void 0, void 0, function* () { yield interaction.editReply('This is Default message.'); })),
                    permissions: [],
                    privateMessage: false,
                    showDeferReply: true,
                    echo: {
                        from: 'default',
                        command: [],
                        subCommand: {
                            baseCommand: 'default',
                            isSubCommand: false,
                        }
                    },
                };
                const command = new Object(Object.assign(Object.assign({}, _defaultCommandAddto), GetSlashCommand));
                //language
                const _language = (0, controller_1.getLanguageAndUndefined)(yield IngCore.Cache.output({ name: 'language', interactionId: String(interaction.guildId) }));
                //script
                try {
                    // Loading Command //
                    if (command.showDeferReply) {
                        yield interaction.deferReply({
                            ephemeral: Boolean(command.privateMessage),
                        });
                    }
                    if (!interaction.guild) {
                        interaction.editReply({
                            content: _language.data.not_guild || 'Slash Command are only available in server.',
                        });
                        return;
                    }
                    // Sub Command //
                    //echo
                    if (((_a = command.echo) === null || _a === void 0 ? void 0 : _a.subCommand) && ((_b = command.echo) === null || _b === void 0 ? void 0 : _b.subCommand.isSubCommand) === true) {
                        interaction.options.getSubcommand = ((required) => {
                            var _a, _b;
                            return String((_b = (_a = command.echo) === null || _a === void 0 ? void 0 : _a.subCommand) === null || _b === void 0 ? void 0 : _b.baseCommand);
                        });
                    }
                    // Permissions //
                    if (command.permissions && Array(command.permissions).length > 0) {
                        if (!((_c = interaction.memberPermissions) === null || _c === void 0 ? void 0 : _c.has(command.permissions))) {
                            yield interaction.editReply({
                                content: _language.data.not_permission || `You don't have permission to use this command.`,
                            });
                            return;
                        }
                    }
                    // Interaction //
                    //logs
                    yield IngCore.Logs.log(`<${interaction.user.id}> <start> /${interaction.commandName}\x1b[0m`, 'info');
                    //run commands
                    const _SlashCommandExtendData = {
                        interaction: interaction,
                        DiscordClient: _extraData.client,
                        createdTime: createdTime,
                        language: _language,
                        apiKey: (0, crypto_1.genarateApiKey)((interaction.user.id + interaction.user.createdTimestamp + interaction.user.username + interaction.user.tag), (interaction.guild.id + interaction.guild.ownerId + interaction.guild.createdTimestamp), process.env['PUBLIC_KEY']),
                    };
                    const CommandExecute = yield command.execute(_SlashCommandExtendData);
                    if (typeof CommandExecute === 'string') {
                        yield interaction.editReply({ content: CommandExecute });
                    }
                    //log time of use
                    const command_now = new Date().getTime();
                    const command_create = Number(createdTime);
                    const command_ping = command_now - command_create;
                    yield IngCore.Logs.log(`<${interaction.user.id}> <end - ${command_ping}> /${interaction.commandName}\x1b[0m`, 'info');
                }
                catch (error) {
                    yield IngCore.Logs.log(error, 'error');
                    yield interaction.editReply({
                        content: _language.data.error || `Something Went Wrong, Please Try Again Later`,
                    });
                }
            }
        });
    },
};
//# sourceMappingURL=interactionCreate.js.map