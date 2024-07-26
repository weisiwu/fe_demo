/** @format */

function getValueFromCss(cssstr = '') {
  return cssstr.match(/([0-9]+)/g)[0];
}

function getTextWidth(text, style) {
  return textMetrics.init(style).width(text);
}

// 动态调整文字大小
function adjustNodeFontSize(node) {
  if (!node) {
    return;
  }

  const text = node.innerText || '';
  const computedStyle = window.getComputedStyle(node) || {};
  const {
    width: rawWidth,
    paddingLeft: rawPaddingLeft,
    paddingRight: rawPaddingRight,
    fontSize: rawFontSize,
    fontFamily,
    fontWeight,
  } = computedStyle;
  const width = getValueFromCss(rawWidth);
  const paddingLeft = getValueFromCss(rawPaddingLeft) || 0;
  const paddingRight = getValueFromCss(rawPaddingRight) || 0;
  const fontSize = getValueFromCss(rawFontSize);
  const useSpace = width - paddingLeft - paddingRight;
  const step = 0.5;
  let newFontSize = fontSize;

  while (
    getTextWidth(text, {
      fontSize: `${newFontSize}px`,
      fontFamily,
      fontWeight,
      width: useSpace,
    }) >= useSpace &&
    newFontSize >= 5
  ) {
    newFontSize -= step;
  }
  node.style['font-size'] = `${newFontSize}px`;
}

function uint8ArrayToImageBase64(uint8Array, mimeType, dom) {
  // 确保提供了正确的 MIME 类型
  const blob = new Blob([uint8Array], { type: mimeType });

  const reader = new FileReader();

  reader.onloadend = () => {
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
  const $csvInput = $('#input-csv');
  const size = { width: $img.width(), height: $img.height() };
  $layout.css('width', size.width);
  $layout.css('height', size.height);
  $layout.css('top', (boxSize - size.height) / 2);

  // 读取每行数据，并生成截图
  async function readLine(row, images, currentIndex) {
    const values = row.values?.filter?.((item) => item) || [];

    if (!values?.length) {
      return;
    }

    const [
      Title,
      Title_2_1 = '',
      Title_2_2 = '',
      Subtitle,
      parameter1,
      parameter2,
      Img1,
      Img2,
      infoField1,
      infoField2,
      Img3,
      Img4,
    ] = values;
    const Title_2 = `${Title_2_1} ${Title_2_2}`;

    Title && $('#Title').html(Title);
    Title_2 && $('#Title_2').html(Title_2);
    Subtitle && $('#Subtitle').html(Subtitle);
    infoField1 && $('#Information_Field_1').html(`${infoField1}KG`);
    infoField2 && $('#Information_Field_2').html(`${infoField2}KG`);
    parameter1 && $('#Parameter_1').html(parameter1);
    parameter2 && $('#Parameter_2').html(parameter2);

    if (currentIndex > images.length) {
      return;
    }

    const Product_Main_Image = images[currentIndex];
    const small_product = images[currentIndex + 1];
    const Product_sideImage_A = images[currentIndex + 2];
    const Product_sideImage_B = images[currentIndex + 3];
    // 每行有四张图，如果没有配置够数量，会出现异常
    Product_Main_Image && readImageFromMedia(Product_Main_Image, $('#Product_Main_Image'));
    small_product && readImageFromMedia(small_product, $('#small_product'));
    Product_sideImage_A && readImageFromMedia(Product_sideImage_A, $('#Product_sideImage_A'));
    Product_sideImage_B && readImageFromMedia(Product_sideImage_B, $('#Product_sideImage_B'));
    currentIndex = currentIndex + 4;

    await exportImage(`${Title} ${Title_2}`);
  }

  function readImageFromMedia(image, node) {
    uint8ArrayToImageBase64(image.buffer, `image/${image.extension || 'png'}`, node);
  }

  // 监听上传excel，并解析excel为json
  $csvInput.on('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const arrayBuffer = event.target.result;
      const workbook = new ExcelJS.Workbook();
      let currentIndex = 0;

      workbook.xlsx.load(arrayBuffer).then((data) => {
        // 从文件原始内容读取图片信息
        const images = data.media || [];

        // 这里只会读取第一个sheet
        workbook.eachSheet(async (worksheet, sheetId) => {
          if (sheetId > 1) {
            return;
          }
          const rows = [];
          // 遍历工作表中的所有行
          worksheet.eachRow((row) => rows.push(row));
          rows.reduce((sum, item) => {
            return sum.then(() => readLine(item, images, currentIndex));
          }, Promise.resolve());
        });
      });
    };

    reader.readAsArrayBuffer(file);
  });

  const exportImage = (name = 0) => {
    const node = document.getElementById('layout');
    $layout.css('top', 0);

    return domtoimage
      .toPng(node)
      .then((dataUrl) => {
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
      .catch((error) => {
        console.error('截图失败', error);
      });
  };

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
      .then((dataUrl) => {
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
      .catch((error) => {
        console.error('截图失败', error);
      });
  });

  const nodeList = [
    $('#Title')[0],
    $('#Title_2')[0],
    $('#Subtitle')[0],
    $('#Information_Field_1')[0],
    $('#Information_Field_2')[0],
  ];
  const config = { childList: true, characterData: true, subtree: true };

  for (let node of nodeList) {
    if (!node) {
      continue;
    }
    // 监听以下文字节点的内容变化，并动态调整文字大小
    const observer = new MutationObserver((mutations) => {
      for (let mutation of mutations) {
        if (mutation.type === 'characterData' || mutation.type === 'childList') {
          adjustNodeFontSize(node);
        }
      }
    });
    observer.observe(node, config);
  }
});
