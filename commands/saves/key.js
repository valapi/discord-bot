const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const mongoose = require(`mongoose`);

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

    async execute(interaction, client) {
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
                        // create
                        const keySchema = new mongoose.Schema({
                            key: String,
                            discordId: Number
                        })
                        try {
                            const Account = await mongoose.model('keys', keySchema);
                            await interaction.editReply({
                                content: `Something Went Wrong, Please Try Again Later`,
                                ephemeral: true
                            });
                        } catch (err) {
                            const Account = await mongoose.model('keys');
                            const user = await Account.findOne({ discordId: await interaction.user.id });
                            if (user == null) {
                                //create new
                                const findAccount = await new Account({ key: _key, discordId: await interaction.user.id });
                                findAccount.save().then(async () => {
                                    await interaction.editReply({
                                        content: `Save Your Private Key In Database, \n__**Hacker Can Use Your Private Key To Get Username And Password From Database**__\n\nKey: **${await _key}**`,
                                        ephemeral: true
                                    });
                                });
                            } else {
                                //delete 
                                await Account.deleteOne({ discordId: await interaction.user.id });
                                //create new
                                const findAccount = await new Account({ key: _key, discordId: await interaction.user.id });
                                findAccount.save().then(async () => {
                                    await interaction.editReply({
                                        content: `Save Your Private Key In Database, \n__**Hacker Can Use Your Private Key To Get Username And Password From Database**__\n\nKey: **${await _key}**`,
                                        ephemeral: true
                                    });
                                });
                            }
                        }
                    });
                }

            } else if (interaction.options.getSubcommand() === "get") {
                await client.dbLogin().then(async () => {
                    // create
                    const keySchema = new mongoose.Schema({
                        key: String,
                        discordId: Number
                    })
                    try {
                        const Account = await mongoose.model('keys', keySchema);
                        await interaction.editReply({
                            content: `Something Went Wrong, Please Try Again Later`,
                            ephemeral: true
                        });
                    } catch (err) {
                        const Account = await mongoose.model('keys');
                        const user = await Account.findOne({ discordId: await interaction.user.id });
                        if (user == null) {
                            await interaction.editReply({
                                content: `Can't Find Your Private Key In Database`,
                                ephemeral: true
                            });
                        } else {
                            await interaction.editReply({
                                content: `__**Hacker Can Use Your Private Key To Get Username And Password From Database**__\n\nKey: **${await user.key}**`,
                                ephemeral: true
                            });
                        }
                    }
                });
            } else if (interaction.options.getSubcommand() === "remove") {
                await client.dbLogin().then(async () => {
                    // create
                    const keySchema = new mongoose.Schema({
                        key: String,
                        discordId: Number
                    })
                    try {
                        const Account = await mongoose.model('keys', keySchema);
                        await interaction.editReply({
                            content: `Something Went Wrong, Please Try Again Later`,
                            ephemeral: true
                        });
                    } catch (err) {
                        const Account = await mongoose.model('keys');
                        const user = await Account.findOne({ discordId: await interaction.user.id });
                        if (user == null) {
                            await interaction.editReply({
                                content: `Can't Find Your Private Key In Database`,
                                ephemeral: true
                            });
                        } else {
                            await Account.deleteOne({ discordId: await interaction.user.id });
                            await interaction.editReply({
                                content: `Delete Your Private Key From Database.`,
                                ephemeral: true
                            });
                        }
                    }

                });
            } else if (interaction.options.getSubcommand() === "new") {
                var _key = await client.createSalt();

                await interaction.editReply({
                    content: `**" Keep It Secret "**\nAnd Saving Private Key At The Safest Spot !!!\n\nKey: **${_key}**`,
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