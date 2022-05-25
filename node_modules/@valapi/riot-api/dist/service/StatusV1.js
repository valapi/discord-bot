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
exports.StatusV1 = void 0;
//class
class StatusV1 {
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
     * @returns {Promise<RiotAPIAxios>}
     */
    PlatformData() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.AxiosClient.get(this.region.riot.server + `/val/status/v1/platform-data` + `?api_key=${this.apiKey}`);
        });
    }
}
exports.StatusV1 = StatusV1;
//# sourceMappingURL=StatusV1.js.map