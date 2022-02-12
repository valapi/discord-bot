const axios = require('axios').default;
const { wrapper } = require('axios-cookiejar-support')
const tough = require('tough-cookie');

module.exports = (client) => {
    client.getOfferEntitlements = async (Account, itemTypeId) => {
        try {
            const cookieJar = new tough.CookieJar();
            const axiosClient = wrapper(axios.create({ cookieJar }));

            const response = await axiosClient.get(Account.url.playerData + `/store/v1/entitlements/${Account.user.id}/${itemTypeId}`, {
                headers: Account.requestHeaders
            });
            return {data: response.data, isError: false};
        }catch(err){
            return {data: err, isError: true};
        }
    };
}