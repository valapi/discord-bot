const axios = require('axios');

module.exports = (client) => {
    client.getGear = async (uuid) => {
        var getRequest;

        if(!uuid || uuid == null || uuid == undefined || uuid == ''){
            getRequest = await client.request(`https://valorant-api.com/v1/gear`);
        }else {
            getRequest = await client.request(`https://valorant-api.com/v1/gear/${uuid}`);
        }

        return getRequest;
    };
}