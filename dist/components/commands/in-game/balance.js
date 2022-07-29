"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const IngCore = tslib_1.__importStar(require("@ing3kth/core"));
const discord_js_1 = require("discord.js");
const accounts_1 = require("../../../utils/accounts");
const __command = {
    command: (new discord_js_1.SlashCommandBuilder()
        .setName('balance')
        .setDescription('Wallet')),
    category: 'valorant',
    echo: {
        data: [
            'wallet'
        ],
    },
    onlyGuild: true,
    async execute({ interaction, language, apiKey }) {
        const userId = interaction.user.id;
        const { WebClient, ValorantApiCom, isValorAccountFind } = await (0, accounts_1.ValorAccount)({
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
        const GetWallet = await WebClient.Store.GetWallet(puuid);
        const AllWallet = GetWallet.data.Balances;
        const GetCurrency = await ValorantApiCom.Currencies.get();
        const BalanceArray = [];
        if (GetCurrency.isError || !GetCurrency.data.data) {
            return;
        }
        for (const ofCurrency of GetCurrency.data.data) {
            if (!isNaN(AllWallet[ofCurrency.uuid])) {
                BalanceArray.push({
                    id: ofCurrency.uuid,
                    name: ofCurrency.displayName,
                    icon: ofCurrency.displayIcon,
                    value: Number(AllWallet[ofCurrency.uuid]),
                });
            }
        }
        const createEmbed = new discord_js_1.EmbedBuilder()
            .setThumbnail((BalanceArray.at(IngCore.Random(0, BalanceArray.length - 1)))?.icon);
        BalanceArray.forEach((item) => {
            createEmbed.addFields({ name: item.name, value: `${item.value}` });
        });
        return {
            embeds: [createEmbed],
        };
    },
};
exports.default = __command;
