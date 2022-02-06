const axios = require('axios');

module.exports = (client) => {
    client.getCompetitiveTiers = async (uuid) => {
        var getRequest;

        if(!uuid || uuid == null || uuid == undefined || uuid == ''){
            getRequest = await client.request(`https://valorant-api.com/v1/competitivetiers`);
        }else {
            getRequest = await client.request(`https://valorant-api.com/v1/competitivetiers/${uuid}`);
        }

        return getRequest;
    };
}