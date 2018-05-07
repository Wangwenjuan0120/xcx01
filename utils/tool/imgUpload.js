import qiniuUploader from '../../lib/qiniuUploader/qiniuUploader.js'
import core from '../core/index'
import aes from '../../lib/aes/rollups/aes.js'

var CryptoJS = aes.CryptoJS;

CryptoJS.mode.ECB = function () { var a = CryptoJS.lib.BlockCipherMode.extend(); a.Encryptor = a.extend({ processBlock: function (a, b) { this._cipher.encryptBlock(a, b) } }); a.Decryptor = a.extend({ processBlock: function (a, b) { this._cipher.decryptBlock(a, b) } }); return a }();

CryptoJS.pad.NoPadding = { pad: function () { }, unpad: function () { } };

var key = "2015020120200131";
key = CryptoJS.enc.Utf8.parse(key);

function aesEncrypt(data, key) {
  var encrypted = CryptoJS.AES.encrypt(data, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();
}

function aesDecrypt(encrypted, key) {
  var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  console.log(decrypted)
  decrypted = CryptoJS.enc.Utf8.stringify(decrypted);// 转换为 utf8 字符串
  return decrypted;
}

export function imgUpload(filePath) {
  console.log(filePath)

  return new Promise((resolve, reject) => {
    core.user.getToken().then(data => {
      // 交给七牛上传
      qiniuUploader.upload(filePath, (res) => {
        console.log(res)
        resolve(res)
      }, (error) => {
        reject(false)
        console.error('error: ' + JSON.stringify(error));
      }, {
          region: 'ECN', // 华北区
          // uptokenURL: 'https://[yourserver.com]/api/uptoken',
          uptoken: aesDecrypt(data.imgToken, key),
          domain: 'http://studioimage.yxj.org.cn',
          shouldUseQiniuFileName: true
        });
    })
  })

}