const CryptoJS = require('crypto-js');
const os = require("os");
const mongoose = require('mongoose');
const ping = require('ping');

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

            //mongoose ping
            const mongo_host = await mongoose.connection.host
            const mongo_res = await ping.promise.probe(mongo_host);
            const mongo_ping = await mongo_res.avg | 0

            //discord.js ping
            const discord_now = await Number(new Date())
            const discord_create = await Number(await createdTime);
            const discord_ping = await discord_now - discord_create

            //valorant-api ping
            const valorant_host = "valorant-api.com"
            const valorant_res = await ping.promise.probe(valorant_host);
            const valorant_ping = await valorant_res.avg | 0

            //client ping
            const client_ping = await Math.round(await client.ws.ping)

            //return
            return {uptime: {days: await up_day + 0, hours: await up_hour + 0, minutes: await up_min + 0, seconds: await up_sec + 0}, status: STATUS, ping: {data: {mongodb: mongo_ping, discordApi: discord_ping, valorantApi: valorant_ping, client: client_ping}, average: await Math.round((mongo_ping + discord_ping + valorant_ping + client_ping) / 4)}}

        }catch (error) {
            console.error(error)
        } 
    };
}