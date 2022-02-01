module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isCommand()){
            const command = client.commands.get(interaction.commandName);

            if (!command) return;

            await interaction.reply({
                content: "Loading Message.. ",
                ephemeral: true
            });

            try {
                if (command.permissions && command.permissions.length > 0){
                    if (!interaction.member.permissions.has(command.permissions)){
                        await interaction.editReply({ content: `You don't have permission to use this command.`, ephemeral: true });
                        return;
                    }
                }

                var createdTime = new Date();

                await command.execute(interaction, client, createdTime);
            } catch (error) {
                console.error(error);
                await interaction.editReply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    },
};