const axios = require('axios');

module.exports = (client) => {
    client.getCurrencies = async (uuid) => {
        var getRequest;

        if(!uuid || uuid == null || uuid == undefined || uuid == ''){
            getRequest = await client.request(`https://valorant-api.com/v1/currencies`);
        }else {
            getRequest = await client.request(`https://valorant-api.com/v1/currencies/${uuid}`);
        }

        return getRequest;
    };
}