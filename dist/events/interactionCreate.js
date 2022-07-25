"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const process = tslib_1.__importStar(require("process"));
const IngCore = tslib_1.__importStar(require("@ing3kth/core"));
const lang_1 = require("../lang");
const discord_js_1 = require("discord.js");
const crypto_1 = require("../utils/crypto");
const __event = {
    name: 'interactionCreate',
    once: false,
    execute({ _SlashCommand, _Menu, _DevelopmentMode, DiscordBot }, interaction) {
        var _a, _b, _c, _d, _e;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (_DevelopmentMode === true && ((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id) !== String(process.env['GUILD_ID'])) {
                return;
            }
            const createdTime = new Date();
            const language = (0, lang_1.getLanguageAndUndefined)(IngCore.Cache.output({ name: 'languages', interactionId: String(interaction.guildId) }));
            if (interaction.isChatInputCommand()) {
                const command = Object.assign({
                    command: ((new discord_js_1.SlashCommandBuilder().setName('default')).setDescription('Default command')),
                    category: 'miscellaneous',
                    permissions: [],
                    isPrivateMessage: false,
                    onlyGuild: false,
                    inDevlopment: false,
                    execute: (() => tslib_1.__awaiter(this, void 0, void 0, function* () { return { content: 'This is Default message.', }; })),
                }, _SlashCommand.Collection.get(interaction.commandName));
                yield interaction.deferReply({
                    ephemeral: command.isPrivateMessage,
                    fetchReply: true,
                });
                try {
                    if (command.inDevlopment === true && interaction.user.id !== '549231132382855189') {
                        yield interaction.editReply({
                            content: language.data['dev_cmd'] || 'This command is in development.',
                        });
                        return;
                    }
                    if (!interaction.guild && command.onlyGuild === true) {
                        yield interaction.editReply({
                            content: language.data['not_guild'] || 'Slash Command are only available in server.',
                        });
                        return;
                    }
                    if (command.echo) {
                        if (command.echo.from) {
                            interaction.commandName = command.echo.from;
                            if (interaction.command) {
                                interaction.command.name = command.echo.from;
                            }
                        }
                        if (command.echo.subCommand && command.echo.subCommand.isSubCommand === true) {
                            interaction.options.getSubcommand = (() => {
                                var _a, _b;
                                return String((_b = (_a = command.echo) === null || _a === void 0 ? void 0 : _a.subCommand) === null || _b === void 0 ? void 0 : _b.baseCommand);
                            });
                        }
                    }
                    if (command.permissions && !((_b = interaction.memberPermissions) === null || _b === void 0 ? void 0 : _b.has(command.permissions))) {
                        yield interaction.editReply({
                            content: language.data['not_permission'] || `You don't have permission to use this command.`,
                        });
                        return;
                    }
                    IngCore.Logs.log(`<${interaction.user.id}> <command> ${interaction.commandName}\x1b[0m`, 'info');
                    const TheCommand = yield command.execute({
                        interaction,
                        DiscordBot,
                        createdTime,
                        language,
                        apiKey: (0, crypto_1.genarateApiKey)(String(`${interaction.user.id}${interaction.user.createdTimestamp}${interaction.user.username}${interaction.user.tag}`), String(`${(_c = interaction.guild) === null || _c === void 0 ? void 0 : _c.id}${(_d = interaction.guild) === null || _d === void 0 ? void 0 : _d.ownerId}`) + String(`${(_e = interaction.guild) === null || _e === void 0 ? void 0 : _e.createdTimestamp}`), String(process.env['PUBLIC_KEY'])),
                    });
                    if (TheCommand) {
                        yield interaction.editReply(TheCommand);
                    }
                    else {
                        yield interaction.editReply({
                            content: language.data['error'],
                        });
                    }
                    IngCore.Logs.log(`<${interaction.user.id}> <command> ${interaction.commandName} [${IngCore.DifferenceMillisecond(new Date().getTime(), createdTime)}]\x1b[0m`, 'info');
                }
                catch (error) {
                    if (_DevelopmentMode === true) {
                        console.error(error);
                    }
                    else {
                        IngCore.Logs.log(error, 'error');
                    }
                    yield interaction.editReply({
                        content: language.data['error'] || `Something Went Wrong, Please Try Again Later`,
                        embeds: [],
                        components: [],
                        files: [],
                        attachments: [],
                    });
                }
            }
            else if (interaction.isSelectMenu()) {
                const menu = Object.assign({
                    customId: 'default',
                    replyMode: 'edit',
                    execute: (() => tslib_1.__awaiter(this, void 0, void 0, function* () { return { content: 'This is Default message.', }; })),
                }, _Menu.get(interaction.customId));
                if (menu.replyMode === 'edit') {
                    yield interaction.deferUpdate({
                        fetchReply: true,
                    });
                }
                else if (menu.replyMode === 'new') {
                    yield interaction.deferReply({
                        fetchReply: true,
                    });
                }
                try {
                    IngCore.Logs.log(`<${interaction.user.id}> <menu> ${interaction.customId}\x1b[0m`, 'info');
                    const TheMenu = yield menu.execute({
                        interaction,
                        DiscordBot,
                        language,
                        _SlashCommand,
                    });
                    yield interaction.editReply(Object.assign(Object.assign({}, TheMenu), { tts: false, fetchReply: true }));
                    IngCore.Logs.log(`<${interaction.user.id}> <menu> ${interaction.customId} [${IngCore.DifferenceMillisecond(new Date().getTime(), createdTime)}]\x1b[0m`, 'info');
                }
                catch (error) {
                    if (_DevelopmentMode === true) {
                        console.error(error);
                    }
                    else {
                        IngCore.Logs.log(error, 'error');
                    }
                    yield interaction.editReply({
                        content: language.data['error'] || `Something Went Wrong, Please Try Again Later`,
                        embeds: [],
                        components: [],
                        files: [],
                        attachments: [],
                    });
                }
            }
        });
    },
};
exports.default = __event;
