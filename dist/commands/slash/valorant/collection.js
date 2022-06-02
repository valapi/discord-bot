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
//common
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
//valorant common
const crypto_1 = require("../../../utils/crypto");
const database_1 = require("../../../utils/database");
//valorant
const api_wrapper_1 = require("@valapi/api-wrapper");
const valorant_api_com_1 = require("@valapi/valorant-api.com");
const core_1 = require("@ing3kth/core");
exports.default = {
    data: new builders_1.SlashCommandBuilder()
        .setName('collection')
        .setDescription('Valorant Items Collection'),
    type: 'valorant',
    onlyGuild: true,
    execute({ interaction, language, apiKey, createdTime }) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            //script
            const userId = interaction.user.id;
            const ValDatabase = (yield database_1.ValData.verify()).getCollection();
            const ValAccountInDatabase = yield database_1.ValData.checkIfExist(ValDatabase, { discordId: userId });
            //valorant
            const ValApiCom = new valorant_api_com_1.Client({
                language: (language.name).replace('_', '-'),
            });
            const ValClient = new api_wrapper_1.Client({
                region: "ap",
                autoReconnect: true,
            });
            ValClient.on('error', ((data) => __awaiter(this, void 0, void 0, function* () {
                yield interaction.editReply({
                    content: `${language.data.error} ${discord_js_1.Formatters.codeBlock('json', JSON.stringify({ errorCode: data.errorCode, message: data.message }))}`,
                });
            })));
            //get
            if (!ValAccountInDatabase.isFind) {
                yield interaction.editReply({
                    content: language.data.command['account']['not_account'],
                });
                return;
            }
            const SaveAccount = ValAccountInDatabase.once.account;
            ValClient.fromJSONAuth(JSON.parse((0, crypto_1.decrypt)(SaveAccount, apiKey)));
            //success
            const ValorantUserInfo = yield ValClient.Player.GetUserInfo();
            const puuid = ValorantUserInfo.data.sub;
            //item
            const GetLoadout = yield ValClient.Player.Loadout(puuid);
            const AllGuns = GetLoadout.data.Guns;
            const AllSprays = GetLoadout.data.Sprays;
            const TheIdentity = GetLoadout.data.Identity;
            const ThisIncognito = GetLoadout.data.Incognito;
            /**
             * script
             */
            let createEmbed = new discord_js_1.MessageEmbed();
            // Guns //
            let sendGunMessage = '';
            for (let ofGun of AllGuns) {
                const GunId = ofGun.SkinID;
                const GetGunData = yield ValApiCom.Weapons.getSkinByUuid(GunId);
                if (GetGunData.isError || !GetGunData.data.data) {
                    continue;
                }
                const GunName = GetGunData.data.data.displayName;
                sendGunMessage += ` ${GunName}\n`;
            }
            // Sprays //
            let sendSprayMessage = '';
            let _DISPLAY = '';
            for (let ofTheSpray in AllSprays) {
                const ofSpray = AllSprays[ofTheSpray];
                const SprayID = ofSpray.SprayID;
                const GetSprayData = yield ValApiCom.Sprays.getByUuid(SprayID);
                if (GetSprayData.isError || !GetSprayData.data.data) {
                    continue;
                }
                const SprayName = GetSprayData.data.data.displayName;
                sendSprayMessage += ` ${SprayName}\n`;
                //extra
                if (_DISPLAY && ((0, core_1.Random)(0, 2) >= 1)) {
                    continue;
                }
                _DISPLAY = GetSprayData.data.data.fullTransparentIcon;
            }
            createEmbed.setThumbnail(_DISPLAY);
            // Identity //
            //card
            const PlayerCardId = TheIdentity.PlayerCardID;
            const GetCardData = yield ValApiCom.PlayerCards.getByUuid(PlayerCardId);
            createEmbed.addField('Player Card', `${(_a = GetCardData.data.data) === null || _a === void 0 ? void 0 : _a.displayName}`, true);
            createEmbed.setImage((_b = GetCardData.data.data) === null || _b === void 0 ? void 0 : _b.wideArt);
            //title
            const PlayerTitleId = TheIdentity.PlayerTitleID;
            const GetTitleData = yield ValApiCom.PlayerTitles.getByUuid(PlayerTitleId);
            if (!((_c = GetTitleData.data.data) === null || _c === void 0 ? void 0 : _c.titleText)) {
                createEmbed.addField('Player Title', `${(_d = GetTitleData.data.data) === null || _d === void 0 ? void 0 : _d.displayName} - ${(_e = GetTitleData.data.data) === null || _e === void 0 ? void 0 : _e.titleText}`, true);
            }
            /**
             * sendMessage
             */
            createEmbed
                .setTimestamp(createdTime)
                .setDescription(language.data.command['collection']['default'])
                .addFields({ name: '\u200B', value: '\u200B' }, {
                name: 'Weapons',
                value: sendGunMessage,
                inline: true,
            }, {
                name: 'Sprays',
                value: sendSprayMessage,
                inline: true,
            })
                .setFooter({ text: `${interaction.user.username}#${interaction.user.discriminator}` });
            yield interaction.editReply({
                embeds: [createEmbed],
            });
        });
    }
};
//# sourceMappingURL=collection.js.map