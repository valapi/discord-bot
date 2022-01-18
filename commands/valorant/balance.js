const { SlashCommandBuilder } = require('@discordjs/builders');
const { RiotApiClient, Region } = require("valorant.js");
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Check Valorant In Game Money')
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

            if (_key == null) {
                await interaction.editReply({
                    content: `Sorry, You Must Type Your Private Key`,
                    ephemeral: true
                });
            } else {
                var _name = await client.decryptBack(riot_api.name, _key);
                var _password = await client.decryptBack(riot_api.password, _key);

                const riotApi = new RiotApiClient({
                    username: _name, // your username
                    password: _password, // your password
                    region: Region.NA // Available regions: EU, NA, AP
                });

                await riotApi.login();

                const accountId = riotApi.user.Subject;

                const balance = await riotApi.storeApi.getWallet(accountId);

                let valorant_point = 0;
                let radiant_point = 0;

                for (i = 0; i < balance.length; i++) {
                    if (balance[i].name === 'Valorant Points') {
                        valorant_point += balance[i].amount;
                    } else if (balance[i].name === 'Radiant Points') {
                        radiant_point += balance[i].amount;
                    }
                };

                await interaction.editReply({
                    content: `You Are Have\n\n**${valorant_point}** Valorant Points\n**${radiant_point}** Radiant Points`,
                    ephemeral: true
                });
            }

        } catch (err) {
            console.error(err);
        }
    }
}
