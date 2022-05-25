import { CustomEvent, Region as _Region, type ValorantAPIError } from '@valapi/lib';
import type { AxiosRequestConfig } from 'axios';
import { AccountV1 } from '../service/AccountV1';
import { ContentV1 } from '../service/ContentV1';
import { StatusV1 } from '../service/StatusV1';
import { type RiotAPIAxiosRequest } from "./AxiosClient";
interface RiotAPIConfig {
    apiKey: string;
    region: keyof typeof _Region;
    axiosConfig?: AxiosRequestConfig;
}
/**
 * Official Api From Riot Games
 */
declare class RiotAPIClient extends CustomEvent {
    protected config: RiotAPIConfig;
    protected apiKey: string;
    private RegionServices;
    private AxiosClient;
    AccountV1: AccountV1;
    ContentV1: ContentV1;
    StatusV1: StatusV1;
    /**
     * @param {RiotAPIConfig} config Config
     */
    constructor(config: RiotAPIConfig);
    /**
     * @returns {void}
     */
    private reload;
    /**
     *
     * @param {String} apiKey IP of local api
     * @returns {void}
     */
    setApiKey(apiKey: string): void;
    /**
     *
     * @param {String} region Username
     * @returns {void}
     */
    setRegion(region?: keyof typeof _Region): void;
}
interface RiotAPIClientEvent {
    'ready': () => void;
    'request': (data: RiotAPIAxiosRequest) => void;
    'changeSettings': (data: {
        name: string;
        data: any;
    }) => void;
    'error': (data: ValorantAPIError) => void;
}
declare interface RiotAPIClient {
    emit<EventName extends keyof RiotAPIClientEvent>(name: EventName, ...args: Parameters<RiotAPIClientEvent[EventName]>): void;
    on<EventName extends keyof RiotAPIClientEvent>(name: EventName, callback: RiotAPIClientEvent[EventName]): void;
    once<EventName extends keyof RiotAPIClientEvent>(name: EventName, callback: RiotAPIClientEvent[EventName]): void;
    off<EventName extends keyof RiotAPIClientEvent>(name: EventName, callback?: RiotAPIClientEvent[EventName]): void;
}
export { RiotAPIClient };
export type { RiotAPIConfig, RiotAPIClientEvent };
//# sourceMappingURL=Client.d.ts.map