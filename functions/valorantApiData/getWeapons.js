const axios = require('axios');

module.exports = (client) => {
    client.getWeapons = async (uuid) => {
        var getRequest;

        if(!uuid || uuid == null || uuid == undefined || uuid == ''){
            getRequest = await client.request(`https://valorant-api.com/v1/weapons`);
        }else {
            getRequest = await client.request(`https://valorant-api.com/v1/weapons/${uuid}`);
        }

        return getRequest;
    };
}