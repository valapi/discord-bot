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
exports.default = {
    data: new builders_1.SlashCommandBuilder()
        .setName('profile')
        .setDescription('Valorant Profile'),
    type: 'valorant',
    onlyGuild: true,
    execute({ interaction, language, apiKey, createdTime }) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            //script
            const userId = interaction.user.id;
            const ValDatabase = (yield database_1.ValData.verify()).getCollection('account', database_1.ValorantSchema);
            const ValAccountInDatabase = yield database_1.ValData.checkIfExist(ValDatabase, { discordId: userId });
            //valorant
            const ValApiCom = new valorant_api_com_1.Client({
                language: (language.name).replace('_', '-'),
            });
            if (ValAccountInDatabase.isFind === false) {
                yield interaction.editReply({
                    content: language.data.command['account']['not_account'],
                });
                return;
            }
            const SaveAccount = ValAccountInDatabase.once.account;
            const ValClient = api_wrapper_1.Client.fromJSON({
                region: "ap",
            }, JSON.parse((0, crypto_1.decrypt)(SaveAccount, apiKey)));
            ValClient.on('error', ((data) => __awaiter(this, void 0, void 0, function* () {
                yield interaction.editReply({
                    content: `${language.data.error} ${discord_js_1.Formatters.codeBlock('json', JSON.stringify({ errorCode: data.errorCode, message: data.message }))}`,
                });
            })));
            yield ValClient.reconnect(false);
            //get
            if (!ValAccountInDatabase.isFind) {
                yield interaction.editReply({
                    content: language.data.command['account']['not_account'],
                });
                return;
            }
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
//# sourceMappingURL=profile.js.map