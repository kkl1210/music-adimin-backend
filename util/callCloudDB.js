const rp = require('request-promise')
const getAccessToken = require('../util/getAccessToken')

const callCloudDB = async (ctx, fnName, query={}) => {
    //查询歌单
    const ACCESS_TOKEN = await getAccessToken()
    const url = `https://api.weixin.qq.com/tcb/${fnName}?access_token=${ACCESS_TOKEN}`
    const options = {
        method: 'POST',
        uri: url,
        body: {
            query,
            env: ctx.state.env,
        },
        json: true // Automatically stringifies the body to JSON
    };
    return await rp(options)
        .then(res => {
            return res
        })
        .catch(function (err) {
            // POST failed...
        });
}

module.exports = callCloudDB