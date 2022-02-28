const { SlashCommandBuilder } = require(`@discordjs/builders`);
const { MessageAttachment, MessageEmbed } = require(`discord.js`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`help`)
        .setDescription(`Get Help`),
    async execute(interaction, client, createdTime) {
        try {
            var sendMessage = ``;

            //get all command
            const getAllCommand = await client.commandArray;

            for (const PerCommand of getAllCommand) {
                sendMessage += `\n**/${PerCommand.name}**\n`;
                sendMessage += `${PerCommand.description}\n`;
            }

            //embed test
            const createEmbed = new MessageEmbed()
                .setColor(`#0099ff`)
                .setTitle(`${await client.user.tag} - Commands List`)
                .setDescription(await sendMessage)
                .setTimestamp(createdTime)
                .setFooter({ text: `${await interaction.user.username}#${await interaction.user.discriminator}` });

            await interaction.editReply({
                content: `Invite Link: **https://discord.com/api/oauth2/authorize?client_id=930354659493822515&permissions=8&scope=bot%20applications.commands**\nWebsite: **https://ingkth.wordpress.com/**\nDiscord: **https://discord.gg/pbyWbUYjyt**\n`,
                embeds: [createEmbed],
                ephemeral: true
            });
        } catch (err) {
            console.error(err);
            await interaction.editReply({
                content: `Something Went Wrong, Please Try Again Later`,
                ephemeral: true
            });
        }
    }
};