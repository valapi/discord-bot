"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const crypto_1 = require("./crypto");
const IngCore = tslib_1.__importStar(require("@ing3kth/core"));
const database_1 = require("./database");
const web_client_1 = require("@valapi/web-client");
const valorant_api_com_1 = require("@valapi/valorant-api.com");
function ValAccount(data) {
    var _a;
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const ValApiCom = new valorant_api_com_1.Client({
            language: (((_a = data.language) === null || _a === void 0 ? void 0 : _a.name) || 'en_US').replace('_', '-'),
        });
        const _cache = new IngCore.Cache('accounts');
        const _save = yield _cache.output(data.userId);
        if (!_save) {
            const ValDatabase = yield database_1.ValData.checkCollection({
                name: 'account',
                schema: database_1.ValorantSchema,
                filter: { discordId: data.userId },
            });
            if (ValDatabase.isFind === true) {
                if (ValDatabase.data[1]) {
                    const _OnlyOne = ValDatabase.data[0];
                    yield ValDatabase.model.deleteMany({ discordId: data.userId });
                    yield new ValDatabase.model({
                        account: _OnlyOne,
                        discordId: data.userId,
                        createdAt: new Date(),
                    }).save();
                }
                const ValClient = yield web_client_1.Client.fromCookie((0, crypto_1.decrypt)(ValDatabase.data[0].account, data.apiKey), { region: data.region || "ap" });
                yield _cache.input((0, crypto_1.encrypt)(JSON.stringify(ValClient.toJSON()), data.apiKey), data.userId);
                return {
                    __isFind: true,
                    ValApiCom,
                    ValClient,
                };
            }
            else {
                return {
                    __isFind: false,
                    ValApiCom,
                    ValClient: new web_client_1.Client({ region: data.region || "ap" }),
                };
            }
        }
        else {
            const ValClient = web_client_1.Client.fromJSON(JSON.parse((0, crypto_1.decrypt)(_save, data.apiKey)), { region: data.region || "ap" });
            yield ValClient.refresh(false);
            return {
                __isFind: true,
                ValApiCom,
                ValClient,
            };
        }
    });
}
exports.default = ValAccount;
