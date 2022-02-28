const axios = require('axios').default;
const { wrapper } = require('axios-cookiejar-support')
const tough = require('tough-cookie');

module.exports = (client) => {
    client.getUsernameFromID = async (Account) => {
        try {
            const cookieJar = Account.request.cookie;
            const axiosClient = wrapper(axios.create({ cookieJar }));

            const response = await axiosClient.put(Account.url.playerData + `/name-service/v2/players`, [
            `${Account.user.id}`,
        ], {
            headers: Account.request.headers,
        })
            return {data: response.data, isError: false};
        }catch(err){
            return {data: err, isError: true};
        }
    };
}