const axios = require('axios');

module.exports = (client) => {
    client.getSprayLevels = async (uuid) => {
        var getRequest;

        if(!uuid || uuid == null || uuid == undefined || uuid == ''){
            getRequest = await client.request(`https://valorant-api.com/v1/sprays/levels`);
        }else {
            getRequest = await client.request(`https://valorant-api.com/v1/sprays/levels/${uuid}`);
        }

        return getRequest;
    };
}