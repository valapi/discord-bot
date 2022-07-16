"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
const ValAccount_1 = tslib_1.__importDefault(require("../../../utils/ValAccount"));
const core_1 = require("@ing3kth/core");
exports.default = {
    data: new builders_1.SlashCommandBuilder()
        .setName('collection')
        .setDescription('Valorant Items Collection'),
    type: 'valorant',
    onlyGuild: true,
    execute({ interaction, language, apiKey, createdTime }) {
        var _a, _b, _c, _d, _e;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const userId = interaction.user.id;
            const { ValClient, ValApiCom, __isFind } = yield (0, ValAccount_1.default)({
                userId: userId,
                apiKey: apiKey,
                language: language,
                region: "ap",
            });
            if (__isFind === false) {
                yield interaction.editReply({
                    content: language.data.command['account']['not_account'],
                });
                return;
            }
            ValClient.on('error', ((data) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                yield interaction.editReply({
                    content: `${language.data.error} ${discord_js_1.Formatters.codeBlock('json', JSON.stringify({ errorCode: data.errorCode, message: data.message }))}`,
                });
            })));
            const ValorantUserInfo = yield ValClient.Player.GetUserInfo();
            const puuid = ValorantUserInfo.data.sub;
            const GetLoadout = yield ValClient.Player.Loadout(puuid);
            const AllGuns = GetLoadout.data.Guns;
            const AllSprays = GetLoadout.data.Sprays;
            const TheIdentity = GetLoadout.data.Identity;
            const ThisIncognito = GetLoadout.data.Incognito;
            let createEmbed = new discord_js_1.MessageEmbed();
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
                if (_DISPLAY && ((0, core_1.Random)(0, 2) >= 1)) {
                    continue;
                }
                _DISPLAY = GetSprayData.data.data.fullTransparentIcon;
            }
            createEmbed.setThumbnail(_DISPLAY);
            const PlayerCardId = TheIdentity.PlayerCardID;
            const GetCardData = yield ValApiCom.PlayerCards.getByUuid(PlayerCardId);
            createEmbed.addField('Player Card', `${(_a = GetCardData.data.data) === null || _a === void 0 ? void 0 : _a.displayName}`, true);
            createEmbed.setImage((_b = GetCardData.data.data) === null || _b === void 0 ? void 0 : _b.wideArt);
            const PlayerTitleId = TheIdentity.PlayerTitleID;
            const GetTitleData = yield ValApiCom.PlayerTitles.getByUuid(PlayerTitleId);
            if (!((_c = GetTitleData.data.data) === null || _c === void 0 ? void 0 : _c.titleText)) {
                createEmbed.addField('Player Title', `${(_d = GetTitleData.data.data) === null || _d === void 0 ? void 0 : _d.displayName} - ${(_e = GetTitleData.data.data) === null || _e === void 0 ? void 0 : _e.titleText}`, true);
            }
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
