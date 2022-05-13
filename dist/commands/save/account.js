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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
const IngCore = __importStar(require("@ing3kth/core"));
const crypto_1 = require("../../utils/crypto");
const makeBuur_1 = __importDefault(require("../../utils/makeBuur"));
const database_1 = require("../../utils/database");
const api_wrapper_1 = require("@valapi/api-wrapper");
const valorant_api_com_1 = require("@valapi/valorant-api.com");
exports.default = {
    data: new builders_1.SlashCommandBuilder()
        .setName('account')
        .setDescription('Manage Valorant Account')
        .addSubcommand(subcommand => subcommand
        .setName('login')
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
        .setName('remove')
        .setDescription("Remove Your Valorant Account"))
        .addSubcommand(subcommand => subcommand
        .setName('get')
        .setDescription("Get Your Valorant Account")),
    permissions: [
        discord_js_1.Permissions.ALL,
    ],
    privateMessage: true,
    execute(interaction, DiscordClient, createdTime) {
        return __awaiter(this, void 0, void 0, function* () {
            //script
            const _subCommand = interaction.options.getSubcommand();
            const _userId = interaction.user.id;
            const _guildId = interaction.guildId;
            const ValDatabase = (yield database_1.ValData.verify()).getCollection();
            const isAccountInDatabase = yield database_1.ValData.checkIfExist(ValDatabase, { discordId: _userId });
            const _cache = yield new IngCore.Cache('valorant');
            const _apiKey = (0, crypto_1.genarateApiKey)(_userId, interaction.user.createdTimestamp, _guildId);
            //valorant
            const ValClient = new api_wrapper_1.Client({
                region: "ap",
            });
            ValClient.on('error', ((data) => __awaiter(this, void 0, void 0, function* () {
                yield interaction.editReply({
                    content: `Something Went Wrong, Please Try Again Later`,
                });
                return;
            })));
            //success
            function success(ValClient) {
                var _a, _b, _c;
                return __awaiter(this, void 0, void 0, function* () {
                    const ValorantUserInfo = yield ValClient.Player.GetUserInfo();
                    const puuid = ValorantUserInfo.data.sub;
                    const ValorantInventory = yield ValClient.Player.Loadout(puuid);
                    const ValorantPlayerCard_ID = ValorantInventory.data.Identity.PlayerCardID;
                    const ValorantPlayerCard = yield (new valorant_api_com_1.Client()).PlayerCards.getByUuid(ValorantPlayerCard_ID);
                    const ValorantPlayerCard_Display = String((_a = ValorantPlayerCard.data.data) === null || _a === void 0 ? void 0 : _a.displayIcon);
                    //sendMessage
                    let sendMessage = "";
                    sendMessage += `Name: **${ValorantUserInfo.data.acct.game_name}**\n`;
                    sendMessage += `Tag: **${ValorantUserInfo.data.acct.tag_line}**\n`;
                    sendMessage += `ID: **${(0, makeBuur_1.default)(puuid)}**\n`;
                    const createEmbed = new discord_js_1.MessageEmbed()
                        .setColor(`#0099ff`)
                        .setTitle(`${ValorantUserInfo.data.acct.game_name}`)
                        .setAuthor({ name: `${(_b = DiscordClient.user) === null || _b === void 0 ? void 0 : _b.tag}`, iconURL: (_c = DiscordClient.user) === null || _c === void 0 ? void 0 : _c.displayAvatarURL(), url: `https://ingkth.wordpress.com` })
                        .setDescription(sendMessage)
                        .setThumbnail(ValorantPlayerCard_Display)
                        .setTimestamp(createdTime)
                        .setFooter({ text: `${interaction.user.username}#${interaction.user.discriminator}` });
                    yield interaction.editReply({
                        content: `You Are Register Riot Account With`,
                        embeds: [createEmbed],
                    });
                    //clear
                    _cache.clear(_userId);
                    //save
                    if (_subCommand === 'get') {
                        return;
                    }
                    if (isAccountInDatabase) {
                        yield ValDatabase.deleteMany({ discordId: _userId });
                    }
                    const SaveAccount = new ValDatabase({
                        account: (0, crypto_1.encrypt)(JSON.stringify(ValClient.toJSONAuth()), _apiKey),
                        discordId: _userId,
                        update: createdTime,
                    });
                    yield SaveAccount.save();
                });
            }
            //sub command
            if (_subCommand === 'login') {
                //auth
                const _USERNAME = String(interaction.options.getString('username'));
                const _PASSWORD = String(interaction.options.getString('password'));
                yield ValClient.login(_USERNAME, _PASSWORD);
                //embed
                const createEmbed = new discord_js_1.MessageEmbed()
                    .setColor(`#0099ff`)
                    .setTitle(`/${interaction.commandName} ${_subCommand}`)
                    .setDescription(`Username: **${_USERNAME}**\nPassword: **${(0, makeBuur_1.default)(_PASSWORD)}**`)
                    .setTimestamp(createdTime)
                    .setFooter({ text: `${interaction.user.username}#${interaction.user.discriminator}` });
                if (!ValClient.multifactor) {
                    //success
                    yield success(ValClient);
                }
                else {
                    //multifactor
                    yield _cache.input((0, crypto_1.encrypt)(JSON.stringify(ValClient.toJSONAuth()), _apiKey), _userId);
                    yield interaction.editReply({
                        content: `Please Verify Your Account\nBy Using: **/login verify {VerifyCode}**`,
                        embeds: [
                            createEmbed,
                        ],
                    });
                }
            }
            else if (_subCommand === 'verify') {
                //auth
                const _MFA_CODE = Number(interaction.options.getNumber("verify_code"));
                const _save = yield _cache.output(_userId);
                ValClient.fromJSONAuth(JSON.parse((0, crypto_1.decrypt)(_save, _apiKey)));
                yield ValClient.verify(_MFA_CODE);
                //success
                yield success(ValClient);
            }
            else if (_subCommand === 'remove') {
                //from cache
                yield _cache.clear(_userId);
                //from database
                if (!isAccountInDatabase) {
                    yield interaction.editReply({
                        content: `Couldn't Find Your Account`,
                    });
                    return;
                }
                yield ValDatabase.deleteOne({ discordId: _userId });
                //response
                yield interaction.editReply({
                    content: `Your Account Has Been Removed`,
                });
            }
            else if (_subCommand === 'get') {
                if (!isAccountInDatabase) {
                    yield interaction.editReply({
                        content: `Couldn't Find Your Account`,
                    });
                    return;
                }
                const _save = yield ValDatabase.findOne({ discordId: _userId });
                const SaveAccount = _save.toJSON().account;
                ValClient.fromJSONAuth(JSON.parse((0, crypto_1.decrypt)(SaveAccount, _apiKey)));
                yield success(ValClient);
            }
        });
    }
};
//# sourceMappingURL=account.js.map