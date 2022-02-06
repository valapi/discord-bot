# Valorant Discord Bot
website: [https://ingkth.wordpress.com/](https://ingkth.wordpress.com/)

## Event
### ready.js
```javascript
module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {

		console.log(`Logged in as ${client.user.tag}`);

		console.log(`Server Time >> ${new Date().getHours()} : ${new Date().getMinutes()} : ${new Date().getSeconds()}`)
	},
};
```
Path --> [ready.js](events/ready.js)
