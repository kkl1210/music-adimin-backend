const rp = require('request-promise')
const getAccessToken = require('../util/getAccessToken')
const fs = require('fs')

const cloudStorage = {
    async download(ctx, fileList) {
        //查询轮播图
        const ACCESS_TOKEN = await getAccessToken()
        const url = `https://api.weixin.qq.com/tcb/batchdownloadfile?access_token=${ACCESS_TOKEN}`
        const options = {
            method: 'POST',
            uri: url,
            body: {
                file_list: fileList,
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
    },
    async upload(ctx) {
        const ACCESS_TOKEN = await getAccessToken()
        const file = ctx.request.files.file
        //得到上传链接
        const path = `swiper/${Date.now()}-${Math.random()}-${file.name}`
        const options = {
            method: 'POST',
            uri: `https://api.weixin.qq.com/tcb/uploadfile?access_token=${ACCESS_TOKEN}`,
            body: {
                path,
                env: ctx.state.env,
            },
            json: true // Automatically stringifies the body to JSON
        };
        const info = await rp(options)
            .then(res => {
                return res
            })
            .catch(function (err) {
                // POST failed...
            });
        //对应上传链接上传
        const params = {
            method: 'POST',
            headers: {
                'content-type': 'multipart/form-data'
            },
            uri: info.url,
            formData: {
                key: path,
                Signature: info.authorization,
                'x-cos-security-token': info.token,
                'x-cos-meta-fileid': info.cos_file_id,
                file: fs.createReadStream(file.path)
            },
            json: true
        }
        await rp(params)
        return info.file_id
    },
    async delete(ctx, fileid_list) {
        //查询轮播图
        const ACCESS_TOKEN = await getAccessToken()
        const url = `https://api.weixin.qq.com/tcb/batchdeletefile?access_token=${ACCESS_TOKEN}`
        const options = {
            method: 'POST',
            uri: url,
            body: {
                fileid_list: fileid_list,
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
}
module.exports = cloudStorage