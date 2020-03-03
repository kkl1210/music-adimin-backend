const Koa = require('koa');
const app = new Koa();

const Router = require('koa-router')
const router = new Router()

const cors = require('koa2-cors')
const koaBody = require('koa-body')
const ENV = 'kl-test1-bhogs'


//跨域
app.use(cors({
  origin: ['http://localhost:9528'],
  credentials: true
}))
//解析请求体
app.use(koaBody({
  multipart: true
}))
app.use(async (ctx, next) => {
  ctx.state.env = ENV
  await next()
})
const playlist = require('./controller/playlist.js')
router.use('/playlist', playlist.routes())

const swiper = require('./controller/swiper.js')
router.use('/swiper', swiper.routes())

const bloglist = require('./controller/bloglist.js')
router.use('/bloglist', bloglist.routes())

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000, () => {
  console.log('服务在3000端口监听中...')
});