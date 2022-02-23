const axios = require('axios');

module.exports = (client) => {
    client.getQuestObjectives = async (uuid) => {
        var getRequest;

        //BETA
        //BETA
        //BETA

        if(!uuid || uuid == null || uuid == undefined || uuid == ''){
            getRequest = await client.request(`https://valorant-api.com/v1/objectives`);
        }else {
            getRequest = await client.request(`https://valorant-api.com/v1/objectives/${uuid}`);
        }

        return getRequest;
    };
}