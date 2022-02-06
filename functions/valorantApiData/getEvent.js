const axios = require('axios');

module.exports = (client) => {
    client.getEvents = async (uuid) => {
        var getRequest;

        if(!uuid || uuid == null || uuid == undefined || uuid == ''){
            getRequest = await client.request(`https://valorant-api.com/v1/events`);
        }else {
            getRequest = await client.request(`https://valorant-api.com/v1/events/${uuid}`);
        }

        return getRequest;
    };
}