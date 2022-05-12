"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiotAPIClient = void 0;
//import
const lib_1 = require("@valapi/lib");
const AccountV1_1 = require("../service/AccountV1");
const ContentV1_1 = require("../service/ContentV1");
const StatusV1_1 = require("../service/StatusV1");
const AxiosClient_1 = require("./AxiosClient");
//class
/**
 * Official Api From Riot Games
 */
class RiotAPIClient extends lib_1.CustomEvent {
    /**
     * @param {RiotAPIConfig} config Config
     */
    constructor(config) {
        super();
        if (config.region === 'data') {
            this.emit('error', { errorCode: 'RiotAPI_Config_Error', message: 'Region Not Found', data: config.region });
            config.region = 'na';
        }
        //config
        this.apiKey = config.apiKey;
        this.config = config;
        //first reload
        this.RegionServices = new lib_1.ValRegion(this.config.region).toJSON();
        this.AxiosClient = new AxiosClient_1.AxiosClient(this.config.axiosConfig);
        this.AxiosClient.on('error', ((data) => { this.emit('error', data); }));
        this.AxiosClient.on('request', ((data) => { this.emit('request', data); }));
        this.AccountV1 = new AccountV1_1.AccountV1(this.AxiosClient, this.apiKey, this.RegionServices);
        this.ContentV1 = new ContentV1_1.ContentV1(this.AxiosClient, this.apiKey, this.RegionServices);
        this.StatusV1 = new StatusV1_1.StatusV1(this.AxiosClient, this.apiKey, this.RegionServices);
        //evet
        this.emit('ready');
    }
    /**
     * @returns {void}
     */
    reload() {
        this.RegionServices = new lib_1.ValRegion(this.config.region).toJSON();
        this.AxiosClient = new AxiosClient_1.AxiosClient(this.config.axiosConfig);
        this.AxiosClient.on('error', ((data) => { this.emit('error', data); }));
        this.AxiosClient.on('request', ((data) => { this.emit('request', data); }));
        this.AccountV1 = new AccountV1_1.AccountV1(this.AxiosClient, this.apiKey, this.RegionServices);
        this.ContentV1 = new ContentV1_1.ContentV1(this.AxiosClient, this.apiKey, this.RegionServices);
        this.StatusV1 = new StatusV1_1.StatusV1(this.AxiosClient, this.apiKey, this.RegionServices);
        //event
        this.emit('ready');
    }
    // SETTINGS //
    /**
     *
     * @param {String} apiKey IP of local api
     * @returns {void}
     */
    setApiKey(apiKey) {
        this.config.apiKey = apiKey;
        this.emit('changeSettings', { name: 'API_Key', data: apiKey });
        this.reload();
    }
    /**
     *
     * @param {String} region Username
     * @returns {void}
     */
    setRegion(region = 'na') {
        this.config.region = region;
        if (region === 'data') {
            this.emit('error', { errorCode: 'RiotAPI_Config_Error', message: 'Region Not Found', data: region });
            region = 'na';
        }
        this.emit('changeSettings', { name: 'Region', data: region });
        this.reload();
    }
}
exports.RiotAPIClient = RiotAPIClient;
//# sourceMappingURL=Client.js.map