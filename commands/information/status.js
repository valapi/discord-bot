const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Bot Status'),
    async execute(interaction, client, createdTime) {
        try {
            const getStatus = await client.getStatus(await createdTime);
            if (!getStatus || getStatus == null || getStatus == undefined) {
                await interaction.editReply({
                    content: `Something Went Wrong, Please Try Again Later`,
                    ephemeral: true
                });
            }else {
                let sendMessage = ``;
                sendMessage += `Uptime: **${await getStatus.uptime.days} Days : ${await getStatus.uptime.hours} Hours : ${await getStatus.uptime.minutes} Minutes : ${await getStatus.uptime.seconds} Seconds**\n`;
                sendMessage += `Status: **${await getStatus.status}**\n`;
                sendMessage += `Ping: **${await getStatus.ping.average} ms**\n`;
                sendMessage += `\n`;
                sendMessage += `Invite Link: **https://discord.com/oauth2/authorize?client_id=930354659493822515&scope=bot&permissions=27648860222**\n`;
                sendMessage += `Website: **https://ingkth.wordpress.com/**\n`;
                sendMessage += `Discord: **https://discord.gg/pbyWbUYjyt**\n`;

                await interaction.editReply({
                    content: await sendMessage,
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