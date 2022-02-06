const axios = require('axios');

module.exports = (client) => {
    client.getCeremonies = async (uuid) => {
        var getRequest;

        if(!uuid || uuid == null || uuid == undefined || uuid == ''){
            getRequest = await client.request(`https://valorant-api.com/v1/ceremonies`);
        }else {
            getRequest = await client.request(`https://valorant-api.com/v1/ceremonies/${uuid}`);
        }

        return getRequest;
    };
}