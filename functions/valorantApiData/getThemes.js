const axios = require('axios');

module.exports = (client) => {
    client.getThemes = async (uuid) => {
        var getRequest;

        if(!uuid || uuid == null || uuid == undefined || uuid == ''){
            getRequest = await client.request(`https://valorant-api.com/v1/themes`);
        }else {
            getRequest = await client.request(`https://valorant-api.com/v1/themes/${uuid}`);
        }

        return getRequest;
    };
}