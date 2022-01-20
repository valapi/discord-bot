const valorantApiCom = require('valorant-api-com');

module.exports = (client) => {
    client.updateApi = async (client) => {
        let valorantApi = new valorantApiCom({
            'language': 'en-US'
        });

        const getVersion = await valorantApi.getVersion();
        const dataArgs = await getVersion.data;
        const versionArgs = await dataArgs.branch;

        console.log(`Valorant Api Version: ${versionArgs}`);
    };
}