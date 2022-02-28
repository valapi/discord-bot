const axios = require('axios').default;
const { wrapper } = require('axios-cookiejar-support')
const tough = require('tough-cookie');

module.exports = (client) => {
    client.getContractsByPlayer = async (Account) => {
        try {
            const cookieJar = new tough.CookieJar();
            const axiosClient = wrapper(axios.create({ cookieJar }));

            const response = await axiosClient.get(Account.url.playerData + `/contracts/v1/contracts/${Account.user.id}`, {
                headers: Account.request.headers
            });
            return {data: response.data, isError: false};
        }catch(err){
            return {data: err, isError: true};
        }

    };
}