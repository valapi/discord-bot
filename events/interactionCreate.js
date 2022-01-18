module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isCommand()){
            const command = client.commands.get(interaction.commandName);

            if (!command) return;

            try {
                await command.execute(interaction, client);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }else if (interaction.isSelectMenu()){
            let colours = "";
            await interaction.values.forEach(async value => {
                colours += `${value} `;
            });
            await interaction.reply({
                content: `Your Favorite Color Are : ${colours}`,
                ephemeral: true
            });
        }else if (interaction.isButton()){
            if (interaction.customId.includes("-button")){
                if(interaction.customId.includes("danger")){
                    await interaction.reply({
                        content: `Color Danger: #ED4245`,
                        ephemeral: true
                    });
                }else if(interaction.customId.includes("success")){
                    await interaction.reply({
                        content: `Color Success: #57F287`,
                        ephemeral: true
                    });
                }else if(interaction.customId.includes("primary")){
                    await interaction.reply({
                        content: `Color Pimary: #5865F2`,
                        ephemeral: true
                    });
                }
            }
        }
    },
};