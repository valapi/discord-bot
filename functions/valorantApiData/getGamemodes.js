const axios = require('axios');

module.exports = (client) => {
    client.getGamemodes = async (uuid) => {
        var getRequest;

        if(!uuid || uuid == null || uuid == undefined || uuid == ''){
            getRequest = await client.request(`https://valorant-api.com/v1/gamemodes`);
        }else {
            getRequest = await client.request(`https://valorant-api.com/v1/gamemodes/${uuid}`);
        }

        return getRequest;
    };
}