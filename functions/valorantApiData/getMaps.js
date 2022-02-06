const axios = require('axios');

module.exports = (client) => {
    client.getMaps = async (uuid) => {
        var getRequest;

        if(!uuid || uuid == null || uuid == undefined || uuid == ''){
            getRequest = await client.request(`https://valorant-api.com/v1/maps`);
        }else {
            getRequest = await client.request(`https://valorant-api.com/v1/maps/${uuid}`);
        }

        return getRequest;
    };
}