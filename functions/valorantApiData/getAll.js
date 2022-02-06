const axios = require('axios');

module.exports = (client) => {
    client.getAll = async (api_key) => {
        var getRequest;

        getRequest = await client.request(`https://ap.api.riotgames.com/val/content/v1/contents?locale=en-US&api_key=${await api_key}`);

        return getRequest;
    };
}