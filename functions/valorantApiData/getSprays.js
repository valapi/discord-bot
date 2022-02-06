const axios = require('axios');

module.exports = (client) => {
    client.getSprays = async (uuid) => {
        var getRequest;

        if(!uuid || uuid == null || uuid == undefined || uuid == ''){
            getRequest = await client.request(`https://valorant-api.com/v1/sprays`);
        }else {
            getRequest = await client.request(`https://valorant-api.com/v1/sprays/${uuid}`);
        }

        return getRequest;
    };
}