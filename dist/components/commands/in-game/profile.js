"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const valorant_ts_1 = require("valorant.ts");
const accounts_1 = require("../../../utils/accounts");
const lib_1 = require("@valapi/lib");
const __command = {
    command: (new discord_js_1.SlashCommandBuilder()
        .setName('profile')
        .setDescription('My Profile')),
    category: 'valorant',
    onlyGuild: true,
    execute({ interaction, language, apiKey, createdTime }) {
        var _a, _b, _c;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const userId = interaction.user.id;
            const { WebClient, ValorantApiCom, isValorAccountFind } = yield (0, accounts_1.ValorAccount)({
                userId,
                apiKey,
                language: language.name,
                region: valorant_ts_1.Region.Asia_Pacific,
            });
            if (isValorAccountFind === false) {
                return {
                    content: language.data.command['account']['not_account'],
                };
            }
            const ValorantUserInfo = yield WebClient.Player.GetUserInfo();
            const puuid = ValorantUserInfo.data.sub;
            const ValorantInventory = yield WebClient.Player.Loadout(puuid);
            const PlayerCard_ID = ValorantInventory.data.Identity.PlayerCardID;
            const PlayerCard = yield ValorantApiCom.PlayerCards.getByUuid(PlayerCard_ID);
            const PlayerCard_Name = String((_a = PlayerCard.data.data) === null || _a === void 0 ? void 0 : _a.displayName);
            const PlayerCard_Icon = String((_b = PlayerCard.data.data) === null || _b === void 0 ? void 0 : _b.displayIcon);
            const PlayerTitle_ID = ValorantInventory.data.Identity.PlayerTitleID;
            const PlayerTitle = yield ValorantApiCom.PlayerTitles.getByUuid(PlayerTitle_ID);
            const PlayerTitle_Title = String((_c = PlayerTitle.data.data) === null || _c === void 0 ? void 0 : _c.titleText);
            const JsonWebClient = WebClient.toJSON();
            return {
                content: language.data.command['profile']['default'],
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setColor(`#0099ff`)
                        .addFields({ name: `Name`, value: `${ValorantUserInfo.data.acct.game_name}`, inline: true }, { name: `Tag`, value: `${ValorantUserInfo.data.acct.tag_line}`, inline: true }, { name: '\u200B', value: '\u200B' }, { name: `Region`, value: `${lib_1.Region.fromString(JsonWebClient.region.live).replace('_', ' ')}`, inline: true }, { name: `Create`, value: (0, discord_js_1.time)(new Date(ValorantUserInfo.data.acct.created_at)), inline: true }, { name: '\u200B', value: '\u200B' }, { name: `Card`, value: `${PlayerCard_Name}`, inline: true }, { name: `Title`, value: `${PlayerTitle_Title}`, inline: true })
                        .setThumbnail(PlayerCard_Icon)
                        .setTimestamp(createdTime)
                        .setFooter({ text: `${interaction.user.username}#${interaction.user.discriminator}` }),
                ],
            };
        });
    },
};
exports.default = __command;
