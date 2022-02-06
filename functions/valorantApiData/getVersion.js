const axios = require('axios');

module.exports = (client) => {
    client.getVersion = async () => {
        var getRequest;

        getRequest = await client.request(`https://valorant-api.com/v1/version`);

        return getRequest;
    };
}