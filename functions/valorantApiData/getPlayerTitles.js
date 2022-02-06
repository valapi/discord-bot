const axios = require('axios');

module.exports = (client) => {
    client.getPlayerTitles = async (uuid) => {
        var getRequest;

        if(!uuid || uuid == null || uuid == undefined || uuid == ''){
            getRequest = await client.request(`https://valorant-api.com/v1/playertitles`);
        }else {
            getRequest = await client.request(`https://valorant-api.com/v1/playertitles/${uuid}`);
        }

        return getRequest;
    };
}