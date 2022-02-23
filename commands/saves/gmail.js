const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const mongoose = require(`mongoose`);
const { MessageAttachment, MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gmail')
        .setDescription('Manage Gmail Account')
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription("Add Gmail Account")
                .addStringOption(option =>
                    option
                        .setName('mail')
                        .setDescription('Type Your Mail')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('verify')
                .setDescription("Verify Gmail Account")
                .addStringOption(option =>
                    option
                        .setName('code')
                        .setDescription('Type Verify Code')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('get')
                .setDescription("Get Your Gmail Account")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription("Remove Gmail Account")
        ),

    async execute(interaction, client, createdTime) {
        try {
            if (interaction.options.getSubcommand() === "add") {
                const _gmail = await interaction.options.getString("mail");

                if (_gmail == null) {
                    await interaction.editReply({
                        content: `Something Went Wrong, Please Try Again Later`,
                        ephemeral: true
                    });
                } else {
                    const verifyNumber = await Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

                    const sendMail = await client.sendMailTo({
                        gmail: await _gmail,
                        title: `Verify Code: ${await verifyNumber}`,
                        message: `Hi. ${await interaction.user.username}#${await interaction.user.discriminator}  -  Run With /${interaction.commandName}\n\nYour verify code is\n\n\n${await verifyNumber}\n\n\nWebsite: https://ingkth.wordpress.com/\nDiscord: https://discord.gg/pbyWbUYjyt\n\nING PROJECT.`
                    });

                    if (await sendMail == null) {
                        await interaction.editReply({
                            content: `**Please Type Your Mail Correctly,**\nSomething Went Wrong, Please Try Again Later`,
                            ephemeral: true
                        });
                    } else {
                        let needed_json = await JSON.parse(fs.readFileSync("./data/json/gmail.json", "utf8"));
                        needed_json[interaction.user.id] = {
                            mail: _gmail,
                            verify: verifyNumber
                        };

                        fs.writeFile("./data/json/gmail.json", JSON.stringify(needed_json), (err) => {
                            if (err) console.error(err)
                        });

                        const createEmbed = new MessageEmbed()
                            .setColor(`#0099ff`)
                            .setTitle(`/${await interaction.commandName} ${await interaction.options.getSubcommand()}`)
                            .setURL(`https://ingkth.wordpress.com`)
                            .setAuthor({ name: `${await client.user.tag}`, iconURL: await client.user.displayAvatarURL(), url: `https://ingkth.wordpress.com` })
                            .setDescription(`**${await _gmail}**`)
                            .setTimestamp(createdTime)
                            .setFooter({ text: `${await interaction.user.username}#${await interaction.user.discriminator}` });

                        await interaction.editReply({
                            content: `We Send You A Mail, Please Check Your Mail And Type The Verify Code in --> **/gmail verify**`,
                            embeds: [createEmbed],
                            ephemeral: true
                        });
                    }
                }
            } else if (interaction.options.getSubcommand() === "verify") {
                const _code = await interaction.options.getString("code");

                let needed_json = await JSON.parse(fs.readFileSync("./data/json/gmail.json", "utf8"));

                const account = needed_json[interaction.user.id];

                if (account == null || account == undefined || !account) {
                    await interaction.editReply({
                        content: `Sorry, You Must Add Gmail Account First`,
                        ephemeral: true
                    });
                } else {
                    if (await account.verify == _code) {
                        await client.dbLogin().then(async () => {
                            // create
                            const gmailSchema = new mongoose.Schema({
                                mail: String,
                                discordId: Number
                            })
                            var Account;
                            try {
                                Account = await mongoose.model('gmails', gmailSchema);
                            } catch (err) {
                                Account = await mongoose.model('gmails');
                            }

                            delete needed_json[interaction.user.id];

                            fs.writeFile("./data/json/gmail.json", JSON.stringify(needed_json), (err) => {
                                if (err) console.error(err)
                            });

                            const user = await Account.findOne({ discordId: await interaction.user.id });
                            if (user == null) {
                                //create new
                                const findAccount = await new Account({ mail: await account.mail, discordId: await interaction.user.id });
                                findAccount.save().then(async () => {
                                    const createEmbed = new MessageEmbed()
                                        .setColor(`#0099ff`)
                                        .setTitle(`/${await interaction.commandName} ${await interaction.options.getSubcommand()}`)
                                        .setURL(`https://ingkth.wordpress.com`)
                                        .setAuthor({ name: `${await client.user.tag}`, iconURL: await client.user.displayAvatarURL(), url: `https://ingkth.wordpress.com` })
                                        .setDescription(`Gmail: **${await account.mail}**\nVerify Code: **${await account.verify}**`)
                                        .setTimestamp(createdTime)
                                        .setFooter({ text: `${await interaction.user.username}#${await interaction.user.discriminator}` });

                                    await interaction.editReply({
                                        content: `Your Gmail Account Has Been Verified`,
                                        embeds: [createEmbed],
                                        ephemeral: true
                                    });
                                });
                            } else {
                                //delete 
                                await Account.deleteOne({ discordId: await interaction.user.id });
                                //create new
                                const findAccount = await new Account({ mail: await account.mail, discordId: await interaction.user.id });
                                findAccount.save().then(async () => {
                                    const createEmbed = new MessageEmbed()
                                        .setColor(`#0099ff`)
                                        .setTitle(`/${await interaction.commandName} ${await interaction.options.getSubcommand()}`)
                                        .setURL(`https://ingkth.wordpress.com`)
                                        .setAuthor({ name: `${await client.user.tag}`, iconURL: await client.user.displayAvatarURL(), url: `https://ingkth.wordpress.com` })
                                        .setDescription(`Gmail: **${await account.mail}**\nVerify Code: **${await account.verify}**`)
                                        .setTimestamp(createdTime)
                                        .setFooter({ text: `${await interaction.user.username}#${await interaction.user.discriminator}` });

                                    await interaction.editReply({
                                        content: `Your Gmail Account Has Been Verified`,
                                        embeds: [createEmbed],
                                        ephemeral: true
                                    });
                                });
                            }

                        });
                    }
                }
            } else if (interaction.options.getSubcommand() === "get") {
                await client.dbLogin().then(async () => {
                    // create
                    const gmailSchema = new mongoose.Schema({
                        mail: String,
                        discordId: Number
                    })
                    var Account;
                    try {
                        Account = await mongoose.model('gmails', gmailSchema);
                    } catch (err) {
                        Account = await mongoose.model('gmails');
                    }

                    const user = await Account.findOne({ discordId: await interaction.user.id });
                    if (user == null) {
                        await interaction.editReply({
                            content: `Can't Find Your Gmail Account in Database`,
                            ephemeral: true
                        });
                    } else {
                        const createEmbed = new MessageEmbed()
                            .setColor(`#0099ff`)
                            .setTitle(`/${await interaction.commandName} ${await interaction.options.getSubcommand()}`)
                            .setURL(`https://ingkth.wordpress.com`)
                            .setAuthor({ name: `${await client.user.tag}`, iconURL: await client.user.displayAvatarURL(), url: `https://ingkth.wordpress.com` })
                            .setDescription(`Gmail: **${await user.mail}**`)
                            .setTimestamp(createdTime)
                            .setFooter({ text: `${await interaction.user.username}#${await interaction.user.discriminator}` });

                        await interaction.editReply({
                            content: ` `,
                            embeds: [createEmbed],
                            ephemeral: true
                        });
                    }
                });
            } else if (interaction.options.getSubcommand() === "remove") {
                await client.dbLogin().then(async () => {
                    // create
                    var Account;
                    try {
                        const gmailSchema = new mongoose.Schema({
                            mail: String,
                            discordId: Number
                        })
                        
                        Account = await mongoose.model('gmails', gmailSchema);
                    } catch (err) {
                        Account = await mongoose.model('gmails');
                    }

                    const user = await Account.findOne({ discordId: await interaction.user.id });
                    if (user == null) {
                        await interaction.editReply({
                            content: `Can't Find Your Gmail Account in Database`,
                            ephemeral: true
                        });
                    } else {
                        //send message
                        const createEmbed = new MessageEmbed()
                            .setColor(`#0099ff`)
                            .setTitle(`/${await interaction.commandName} ${await interaction.options.getSubcommand()}`)
                            .setURL(`https://ingkth.wordpress.com`)
                            .setAuthor({ name: `${await client.user.tag}`, iconURL: await client.user.displayAvatarURL(), url: `https://ingkth.wordpress.com` })
                            .setDescription(`Gmail: **${await user.mail}**`)
                            .setTimestamp(createdTime)
                            .setFooter({ text: `${await interaction.user.username}#${await interaction.user.discriminator}` });

                        await interaction.editReply({
                            content: `Deleted Gmail Account From Database`,
                            embeds: [createEmbed],
                            ephemeral: true
                        });
                        //delete 
                        await Account.deleteOne({ discordId: await interaction.user.id });
                    }
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