//多桶操作
var COS = require("cos-js-sdk-v5");
import {
  Loading
} from 'element-ui';

class COSS {
  constructor(cosConfig) {
    this.url = cosConfig.url
    this.Bucket = cosConfig.Bucket
    this.Region = cosConfig.Region
    this.cos = new COS({
      SecretId: cosConfig.SecretId,
      SecretKey: cosConfig.SecretKey,
    })
  }
  /**
   * Parse the time to string
   * @param {string} dir //文件目录名
   * @param {(string|number)} id //文件目录名
   * @returns {Array} //文件对象数组
   */
  getFiles(dir, id = '') {
    var ids = id == '' ? "" : id + "/"
    var that = this
    return new Promise((resolve, reject) => {
      that.cos.getBucket({
        Bucket: that.Bucket,
        Region: that.Region,
        Prefix: dir + '/' + ids,
        /* 非必须 */
      }, function (err, data) {
        var arr = []
        data.Contents.map((item) => {
          if (item.Size > 0) {
            arr.push({
              name: item.Key.substring(item.Key.lastIndexOf('/') + 1, item.Key.length),
              url: that.url + item.Key,
              lastModified: item.LastModified
            })
          }
        })
        resolve(arr)
      });
    })
  }
  /**
   * Parse the time to string
   * @param {string} dir //文件目录名
   * @param {Array} files //文件对象数组
   * @param {(string|number)} id //文件目录名
   */
  addFiles(dir, files, id = '') {
    var ids = id == '' ? "" : id + "/"
    var arr = []
    var that = this
    files.map((item) => {
      arr.push({
        Bucket: that.Bucket, // Bucket 格式：BucketName-APPID
        Region: that.Region,
        Key: dir + "/" + ids + item.name,
        Body: item.raw,
      })
    })
    return new Promise((resolve, reject) => {
      if (arr.length == 0) {
        resolve()
      } else {
        const loading = Loading.service({
          lock: true,
          text: '图片上传中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        cos.uploadFiles({
          files: arr,
          SliceSize: 1024 * 1024,
          onProgress: function (info) {
            var percent = parseInt(info.percent * 10000) / 100;
            var speed = parseInt(info.speed / 1024 / 1024 * 100) / 100;
            loading.setText('进度：' + percent + '%; 速度：' + speed + 'Mb/s;');
            // callback('进度：' + percent + '%; 速度：' + speed + 'Mb/s;')

          },
          onFileFinish: function (err, data, options) {
            console.log(options.Key + '上传' + (err ? '失败' : '完成'));
          },
        }, function (err, data) {
          // console.log(err || data);
          loading.close();
          resolve()
        });
      }
    })
  }
  /**
   * Parse the time to string
   * @param {string} dir //文件目录名
   * @param {Array} filesName //文件名称数组
   * @param {(string|number)} id //文件目录名
   */
  delFiles(dir, filesName, id = '') {
    var ids = id == '' ? "" : id + "/"
    var arr = []
    var that = this
    filesName.map((item) => {
      arr.push([{
        Key: dir + '/' + ids + item
      }])
    })
    return new Promise((resolve, reject) => {
      if (arr.length == 0) {
        resolve()
      } else {
        cos.deleteMultipleObject({
          Bucket: that.Bucket,
          Region: that.Region,
          Objects: arr
        }, function (err, data) {
          // console.log(err || data);
          resolve()
        })
      }
    })
  }
}


export default COSS