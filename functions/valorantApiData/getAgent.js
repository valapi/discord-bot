const axios = require('axios');

module.exports = (client) => {
    client.getAgent = async (uuid) => {
        var getRequest;

        if(!uuid || uuid == null || uuid == undefined || uuid == ''){
            getRequest = await client.request(`https://valorant-api.com/v1/agents`);
        }else {
            getRequest = await client.request(`https://valorant-api.com/v1/agents/${uuid}`);
        }

        return getRequest;
    };
}