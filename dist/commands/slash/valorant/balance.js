"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
const ValAccount_1 = tslib_1.__importDefault(require("../../../utils/ValAccount"));
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
            const GetWallet = yield ValClient.Store.GetWallet(puuid);
            const AllWallet = GetWallet.data.Balances;
            const GetCurrency = yield ValApiCom.Currencies.get();
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
