const Router = require('koa-router')
const router = new Router()
const rp = require('request-promise')
const callCloudDB = require('../util/callCloudDB')
const cloudStorage = require('../util/callCloudStorage')

router.get('/list', async (ctx, next) => {
    const params = ctx.request.query
    const query = `db.collection('blog').skip(${params.start}).limit(${params.count}).orderBy('createTime','desc').get()`
    const res = await callCloudDB(ctx, 'databasequery', query)
    ctx.body = {
        code: 20000,
        data: res.data,
    }
})

router.post('/deleteList', async (ctx, next) => {
    const params = ctx.request.body
    console.log(params)
    //删除blog
    const blogquery = `db.collection('blog').doc('${params._id}').remove()
    `
    const dlblogRes = await callCloudDB(ctx, 'databasedelete', blogquery)
    //删除comment
    const commentquery = `db.collection('blog-comment').where({
        blogid:${params._id}
    }).remove()
    `
    const dlcommentRes = await callCloudDB(ctx, 'databasedelete', commentquery)
    //删除 云存储图片
    const delStorageres = await cloudStorage.delete(ctx, params.imgs)
    console.log(dlblogRes)
    console.log(dlcommentRes)
    ctx.body = {
        code: 20000,
        data: {
            dlblogRes,
            dlcommentRes,
            delStorageres
        }
    }
})

module.exports = router