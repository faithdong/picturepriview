/*
 * @Author: zhongxd 
 * @Date: 2018-05-29 16:17:44 
 * @Last Modified by: zhongxd
 * @Last Modified time: 2018-05-29 16:30:04
 * 图片预览插件
 */

; (function () {
  'use strict'
  var _global;
  var imgCgyFlag = 0;//选中标志
  //----1、定义插件构造函数-----
  function PicturePriview(data) {
    var self = this;
    self.isImgsLoopFlag = true; //是否循环播放标志
    //测试数据
    var imagesAry = [
      {
        src: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png',
      },
      {
        src: './images/img1.jpg',
      },
      {
        src: './images/img2.jpg',
      },
      {
        src: './images/img3.jpg',
      }
    ];

    /* data = {
      imgType1: [
        { src: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
        { src: './images/img1.jpg' },
        { src: './images/img2.jpg' },
        //{src: './images/img3.jpg'}
      ],
      imgType2: [
        { src: './images/type2img1.jpg' },
        { src: './images/type2img2.jpg' },
        { src: './images/type2img3.jpg' }
      ],
      imgType3: [
        { src: './images/type2img2.jpg'},
        { src: './images/type2img3.jpg'},
        { src: './images/img2.jpg'},
      
      ]
    }; */
    this.initial(data, imagesAry);
  };

  //-----2、定义插件方法-----
  /**
   * 
   * @param {*} imagesAry 图片对象 
   */
  PicturePriview.prototype.initial = function (data, imagesAry) {
    //1、参数判断
    if (imagesAry.length == 0) return false;
    //2、创建图片预览字符静态串模板并插入到body中
    var strHtml = createPicMagnifier();
    document.body.innerHTML = strHtml;
    //3、将图片数据动态渲染到页面中
    renderImagsToHtml(data);
    //4、初始化图片轮播
    //this.pictureRotation(data,imagesAry);
    //5、初始化图片放大镜
    this.pictureMagifier(data, imagesAry);

  };

  /**
   * 图片轮播
   * @param {*} imagesAry 
   */
  PicturePriview.prototype.pictureRotation = function (data, imagesAry) {
    this.pictureAutoPlay(data, imagesAry);
  };

  /**
   * 自动轮播图片
   * @param {*} imagesAry 
   */
  PicturePriview.prototype.pictureAutoPlay = function (data, imagesAry) {
    if (PicturePriview.isImgsLoopFlag == false) {
      clearInterval(pictureTimer);
      return;
    } else {
      nextPic(data);
    }

  };

  /**
   * 图片放大
   * 鼠标经过图片，移动图片，离开图片事件
   * @param {*} imagesAry 
   */
  PicturePriview.prototype.pictureMagifier = function (data, imagesAry) {
    var originalDiv = document.getElementById('normalimgdiv');
    var mirrorDiv = document.getElementById('mirrorDiv');
    var scaler = document.getElementById('scaler');
    var real_left = originalDiv.offsetLeft;
    var real_right = originalDiv.offsetWidth + originalDiv.offsetLeft;
    var real_top = originalDiv.offsetTop;
    var real_bottom = originalDiv.offsetHeight + originalDiv.offsetTop;
    var self = this;
    originalDiv.onmouseover = function (e) {
      self.isImgsLoopFlag = false;
      var mirrorDiv = document.getElementById('mirrorDiv');
      var scaler = document.getElementById('scaler');
      originalDiv.style.cursor = "move";
      mirrorDiv.style.display = "block";
      scaler.style.display = "block";
    };

    originalDiv.onmousemove = function (e) {
      self.isImgsLoopFlag = false;
      //console.log('left:' + e.clientX + '---top:' + e.clientY);
      //1、获取图片容器外层div距离浏览器窗口top，left距离
      var ppmodalDiv = document.getElementById('ppmodal');
      var ppmodal_left = ppmodalDiv.offsetLeft;
      var ppmodal_top = ppmodalDiv.offsetTop;
      //2、获取图片缩略图容器div距离父容器top，left距离
      var originalDiv = document.getElementById('normalimgdiv');
      var original_left = originalDiv.offsetLeft;
      var original_top = originalDiv.offsetTop;
      //3、计算放大镜div在缩略图中的位置
      var scaler = document.getElementById('scaler');
      var mouseInPicX = e.clientX - ppmodal_left - original_left - (scaler.offsetWidth / 2);
      var mouseInPicY = e.clientY - ppmodal_top - original_top - (scaler.offsetWidth / 2);
      scaler.style.top = mouseInPicY + 'px';
      scaler.style.left = mouseInPicX + 'px';
      var maximg = document.getElementById('maximg');
      //4、就算放大镜位置，并固定放大4倍
      maximg.style.left = '-' + (mouseInPicX * 3) + 'px';
      maximg.style.top = '-' + (mouseInPicY * 3) + 'px';;
      maximg.style.width = (originalDiv.offsetWidth * 3) + 'px';
      maximg.style.height = (originalDiv.offsetHeight * 3) + 'px';
      return;
    };

    originalDiv.onmouseout = function (e) {
      self.isImgsLoopFlag = true;
      //self.pictureAutoPlay(data, imagesAry);
      var mirrorDiv = document.getElementById('mirrorDiv');
      var scaler = document.getElementById('scaler');
      mirrorDiv.style.display = "none";
      scaler.style.display = "none";
    };

  };

  /**
   * 创建 图片预览插件静态模板字符串 html 
   */
  var createPicMagnifier = function () {
    var strHtml =
      '<div class="pp-modal-mask"></div><div class="pp-modal-wrap">'
      + '<div class="pp-modal-wrap">'
      + '<div class="pp-modal" id="ppmodal" style="width: 500px; transform-origin: -30px 431px 0px;">'
      + '<div class="pp-modal-content" id="pmc">'
      + '<button aria-label="Close" class="pp-modal-close"><span class="pp-modal-close-x"></span></button>'
      + '<div class="pp-modal-header"><div class="pp-modal-title" id="rcDialogTitle2">图片预览</div></div>'
      + '<div class="pp-modal-body">'
      + '<div class="pp-card-category" id="imgcategory">'
      //+ '<div class="pp-card-right-d">场景图</div>'
      //+ '<div class="pp-card-right-d">细节图</div>'
      //+ '<div class="pp-card-right-d">腿色图</div>'
      + '</div>'
      + '<div class="pp-scale">'
      + '<div class="pp-card pp-card-bordered" id="normalimgdiv">'
      + '<img alt="example" width="100% " style="vertical-align: middle; height: 350px;" ">'
      + '<div class="fd" id="scaler"></div>'
      + '</div>'
      + '<div class="pp-card">'
      + '<div class="pp-card-anchor-prv prv" id="imgprv" style="z-index:2106"><img src="./images/prv.png" /></div>'
      + '<div class="spec-list" id="speclist">'
      + '<div class="spec-items" id="specitems">'
      + '<ul>'
      //+ '<li><img alt="缩略图" src="./images/img1.jpg" />/li>'
      //+ '<li><img alt="缩略图" src="./images/img2.jpg" />/li>'
      // + '<li><img alt="缩略图" src="./images/img3.jpg" />/li>'
      + '</ul>'
      + '</div>'
      + '</div>'
      + '<div class="pp-card-anchor-next next" id="imgnext" style="z-index:2106"><img src="./images/next.png" /></div>'
      + '</div>'
      + '<div class="pp-image-max" id="mirrorDiv">'
      + '<img alt="example" id="maximg"  />'
      + '</div>'
      + '</div>'
      + '</div>'
      + '</div>'
      + '</div>'
      + '</div>'
      + '</div>';
    return strHtml;

  };


  /**
   * 渲染图片到html
   * @param {*} imagesData 
   */
  var renderImagsToHtml = function (imagesData) {
    //1、默认显示一张缩放图片
    var normalimg = document.querySelector('#normalimgdiv img');//单张缩略图
    var specitems = document.querySelector('#specitems ul');//多张缩略图
    var maximg = document.getElementById('maximg');//放大图
    normalimg.src = imagesData.imgType1[0].src;
    //2、默认显示一组缩略图
    var specitems = document.querySelector('#specitems ul');
    for (var i = 0; i < imagesData.imgType1.length; i++) {
      var li = document.createElement("li");
      var img = document.createElement("img");
      img.setAttribute('data-index', i);
      img.src = imagesData.imgType1[i].src;
      li.appendChild(img);
      specitems.appendChild(li);
    }
    //默认给缩略图第一张加border
    var img = specitems.children[0].firstChild;
    img.className = 'stld';
    //3、添加图片分类
    var imgcategory = document.querySelector('#imgcategory');
    var namAry = ['场景图', '细节图', '腿色图'];
    for (var i = 0; i < 3; i++) {
      var div = document.createElement("div");
      div.className = 'pp-card-right-d';
      div.innerHTML = namAry[i];
      div.setAttribute('category-name', namAry[i]);
      div.setAttribute('category-index', i);
      imgcategory.appendChild(div);
    }
    //4、添加缩略图mouseovre事件
    var list = document.getElementById("specitems").getElementsByTagName("li");
    for (var i = 0; i < list.length; i++) {
      var li = list[i];
      li.onmouseover = (function (index) {
        return function () {
          for (var i = 0; i < specitems.children.length; i++) {
            if (index != i) {
              var li = specitems.children[i];
              var img = li.firstChild;
              //img.style.border = '';
              img.className = '';
            } else {
              var li = specitems.children[i];
              var img = li.firstChild;
              //img.style.border = '2px solid rgb(32, 192, 117)';
              img.className = 'stld';
              if (imgCgyFlag == 0) {
                normalimg.src = imagesData.imgType1[index].src;
                maximg.src = imagesData.imgType1[index].src;
              } else if (imgCgyFlag == 1) {
                normalimg.src = imagesData.imgType2[index].src;
                maximg.src = imagesData.imgType2[index].src;
              } else {
                normalimg.src = imagesData.imgType3[index].src;
                maximg.src = imagesData.imgType3[index].src;
              }
            }
          }
        };
      })(i);

      li.onmouseout = (function (index) {
        return function (e) {
          //1、鼠标离开当前li，就清空样式
          var li = specitems.children[index];
          var currentImg = li.firstChild;
          currentImg.className = '';
          //2、当鼠标离开li，判断鼠标有没有进入其他li的，如果没有,就把样式重新赋值给当前li
          for (var i = 0; i < specitems.children.length; i++) {
            var li = specitems.children[i];
            var img = li.firstChild;
            var clsFlag = img.hasAttribute('class');
            if (clsFlag === true && img.getAttribute('class') != 'stld') {
              currentImg.className = 'stld';
              return;
            }
          }
        }
      })(i);
    }
    //5、添加图片分类onclick事件
    var imgcategory = document.getElementById("imgcategory").getElementsByTagName("div");
    for (var j = 0; j < imgcategory.length; j++) {
      var categoryDiv = imgcategory[j];
      categoryDiv.onclick = function (e) {
        console.log(e);
        var cgyDiv = e.target;
        var cgyType = cgyDiv.getAttribute('category-index');
        if (cgyType == '0') {//场景图
          imgCgyFlag = 0;
          for (var i = 0; i < imagesData.imgType1.length; i++) {
            var li = specitems.children[i];
            var img = li.firstChild;
            img.src = imagesData.imgType1[i].src;
          }
          normalimg.src = imagesData.imgType1[0].src;
          maximg.src = imagesData.imgType1[0].src;
          //默认给缩略图第一张加border
          var img = specitems.children[0].firstChild;
          img.className = 'stld';
        } else if (cgyType == '1') { //细节图
          imgCgyFlag = 1;
          for (var i = 0; i < imagesData.imgType2.length; i++) {
            var li = specitems.children[i];
            var img = li.firstChild;
            img.src = imagesData.imgType2[i].src;
          }
          normalimg.src = imagesData.imgType2[0].src;
          maximg.src = imagesData.imgType2[0].src;
          //默认给缩略图第一张加border
          var img = specitems.children[0].firstChild;
          img.className = 'stld';
        } else { //腿色图
          imgCgyFlag = 2;
          for (var i = 0; i < imagesData.imgType3.length; i++) {
            var li = specitems.children[i];
            var img = li.firstChild;
            img.src = imagesData.imgType3[i].src;
          }
          normalimg.src = imagesData.imgType3[0].src;
          maximg.src = imagesData.imgType3[0].src;
          //默认给缩略图第一张加border
          var img = specitems.children[0].firstChild;
          img.className = 'stld';
        }
      }
    }

    //6、添加图片上一页，下一页onclick事件
    var imgprv = document.getElementById('imgprv');
    var imgnext = document.getElementById('imgnext');
    imgprv.onclick = function (e) {
      e.preventDefault();
      //1、获取到li缩略图数据及当前选中的缩略图的index
      var liList = specitems.children;
      var crtImgIdx = 0;
      for (var i = 0; i < liList.length; i++) {
        var img = liList[i].firstChild;
        var clsFlag = img.hasAttribute('class');
        if (clsFlag === true) {
          if (img.getAttribute('class') == 'stld') {
            crtImgIdx = parseInt(img.getAttribute('data-index'));
          }
        }
      }
      //2、根据缩略图索引值显示上一张图片
      if (crtImgIdx == 0) return;
      liList[crtImgIdx].firstChild.className = '';
      liList[crtImgIdx - 1].firstChild.className = 'stld';
      liList[crtImgIdx - 1].style.display = 'block';
      normalimg.src = liList[crtImgIdx-1].firstChild.src;
      maximg.src = liList[crtImgIdx-1].firstChild.src;
    };

    /**
     * 下一张图片
     * @param {*} e 
     */
    imgnext.onclick = function (e) {
      e.preventDefault();
      //1、获取到li缩略图数据及当前选中的缩略图的index
      var liList = specitems.children;
      var crtImgIdx = 0;
      for (var i = 0; i < liList.length; i++) {
        var img = liList[i].firstChild;
        var clsFlag = img.hasAttribute('class');
        if (clsFlag === true) {
          if (img.getAttribute('class') == 'stld') {
            crtImgIdx = parseInt(img.getAttribute('data-index'));
          }
        }
      }
      //2、判断是否有下一张图片
      if (crtImgIdx == liList.length - 1) return;
      if (crtImgIdx < 2) {
        liList[crtImgIdx].firstChild.className = '';
        liList[crtImgIdx + 1].firstChild.className = 'stld';
        normalimg.src = liList[crtImgIdx + 1].firstChild.src;
        maximg.src = liList[crtImgIdx + 1].firstChild.src;
      } else {
        liList[crtImgIdx + 1].style.display = 'block';
        liList[crtImgIdx + 1].firstChild.className = 'stld';
        normalimg.src = liList[crtImgIdx + 1].firstChild.src;
        maximg.src = liList[crtImgIdx + 1].firstChild.src;
        liList[(crtImgIdx + 1) - 3].style.display = 'none';
        liList[crtImgIdx].firstChild.className = '';
      }

    };

  };

  /**
   * 下一张图片
   * @param {*} imagesData 
   */
  var nextPic = function (imagesData) {
    var indexLen = imagesData.imgType1.length;
    var index = -1;
    var indexCurrent = -1;
    var pictureTimer = null;
    pictureTimer = setInterval(function () {
      console.log('autoplay');
      indexCurrent++;
      //如果鼠标进入图片就停止轮播图片
      if (PicturePriview.isImgsLoopFlag == false) {
        clearInterval(pictureTimer);
        return;
      }
      var normalimg = document.querySelector('#normalimgdiv img');//单张缩略图
      var specitems = document.querySelector('#specitems ul');//多张缩略图
      var maximg = document.getElementById('maximg');//放大图
      var len = specitems.children.length; //缩略图共有多少张
      for (var i = 0; i < len; i++) {
        var li = specitems.children[i];
        var img = li.firstChild;
        img.style.border = '';
      }
      if (indexCurrent == 0) {
        var li = specitems.children[indexCurrent];
        var img = li.firstChild;
        img.style.border = '2px solid rgb(32, 192, 117)';
        normalimg.src = imagesData.imgType1[indexCurrent].src;
        maximg.src = imagesData.imgType1[indexCurrent].src;
      } else if (indexCurrent > 0 && indexCurrent <= len - 1) {
        var prvLi = specitems.children[indexCurrent - 1];
        var prvImg = prvLi.firstChild;
        prvImg.style.border = '';
        var li = specitems.children[indexCurrent];
        var img = li.firstChild;
        img.style.border = '2px solid rgb(32, 192, 117)';
        normalimg.src = imagesData.imgType1[indexCurrent].src;
        maximg.src = imagesData.imgType1[indexCurrent].src;
      } else {
        indexCurrent = -1;
      }
    }, 2000);
  };


  /**
   * 创建镜像盒子
   */
  var createMirror = function () {
    var normalimgdiv = document.getElementById('normalimgdiv');
    var mirrorDiv = null;
    var mirrorImg = null;
    var scaler = null;
    var originalStyle = getComputedStyle(normalimgdiv);
    mirrorDiv = document.createElement("div")
    mirrorDiv.style.cssText = 'width:' + originalStyle.width +
      ';height:' + originalStyle.height +
      ';position:absolute;left:' + originalStyle.width +
      ';top:0px;margin-left:10px;overflow:hidden;';
    //创建镜像图片
    mirrorImg = document.createElement("img")
    mirrorImg.style.cssText = 'width:' + (normalimgdiv.offsetWidth * 4) +
      'px;height:' + normalimgdiv.offsetHeight * 4 + 'px;position:absolute;top:0px;left:0px;'
    mirrorImg.src = normalimgdiv.src;
    mirrorDiv.appendChild(mirrorImg);
    normalimgdiv.appendChild(mirrorDiv);
  };

  /**
   * 创建放大镜div
   * @param {*} left 
   * @param {*} top 
   */
  var createScaler = function (left, top) {
    var normalimgdiv = document.getElementById('normalimgdiv');
    var scaler = document.createElement("div")
    scaler.style.cssText = 'width:100px;height:100px;background-color:yellow;opacity:0.4;position:absolute;'
    scaler.style.top = top;
    scaler.style.left = left;
    normalimgdiv.appendChild(scaler);
  };



  //3、将插件对象暴露给全局对象
  _global = (function () {
    return this || (0, eval)('this');
  }());
  if (typeof module !== "undefined" && module.exports) {
    module.exports = PicturePriview;
  } else if (typeof define === 'function' && define.amd) {
    define(function () {
      return PicturePriview;
    });
  } else {
    !('PicturePriview' in _global) && (_global.PicturePriview = PicturePriview);
  }
}());
