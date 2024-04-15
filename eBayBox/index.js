/** @format */

function uint8ArrayToImageBase64(uint8Array, mimeType, dom) {
  // 确保提供了正确的 MIME 类型
  const blob = new Blob([uint8Array], { type: mimeType });

  const reader = new FileReader();

  reader.onloadend = function () {
    const base64String = reader.result; // 包含 MIME 类型的 Base64 字符串
    dom.attr('src', base64String);
  };

  reader.readAsDataURL(blob);
}

$(document).ready(() => {
  const boxSize = 500;
  // 以左上方为原点
  const $img = $('#bk');
  const $layout = $('#layout');
  const $excelInput = $('#input-excel');
  const $csvInput = $('#input-csv');
  const size = { width: $img.width(), height: $img.height() };
  $layout.css('width', size.width);
  $layout.css('height', size.height);
  $layout.css('top', (boxSize - size.height) / 2);

  // 监听上传excel，并解析excel为json
  $excelInput.on('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
      const arrayBuffer = event.target.result;

      const workbook = new ExcelJS.Workbook();
      workbook.xlsx.load(arrayBuffer).then((data) => {
        const images = data.media;
        images.forEach((image, index) => {
          index === 0 &&
            uint8ArrayToImageBase64(image.buffer, `image/${image.extension || 'png'}`, $('#Product_Main_Image'));
          index === 1 && uint8ArrayToImageBase64(image.buffer, `image/${image.extension || 'png'}`, $('#Side_Img'));
        });

        workbook.eachSheet((worksheet, sheetId) => {
          // 遍历工作表中的所有行
          worksheet.eachRow((row, rowNumber) => {
            const [_, key, value] = row.values || [];
            if (value?.error) {
              return;
            }
            key === 'Title' && $('#Title').html(value);
            key === 'Title_2' && $('#Title_2').html(value);
            key === 'Subtitle' && $('#Subtitle').html(value);
            key === 'infoField1' && $('#Information_Field_1').html(value);
            key === 'infoField2' && $('#Information_Field_2').html(value);
            key === 'parameter1' && $('#Parameter_1').html(value);
            key === 'parameter2' && $('#Parameter_2').html(value);
          });
        });
      });
    };

    reader.readAsArrayBuffer(file);
  });

  const exportImage = (name = 0) => {
    const node = document.getElementById('layout');
    $layout.css('top', 0);

    console.log('wswTest: ', 'i开始到吃屎搜索是');
    return domtoimage
      .toPng(node)
      .then(function (dataUrl) {
        const img = new Image();
        img.src = dataUrl;
        document.body.appendChild(img);

        // 如果你想下载图片
        const link = document.createElement('a');
        link.download = `captured-image-${name}.png`;
        link.href = dataUrl;
        link.click();
        document.body.removeChild(img);
        $layout.css('top', (boxSize - size.height) / 2);
      })
      .catch(function (error) {
        console.error('截图失败', error);
      });
  };

  $csvInput.on('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
      const content = event.target.result;
      const lines = content.split('\n').map((line) => line.trim());
      const segments = lines.map((line) => line.split('\t'));
      const [columns, ...rows] = segments;

      rows.reduce((sum, row, index) => {
        return sum.then(() => {
          return new Promise((resolve, reject) => {
            $('#Title').html(row[0]);
            $('#Title_2').html(row[1]);
            $('#Subtitle').html(row[2]);
            $('#Parameter_2').html(row[3]);
            $('#Parameter_1').html(row[4]);
            $('#small_product').attr('src', row[5]);
            $('#Product_Main_Image').attr('src', row[6]);
            $('#Information_Field_1').html(row[7]);
            $('#Information_Field_2').html(row[8]);
            $('#Product_sideImage_A').attr('src', row[9]);
            $('#Product_sideImage_B').attr('src', row[10]);
            // 给5s加载图片
            setTimeout(() => resolve(exportImage(index)), 5000);
          });
        });
      }, Promise.resolve());
    };

    reader.readAsText(file);
  });

  // 文字处理区
  $('#title').on('input', (evt) => {
    const $Title = $('#Title');
    const value = evt.target.value;
    $Title.html(value);
  });

  $('#title2').on('input', (evt) => {
    const $Title = $('#Title_2');
    const value = evt.target.value;
    $Title.html(value);
  });

  $('#subtitle').on('input', (evt) => {
    const $Subtitle = $('#Subtitle');
    const value = evt.target.value;
    $Subtitle.html(value);
  });

  $('#infoField1').on('input', (evt) => {
    const $Information_Field_1 = $('#Information_Field_1');
    const value = evt.target.value;
    $Information_Field_1.html(value);
  });

  $('#infoField2').on('input', (evt) => {
    const $Information_Field_2 = $('#Information_Field_2');
    const value = evt.target.value;
    $Information_Field_2.html(value);
  });

  $('#parameter1').on('input', (evt) => {
    const $Parameter_1 = $('#Parameter_1');
    const value = evt.target.value;
    $Parameter_1.html(value);
  });

  $('#parameter2').on('input', (evt) => {
    const $Parameter_2 = $('#Parameter_2');
    const value = evt.target.value;
    $Parameter_2.html(value);
  });

  $('#typeText').on('input', (evt) => {
    const $TypeText = $('#TypeText');
    const value = evt.target.value;
    $TypeText.html(value);
  });

  // 图片处理区域
  $('#productImage').on('input', (evt) => {
    const $Product_Main_Image = $('#Product_Main_Image');
    const file = evt.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      $Product_Main_Image.attr('src', e.target.result);
    };

    reader.readAsDataURL(file);
  });

  $('#sideImage').on('input', (evt) => {
    const $Side_Img = $('#Side_Img');
    const file = evt.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      $Side_Img.attr('src', e.target.result);
    };

    reader.readAsDataURL(file);
  });

  $('#BottomLogo1').on('input', (evt) => {
    const $Side_Img = $('#Product_sideImage_A');
    const file = evt.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      $Side_Img.attr('src', e.target.result);
    };

    reader.readAsDataURL(file);
  });

  $('#BottomLogo2').on('input', (evt) => {
    const $Side_Img = $('#Product_sideImage_B');
    const file = evt.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      $Side_Img.attr('src', e.target.result);
    };

    reader.readAsDataURL(file);
  });

  $('#SideImage1').on('input', (evt) => {
    const $smallProduct = $('#small_product');
    const file = evt.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      $smallProduct.attr('src', e.target.result);
    };

    reader.readAsDataURL(file);
  });

  // 导出图片
  $('#Export_Image').on('click', (evt) => {
    const node = document.getElementById('layout');
    $layout.css('top', 0);

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
        document.body.removeChild(img);
        $layout.css('top', (boxSize - size.height) / 2);
      })
      .catch(function (error) {
        console.error('截图失败', error);
      });
  });
});
