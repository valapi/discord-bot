const axios = require('axios');

module.exports = (client) => {
    client.getGamemodeEquippables = async (uuid) => {
        var getRequest;

        if(!uuid || uuid == null || uuid == undefined || uuid == ''){
            getRequest = await client.request(`https://valorant-api.com/v1/gamemodes/equippables`);
        }else {
            getRequest = await client.request(`https://valorant-api.com/v1/gamemodes/equippables/${uuid}`);
        }

        return getRequest;
    };
}