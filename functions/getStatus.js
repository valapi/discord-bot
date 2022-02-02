const process = require('process');

module.exports = (client) => {
    client.getStatus = async (createdTime) => {
        try{
            //uptime
            let up_sec = await process.uptime() | 0;
            let up_min = 0;
            let up_hour = 0;
            let up_day = 0;

            while (up_sec >= 60) {
                up_hour++
                up_sec -= 60
            }

            while (up_min >= 60) {
                up_hour++
                up_min -= 60
            }

            while (up_hour >= 24) {
                up_day++
                up_hour -= 24
            }

            //status
            const status_now = await client.user.presence.status
            const STATUS = await status_now.charAt(0).toUpperCase() + await status_now.slice(1);

            //ping

            //discord.js ping
            
            const discord_now = await Number(new Date())
            const discord_create = await Number(await createdTime);
            const discord_ping = await discord_now - discord_create

            //client ping
            const client_ping = await Math.round(await client.ws.ping)

            //return
            return {uptime: {days: await up_day + 0, hours: await up_hour + 0, minutes: await up_min + 0, seconds: await up_sec + 0}, status: STATUS, ping: {data: {discordApi: discord_ping, client: client_ping}, average: await Math.round((discord_ping + client_ping) / 2)}}

        }catch (error) {
            console.error(error)
        } 
    };
}