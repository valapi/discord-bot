const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const mongoose = require(`mongoose`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('account')
        .setDescription('Valorant Account Info')
        .addStringOption(option => option.setName('privatekey').setDescription('Type Your Private Key').setRequired(true)),

    async execute(interaction, client) {
        try {
            const _key = await interaction.options.getString("privatekey");
            await client.dbLogin().then(async () => {
                var Account;
                try {
                    const valorantSchema = new mongoose.Schema({
                        username: String,
                        password: String,
                        discordId: Number
                    })

                    Account = await mongoose.model('valorants', valorantSchema);
                }catch(err) {
                    Account = await mongoose.model('valorants');
                    //script
                    const user = await Account.findOne({ discordId: await interaction.user.id });
                    if (user == null) {
                        await interaction.editReply({
                            content: `Can't Find Your Account In Database`,
                            ephemeral: true
                        });
                    } else {
                        if (_key == null) {
                            await interaction.editReply({
                                content: `Sorry, You Must Type Your Private Key`,
                                ephemeral: true
                            });
                        } else {
                            const _name = await client.decryptBack(await user.username, _key);
                            const _password = await client.decryptBack(await user.password, _key);

                            const Valorant = require('@liamcottle/valorant.js');
                            const valorantApi = new Valorant.API(Valorant.Regions.AsiaPacific);
                            valorantApi.authorize(_name, _password).then(async () => {

                                let sendReg = ``;
                                if (await valorantApi.region == 'AP'){
                                    sendReg += `Asia Pacific`;
                                }else {
                                    sendReg += `${await valorantApi.region} - Not Support`;
                                }

                                await interaction.editReply({
                                    content: `You Are Register Riot Account With \n\nUsername: **${await valorantApi.username}**\nId: **${await valorantApi.user_id}**\nRegion: **${await sendReg}**`,
                                    ephemeral: true
                                });

                            }).catch((error) => {
                                console.log(error);
                            });
                        }
                    }
                }
            });

        } catch (err) {
            console.error(err);
            await interaction.editReply({
                content: `Something Went Wrong, Please Try Again Later`,
                ephemeral: true
            });
        }
    }
}
