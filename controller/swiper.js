const Router = require('koa-router')
const router = new Router()
const rp = require('request-promise')
const callCloudDB = require('../util/callCloudDB')
const cloudStorage = require('../util/callCloudStorage')

router.get('/list', async (ctx, next) => {
    //默认一次十条数据
    const query = `db.collection('swiper').get()`
    const res = await callCloudDB(ctx, 'databasequery', query)

    //文件下载
    let fileList = []
    for (let i = 0, len = res.data.length; i < len; i++) {
        fileList.push({
            fileid: JSON.parse(res.data[i]).fileid,
            max_age: 7200,
        })
    }
    const dlres = await cloudStorage.download(ctx, fileList)
    let fileURLs = []
    for (let i = 0, len = dlres.file_list.length; i < len; i++) {
        fileURLs.push({
            fileid: dlres.file_list[i].fileid,
            download_url: dlres.file_list[i].download_url,
            _id: JSON.parse(res.data[i])._id,
        })
    }
    ctx.body = {
        code: 20000,
        data: fileURLs
    }
})

router.post('/upload', async (ctx, next) => {
    const fileid = await cloudStorage.upload(ctx)
    //写数据库
    const query = `db.collection('swiper').add({
        data:{
            fileid:'${fileid}'
        }
    })
    `
    const res = await callCloudDB(ctx, 'databaseadd', query)
    ctx.body = {
        code: 20000,
        id_list: res.id_list
    }
})

router.get('/deleteList', async (ctx, next) => {
    const param = ctx.request.query
    const query = `db.collection('swiper').doc('${param._id}').remove()`
    const delDBres = await callCloudDB(ctx, 'databasedelete', query)
    //删除云存储
    const delStorageres = await cloudStorage.delete(ctx, [param.fileid])
    console.log(delStorageres)
    ctx.body = {
        code: 20000,
        data: {
            delDBres,
            delStorageres
        }
    }
})

module.exports = router