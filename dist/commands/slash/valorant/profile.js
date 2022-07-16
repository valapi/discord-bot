"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
const ValAccount_1 = tslib_1.__importDefault(require("../../../utils/ValAccount"));
exports.default = {
    data: new builders_1.SlashCommandBuilder()
        .setName('profile')
        .setDescription('Valorant Profile'),
    type: 'valorant',
    onlyGuild: true,
    execute({ interaction, language, apiKey, createdTime }) {
        var _a, _b, _c;
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
            const ValorantInventory = yield ValClient.Player.Loadout(puuid);
            const PlayerCard_ID = ValorantInventory.data.Identity.PlayerCardID;
            const PlayerCard = yield ValApiCom.PlayerCards.getByUuid(PlayerCard_ID);
            const PlayerCard_Name = String((_a = PlayerCard.data.data) === null || _a === void 0 ? void 0 : _a.displayName);
            const PlayerCard_Icon = String((_b = PlayerCard.data.data) === null || _b === void 0 ? void 0 : _b.displayIcon);
            const PlayerTitle_ID = ValorantInventory.data.Identity.PlayerTitleID;
            const PlayerTitle = yield ValApiCom.PlayerTitles.getByUuid(PlayerTitle_ID);
            const PlayerTitle_Title = String((_c = PlayerTitle.data.data) === null || _c === void 0 ? void 0 : _c.titleText);
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
