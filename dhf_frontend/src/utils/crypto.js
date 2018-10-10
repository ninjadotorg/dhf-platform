const CryptoJS = require('crypto-js');

export const IsJsonString = (str) => {
    try {
      return JSON.parse(str);
    } catch (e) {
      return false;
    }
  }

export const  decryptWalletsByPassword = (ciphertext, password) => {
    try {
      const bytes = CryptoJS.AES.decrypt(ciphertext, password);
      const plaintext = bytes.toString(CryptoJS.enc.Utf8);
      const walletsObject = IsJsonString(plaintext);
      return walletsObject;
    } catch (err) {
      return false;
    }
  }