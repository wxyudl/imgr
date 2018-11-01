;(function (window, $) {
  $('#process')[0].addEventListener('click', function (e) {
    let formData = new FormData();
    const file = $('#file')[0];
    const size = $('#size')[0].value;

    formData.append('file', file.files[0]);
    formData.append('size', size);
    const options = {
      method: 'POST',
      body: formData
    };
    
    fetch('/upload', options).then(res => {
      return res.text();
    }).then(res => {
      if (res) {
        reset();

        let img = new Image();
        let link = document.createElement('a');
        link.href = `/${ res }`;
        link.target = '_blank';
        img.src = `/${ res }`;
        $('#fname')[0].value = res;
        $('#_fname')[0].value = res;
        $('#preview')[0].innerHTML = '';

        link.appendChild(img);
        $('#preview')[0].appendChild(link);
      }
    });
  });

  $('#uploadQiniu')[0].addEventListener('click', function (e) {
    let formData = new FormData();

    const file = $('#_fname')[0].value;
    const path = $('#path')[0].value;
    const accessKey = $('#accessKey')[0].value;
    const secretKey = $('#secretKey')[0].value;
    const bucket = $('#bucket')[0].value;

    formData.append('file', file);
    formData.append('path', path);
    formData.append('accessKey', accessKey);
    formData.append('secretKey', secretKey);
    formData.append('bucket', bucket);

    const options = {
      method: 'POST',
      body: formData
    };

    fetch('/cdn/upload', options).then(res => {
      return res.text();
    }).then(res => {
      if (res) {
        if (res === 'ERROR') {
          $('#msg')[0].innerHTML = `<span style="color: red;">文件：${ file } 保存失败</span>`;
        } else {
          $('#msg')[0].innerHTML = `<span style="color: green;">文件：<a target="_blank" href="https://portal.qiniu.com/bucket/${ bucket }/resource">${ file }</a> 保存成功</span>`;
        }
      }
    });
  });

  function reset () {
    $('#file')[0].value = '';
    $('#fname')[0].value = '';
    $('#_fname')[0].value = '';
    $('#msg')[0].innerHTML = '';
  }
})(window, (sel) => {
  return document.querySelectorAll(sel);
});