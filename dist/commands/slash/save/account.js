"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
const IngCore = tslib_1.__importStar(require("@ing3kth/core"));
const crypto_1 = require("../../../utils/crypto");
const database_1 = require("../../../utils/database");
const lib_1 = require("@valapi/lib");
const web_client_1 = require("@valapi/web-client");
const valorant_api_com_1 = require("@valapi/valorant-api.com");
exports.default = {
    data: new builders_1.SlashCommandBuilder()
        .setName('account')
        .setDescription('Manage Valorant Account')
        .addSubcommand(subcommand => subcommand
        .setName('add')
        .setDescription("Add Your Valorant Account")
        .addStringOption(option => option
        .setName('username')
        .setDescription('Riot Account Username')
        .setRequired(true))
        .addStringOption(option => option
        .setName('password')
        .setDescription('Riot Account Password')
        .setRequired(true)))
        .addSubcommand(subcommand => subcommand
        .setName('verify')
        .setDescription('Multi-Factor Authentication')
        .addNumberOption(option => option
        .setName('verify_code')
        .setDescription('Verify Code')
        .setRequired(true)))
        .addSubcommand(subcommand => subcommand
        .setName('reconnect')
        .setDescription('Reconnect Your Account'))
        .addSubcommand(subcommand => subcommand
        .setName('remove')
        .setDescription("Remove Your Valorant Account"))
        .addSubcommand(subCommand => subCommand
        .setName('settings')
        .setDescription('Account Settings')
        .addStringOption(option => option
        .setName('region')
        .setDescription('Change Your Account Region')
        .addChoices({ name: lib_1.Region.from.ap, value: lib_1.Region.to.Asia_Pacific }, { name: lib_1.Region.from.br, value: lib_1.Region.to.Brazil }, { name: lib_1.Region.from.eu, value: lib_1.Region.to.Europe }, { name: lib_1.Region.from.kr, value: lib_1.Region.to.Korea }, { name: lib_1.Region.from.latam, value: lib_1.Region.to.Latin_America }, { name: lib_1.Region.from.na, value: lib_1.Region.to.North_America }, { name: lib_1.Region.from.pbe, value: lib_1.Region.to.Public_Beta_Environment })
        .setRequired(true)))
        .addSubcommand(subcommand => subcommand
        .setName('get')
        .setDescription("Get Your Valorant Account")),
    type: 'settings',
    privateMessage: true,
    echo: {
        command: [
            {
                newCommandName: 'login',
                subCommandName: 'add',
            },
            {
                newCommandName: 'verify',
                subCommandName: 'verify',
            },
            {
                newCommandName: 'logout',
                subCommandName: 'remove',
            },
        ],
    },
    onlyGuild: true,
    execute({ interaction, createdTime, language, apiKey }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const userId = interaction.user.id;
            const _subCommand = interaction.options.getSubcommand();
            const CommandLanguage = language.data.command['account'];
            const ValAccount = yield database_1.ValData.checkCollection({
                name: 'account',
                schema: database_1.ValorantSchema,
                filter: { discordId: userId },
            });
            const _cache = new IngCore.Cache('authentication');
            const ValClient = new web_client_1.Client({
                region: "ap",
            });
            ValClient.on('error', ((data) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                yield interaction.editReply({
                    content: `${language.data.error}  ${discord_js_1.Formatters.codeBlock('json', JSON.stringify({ errorCode: data.errorCode, message: data.message }))}`,
                });
            })));
            function save(ValClient) {
                return tslib_1.__awaiter(this, void 0, void 0, function* () {
                    if (ValAccount.isFind) {
                        yield ValAccount.model.deleteMany({ discordId: userId });
                    }
                    const SaveAccount = new ValAccount.model({
                        account: (0, crypto_1.encrypt)(ValClient.toJSON().cookie.ssid, apiKey),
                        discordId: userId,
                        createdAt: createdTime,
                    });
                    yield SaveAccount.save();
                });
            }
            function success(ValClient) {
                var _a;
                return tslib_1.__awaiter(this, void 0, void 0, function* () {
                    const ValorantUserInfo = yield ValClient.Player.GetUserInfo();
                    const puuid = ValorantUserInfo.data.sub;
                    const ValorantInventory = yield ValClient.Player.Loadout(puuid);
                    const ValorantPlayerCard = yield (new valorant_api_com_1.Client()).PlayerCards.getByUuid(ValorantInventory.data.Identity.PlayerCardID);
                    const createEmbed = new discord_js_1.MessageEmbed()
                        .setColor(`#0099ff`)
                        .addFields({ name: `Name`, value: `${ValorantUserInfo.data.acct.game_name}`, inline: true }, { name: `Tag`, value: `${ValorantUserInfo.data.acct.tag_line}`, inline: true }, { name: '\u200B', value: '\u200B' }, { name: `ID`, value: `${puuid}`, inline: true })
                        .setThumbnail(String((_a = ValorantPlayerCard.data.data) === null || _a === void 0 ? void 0 : _a.displayIcon))
                        .setTimestamp(createdTime)
                        .setFooter({ text: `${interaction.user.username}#${interaction.user.discriminator}` });
                    yield interaction.editReply({
                        content: CommandLanguage['succes'],
                        embeds: [createEmbed],
                    });
                    _cache.clear(userId);
                    yield (new IngCore.Cache('accounts')).input((0, crypto_1.encrypt)(JSON.stringify(ValClient.toJSON()), apiKey), userId);
                    if (_subCommand === 'get') {
                        return;
                    }
                    yield save(ValClient);
                });
            }
            if (_subCommand === 'add') {
                const _USERNAME = String(interaction.options.getString('username'));
                yield ValClient.login(_USERNAME, String(interaction.options.getString('password')));
                const createEmbed = new discord_js_1.MessageEmbed()
                    .setColor(`#0099ff`)
                    .setTitle(`/${interaction.commandName} ${_subCommand}`)
                    .setDescription(`Username: **${_USERNAME}**`)
                    .setTimestamp(createdTime)
                    .setFooter({ text: `${interaction.user.username}#${interaction.user.discriminator}` });
                if (!ValClient.isMultifactor) {
                    yield success(ValClient);
                }
                else {
                    yield _cache.input((0, crypto_1.encrypt)(JSON.stringify(ValClient.toJSON()), apiKey), userId);
                    yield interaction.editReply({
                        content: CommandLanguage.verify,
                        embeds: [
                            createEmbed,
                        ],
                    });
                }
            }
            else if (_subCommand === 'verify') {
                const _save = yield _cache.output(userId);
                if (!_save) {
                    yield interaction.editReply({
                        content: CommandLanguage['not_account'],
                    });
                    return;
                }
                ValClient.fromJSON(JSON.parse((0, crypto_1.decrypt)(_save, apiKey)));
                yield ValClient.verify(Number(interaction.options.getNumber("verify_code")));
                yield success(ValClient);
            }
            else if (_subCommand === 'reconnect') {
                if (!ValAccount.isFind) {
                    yield interaction.editReply({
                        content: CommandLanguage['not_account'],
                    });
                    return;
                }
                const NewValClient = yield web_client_1.Client.fromCookie((0, crypto_1.decrypt)(ValAccount.data[0].account, apiKey));
                yield NewValClient.refresh(true);
                yield interaction.editReply(CommandLanguage['reconnect']);
                yield success(NewValClient);
            }
            else if (_subCommand === 'remove') {
                yield _cache.clear(userId);
                yield (new IngCore.Cache('accounts')).clear(userId);
                if (!ValAccount.isFind) {
                    yield interaction.editReply({
                        content: CommandLanguage['not_account'],
                    });
                    return;
                }
                yield ValAccount.model.deleteMany({ discordId: userId });
                yield interaction.editReply({
                    content: CommandLanguage['remove'],
                });
            }
            else if (_subCommand === 'settings') {
                if (!ValAccount.isFind) {
                    yield interaction.editReply({
                        content: CommandLanguage['not_account'],
                    });
                    return;
                }
                const _choice = interaction.options.getString('region');
                ValClient.setRegion(lib_1.Region.toString(_choice));
                yield interaction.editReply(`changed region to **${_choice.replace('_', ' ')}**`);
                yield save(ValClient);
            }
            else if (_subCommand === 'get') {
                if (!ValAccount.isFind) {
                    yield interaction.editReply({
                        content: CommandLanguage['not_account'],
                    });
                    return;
                }
                const NewValClient = yield web_client_1.Client.fromCookie((0, crypto_1.decrypt)(ValAccount.data[0].account, apiKey));
                yield NewValClient.refresh(false);
                yield success(NewValClient);
            }
        });
    }
};
