const Koa = require('koa');
const Router = require('koa-router');
const render = require('koa-ejs');
const path = require('path');
const static = require('koa-static');
const koaBody = require('koa-body');

const app = new Koa();
const router = new Router();
const IndexCtrl = require('./controllers/index');
const UploadCtrl = require('./controllers/upload');
const CDNCtrl = require('./controllers/cdn');

render(app, {
  root: path.join(__dirname, 'templates'),
  layout: 'template',
  viewExt: 'html',
  cache: false,
  debug: false
});

router.get('/', IndexCtrl.index);
router.post('/upload', UploadCtrl.upload);
router.post('/cdn/upload', CDNCtrl.upload);

app.use(koaBody({ multipart: true }));
app.use(static(__dirname + '/static'));
app.use(static(__dirname + '/tmp'));
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);