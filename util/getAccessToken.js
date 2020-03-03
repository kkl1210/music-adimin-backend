const rp = require('request-promise')
const fs = require('fs')
const path = require('path')
const fileName = path.resolve(__dirname, './access_token.json')
const APPID = 'wxc3a9e1e59be4a27f'
const APPSECRET = 'b74dc1d582f5c03057ea7d4a7a76a36d'
const URL = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`

const updateAccessToken = async () => {
    const resStr = await rp(URL)
    const resObj = JSON.parse(resStr)
    if (resObj.access_token) {
        fs.writeFileSync(fileName, JSON.stringify({
            access_token: resObj.access_token,
            createTime: new Date()
        }))
    } else {
        updateAccessToken()
    }
}

//从文件中读取
const getAccessToken = async () => {
    try {
        const readRes = fs.readFileSync(fileName, 'utf-8')
        const resObj = JSON.parse(readRes)

        const createTime = new Date(resObj.createTime).getTime()
        const nowTime = new Date().getTime()
        if ((nowTime - createTime) / 1000 / 60 / 60 >= 2) {
            await updateAccessToken()
            await getAccessToken()
        }
        return resObj.access_token
    } catch (error) {
        await updateAccessToken()
        await getAccessToken()
    }
}

//确保每两小时更新一次
setInterval(async () => {
    await updateAccessToken()
}, (7200 - 300) * 1000)

module.exports = getAccessToken