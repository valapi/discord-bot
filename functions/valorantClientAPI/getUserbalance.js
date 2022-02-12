const axios = require('axios').default;
const { wrapper } = require('axios-cookiejar-support')
const tough = require('tough-cookie');

module.exports = (client) => {
    client.getUserbalance = async (Account) => {
        try {
            const cookieJar = new tough.CookieJar();
            const axiosClient = wrapper(axios.create({ cookieJar }));

            const response = await axiosClient.get(Account.url.playerData + `/store/v1/wallet/${Account.user.id}`, {
                headers: Account.requestHeaders
            });
            return {data: response.data, isError: false};
        }catch(err){
            return {data: err, isError: true};
        }
    };
}