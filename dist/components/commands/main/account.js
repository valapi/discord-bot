"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const IngCore = tslib_1.__importStar(require("@ing3kth/core"));
const discord_js_1 = require("discord.js");
const crypto_1 = require("../../../utils/crypto");
const database_1 = require("../../../utils/database");
const lib_1 = require("@valapi/lib");
const web_client_1 = require("@valapi/web-client");
const valorant_api_com_1 = require("@valapi/valorant-api.com");
const __command = {
    command: (new discord_js_1.SlashCommandBuilder()
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
        .setName('multifactor')
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
        .setDescription("Get Your Valorant Account"))),
    category: 'settings',
    onlyGuild: true,
    isPrivateMessage: true,
    echo: {
        data: [
            { oldName: 'add', newName: 'login' },
            { oldName: 'multifactor', newName: 'verify' },
            { oldName: 'remove', newName: 'logout' },
        ],
    },
    async execute({ interaction, apiKey, createdTime, language }) {
        const userId = interaction.user.id;
        const thisSubCommand = interaction.options.getSubcommand();
        const CommandLanguage = language.data.command.account;
        const _cache = new IngCore.Cache('authentications');
        const ValAccount = await (0, database_1.ValorDatabase)({
            name: 'account',
            schema: database_1.ValorInterface.Account.Schema,
            filter: { discordId: userId },
            token: process.env['MONGO_TOKEN'],
        });
        const ValorantApiCom = new valorant_api_com_1.Client({
            language: language.name,
        });
        const WebClient = new web_client_1.Client();
        async function ValorSave(WebClient) {
            (new IngCore.Cache('accounts')).clear(userId);
            if (ValAccount.isFind === true) {
                await ValAccount.model.deleteMany({ discordId: userId });
            }
            const _ClientData = WebClient.toJSON();
            await (new ValAccount.model({
                account: (0, crypto_1.encrypt)(_ClientData.cookie.ssid, apiKey),
                region: _ClientData.region.live,
                discordId: userId,
                createdAt: (ValAccount.data.at(0))?.createdAt || new Date(),
            })).save();
        }
        async function ValorSuccess(WebClient, isSave) {
            if (isSave === true) {
                _cache.clear(userId);
                await ValorSave(WebClient);
            }
            const ValorantUserInfo = await WebClient.Player.GetUserInfo();
            const puuid = ValorantUserInfo.data.sub;
            const ValorantInventory = await WebClient.Player.Loadout(puuid);
            const ValorantPlayerCard = await ValorantApiCom.PlayerCards.getByUuid(ValorantInventory.data.Identity.PlayerCardID);
            return {
                content: CommandLanguage['succes'],
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setColor(`#0099ff`)
                        .addFields({ name: `Name`, value: `${ValorantUserInfo.data.acct.game_name}`, inline: true }, { name: `Tag`, value: `${ValorantUserInfo.data.acct.tag_line}`, inline: true }, { name: '\u200B', value: '\u200B' }, { name: `ID`, value: `${puuid}`, inline: true })
                        .setThumbnail(String(ValorantPlayerCard.data.data?.displayIcon))
                        .setTimestamp(createdTime)
                        .setFooter({ text: `${interaction.user.username}#${interaction.user.discriminator}` })
                ],
            };
        }
        if (thisSubCommand === 'add') {
            const _InputUsername = String(interaction.options.getString('username'));
            await WebClient.login(_InputUsername, String(interaction.options.getString('password')));
            if (WebClient.isMultifactor === false) {
                return await ValorSuccess(WebClient, true);
            }
            _cache.input((0, crypto_1.encrypt)(JSON.stringify(WebClient.toJSON()), apiKey), userId);
            return {
                content: CommandLanguage['verify'],
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setColor(`#0099ff`)
                        .setTitle(`/${interaction.commandName} ${thisSubCommand}`)
                        .setDescription(`Username: **${_InputUsername}**`)
                        .setTimestamp(createdTime)
                        .setFooter({ text: `${interaction.user.username}#${interaction.user.discriminator}` }),
                ],
            };
        }
        if (thisSubCommand === 'multifactor') {
            const _save = _cache.output(userId);
            if (!_save) {
                return {
                    content: CommandLanguage['not_account'],
                };
            }
            WebClient.fromJSON(JSON.parse((0, crypto_1.decrypt)(_save, apiKey)));
            await WebClient.verify(Number(interaction.options.getNumber("verify_code")));
            return await ValorSuccess(WebClient, true);
        }
        if (thisSubCommand === 'reconnect') {
            if (ValAccount.isFind === false) {
                return {
                    content: CommandLanguage['not_account'],
                };
            }
            await WebClient.fromCookie((0, crypto_1.decrypt)((ValAccount.data[0]).account, apiKey));
            WebClient.setRegion((ValAccount.data[0]).region);
            await WebClient.refresh(true);
            await ValorSave(WebClient);
            return {
                content: CommandLanguage['reconnect'],
            };
        }
        if (thisSubCommand === 'remove') {
            _cache.clear(userId);
            (new IngCore.Cache('accounts')).clear(userId);
            if (ValAccount.isFind === false) {
                return {
                    content: CommandLanguage['not_account'],
                };
            }
            await ValAccount.model.deleteMany({ discordId: userId });
            return {
                content: CommandLanguage['remove'],
            };
        }
        if (thisSubCommand === 'settings') {
            if (ValAccount.isFind === false) {
                return {
                    content: CommandLanguage['not_account'],
                };
            }
            await WebClient.fromCookie((0, crypto_1.decrypt)((ValAccount.data[0]).account, apiKey));
            const _choice = interaction.options.getString('region');
            WebClient.setRegion(_choice);
            await ValorSave(WebClient);
            return {
                content: `__*beta*__\n\nchanged region to **${String(lib_1.Region.fromString(WebClient.toJSON().region.live)).replace('_', ' ')}**\n\n`,
            };
        }
        if (thisSubCommand === 'get') {
            if (ValAccount.isFind === false) {
                return {
                    content: CommandLanguage['not_account'],
                };
            }
            await WebClient.fromCookie((0, crypto_1.decrypt)((ValAccount.data[0]).account, apiKey));
            WebClient.setRegion((ValAccount.data[0]).region);
            await WebClient.refresh(false);
            return await ValorSuccess(WebClient, false);
        }
    },
};
exports.default = __command;