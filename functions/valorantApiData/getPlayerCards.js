const axios = require('axios');

module.exports = (client) => {
    client.getPlayerCards = async (uuid) => {
        var getRequest;

        if(!uuid || uuid == null || uuid == undefined || uuid == ''){
            getRequest = await client.request(`https://valorant-api.com/v1/playercards`);
        }else {
            getRequest = await client.request(`https://valorant-api.com/v1/playercards/${uuid}`);
        }

        return getRequest;
    };
}