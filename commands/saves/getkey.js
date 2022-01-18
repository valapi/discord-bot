const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('getkey')
        .setDescription('Renarate Your Private Key'),


    async execute(interaction, client) {
        try {
            await interaction.reply({
                content: "Loading Message.. ",
                ephemeral: true
            });
    
            var _key = await client.createSalt();

            await interaction.editReply({
                content: `**" Keep It Secret "**\nAnd Saving Private Key At The Safest Spot !!!\n\nKey: **${_key}**`,
                ephemeral: true
            });
        } catch (err) {
            console.error(err);
        }
    }
}