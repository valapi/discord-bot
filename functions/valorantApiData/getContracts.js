const axios = require('axios');

module.exports = (client) => {
    client.getContracts = async (uuid) => {
        var getRequest;

        if(!uuid || uuid == null || uuid == undefined || uuid == ''){
            getRequest = await client.request(`https://valorant-api.com/v1/contracts`);
        }else {
            getRequest = await client.request(`https://valorant-api.com/v1/contracts/${uuid}`);
        }

        return getRequest;
    };
}