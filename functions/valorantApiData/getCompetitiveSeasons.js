const axios = require('axios');

module.exports = (client) => {
    client.getCompetitiveSeasons = async (uuid) => {
        var getRequest;

        if(!uuid || uuid == null || uuid == undefined || uuid == ''){
            getRequest = await client.request(`https://valorant-api.com/v1/seasons/competitive`);
        }else {
            getRequest = await client.request(`https://valorant-api.com/v1/seasons/competitive/${uuid}`);
        }

        return getRequest;
    };
}