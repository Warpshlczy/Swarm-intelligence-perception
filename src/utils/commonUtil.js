import JSEncrypt from 'jsencrypt'

export default {
  encodeRSA(word, keyStr) {
    // 这个是公钥,有入参时用入参，没有入参用默认公钥
    keyStr = keyStr || 'MIGxxxxxxxxxxxxxxxxxxxxxxxxxx'
    // 创建对象
    const jsRsa = new JSEncrypt()
    // 设置公钥
    jsRsa.setPublicKey(keyStr)
    // 返回加密后结果
    return jsRsa.encrypt(word)
  }

}
