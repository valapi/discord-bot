const axios = require('axios');

module.exports = (client) => {
    client.getQuestMissions = async (uuid) => {
        var getRequest;

        //BETA
        //BETA
        //BETA

        if(!uuid || uuid == null || uuid == undefined || uuid == ''){
            getRequest = await client.request(`https://valorant-api.com/v1/missions`);
        }else {
            getRequest = await client.request(`https://valorant-api.com/v1/missions/${uuid}`);
        }

        return getRequest;
    };
}