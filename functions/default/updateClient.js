const fs = require('fs');
const mongoose = require(`mongoose`);

module.exports = (client) => {
    client.updateClient = async (client) => {

        // valorant api

        const getVersion = await client.getVersion();
        const dataArgs = await getVersion.data;
        const versionArgs = await dataArgs.branch;

        console.log(`Valorant Api Version: ${versionArgs}`);

        //status
        try {
            const getStatus = await client.getStatus(new Date());
            console.log(getStatus);
        }catch (err){
            console.log(err);
        }
    };
}