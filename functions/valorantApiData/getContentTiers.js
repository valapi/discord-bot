const axios = require('axios');

module.exports = (client) => {
    client.getContentTiers = async (uuid) => {
        var getRequest;

        if(!uuid || uuid == null || uuid == undefined || uuid == ''){
            getRequest = await client.request(`https://valorant-api.com/v1/contenttiers`);
        }else {
            getRequest = await client.request(`https://valorant-api.com/v1/contenttiers/${uuid}`);
        }

        return getRequest;
    };
}