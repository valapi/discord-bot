const { SlashCommandBuilder } = require('@discordjs/builders');
const { RiotApiClient, Region } = require("valorant.js");
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('account')
        .setDescription('Valorant Account Info')
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
                    region: Region.AP // Available regions: EU, NA, AP
                });

                await riotApi.login();

                const name = riotApi.user.GameName
                const tag = riotApi.user.TagLine

                await interaction.editReply({
                    content: `You Are Register Riot Account With \n\nName: **${name}**\nTag: **${tag}**`,
                    ephemeral: true
                });
            }

        } catch (err) {
            console.error(err);
        }
    }
}
