const axios = require('axios');

module.exports = (client) => {
    client.getBuddyLevel = async (uuid) => {
        var getRequest;

        if(!uuid || uuid == null || uuid == undefined || uuid == ''){
            getRequest = await client.request(`https://valorant-api.com/v1/buddies/levels`);
        }else {
            getRequest = await client.request(`https://valorant-api.com/v1/buddies/levels/${uuid}`);
        }

        return getRequest;
    };
}