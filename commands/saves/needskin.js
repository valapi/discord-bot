const { SlashCommandBuilder } = require('@discordjs/builders');
const valorantApiCom = require('valorant-api-com');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('needskin')
        .setDescription('BETA - When Your Need Skin In Shop Its Will Notification You')
        .addStringOption(option => option.setName('name').setDescription('Type Need Skin Name')),

    async execute(interaction, client) {
        try {
            await interaction.reply({
                content: "Loading Message.. ",
                ephemeral: true
            });

            let get_key = await JSON.parse(fs.readFileSync("./data/json/key.json", "utf8"));
            let _name = await interaction.options.getString("name")

            if(_name == null){
                await interaction.editReply({
                    content: `Sorry, You Must Type Your Need Skin Name`,
                    ephemeral: true
                });
            }else {
                if (!get_key[interaction.user.id]) {
                    await interaction.editReply({
                        content: `You Must Save Your Private Key First`,
                        ephemeral: true
                    });
                } else {
                    var needed_json = await JSON.parse(fs.readFileSync("./data/json/need.json", "utf8"));
    
                    let discordArray = needed_json["discord"]
                    let nameArray = needed_json["name"]
                    let idArray = needed_json["id"]
                    let channelArray = needed_json["channel"]
    
                    let valorantApi = new valorantApiCom({
                        'language': 'en-US'
                    });
    
                    const getWeapon = await valorantApi.getWeaponLevels();
    
                    let finded;
    
                    for(let i = 0; i < getWeapon.data.length; i++){
                        if(getWeapon.data[i].displayName == _name){
                            nameArray.push(await getWeapon.data[i].displayName)
                            idArray.push(await getWeapon.data[i].uuid)
                            discordArray.push(await interaction.user.id)
                            channelArray.push(await interaction.channel.id)
    
                            fs.writeFile("./data/json/need.json", JSON.stringify(needed_json), (err) => {
                                if (err) console.error(err)
                            });
    
                            await interaction.editReply({
                                content: `You Have Registered Your Need Skin With\n\n**Name:** ${getWeapon.data[i].displayName}\n**ID:** ${getWeapon.data[i].uuid}`,
                                ephemeral: true
                            });
    
                            finded = true
                        }else if(getWeapon.data.length - 1 == i && finded == undefined){
                            await interaction.editReply({
                                content: `**Can't Find Your Need Skin In Database**\n\nSkin List: https://valorant.fandom.com/wiki/Weapon_Skins\nApi: https://valorant-api.com/v1/weapons/skinlevels/`,
                                ephemeral: true
                            });
                        }
                    }
                }
            }

        } catch (err) {
            console.error(err);
        }
    }
}