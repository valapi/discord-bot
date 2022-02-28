const axios = require('axios').default;
const { wrapper } = require('axios-cookiejar-support')
const tough = require('tough-cookie');
const url = require('url');

module.exports = (client) => {
    client.twofactor = async (getCookie, getCode) => {
        try {
            const playerDataUrl = "https://pd.ap.a.pvp.net";
            const partyServiceUrl = "https://glz-ap-1.ap.a.pvp.net";
            const sharedDataUrl = "https://shared.ap.a.pvp.net";
            var cookieJar

            try {
                const toughCookie = tough.CookieJar;
                cookieJar = await toughCookie.fromJSON(getCookie);
            } catch (err) {
                cookieJar = getCookie;
            }
            const axiosClient = wrapper(axios.create({ cookieJar }))

            const main_response = await axiosClient.put('https://auth.riotgames.com/api/v1/authorization', {
                "type": "multifactor",
                "code": getCode.toString(),
                "rememberDevice": false
            }, {
                jar: cookieJar,
                withCredentials: true,
            })

            // check for error
            if (main_response.data.error) {
                return {
                    data: main_response,
                    isError: true
                }
            }

            // get asscess token
            const get_url = main_response.data.response.parameters.uri;
            const url_parts = await url.parse(get_url, true);
            const removeSharpTag = await url_parts.hash.replace('#', '');

            var asscessToken_params = new URLSearchParams(removeSharpTag);

            const asscessToken = asscessToken_params.get('access_token');

            //ENTITLEMENTS
            const jwt_response = await axiosClient.post('https://entitlements.auth.riotgames.com/api/token/v1', {}, {
                jar: cookieJar,
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${asscessToken}`,
                },
            })

            // check for error
            if (jwt_response.data.error) {
                return {
                    data: jwt_response,
                    isError: true
                }
            }

            const _entitlements = jwt_response.data.entitlements_token;

            //USERID
            const user_response = await axiosClient.post('https://auth.riotgames.com/userinfo', {}, {
                jar: cookieJar,
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${asscessToken}`,
                },
            })

            // check for error
            if (user_response.data.error) {
                return {
                    data: user_response,
                    isError: true
                }
            }

            const _userid = user_response.data.sub;
            //CLIENT VERSION
            const getVersion = await client.getVersion()
            const _clientVersion = getVersion.data.riotClientVersion;

            return {
                request: {
                    headers: {
                        'Authorization': `Bearer ${asscessToken}`,
                        'X-Riot-Entitlements-JWT': _entitlements,
                        'X-Riot-ClientVersion': _clientVersion,
                        'X-Riot-ClientPlatform': 'ew0KCSJwbGF0Zm9ybVR5cGUiOiAiUEMiLA0KCSJwbGF0Zm9ybU9TIjogIldpbmRvd3MiLA0KCSJwbGF0Zm9ybU9TVmVyc2lvbiI6ICIxMC4wLjE5MDQyLjEuMjU2LjY0Yml0IiwNCgkicGxhdGZvcm1DaGlwc2V0IjogIlVua25vd24iDQp9',
                    },
                    cookie: cookieJar,
                    accessToken: asscessToken,
                    entitlement: _entitlements,
                },
                url: {
                    playerData: playerDataUrl,
                    partyService: partyServiceUrl,
                    sharedData: sharedDataUrl
                },
                user: {
                    id: _userid
                },
                data: user_response.data,
                isError: false
            };
        } catch (err) {
            return err;
        }
    };
}