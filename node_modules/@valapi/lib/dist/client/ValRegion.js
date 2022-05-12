"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValRegion = void 0;
//import
const Region_1 = __importDefault(require("../resources/Region"));
//class
class ValRegion {
    /**
    * @param {String} region Region
    * @returns {IValRegion}
    */
    constructor(region = 'na') {
        this.base = region;
        if (!Region_1.default[region] || region === 'data') {
            throw new Error(`Region '${String(this.base)}' not found`);
        }
        switch (region) {
            case 'na':
                this.region = 'na';
                this.server = 'na';
                this.riotRegion = 'americas';
                break;
            case 'latam':
                this.region = 'latam';
                this.server = 'na';
                this.riotRegion = 'americas';
                break;
            case 'br':
                this.region = 'br';
                this.server = 'na';
                this.riotRegion = 'americas';
                break;
            case 'pbe':
                this.region = 'na';
                this.server = 'pbe';
                this.riotRegion = 'pbe1';
                break;
            case 'eu':
                this.region = 'eu';
                this.server = 'eu';
                this.riotRegion = 'europe';
                break;
            case 'kr':
                this.region = 'kr';
                this.server = 'kr';
                this.riotRegion = 'asia';
                break;
            case 'ap':
                this.region = 'ap';
                this.server = 'ap';
                this.riotRegion = 'asia';
                break;
            default:
                return new ValRegion('na');
        }
    }
    /**
     *
     * @returns {ValorantAPIRegion}
     */
    toJSON() {
        return {
            data: {
                base: this.base,
                api: this.region,
                server: this.server,
                riot: this.riotRegion,
            },
            url: {
                playerData: `https://pd.${this.server}.a.pvp.net`,
                partyService: `https://glz-${this.region}-1.${this.server}.a.pvp.net`,
                sharedData: `https://shared.${this.server}.a.pvp.net`,
            },
            riot: {
                api: `https://${this.riotRegion}.api.riotgames.com`,
                esports: `https://esports.api.riotgames.com`,
                server: `https://${this.region}.api.riotgames.com`,
            }
        };
    }
    /**
     * @param {String} region Region
     * @returns {String}
     */
    static toString(region) {
        return Region_1.default.data[region];
    }
    /**
     * @param {String} region Region
     * @returns {ValorantAPIRegion}
     */
    static fromString(region) {
        const _region = new ValRegion(ValRegion.toString(region));
        return _region.toJSON();
    }
}
exports.ValRegion = ValRegion;
//# sourceMappingURL=ValRegion.js.map