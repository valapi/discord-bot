module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {

		console.log(`Logged in as ${client.user.tag}`);

		console.log(`Server Time >> ${new Date().getHours()} : ${new Date().getMinutes()} : ${new Date().getSeconds()}`)
	},
};