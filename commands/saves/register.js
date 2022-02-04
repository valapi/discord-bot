const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const mongoose = require(`mongoose`);
const { MessageAttachment, MessageEmbed } = require('discord.js');

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
                ),
        ),

    async execute(interaction, client, createdTime) {
        try {
            if (interaction.options.getSubcommand() === "valorant") {
                const _user = await interaction.options.getString("username");
                const _pass = await interaction.options.getString("password");
                var _key = await interaction.options.getString("privatekey");

                if (_user == null || _pass == null) {
                    await interaction.editReply({
                        content: `Something Went Wrong, Please Try Again Later`,
                        ephemeral: true
                    });
                } else {
                    const Valorant = require('@liamcottle/valorant.js');
                    const valorantApi = new Valorant.API(Valorant.Regions.AsiaPacific);

                    valorantApi.authorize(_user, _pass).then(async () => {
                        if (_key == null) {
                            //try to find key in database
                            var tryToFindKey;
                            try {
                                const keySchema = new mongoose.Schema({
                                    key: String,
                                    discordId: Number
                                })
    
                                tryToFindKey = await mongoose.model('keys', keySchema);
                            } catch (err) {
                                tryToFindKey = await mongoose.model('keys');
                            }
                            getKeyUser = await tryToFindKey.findOne({ discordId: await interaction.user.id });
                            if (getKeyUser || getKeyUser != null || getKeyUser != undefined) {
                                _key = await getKeyUser.key;
                            }
                        }
                        
                        if (_key == null) {
                            await interaction.editReply({
                                content: `Sorry, You Must Type Your Private Key`,
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

                                var Account;
                                try {
                                    Account = await mongoose.model('valorants', valorantSchema);
                                } catch (err) {
                                    Account = await mongoose.model('valorants');
                                }
                                const user = await Account.findOne({ discordId: await interaction.user.id });
                                if (user == null) {
                                    //create new
                                    const findAccount = await new Account({ username: _username, password: _password, discordId: await interaction.user.id });
                                    findAccount.save().then(async () => {
                                        const createEmbed = new MessageEmbed()
                                            .setColor(`#0099ff`)
                                            .setTitle(`/${await interaction.commandName}`)
                                            .setURL(`https://ingkth.wordpress.com`)
                                            .setAuthor({ name: `${await client.user.tag}`, iconURL: await client.user.displayAvatarURL(), url: `https://ingkth.wordpress.com` })
                                            .setDescription(`Name: **${await client.decryptBack(_username, _key)}**\nPassword: **${await client.decryptBack(_password, _key)}**\nPrivate Key: **${_key}**`)
                                            .setTimestamp(createdTime)
                                            .setFooter({ text: `${await interaction.user.username}#${await interaction.user.discriminator}` });

                                        await interaction.editReply({
                                            content: `Register Riot Account With`,
                                            embeds: [createEmbed],
                                            ephemeral: true
                                        });
                                    });
                                } else {
                                    //delete 
                                    await Account.deleteOne({ discordId: await interaction.user.id });
                                    //create new
                                    const findAccount = await new Account({ username: _username, password: _password, discordId: await interaction.user.id });
                                    findAccount.save().then(async () => {
                                        const createEmbed = new MessageEmbed()
                                            .setColor(`#0099ff`)
                                            .setTitle(`/${await interaction.commandName}`)
                                            .setURL(`https://ingkth.wordpress.com`)
                                            .setAuthor({ name: `${await client.user.tag}`, iconURL: await client.user.displayAvatarURL(), url: `https://ingkth.wordpress.com` })
                                            .setDescription(`Name: **${await client.decryptBack(_username, _key)}**\nPassword: **${await client.decryptBack(_password, _key)}**\nPrivate Key: **${_key}**`)
                                            .setTimestamp(createdTime)
                                            .setFooter({ text: `${await interaction.user.username}#${await interaction.user.discriminator}` });

                                        await interaction.editReply({
                                            content: `Register Riot Account With`,
                                            embeds: [createEmbed],
                                            ephemeral: true
                                        });
                                    });
                                }
                            });
                        }
                    }).catch(async (error) => {
                        await interaction.editReply({
                            content: `**Username or Password Is Wrong,**\nSomething Went Wrong, Please Try Again Later`,
                            ephemeral: true
                        });
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