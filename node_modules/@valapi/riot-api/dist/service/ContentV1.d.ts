import { AxiosClient, type RiotAPIAxios } from "../client/AxiosClient";
import { type ValorantAPIRegion, Locale as _Locale } from "@valapi/lib";
interface RiotAPIServiceContentAct {
    name: string;
    localizedNames?: string;
    id: string;
    isActive: boolean;
    [key: string]: any;
}
interface RiotAPIServiceContentItem {
    name: string;
    localizedNames?: string;
    id: string;
    assetName: string;
    assetPath?: string;
    [key: string]: any;
}
interface RiotAPIServiceContent {
    version: string;
    characters: Array<RiotAPIServiceContentItem>;
    maps: Array<RiotAPIServiceContentItem>;
    chromas: Array<RiotAPIServiceContentItem>;
    skins: Array<RiotAPIServiceContentItem>;
    skinLevels: Array<RiotAPIServiceContentItem>;
    equips: Array<RiotAPIServiceContentItem>;
    gameModes: Array<RiotAPIServiceContentItem>;
    sprays: Array<RiotAPIServiceContentItem>;
    sprayLevels: Array<RiotAPIServiceContentItem>;
    charms: Array<RiotAPIServiceContentItem>;
    charmLevels: Array<RiotAPIServiceContentItem>;
    playerCards: Array<RiotAPIServiceContentItem>;
    playerTitles: Array<RiotAPIServiceContentItem>;
    acts: Array<RiotAPIServiceContentAct>;
    [key: string]: any;
}
declare class ContentV1 {
    private apiKey;
    private region;
    private AxiosClient;
    /**
     *
     * @param AxiosClient Axios Client
     * @param apiKey API Key
     * @param Region Region Service
     */
    constructor(AxiosClient: AxiosClient, apiKey: string, Region: ValorantAPIRegion);
    /**
     *
     * @param {String} locale Locale
     * @returns {Promise<RiotAPIAxios>}
     */
    Contents(locale?: keyof typeof _Locale.data): Promise<RiotAPIAxios<RiotAPIServiceContent>>;
}
export { ContentV1 };
export type { RiotAPIServiceContent, RiotAPIServiceContentItem, RiotAPIServiceContentAct };
//# sourceMappingURL=ContentV1.d.ts.map