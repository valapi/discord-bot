const axios = require('axios');

module.exports = (client) => {
    client.getWeaponSkinChromas = async (uuid) => {
        var getRequest;

        if(!uuid || uuid == null || uuid == undefined || uuid == ''){
            getRequest = await client.request(`https://valorant-api.com/v1/weapons/skinchromas`);
        }else {
            getRequest = await client.request(`https://valorant-api.com/v1/weapons/skinchromas/${uuid}`);
        }

        return getRequest;
    };
}