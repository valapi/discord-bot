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
                .setName('remove')
                .setDescription("Remove Gmail Account")
        ),

    async execute(interaction, client) {
        try {
            if (interaction.options.getSubcommand() === "add") {
                const _gmail = await interaction.options.getString("mail");

                if (_gmail == null) {
                    await interaction.editReply({
                        content: `Something Went Wrong, Please Try Again Later`,
                        ephemeral: true
                    });
                } else {
                    const sendMail = await client.sendVerify(await _gmail);

                    if(await sendMail.result == null || await sendMail.verifyNumber == null) {
                        await interaction.editReply({
                            content: `Please Type Your Mail Correctly`,
                            ephemeral: true
                        });
                    }else {
                        let needed_json = await JSON.parse(fs.readFileSync("./data/json/gmail.json", "utf8"));
                        needed_json[interaction.user.id] = {
                            mail: _gmail,
                            verify: await sendMail.verifyNumber
                        };
    
                        fs.writeFile("./data/json/gmail.json", JSON.stringify(needed_json), (err) => {
                            if (err) console.error(err)
                        });
    
                        await interaction.editReply({
                            content: `We Send You A Mail, Please Check Your Mail And Type The Verify Code in --> **/gmail verify**\n\nGmail: **${await _gmail}**`,
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
                }else {
                    if (await account.verify == _code){
                        await client.dbLogin().then(async () => {
                            // create
                            const gmailSchema = new mongoose.Schema({
                                mail: String,
                                discordId: Number
                            })
                            try {
                                const Account = await mongoose.model('gmails', gmailSchema);
                                await interaction.editReply({
                                    content: `Something Went Wrong, Please Try Again Later`,
                                    ephemeral: true
                                });
                            }catch (err){
                                delete needed_json[interaction.user.id];

                                fs.writeFile("./data/json/gmail.json", JSON.stringify(needed_json), (err) => {
                                    if (err) console.error(err)
                                });

                                const Account = await mongoose.model('gmails');
                                const user = await Account.findOne({ discordId: await interaction.user.id });
                                if (user == null) {
                                    //create new
                                    const findAccount = await new Account({ mail: await account.mail, discordId: await interaction.user.id });
                                    findAccount.save().then(async () => {
                                        await interaction.editReply({
                                            content: `Your Gmail Account Has Been Verified\n\nGmail: **${await account.mail}**\nVerify Code: **${await account.verify}**`,
                                            ephemeral: true
                                        });
                                    });
                                } else {
                                    //delete 
                                    await Account.deleteOne({ discordId: await interaction.user.id });
                                    //create new
                                    const findAccount = await new Account({ mail: await account.mail, discordId: await interaction.user.id });
                                    findAccount.save().then(async () => {
                                        await interaction.editReply({
                                            content: `Your Gmail Account Has Been Verified\n\nGmail: **${await account.mail}**\nVerify Code: **${await account.verify}**`,
                                            ephemeral: true
                                        });
                                    });
                                }
                            }
    
                        });
                    }
                }
            }else if (interaction.options.getSubcommand() === "remove"){
                await client.dbLogin().then(async () => {
                    // create
                    const gmailSchema = new mongoose.Schema({
                        mail: String,
                        discordId: Number
                    })
                    try {
                        const Account = await mongoose.model('gmails', gmailSchema);
                        await interaction.editReply({
                            content: `Something Went Wrong, Please Try Again Later`,
                            ephemeral: true
                        });
                    }catch (err){
                        const Account = await mongoose.model('gmails');
                        const user = await Account.findOne({ discordId: await interaction.user.id });
                        if (user == null) {
                            await interaction.editReply({
                                content: `Can't Find Your Gmail Account in Database`,
                                ephemeral: true
                            });
                        } else {
                            //delete 
                            await Account.deleteOne({ discordId: await interaction.user.id });
                            await interaction.editReply({
                                content: `Deleted Gmail Account From Database`,
                                ephemeral: true
                            });
                        }
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