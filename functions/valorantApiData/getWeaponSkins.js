const axios = require('axios');

module.exports = (client) => {
    client.getWeaponSkins = async (uuid) => {
        var getRequest;

        if(!uuid || uuid == null || uuid == undefined || uuid == ''){
            getRequest = await client.request(`https://valorant-api.com/v1/weapons/skins`);
        }else {
            getRequest = await client.request(`https://valorant-api.com/v1/weapons/skins/${uuid}`);
        }

        return getRequest;
    };
}