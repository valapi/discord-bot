const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const mongoose = require(`mongoose`);
const { MessageAttachment, MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nightmarket')
        .setDescription('Valorant Bonus Store // Night Market')
        .addStringOption(option => option.setName('privatekey').setDescription('Type Your Private Key')),

    async execute(interaction, client, createdTime) {
        try {
            var _key = await interaction.options.getString("privatekey");
            await client.dbLogin().then(async () => {
                var Account;
                try {
                    const valorantSchema = new mongoose.Schema({
                        username: String,
                        password: String,
                        discordId: Number
                    })

                    Account = await mongoose.model('valorants', valorantSchema);
                } catch (err) {
                    Account = await mongoose.model('valorants');
                }
                //script
                const user = await Account.findOne({ discordId: await interaction.user.id });
                if (user == null) {
                    await interaction.editReply({
                        content: `Can't Find Your Account In Database`,
                        ephemeral: true
                    });
                } else {
                    if (_key == null) {
                        //try to find key in database
                        var tryToFindKey;
                        try {
                            const keySchema = new mongoose.Schema({
                                key: String,
                                discordId: Number
                            })

                            tryToFindKey = await mongoose.model('keys', keySchema);
                        } catch (err) {
                            tryToFindKey = await mongoose.model('keys');
                        }
                        getKeyUser = await tryToFindKey.findOne({ discordId: await interaction.user.id });
                        if (getKeyUser || getKeyUser != null || getKeyUser != undefined) {
                            _key = await getKeyUser.key;
                        }
                    }

                    if (_key == null) {
                        await interaction.editReply({
                            content: `Sorry, You Must Type Your Private Key`,
                            ephemeral: true
                        });
                    } else {
                        const _name = await client.decryptBack(await user.username, _key);
                        const _password = await client.decryptBack(await user.password, _key);

                        const Valorant = require('@liamcottle/valorant.js');
                        const valorantApi = new Valorant.API(Valorant.Regions.AsiaPacific);
                        valorantApi.authorize(_name, _password).then(async () => {

                            await valorantApi.getPlayerStoreFront(valorantApi.user_id).then(async (response) => {
                                var BonusStores;
                                try {
                                    BonusStores = await response.data.BonusStore;
                                } catch (err) {

                                }
                                if (BonusStores == undefined || BonusStores == null || !BonusStores) {
                                    await interaction.editReply({
                                        content: `Can't Find Bonus Store // Nightmarket`,
                                        ephemeral: true
                                    });
                                } else {
                                    let sec = BonusStores.BonusStoreRemainingDurationInSeconds;
                                    let min = 0;
                                    let hour = 0;
                                    let day = 0;

                                    while (sec >= 60) {
                                        min++;
                                        sec -= 60;
                                    }

                                    while (min >= 60) {
                                        hour++;
                                        min -= 60;
                                    }

                                    while (hour >= 24) {
                                        day++
                                        hour -= 24;
                                    }

                                    const timeLeft = `Time Left: ** ${day} day(s) ${hour} hour(s) ${min} minute(s) ${sec} second(s)**`

                                    var sendArray = [];

                                    for (let i = 0; i < BonusStores.BonusStoreOffers.length; i++) {
                                        const OfferId = BonusStores.BonusStoreOffers[i].Offer.OfferID;
                                        const OfferNormalPrice = BonusStores.BonusStoreOffers[i].Offer.Cost['85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741']
                                        const OfferDiscountPrice = BonusStores.BonusStoreOffers[i].DiscountCosts['85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741']
                                        const OfferDiscount = BonusStores.BonusStoreOffers[i].DiscountPercent
                                        const OfferSeen = BonusStores.BonusStoreOffers[i].IsSeen

                                        //Normal Data
                                        const getDatas = await client.getWeaponSkinLevels(await OfferId);
                                        const _OfferName = getDatas.data.displayName;
                                        const _OfferImage = getDatas.data.displayIcon;

                                        //Advance Data
                                        const ValorantAccount = await client.valorantClientAPI(_name, _password);
                                        const ValorantOffers = await client.getOfferId(ValorantAccount);

                                        var Store_ItemID;
                                        var Store_Cost;
                                        var Store_ID;

                                        for (let j = 0; j < await ValorantOffers.data.Offers.length; j++) {
                                            const _ForJ = await ValorantOffers.data.Offers[j];
                                            for (let k = 0; k < _ForJ.Rewards.length; k++) {
                                                const _ForK = _ForJ.Rewards[k];

                                                Store_ItemID = _ForK.ItemID;

                                                if (Store_ItemID == OfferId) {
                                                    Store_ID = _ForJ.OfferID;
                                                    Store_Cost = _ForJ.Cost['85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741'];
                                                }
                                            }
                                        }

                                        //Content Tiers
                                        var _contentTierUuid;
                                        const getAllWeapons = await client.getWeapons();

                                        for (let j = 0; j < getAllWeapons.data.length; j++) {
                                            const _ForJ = getAllWeapons.data[j];
                                            for (let k = 0; k < _ForJ.skins.length; k++) {
                                                const _ForK = _ForJ.skins[k];
                                                for (let m = 0; m < _ForK.levels.length; m++) {
                                                    const _ForM = _ForK.levels[m];
                                                    if (OfferId == _ForM.uuid) {
                                                        _contentTierUuid = _ForK.contentTierUuid;
                                                    }
                                                }
                                            }
                                        }

                                        const getContentTier = await client.getContentTiers(_contentTierUuid);
                                        const ContentTier_display = getContentTier.data.displayIcon;
                                        const ContentTier_name = getContentTier.data.devName;

                                        const color_firstString = getContentTier.data.highlightColor;
                                        const color_midString = color_firstString.substring(0, color_firstString.length - 1);
                                        const color_endString = color_midString.substring(0, color_midString.length - 1);

                                        const createEmbed = new MessageEmbed()
                                            .setColor(`#${color_endString}`)
                                            .setTitle(_OfferName)
                                            .setAuthor({ name: ContentTier_name, iconURL: ContentTier_display, url: ContentTier_display })
                                            .setDescription(`Old Price: **${OfferNormalPrice}**\nDiscount: **${OfferDiscount}%**\nPrice: **${OfferDiscountPrice}**\nIsSeen: **${OfferSeen.toString()}**\nSlot: **${i + 1}**`)
                                            .setThumbnail(_OfferImage)

                                        sendArray.push(createEmbed);
                                    }

                                    await interaction.editReply({
                                        content: await timeLeft,
                                        embeds: await sendArray,
                                        ephemeral: true
                                    });
                                }
                            });

                        }).catch((error) => {
                            console.log(error);
                        });
                    }
                }
            });

        } catch (err) {
            console.error(err);
            await interaction.editReply({
                content: `Something Went Wrong, Please Try Again Later`,
                ephemeral: true
            });
        }
    }
}
