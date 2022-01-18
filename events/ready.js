module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {

		console.log(`Logged in as ${client.user.tag}`);

		client.user.setPresence({
			activity: [{
				name: 'run with Discord.js',
				type: 'PLAYING'
			}],
			status: 'online'
		});
	},
};