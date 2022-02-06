const axios = require('axios');

module.exports = (client) => {
    client.getWeaponSkinLevels = async (uuid) => {
        var getRequest;

        if(!uuid || uuid == null || uuid == undefined || uuid == ''){
            getRequest = await client.request(`https://valorant-api.com/v1/weapons/skinlevels`);
        }else {
            getRequest = await client.request(`https://valorant-api.com/v1/weapons/skinlevels/${uuid}`);
        }

        return getRequest;
    };
}