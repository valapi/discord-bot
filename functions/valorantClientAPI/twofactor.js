const axios = require('axios').default;
const { wrapper } = require('axios-cookiejar-support')
const tough = require('tough-cookie');

module.exports = (client) => {
    client.twofactor = async (Account, twoFAcode) => {
        try {
            const cookieJar = Account.request.cookie;
            const axiosClient = wrapper(axios.create({ cookieJar }));

            const main_response = await axiosClient.put('https://auth.riotgames.com/api/v1/authorization', {
                "type": "multifactor",
                "code": twoFAcode.toString(),
                "rememberDevice": false
            }, {
                jar: cookieJar,
                withCredentials: true,
            })

            return { data: main_response, isError: false };
        } catch (err) {
            return { data: err, isError: true };
        }
    };
}