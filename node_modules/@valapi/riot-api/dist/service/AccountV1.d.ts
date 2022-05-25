import { AxiosClient, type RiotAPIAxios } from "../client/AxiosClient";
import type { ValorantAPIRegion } from "@valapi/lib";
interface RiotAPIServiceAccount {
    puuid: string;
    gameName: string;
    tagLine: string;
    [key: string]: any;
}
declare type RiotAPIServiceAccountGameList = 'val' | 'lor';
declare class AccountV1 {
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
     * @param {String} gameName In-Game Name
     * @param {String} tagLine In-Game Tag
     * @returns {Promise<RiotAPIAxios>}
     */
    ByRiotId(gameName: string, tagLine: string): Promise<RiotAPIAxios<RiotAPIServiceAccount>>;
    /**
     *
     * @param {String} puuid Player UUID
     * @returns {Promise<RiotAPIAxios>}
     */
    ByPuuid(puuid: string): Promise<RiotAPIAxios<RiotAPIServiceAccount>>;
    /**
     *
     * @param {String} puuid Player UUID
     * @param {String} game Game
     * @returns {Promise<RiotAPIAxios>}
     */
    ByGame(puuid: string, game?: RiotAPIServiceAccountGameList): Promise<RiotAPIAxios<any>>;
}
export { AccountV1 };
export type { RiotAPIServiceAccount, RiotAPIServiceAccountGameList };
//# sourceMappingURL=AccountV1.d.ts.map