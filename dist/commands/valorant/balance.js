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
const crypto_1 = require("../../utils/crypto");
const database_1 = require("../../utils/database");
//valorant
const api_wrapper_1 = require("@valapi/api-wrapper");
const valorant_api_com_1 = require("@valapi/valorant-api.com");
const core_1 = require("@ing3kth/core");
exports.default = {
    data: new builders_1.SlashCommandBuilder()
        .setName('balance')
        .setDescription('Valorant InGame Wallet'),
    echo: {
        command: [
            'wallet'
        ],
    },
    execute({ interaction, language, apiKey, createdTime }) {
        var _a;
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
//# sourceMappingURL=balance.js.map