const sharp = require('sharp');

const processImage = (...file) => {
  const [w, h] = file[0].split('_');

  return new Promise ((res, rej) => {
    sharp(file[2])
    .resize(parseInt(w), parseInt(h), {
      kernel: sharp.kernel.nearest,
      fit: 'cover',
      background: '#000000'
    })
    .toFile(`./tmp/${ file[1] }`)
    .then(() => {
      res(file[1]);
    });
  });
}

const genName = () => {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';

  for (let i = 0; i < 10; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

module.exports = {
  async upload (ctx) {
    const file = ctx.request.files.file;
    const size = ctx.request.body.size;
    
    if (file) {
      const name = genName(file.name);
      const ext = file.name.match(/\.\w{3,4}$/g)[0];

      ctx.body = await processImage(size, `${ (name + ext) }`, file.path);
    } else {
      ctx.body = '';
    }
  }
}