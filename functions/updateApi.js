const valorantApiCom = require('valorant-api-com');
const { RiotApiClient, Region } = require("valorant.js");
const fs = require('fs');

module.exports = (client) => {
    client.updateApi = async (client) => {
        while (true) {
            const nowTime = `${new Date().getHours()}${new Date().getMinutes()}${new Date().getSeconds()}`;

            if (nowTime === "02459") {
                //get version of api
                let valorantApi = new valorantApiCom({
                    'language': 'en-US'
                });

                const getVersion = await valorantApi.getVersion();
                const dataArgs = await getVersion.data;
                const versionArgs = await dataArgs.branch;

                console.log(`Valorant Api Version: ${versionArgs}`);

                //send message to all need skin person
                var need_json = await JSON.parse(fs.readFileSync("./data/json/need.json", "utf8"));
                var need_account = await JSON.parse(fs.readFileSync("./data/json/account.json", "utf8"));

                for (let i = 0; i < need_json.discord.length; i++) {
                    let discordId = await need_json.discord[i]
                    let skinName = await need_json.name[i]
                    let skinId = await need_json.id[i]
                    let channelId = await need_json.channel[i]

                    var summon_key = await JSON.parse(fs.readFileSync("./data/json/key.json", "utf8"));
                    var _key = summon_key[discordId].key

                    let account = await need_account[discordId]

                    var _name = await client.decryptBack(account.name, _key);
                    var _password = await client.decryptBack(account.password, _key);

                    const riotApi = new RiotApiClient({
                        username: _name, // your username
                        password: _password, // your password
                        region: Region.NA // Available regions: EU, NA, AP
                    });

                    await riotApi.login();

                    const accountId = riotApi.user.Subject;

                    const store = await riotApi.storeApi.getStorefront(accountId, false);

                    for (let l = 0; l < store.SkinsPanelLayout.SingleItemOffers.length; l++) {
                        if (store.SkinsPanelLayout.SingleItemOffers[l] == skinId) {
                            const gasGas = `----------------------------------------------------`;

                            await client.channels.cache.get(channelId).send(`${gasGas}\n\n<@${discordId}>\nFind __**${skinName}**__ in Valorant Store!\n\n${gasGas}`);

                        }
                    }
                }

                await new Promise(resolve => setTimeout(resolve, 82800000));
            }

            await new Promise(resolve => setTimeout(resolve, 750));
        }

    };
}