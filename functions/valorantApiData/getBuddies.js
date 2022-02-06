const axios = require('axios');

module.exports = (client) => {
    client.getBuddies = async (uuid) => {
        var getRequest;

        if(!uuid || uuid == null || uuid == undefined || uuid == ''){
            getRequest = await client.request(`https://valorant-api.com/v1/buddies`);
        }else {
            getRequest = await client.request(`https://valorant-api.com/v1/buddies/${uuid}`);
        }

        return getRequest;
    };
}