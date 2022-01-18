const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply({
			content: "Pong!",
			ephemeral: false
		});

		const message = await interaction.fetchReply();
		message.react("⚪");
		message.reactions.removeAll()
			.catch(error => console.error('Failed to clear reactions:', error));
		message.react("🏓");
		
	}
};