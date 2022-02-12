const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const mongoose = require(`mongoose`);
const { MessageAttachment, MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('account')
        .setDescription('Valorant Account Info')
        .addStringOption(option => option.setName('privatekey').setDescription('Type Your Private Key')),

    async execute(interaction, client, createdTime) {
        try {
            var _key = await interaction.options.getString("privatekey");
            await client.dbLogin().then(async () => {
                var Account;
                try {
                    const valorantSchema = new mongoose.Schema({
                        username: String,
                        password: String,
                        discordId: Number
                    })

                    Account = await mongoose.model('valorants', valorantSchema);
                } catch (err) {
                    Account = await mongoose.model('valorants');
                }
                //script
                const user = await Account.findOne({ discordId: await interaction.user.id });
                if (user == null) {
                    await interaction.editReply({
                        content: `Can't Find Your Account In Database`,
                        ephemeral: true
                    });
                } else {
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
                        const _name = await client.decryptBack(await user.username, _key);
                        const _password = await client.decryptBack(await user.password, _key);

                        //client
                        const ValorantAccount = await client.valorantClientAPI(_name, _password);
                        const ValorantUser = await client.getUsernameFromID(ValorantAccount)
                        const ValorantInventory = await client.getPlayerInventory(ValorantAccount)

                        //player card
                        const ValorantPlayerCard_ID = await ValorantInventory.data.Identity.PlayerCardID
                        const getCards = await client.getPlayerCards(await ValorantPlayerCard_ID)
                        const ValorantPlayerCard_Display = await getCards.data.displayIcon;  //".wideArt"  //".largeArt"  //".displayIcon"  //".smallArt"

                        //sendMessage
                        let sendMessage = "";
                        sendMessage += `Name: **${ValorantUser.data[0].GameName}**\n`;
                        sendMessage += `Tag: **${ValorantUser.data[0].TagLine}**\n`;
                        sendMessage += `ID: **${ValorantAccount.user.id}**\n`;
                        sendMessage += `Country: **${ValorantAccount.user.country}**\n`;

                        const createEmbed = new MessageEmbed()
                            .setColor(`#0099ff`)
                            .setTitle(ValorantAccount.user.username)
                            .setURL(`https://ingkth.wordpress.com`)
                            .setAuthor({ name: `${await client.user.tag}`, iconURL: await client.user.displayAvatarURL(), url: `https://ingkth.wordpress.com` })
                            .setDescription(sendMessage)
                            .setThumbnail(ValorantPlayerCard_Display)
                            .setTimestamp(createdTime)
                            .setFooter({ text: `${await interaction.user.username}#${await interaction.user.discriminator}` });

                        await interaction.editReply({
                            content: `You Are Register Riot Account With`,
                            embeds: [createEmbed],
                            ephemeral: true
                        });
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
