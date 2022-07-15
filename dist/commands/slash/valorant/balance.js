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
const core_1 = require("@ing3kth/core");
exports.default = {
    data: new builders_1.SlashCommandBuilder()
        .setName('balance')
        .setDescription('Valorant InGame Wallet'),
    type: 'valorant',
    echo: {
        command: [
            'wallet'
        ],
    },
    onlyGuild: true,
    execute({ interaction, language, apiKey, createdTime }) {
        var _a;
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
            const GetWallet = yield ValClient.Store.GetWallet(puuid);
            const AllWallet = GetWallet.data.Balances;
            const GetCurrency = yield ValApiCom.Currencies.get();
            //currency
            let BalanceArray = [];
            if (GetCurrency.isError || !GetCurrency.data.data) {
                throw new Error('Currency not found');
            }
            for (let ofCurrency of GetCurrency.data.data) {
                if (!isNaN(AllWallet[ofCurrency.uuid])) {
                    BalanceArray.push({
                        id: ofCurrency.uuid,
                        name: ofCurrency.displayName,
                        icon: ofCurrency.displayIcon,
                        value: Number(AllWallet[ofCurrency.uuid]),
                    });
                }
            }
            //sendMessage
            const createEmbed = new discord_js_1.MessageEmbed()
                .setThumbnail((_a = (BalanceArray.at((0, core_1.Random)(0, BalanceArray.length - 1)))) === null || _a === void 0 ? void 0 : _a.icon);
            BalanceArray.forEach((item) => {
                createEmbed.addField(item.name, String(item.value));
            });
            yield interaction.editReply({
                embeds: [createEmbed],
            });
        });
    }
};
