// SDK 文档：https://developer.qiniu.com/kodo/sdk/1289/nodejs

const qiniu = require('qiniu');
const path = require('path');

const putFile = (...args) => {
  return new Promise ((res, rej) => {
    const config = new qiniu.conf.Config();
    const formUploader = new qiniu.form_up.FormUploader(config);
    
    config.zone = qiniu.zone.Zone_z0;
    formUploader.putFile(...args, function(respErr, respBody, respInfo) {
      if (respErr) {
        res('ERROR');
      }

      if (respInfo.statusCode === 200) {
        res('SUCCESS');
      } else {
        res('ERROR');
      }
    });
  });
}

module.exports = {
  async upload (ctx) {
    const file = ctx.request.body.file;
    const _path = ctx.request.body.path;
    const accessKey = ctx.request.body.accessKey;
    const secretKey = ctx.request.body.secretKey;
    const bucket = ctx.request.body.bucket;
    const putExtra = new qiniu.form_up.PutExtra();
    const localFile = path.join(__dirname, `../tmp/${ file }`);

    if (file && _path && accessKey && secretKey && bucket) {
      const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
      
      const options = {
        scope: bucket,
      };
      const putPolicy = new qiniu.rs.PutPolicy(options);
      const uploadToken = putPolicy.uploadToken(mac);
      
      ctx.body = await putFile(uploadToken, (_path + file), localFile, putExtra);
    } else {
      ctx.body = 'ERROR';
    }
  }
}