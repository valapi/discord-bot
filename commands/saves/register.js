const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const mongoose = require(`mongoose`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('Register Any Account')
        .addSubcommand(subcommand =>
            subcommand
                .setName('valorant')
                .setDescription("Add Your Valorant Account To Database")
                .addStringOption(option =>
                    option
                        .setName('username')
                        .setDescription('Type Your Riot Account Username')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName('password')
                        .setDescription('Type Your Riot Account Password')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName('privatekey')
                        .setDescription('Type Your Private Key')
                        .setRequired(true)
                ),
        ),

    async execute(interaction, client) {
        try {
            if (interaction.options.getSubcommand() === "valorant") {
                const _user = await interaction.options.getString("username");
                const _pass = await interaction.options.getString("password");
                const _key = await interaction.options.getString("privatekey");

                if (_user == null || _pass == null || _key == null) {
                    await interaction.editReply({
                        content: `Something Went Wrong, Please Try Again Later`,
                        ephemeral: true
                    });
                } else {
                    const _username = await client.encryptTo(_user, _key);
                    const _password = await client.encryptTo(_pass, _key);

                    await client.dbLogin().then(async () => {
                        // create
                        const valorantSchema = new mongoose.Schema({
                            username: String,
                            password: String,
                            discordId: Number
                        })
                        try {
                            const Account = await mongoose.model('valorants', valorantSchema);
                            await interaction.editReply({
                                content: `Something Went Wrong, Please Try Again Later`,
                                ephemeral: true
                            });
                        }catch (err){
                            const Account = await mongoose.model('valorants');
                            const user = await Account.findOne({ discordId: await interaction.user.id });
                            if (user == null) {
                                //create new
                                const findAccount = await new Account({ username: _username, password: _password, discordId: await interaction.user.id });
                                findAccount.save().then(async () => {
                                    await interaction.editReply({
                                        content: `Register Riot Account With\n\nName: **${await client.decryptBack(_username, _key)}**\nPassword: **${await client.decryptBack(_password, _key)}**`,
                                        ephemeral: true
                                    });
                                });
                            } else {
                                //delete 
                                await Account.deleteOne({ discordId: await interaction.user.id });
                                //create new
                                const findAccount = await new Account({ username: _username, password: _password, discordId: await interaction.user.id });
                                findAccount.save().then(async () => {
                                    await interaction.editReply({
                                        content: `Register Riot Account With\n\nName: **${await client.decryptBack(_username, _key)}**\nPassword: **${await client.decryptBack(_password, _key)}**`,
                                        ephemeral: true
                                    });
                                });
                            }
                        }

                    });
                }
            }
        } catch (err) {
            console.error(err);
            await interaction.editReply({
                content: `Something Went Wrong, Please Try Again Later`,
                ephemeral: true
            });
        }
    }
}