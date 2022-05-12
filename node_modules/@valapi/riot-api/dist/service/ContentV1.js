"use strict";
//import
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
exports.ContentV1 = void 0;
const lib_1 = require("@valapi/lib");
//class
class ContentV1 {
    /**
     *
     * @param AxiosClient Axios Client
     * @param apiKey API Key
     * @param Region Region Service
     */
    constructor(AxiosClient, apiKey, Region) {
        this.apiKey = apiKey;
        this.region = Region;
        this.AxiosClient = AxiosClient;
    }
    /**
     *
     * @param {String} locale Locale
     * @returns {Promise<RiotAPIAxios>}
     */
    Contents(locale = 'English_United_States') {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.AxiosClient.get(this.region.riot.server + `/val/content/v1/contents?locale=${lib_1.Locale.data[locale]}` + `&api_key=${this.apiKey}`);
        });
    }
}
exports.ContentV1 = ContentV1;
//# sourceMappingURL=ContentV1.js.map