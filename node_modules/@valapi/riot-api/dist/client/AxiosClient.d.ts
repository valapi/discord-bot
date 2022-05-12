import { CustomEvent, type ValorantAPIError } from "@valapi/lib";
import { type Axios, type AxiosRequestConfig } from 'axios';
interface RiotAPIAxios<RiotAPIAxiosReturn> {
    isError: boolean;
    data: RiotAPIAxiosReturn;
}
declare type RiotAPIAxiosMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';
interface RiotAPIAxiosRequest {
    method: RiotAPIAxiosMethod;
    url: string;
    body: Object;
    config: AxiosRequestConfig;
}
declare class AxiosClient extends CustomEvent {
    axiosClient: Axios;
    /**
    * @param {AxiosRequestConfig} config Config
    */
    constructor(config?: AxiosRequestConfig);
    /**
     *
     * @param {AxiosError} error Axios Error
     * @returns
     */
    private errorHandler;
    /**
    * @param {String} url URL
    * @param {AxiosRequestConfig} config Axios Config
    * @returns {Promise<RiotAPIAxios<any>>}
    */
    get(url: string, config?: AxiosRequestConfig): Promise<RiotAPIAxios<any>>;
    /**
    * @param {String} url URL
    * @param {Object} body Body
    * @param {AxiosRequestConfig} config Axios Config
    * @returns {Promise<RiotAPIAxios<any>>}
    */
    post(url: string, body?: object, config?: AxiosRequestConfig): Promise<RiotAPIAxios<any>>;
    /**
    * @param {String} url URL
    * @param {Object} body Body
    * @param {AxiosRequestConfig} config Axios Config
    * @returns {Promise<RiotAPIAxios<any>>}
    */
    put(url: string, body?: object, config?: AxiosRequestConfig): Promise<RiotAPIAxios<any>>;
    /**
    * @param {String} url URL
    * @param {Object} body Body
    * @param {AxiosRequestConfig} config Axios Config
    * @returns {Promise<RiotAPIAxios<any>>}
    */
    patch(url: string, body?: object, config?: AxiosRequestConfig): Promise<RiotAPIAxios<any>>;
    /**
    * @param {String} url URL
    * @param {AxiosRequestConfig} config Axios Config
    * @returns {Promise<RiotAPIAxios<any>>}
    */
    delete(url: string, config?: AxiosRequestConfig): Promise<RiotAPIAxios<any>>;
}
interface RiotAPIAxiosEvent {
    'ready': () => void;
    'request': (data: RiotAPIAxiosRequest) => void;
    'error': (data: ValorantAPIError) => void;
}
declare interface AxiosClient {
    on<EventName extends keyof RiotAPIAxiosEvent>(name: EventName, callback: RiotAPIAxiosEvent[EventName]): void;
    once<EventName extends keyof RiotAPIAxiosEvent>(name: EventName, callback: RiotAPIAxiosEvent[EventName]): void;
    off<EventName extends keyof RiotAPIAxiosEvent>(name: EventName, callback?: RiotAPIAxiosEvent[EventName]): void;
}
export { AxiosClient };
export type { RiotAPIAxios, RiotAPIAxiosMethod, RiotAPIAxiosRequest, RiotAPIAxiosEvent };
//# sourceMappingURL=AxiosClient.d.ts.map