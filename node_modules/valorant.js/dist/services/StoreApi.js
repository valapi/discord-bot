"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreApi = void 0;
const Request_1 = require("../Request");
const Currency_1 = __importDefault(require("../resources/Currency"));
const StoreParser_1 = require("../helpers/StoreParser");
const IStoreOffers_1 = require("../models/IStoreOffers");
class StoreApi {
    constructor(client) {
        this._client = client;
    }
    /**
     * - Gets the users wallet (valorant points etc.)
     * @param accountId Account to get the wallet for
     */
    async getWallet(accountId) {
        const currencies = [];
        const walletReq = new Request_1.RequestBuilder()
            .setMethod("GET")
            .setUrl(this._client.region.BaseUrl + "/store/v1/wallet/" + accountId)
            .build();
        const walletRes = (await this._client.http.sendRequest(walletReq)).data;
        const walletMap = new Map(Object.entries(walletRes.Balances));
        walletMap.forEach((v, k) => {
            currencies.push({
                id: k,
                name: Currency_1.default[k] || "Unknown. Please contact the library developer.",
                amount: v
            });
        });
        return currencies;
    }
    /**
     * - Gets the storefront
     * @param accountId Account to get storefront for
     * @param parse Wether to parse the shop or not
     */
    async getStorefront(accountId, parse) {
        const storeReq = new Request_1.RequestBuilder()
            .setUrl(this._client.region.BaseUrl + "/store/v2/storefront/" + accountId)
            .setMethod("GET")
            .build();
        const storeRes = (await this._client.http.sendRequest(storeReq)).data;
        if (!parse)
            return storeRes;
        const content = await this._client.contentApi.getContent();
        const offers = await this.getStoreOffers();
        const parser = new StoreParser_1.StoreParser(storeRes, content, offers.Offers);
        return parser.parse();
    }
    /**
     * - Gets the store offers
     */
    async getStoreOffers() {
        const storeReq = new Request_1.RequestBuilder()
            .setUrl(this._client.region.BaseUrl + "/store/v1/offers")
            .setMethod("GET")
            .build();
        return new IStoreOffers_1.IStoreOffers((await this._client.http.sendRequest(storeReq)).data);
    }
}
exports.StoreApi = StoreApi;
//# sourceMappingURL=StoreApi.js.map