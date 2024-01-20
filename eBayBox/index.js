
$(document).ready(()=> {
    const boxSize = 500;
    // 以左上方为原点
    const $img = $('#bk')
    const $layout = $('#layout')
    const size = { width: $img.width(), height: $img.height() }
    $layout.css('width', size.width)
    $layout.css('height', size.height)
    $layout.css('top', (boxSize - size.height) / 2)
    
    // 文字处理区
    $('#title').on('input', (evt) => {
        const $Title = $('#Title');
        const value = evt.target.value;
        $Title.html(value)
    });

    $('#subtitle').on('input', (evt) => {
        const $Subtitle = $('#Subtitle');
        const value = evt.target.value;
        $Subtitle.html(value)
    });

    $('#infoField1').on('input', (evt) => {
        const $Information_Field_1 = $('#Information_Field_1');
        const value = evt.target.value;
        $Information_Field_1.html(value)
    });

    $('#infoField2').on('input', (evt) => {
        const $Information_Field_2 = $('#Information_Field_2');
        const value = evt.target.value;
        $Information_Field_2.html(value)
    });

    $('#parameter1').on('input', (evt) => {
        const $Parameter_1 = $('#Parameter_1');
        const value = evt.target.value;
        $Parameter_1.html(value)
    });

    $('#parameter2').on('input', (evt) => {
        const $Parameter_2 = $('#Parameter_2');
        const value = evt.target.value;
        $Parameter_2.html(value)
    });

    $('#typeText').on('input', (evt) => {
        const $TypeText = $('#TypeText');
        const value = evt.target.value;
        $TypeText.html(value)
    });

    // 图片处理区域
    $('#productImage').on('input', (evt) => {
        const $Product_Main_Image = $('#Product_Main_Image');
        const file = evt.target.files[0];
        const reader = new FileReader();
      
        reader.onload = (e) => {
            $Product_Main_Image.attr('src', e.target.result)
        };

        reader.readAsDataURL(file);
    });

    $('#sideImage').on('input', (evt) => {
        const $Side_Img = $('#Side_Img');
        const file = evt.target.files[0];
        const reader = new FileReader();
      
        reader.onload = (e) => {
            $Side_Img.attr('src', e.target.result)
        };

        reader.readAsDataURL(file);
    });

    // 导出图片
    $('#Export_Image').on('click', (evt) => {
      const node = document.getElementById('layout');

      domtoimage
        .toPng(node)
        .then(function (dataUrl) {
          const img = new Image();
          img.src = dataUrl;
          document.body.appendChild(img);

          // 如果你想下载图片
          const link = document.createElement('a');
          link.download = 'captured-image.png';
          link.href = dataUrl;
          link.click();
        })
        .catch(function (error) {
          console.error('截图失败', error);
        });

      // html2canvas($('#layout')[0]).then(canvas => {
      //     // 创建一个 Data URL
      //     const dataURL = canvas.toDataURL("image/png");

      //     // 创建一个下载链接
      //     const link = document.createElement('a');
      //     link.href = dataURL;
      //     link.download = 'captured-image.png';

      //     // 模拟点击链接
      //     document.body.appendChild(link);
      //     link.click();
      //     document.body.removeChild(link);
      // });
    });
})