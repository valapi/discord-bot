const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('invite')
		.setDescription('Get Invite Link'),
	async execute(interaction) {
		await interaction.reply({
			content: "https://discord.com/oauth2/authorize?client_id=930354659493822515&scope=bot&permissions=27648860222",
			ephemeral: true
		});
	}
};