const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const mongoose = require(`mongoose`);
const { MessageAttachment, MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('key')
        .setDescription('NOT RECOMMENDED - Save Your Private Key In Database')
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription("Add Your Private Key To Database")
                .addStringOption(option => option.setName('privatekey').setDescription('Type Your Private Key').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('get')
                .setDescription("Get Your Private Key.")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription("Remove Your Private Key From Database.")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('new')
                .setDescription("Create New Private Key")
        ),

    async execute(interaction, client, createdTime) {
        try {
            if (interaction.options.getSubcommand() === "add") {
                const _key = await interaction.options.getString("privatekey");
                if (_key == null) {
                    await interaction.editReply({
                        content: `Something Went Wrong, Please Try Again Later`,
                        ephemeral: true
                    });
                } else {
                    await client.dbLogin().then(async () => {
                        var Account;
                        try {
                            const keySchema = new mongoose.Schema({
                                key: String,
                                discordId: Number
                            })

                            Account = await mongoose.model('keys', keySchema);
                        } catch (err) {
                            Account = await mongoose.model('keys');
                        }
                        //script
                        const user = await Account.findOne({ discordId: await interaction.user.id });
                        if (user == null) {
                            //create new
                            const findAccount = await new Account({ key: _key, discordId: await interaction.user.id });

                            const createEmbed = new MessageEmbed()
                                .setColor(`#0099ff`)
                                .setTitle(`/${await interaction.commandName} ${await interaction.options.getSubcommand()}`)
                                .setURL(`https://ingkth.wordpress.com`)
                                .setAuthor({ name: `${await client.user.tag}`, iconURL: await client.user.displayAvatarURL(), url: `https://ingkth.wordpress.com` })
                                .setDescription(`**${await _key}**`)
                                .setTimestamp(createdTime)
                                .setFooter({ text: `${await interaction.user.username}#${await interaction.user.discriminator}` });

                            findAccount.save().then(async () => {
                                await interaction.editReply({
                                    content: `Save Your Private Key In Database, \n__**Hacker Can Use Your Private Key To Get Username And Password From Database**__`,
                                    embeds: [createEmbed],
                                    ephemeral: true
                                });
                            });
                        } else {
                            //delete 
                            await Account.deleteOne({ discordId: await interaction.user.id });
                            //create new
                            const findAccount = await new Account({ key: _key, discordId: await interaction.user.id });

                            const createEmbed = new MessageEmbed()
                                .setColor(`#0099ff`)
                                .setTitle(`/${await interaction.commandName} ${await interaction.options.getSubcommand()}`)
                                .setURL(`https://ingkth.wordpress.com`)
                                .setAuthor({ name: `${await client.user.tag}`, iconURL: await client.user.displayAvatarURL(), url: `https://ingkth.wordpress.com` })
                                .setDescription(`**${await _key}**`)
                                .setTimestamp(createdTime)
                                .setFooter({ text: `${await interaction.user.username}#${await interaction.user.discriminator}` });

                            findAccount.save().then(async () => {
                                await interaction.editReply({
                                    content: `Save Your Private Key In Database, \n__**Hacker Can Use Your Private Key To Get Username And Password From Database**__`,
                                    embeds: [createEmbed],
                                    ephemeral: true
                                });
                            });
                        }
                    });
                }

            } else if (interaction.options.getSubcommand() === "get") {
                await client.dbLogin().then(async () => {
                    var Account;
                    try {
                        const keySchema = new mongoose.Schema({
                            key: String,
                            discordId: Number
                        })

                        Account = await mongoose.model('keys', keySchema);
                    } catch (err) {
                        Account = await mongoose.model('keys');
                    }
                    //script
                    const user = await Account.findOne({ discordId: await interaction.user.id });
                    if (user == null) {
                        await interaction.editReply({
                            content: `Can't Find Your Private Key In Database`,
                            ephemeral: true
                        });
                    } else {
                        const createEmbed = new MessageEmbed()
                            .setColor(`#0099ff`)
                            .setTitle(`/${await interaction.commandName} ${await interaction.options.getSubcommand()}`)
                            .setURL(`https://ingkth.wordpress.com`)
                            .setAuthor({ name: `${await client.user.tag}`, iconURL: await client.user.displayAvatarURL(), url: `https://ingkth.wordpress.com` })
                            .setDescription(`**${await user.key}**`)
                            .setTimestamp(createdTime)
                            .setFooter({ text: `${await interaction.user.username}#${await interaction.user.discriminator}` });

                        await interaction.editReply({
                            content: `__**Hacker Can Use Your Private Key To Get Username And Password From Database**__`,
                            embeds: [createEmbed],
                            ephemeral: true
                        });
                    }
                });
            } else if (interaction.options.getSubcommand() === "remove") {
                await client.dbLogin().then(async () => {
                    var Account;
                    try {
                        const keySchema = new mongoose.Schema({
                            key: String,
                            discordId: Number
                        })

                        Account = await mongoose.model('keys', keySchema);
                    } catch (err) {
                        Account = await mongoose.model('keys');
                    }
                    //script
                    const user = await Account.findOne({ discordId: await interaction.user.id });
                    if (user == null) {
                        await interaction.editReply({
                            content: `Can't Find Your Private Key In Database`,
                            ephemeral: true
                        });
                    } else {
                        const createEmbed = new MessageEmbed()
                            .setColor(`#0099ff`)
                            .setTitle(`/${await interaction.commandName} ${await interaction.options.getSubcommand()}`)
                            .setURL(`https://ingkth.wordpress.com`)
                            .setAuthor({ name: `${await client.user.tag}`, iconURL: await client.user.displayAvatarURL(), url: `https://ingkth.wordpress.com` })
                            .setDescription(`**${await user.key}**`)
                            .setTimestamp(createdTime)
                            .setFooter({ text: `${await interaction.user.username}#${await interaction.user.discriminator}` });

                        await interaction.editReply({
                            content: `Delete Your Private Key From Database.`,
                            embeds: [createEmbed],
                            ephemeral: true
                        });

                        await Account.deleteOne({ discordId: await interaction.user.id });
                    }

                });
            } else if (interaction.options.getSubcommand() === "new") {
                var _key = await client.createSalt();

                const createEmbed = new MessageEmbed()
                    .setColor(`#0099ff`)
                    .setTitle(`/${await interaction.commandName} ${await interaction.options.getSubcommand()}`)
                    .setURL(`https://ingkth.wordpress.com`)
                    .setAuthor({ name: `${await client.user.tag}`, iconURL: await client.user.displayAvatarURL(), url: `https://ingkth.wordpress.com` })
                    .setDescription(`**${await _key}**`)
                    .setTimestamp(createdTime)
                    .setFooter({ text: `${await interaction.user.username}#${await interaction.user.discriminator}` });

                await interaction.editReply({
                    content: `**" Keep It Secret "**\nAnd Saving Private Key At The Safest Spot !!!`,
                    embeds: [createEmbed],
                    ephemeral: true
                });
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