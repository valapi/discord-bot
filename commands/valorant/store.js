const { SlashCommandBuilder } = require('@discordjs/builders');
const { RiotApiClient, Region } = require("valorant.js");
const valorantApiCom = require('valorant-api-com');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('store')
        .setDescription('Valorant Daily Store')
        .addStringOption(option => option.setName('privatekey').setDescription('Type Your Private Key')),

    async execute(interaction, client) {
        try {
            await interaction.reply({
                content: "Loading Message.. ",
                ephemeral: true
            });
    
            const riot_json = JSON.parse(fs.readFileSync("./data/json/account.json", "utf8"));
            const riot_api = riot_json[interaction.user.id];

            const _key = interaction.options.getString("privatekey");

            if (_key == null){
                await interaction.editReply({
                    content: `Sorry, You Must Type Your Private Key`,
                    ephemeral: true
                });
            }else{
                var _name = await client.decryptBack(riot_api.name, _key);
                var _password = await client.decryptBack(riot_api.password, _key);
                
                const riotApi = new RiotApiClient({
                    username: _name, // your username
                    password: _password, // your password
                    region: Region.AP // Available regions: EU, NA, AP
                });
    
                await riotApi.login();
    
                const accountId = riotApi.user.Subject;
    
                const store = await riotApi.storeApi.getStorefront(accountId, false);
    
                let id_1 = store.SkinsPanelLayout.SingleItemOffers[0];
                let id_2 = store.SkinsPanelLayout.SingleItemOffers[1];
                let id_3 = store.SkinsPanelLayout.SingleItemOffers[2];
                let id_4 = store.SkinsPanelLayout.SingleItemOffers[3];
    
                let shop_1 = "";
                let shop_2 = "";
                let shop_3 = "";
                let shop_4 = "";

                let valorantApi = new valorantApiCom({
                    'language': 'en-US'
                });

                let getWeapons = await valorantApi.getWeaponLevels();
    
                for (let i = 0; i < getWeapons.data.length; i++) {
                    if (getWeapons.data[i].uuid === id_1) {
                        shop_1 += getWeapons.data[i].displayName;
                    } else if (getWeapons.data[i].uuid === id_2) {
                        shop_2 += getWeapons.data[i].displayName;
                    } else if (getWeapons.data[i].uuid === id_3) {
                        shop_3 += getWeapons.data[i].displayName;
                    } else if (getWeapons.data[i].uuid === id_4) {
                        shop_4 += getWeapons.data[i].displayName;
                    }
                }
    
                await interaction.editReply({
                    content: `Slot 1: **${shop_1}**\nSlot 2: **${shop_2}**\nSlot 3: **${shop_3}**\nSlot 4: **${shop_4}**`,
                    ephemeral: true
                });
            }
        } catch (err) {
            console.error(err);
        }
    }
}