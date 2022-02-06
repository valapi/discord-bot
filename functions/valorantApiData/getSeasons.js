const axios = require('axios');

module.exports = (client) => {
    client.getSeasons = async (uuid) => {
        var getRequest;

        if(!uuid || uuid == null || uuid == undefined || uuid == ''){
            getRequest = await client.request(`https://valorant-api.com/v1/seasons`);
        }else {
            getRequest = await client.request(`https://valorant-api.com/v1/seasons/${uuid}`);
        }

        return getRequest;
    };
}