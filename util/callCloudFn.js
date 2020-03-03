const rp = require('request-promise')
const getAccessToken = require('../util/getAccessToken')

const callCloudFn = async (ctx, fnName, params) => {
    //查询歌单
    const ACCESS_TOKEN = await getAccessToken()
    const ENV = 'kl-test1-bhogs'
    const url = `https://api.weixin.qq.com/tcb/invokecloudfunction?access_token=${ACCESS_TOKEN}&env=${ENV}&name=${fnName}`
    const query = ctx.request.query
    const options = {
        method: 'POST',
        uri: url,
        body: {
            ...params
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

module.exports = callCloudFn