"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const IngCore = tslib_1.__importStar(require("@ing3kth/core"));
const discord_js_1 = require("discord.js");
const accounts_1 = require("../../../utils/accounts");
const __command = {
    command: (new discord_js_1.SlashCommandBuilder()
        .setName('collection')
        .setDescription('Items Collection')),
    category: 'valorant',
    onlyGuild: true,
    execute({ interaction, language, apiKey, createdTime }) {
        var _a, _b, _c, _d, _e;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const userId = interaction.user.id;
            const { WebClient, ValorantApiCom, isValorAccountFind } = yield (0, accounts_1.ValorAccount)({
                userId,
                apiKey,
                language: language.name,
            });
            if (isValorAccountFind === false) {
                return {
                    content: language.data.command['account']['not_account'],
                };
            }
            const puuid = WebClient.getSubject();
            const GetLoadout = yield WebClient.Player.Loadout(puuid);
            const AllGuns = GetLoadout.data.Guns;
            const AllSprays = GetLoadout.data.Sprays;
            const TheIdentity = GetLoadout.data.Identity;
            const createEmbed = new discord_js_1.EmbedBuilder();
            let sendGunMessage = '';
            for (const ofGun of AllGuns) {
                const GunId = ofGun.SkinID;
                const GetGunData = yield ValorantApiCom.Weapons.getSkinByUuid(GunId);
                if (GetGunData.isError || !GetGunData.data.data) {
                    continue;
                }
                const GunName = GetGunData.data.data.displayName;
                sendGunMessage += ` ${GunName}\n`;
            }
            let sendSprayMessage = '';
            let _DISPLAY = '';
            for (const ofTheSpray in AllSprays) {
                const ofSpray = AllSprays[ofTheSpray];
                const SprayID = ofSpray.SprayID;
                const GetSprayData = yield ValorantApiCom.Sprays.getByUuid(SprayID);
                if (GetSprayData.isError || !GetSprayData.data.data) {
                    continue;
                }
                const SprayName = GetSprayData.data.data.displayName;
                sendSprayMessage += ` ${SprayName}\n`;
                if (_DISPLAY && (IngCore.Random(0, 2) >= 1)) {
                    continue;
                }
                _DISPLAY = GetSprayData.data.data.fullTransparentIcon;
            }
            createEmbed.setThumbnail(_DISPLAY);
            const PlayerCardId = TheIdentity.PlayerCardID;
            const GetCardData = yield ValorantApiCom.PlayerCards.getByUuid(PlayerCardId);
            createEmbed.addFields({ name: 'Player Card', value: `${(_a = GetCardData.data.data) === null || _a === void 0 ? void 0 : _a.displayName}`, inline: true });
            createEmbed.setImage((_b = GetCardData.data.data) === null || _b === void 0 ? void 0 : _b.wideArt);
            const PlayerTitleId = TheIdentity.PlayerTitleID;
            const GetTitleData = yield ValorantApiCom.PlayerTitles.getByUuid(PlayerTitleId);
            if (!((_c = GetTitleData.data.data) === null || _c === void 0 ? void 0 : _c.titleText)) {
                createEmbed.addFields({ name: 'Player Title', value: `${(_d = GetTitleData.data.data) === null || _d === void 0 ? void 0 : _d.displayName} - ${(_e = GetTitleData.data.data) === null || _e === void 0 ? void 0 : _e.titleText}`, inline: true });
            }
            createEmbed
                .setTimestamp(createdTime)
                .setDescription(language.data.command['collection']['default'])
                .addFields({ name: '\u200B', value: '\u200B' }, {
                name: 'Weapons',
                value: `${sendGunMessage}`,
                inline: true,
            }, {
                name: 'Sprays',
                value: `${sendSprayMessage}`,
                inline: true,
            })
                .setFooter({ text: `${interaction.user.username}#${interaction.user.discriminator}` });
            return {
                embeds: [createEmbed],
            };
        });
    },
};
exports.default = __command;
