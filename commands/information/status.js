const { SlashCommandBuilder } = require(`@discordjs/builders`);
const { MessageAttachment, MessageEmbed } = require(`discord.js`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`status`)
        .setDescription(`Bot Status`),
    async execute(interaction, client, createdTime) {
        try {
            const getStatus = await client.getStatus(await createdTime);
            if (!getStatus || getStatus == null || getStatus == undefined) {
                await interaction.editReply({
                    content: `Something Went Wrong, Please Try Again Later`,
                    ephemeral: true
                });
            } else {
                let sendMessage = ``;
                sendMessage += `Uptime: **${await getStatus.uptime.days} Days : ${await getStatus.uptime.hours} Hours : ${await getStatus.uptime.minutes} Minutes : ${await getStatus.uptime.seconds} Seconds**\n`;
                sendMessage += `Status: **${await getStatus.status}**\n`;
                sendMessage += `Ping: **${await getStatus.ping.average} ms**`;

                //embed test
                const createEmbed = new MessageEmbed()
                    .setColor(`#0099ff`)
                    .setTitle(`/${await interaction.commandName}`)
                    .setURL(`https://ingkth.wordpress.com`)
                    .setAuthor({ name: `${await client.user.tag}`, iconURL: await client.user.displayAvatarURL() , url: `https://ingkth.wordpress.com` })
                    .setDescription(await sendMessage)
                    .setTimestamp(createdTime)
                    .setFooter({ text: `${await interaction.user.username}#${await interaction.user.discriminator}`});

                await interaction.editReply({
                    content: `Invite Link: **https://discord.com/oauth2/authorize?client_id=930354659493822515&scope=bot&permissions=27648860222**\nWebsite: **https://ingkth.wordpress.com/**\nDiscord: **https://discord.gg/pbyWbUYjyt**\n`,
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
};