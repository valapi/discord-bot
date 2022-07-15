"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
//common
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
//valorant common
const crypto_1 = require("../../../utils/crypto");
const database_1 = require("../../../utils/database");
//valorant
const valorant_ts_1 = require("valorant.ts");
const web_client_1 = require("@valapi/web-client");
const valorant_api_com_1 = require("@valapi/valorant-api.com");
exports.default = {
    data: new builders_1.SlashCommandBuilder()
        .setName('profile')
        .setDescription('Valorant Profile'),
    type: 'valorant',
    onlyGuild: true,
    execute({ interaction, language, apiKey, createdTime }) {
        var _a, _b, _c;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            //script
            const userId = interaction.user.id;
            const ValDatabase = yield database_1.ValData.checkCollection({
                name: 'account',
                schema: database_1.ValorantSchema,
                filter: { discordId: interaction.user.id },
            });
            //valorant
            const ValApiCom = new valorant_api_com_1.Client({
                language: (language.name).replace('_', '-'),
            });
            if (ValDatabase.isFind === false) {
                yield interaction.editReply({
                    content: language.data.command['account']['not_account'],
                });
                return;
            }
            const ValClient = web_client_1.Client.fromJSON(JSON.parse((0, crypto_1.decrypt)(ValDatabase.once.account, apiKey)), {
                region: valorant_ts_1.Region.Asia_Pacific
            });
            ValClient.on('error', ((data) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                yield interaction.editReply({
                    content: `${language.data.error} ${discord_js_1.Formatters.codeBlock('json', JSON.stringify({ errorCode: data.errorCode, message: data.message }))}`,
                });
            })));
            yield ValClient.refresh(false);
            //success
            const ValorantUserInfo = yield ValClient.Player.GetUserInfo();
            const puuid = ValorantUserInfo.data.sub;
            const ValorantInventory = yield ValClient.Player.Loadout(puuid);
            const PlayerCard_ID = ValorantInventory.data.Identity.PlayerCardID;
            const PlayerCard = yield ValApiCom.PlayerCards.getByUuid(PlayerCard_ID);
            const PlayerCard_Name = String((_a = PlayerCard.data.data) === null || _a === void 0 ? void 0 : _a.displayName);
            const PlayerCard_Icon = String((_b = PlayerCard.data.data) === null || _b === void 0 ? void 0 : _b.displayIcon);
            const PlayerTitle_ID = ValorantInventory.data.Identity.PlayerTitleID;
            const PlayerTitle = yield ValApiCom.PlayerTitles.getByUuid(PlayerTitle_ID);
            const PlayerTitle_Title = String((_c = PlayerTitle.data.data) === null || _c === void 0 ? void 0 : _c.titleText);
            //sendMessage
            const createEmbed = new discord_js_1.MessageEmbed()
                .setColor(`#0099ff`)
                .addFields({ name: `Name`, value: `${ValorantUserInfo.data.acct.game_name}`, inline: true }, { name: `Tag`, value: `${ValorantUserInfo.data.acct.tag_line}`, inline: true }, { name: '\u200B', value: '\u200B' }, { name: `Card`, value: `${PlayerCard_Name}`, inline: true }, { name: `Title`, value: `${PlayerTitle_Title}`, inline: true }, { name: '\u200B', value: '\u200B' }, { name: `Country`, value: `${ValorantUserInfo.data.country}`, inline: true }, { name: `Create`, value: `${new Date(ValorantUserInfo.data.acct.created_at).toUTCString()}`, inline: true })
                .setThumbnail(PlayerCard_Icon)
                .setTimestamp(createdTime)
                .setFooter({ text: `${interaction.user.username}#${interaction.user.discriminator}` });
            yield interaction.editReply({
                content: language.data.command['profile']['default'],
                embeds: [createEmbed],
            });
        });
    }
};
