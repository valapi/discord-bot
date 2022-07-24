"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValorAccount = void 0;
const tslib_1 = require("tslib");
const IngCore = tslib_1.__importStar(require("@ing3kth/core"));
const crypto_1 = require("./crypto");
const database_1 = require("./database");
const web_client_1 = require("@valapi/web-client");
const valorant_api_com_1 = require("@valapi/valorant-api.com");
function ValorAccount(config) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const MyValorantApiCom = new valorant_api_com_1.Client({
            language: config.language || 'en-US',
        });
        const _cache = new IngCore.Cache('accounts');
        const _save = yield _cache.output(config.userId);
        if (!_save) {
            const ValDatabase = yield (0, database_1.ValorDatabase)({
                name: 'account',
                schema: database_1.ValorInterface.Account.Schema,
                filter: { discordId: config.userId },
            });
            if (ValDatabase.isFind === true) {
                if (ValDatabase.data[1]) {
                    const _OnlyOne = ValDatabase.data[0];
                    yield ValDatabase.model.deleteMany({ discordId: config.userId });
                    yield (new ValDatabase.model({
                        account: _OnlyOne,
                        discordId: config.userId,
                        createdAt: ValDatabase.data[0].createdAt,
                    })).save();
                }
                const MyWebClient = yield web_client_1.Client.fromCookie((0, crypto_1.decrypt)(ValDatabase.data[0].account, config.apiKey), { region: config.region || "ap" });
                _cache.input((0, crypto_1.encrypt)(JSON.stringify(MyWebClient.toJSON()), config.apiKey), config.userId);
                return {
                    isValorAccountFind: true,
                    ValorantApiCom: MyValorantApiCom,
                    WebClient: MyWebClient,
                };
            }
            else {
                return {
                    isValorAccountFind: false,
                    ValorantApiCom: MyValorantApiCom,
                    WebClient: new web_client_1.Client({ region: config.region || "ap" }),
                };
            }
        }
        else {
            const MyWebClient = web_client_1.Client.fromJSON(JSON.parse((0, crypto_1.decrypt)(_save, config.apiKey)), { region: config.region || "ap" });
            yield MyWebClient.refresh(false);
            return {
                isValorAccountFind: true,
                ValorantApiCom: MyValorantApiCom,
                WebClient: MyWebClient,
            };
        }
    });
}
exports.ValorAccount = ValorAccount;
