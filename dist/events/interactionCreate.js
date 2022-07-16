"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const builders_1 = require("@discordjs/builders");
const fs = tslib_1.__importStar(require("fs"));
const process = tslib_1.__importStar(require("process"));
const IngCore = tslib_1.__importStar(require("@ing3kth/core"));
const controller_1 = require("../language/controller");
const crypto_1 = require("../utils/crypto");
const msANDms_1 = tslib_1.__importDefault(require("../utils/msANDms"));
exports.default = {
    name: 'interactionCreate',
    once: false,
    execute(interaction, _extraData) {
        var _a, _b, _c, _d, _e, _f;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const createdTime = new Date();
            const _language = (0, controller_1.getLanguageAndUndefined)(yield IngCore.Cache.output({ name: 'language', interactionId: String(interaction.guildId) }));
            if (interaction.isCommand()) {
                const GetSlashCommand = _extraData.commands.get(interaction.commandName);
                if (!GetSlashCommand) {
                    return;
                }
                ;
                const _defaultCommandAddto = {
                    data: (new builders_1.SlashCommandBuilder().setName('default')).setDescription('Default command'),
                    type: 'miscellaneous',
                    execute: (({ interaction }) => tslib_1.__awaiter(this, void 0, void 0, function* () { yield interaction.editReply('This is Default message.'); })),
                    permissions: [],
                    privateMessage: false,
                    showDeferReply: true,
                    onlyGuild: false,
                    inDevlopment: false,
                    timeOut: 60000,
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
                try {
                    if (command.showDeferReply === true) {
                        yield interaction.deferReply({
                            ephemeral: Boolean(command.privateMessage),
                        });
                    }
                    if (command.inDevlopment === true && interaction.user.id !== '549231132382855189') {
                        yield interaction.reply({
                            content: _language.data.dev_cmd || 'This command is in development.',
                        });
                        return;
                    }
                    if (!interaction.guild && command.onlyGuild === true) {
                        yield interaction.editReply({
                            content: _language.data.not_guild || 'Slash Command are only available in server.',
                        });
                        return;
                    }
                    if (((_a = command.echo) === null || _a === void 0 ? void 0 : _a.subCommand) && ((_b = command.echo) === null || _b === void 0 ? void 0 : _b.subCommand.isSubCommand) === true) {
                        interaction.options.getSubcommand = ((required) => {
                            var _a, _b;
                            return String((_b = (_a = command.echo) === null || _a === void 0 ? void 0 : _a.subCommand) === null || _b === void 0 ? void 0 : _b.baseCommand);
                        });
                    }
                    if (command.permissions && Array(command.permissions).length > 0 && interaction.guild) {
                        if (!((_c = interaction.memberPermissions) === null || _c === void 0 ? void 0 : _c.has(command.permissions))) {
                            yield interaction.editReply({
                                content: _language.data.not_permission || `You don't have permission to use this command.`,
                            });
                            return;
                        }
                    }
                    yield IngCore.Logs.log(`<${interaction.user.id}> <command> ${interaction.commandName}\x1b[0m`, 'info');
                    const _SlashCommandExtendData = {
                        interaction: interaction,
                        DiscordClient: _extraData.client,
                        createdTime: createdTime,
                        language: _language,
                        apiKey: (0, crypto_1.genarateApiKey)((interaction.user.id + interaction.user.createdTimestamp + interaction.user.username + interaction.user.tag), (String((_d = interaction.guild) === null || _d === void 0 ? void 0 : _d.id) + String((_e = interaction.guild) === null || _e === void 0 ? void 0 : _e.ownerId) + String((_f = interaction.guild) === null || _f === void 0 ? void 0 : _f.createdTimestamp)), process.env['PUBLIC_KEY']),
                    };
                    const CommandExecute = yield command.execute(_SlashCommandExtendData);
                    if (typeof CommandExecute === 'string') {
                        yield interaction.editReply({ content: CommandExecute });
                    }
                    yield IngCore.Logs.log(`<${interaction.user.id}> <command> ${interaction.commandName} [${(0, msANDms_1.default)(new Date().getTime(), createdTime)}]\x1b[0m`, 'info');
                }
                catch (error) {
                    yield IngCore.Logs.log(error, 'error');
                    yield interaction.editReply({
                        content: _language.data.error || `Something Went Wrong, Please Try Again Later`,
                        embeds: [],
                        components: [],
                    });
                }
            }
            else if (interaction.isButton()) {
                yield IngCore.Logs.log(`<${interaction.user.id}> <button> ${interaction.customId}\x1b[0m`, 'info');
                const ButtonFolder = yield fs.readdirSync(`${process.cwd()}/dist/commands/button`).filter(file => file.endsWith('.js'));
                ButtonFolder.forEach((file) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    const _getButtonFile = require(`${process.cwd()}/dist/commands/button/${file.replace('.js', '')}`).default;
                    if (_getButtonFile.customId === interaction.customId) {
                        const _defaultButtonFile = {
                            customId: 'default',
                            privateMessage: false,
                            showDeferReply: true,
                            execute: (({ interaction }) => tslib_1.__awaiter(this, void 0, void 0, function* () { yield interaction.editReply('This is Default message.'); })),
                        };
                        const _file = new Object(Object.assign(Object.assign({}, _defaultButtonFile), _getButtonFile));
                        if (_file.showDeferReply) {
                            yield interaction.deferReply({
                                ephemeral: Boolean(_file.privateMessage),
                            });
                        }
                        const _ButtonExtendData = {
                            interaction: interaction,
                            DiscordClient: _extraData.client,
                            createdTime: createdTime,
                            language: _language,
                        };
                        yield _file.execute(_ButtonExtendData);
                        return;
                    }
                }));
                yield IngCore.Logs.log(`<${interaction.user.id}> <button> ${interaction.customId} [${(0, msANDms_1.default)(new Date().getTime(), createdTime)}]\x1b[0m`, 'info');
            }
            else if (interaction.isSelectMenu()) {
                yield IngCore.Logs.log(`<${interaction.user.id}> <menu> ${interaction.customId}\x1b[0m`, 'info');
                const MenusFolder = yield fs.readdirSync(`${process.cwd()}/dist/commands/menu`).filter(file => file.endsWith('.js'));
                MenusFolder.forEach((file) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    const _getMenuFile = require(`${process.cwd()}/dist/commands/menu/${file.replace('.js', '')}`).default;
                    if (_getMenuFile.customId === interaction.customId) {
                        const _defaultMenuFile = {
                            customId: 'default',
                            privateMessage: false,
                            showDeferReply: true,
                            execute: (({ interaction }) => tslib_1.__awaiter(this, void 0, void 0, function* () { yield interaction.editReply('This is Default message.'); })),
                        };
                        const _file = new Object(Object.assign(Object.assign({}, _defaultMenuFile), _getMenuFile));
                        if (_file.showDeferReply) {
                            yield interaction.deferUpdate();
                        }
                        const _MenuExtendData = {
                            interaction: interaction,
                            DiscordClient: _extraData.client,
                            createdTime: createdTime,
                            language: _language,
                            command: {
                                collection: _extraData.commands,
                                array: _extraData.commandArray,
                            }
                        };
                        yield _file.execute(_MenuExtendData);
                        return;
                    }
                }));
                yield IngCore.Logs.log(`<${interaction.user.id}> <menu> ${interaction.customId} [${(0, msANDms_1.default)(new Date().getTime(), createdTime)}]\x1b[0m`, 'info');
            }
        });
    },
};
