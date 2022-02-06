const axios = require('axios');

module.exports = (client) => {
    client.getBundles = async (uuid) => {
        var getRequest;

        if(!uuid || uuid == null || uuid == undefined || uuid == ''){
            getRequest = await client.request(`https://valorant-api.com/v1/bundles`);
        }else {
            getRequest = await client.request(`https://valorant-api.com/v1/bundles/${uuid}`);
        }

        return getRequest;
    };
}