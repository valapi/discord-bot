module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        const createdTime = new Date();
        
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
                try {
                    console.log(`\x1b[36m[${createdTime.toLocaleTimeString()}] : ${await interaction.user.username}#${await interaction.user.discriminator} used /${await interaction.commandName}\x1b[0m`)

                    await command.execute(interaction, client, createdTime);
                }catch (err){
                    await interaction.editReply({ content: 'There was an error while executing this command.', ephemeral: true });
                }finally {
                    const command_now = await Number(new Date())
                    const command_create = await Number(await createdTime);
                    const command_ping = await command_now - command_create

                    console.log(`\x1b[36m[${new Date().toLocaleTimeString()}] : ${await interaction.user.username}#${await interaction.user.discriminator} used /${await interaction.commandName} - ${await command_ping} Milliseconds\x1b[0m`)
                }
            } catch (error) {
                console.error(error);
                await interaction.editReply({ content: 'There was an error while executing this command.', ephemeral: true });
            }
        }
    },
};