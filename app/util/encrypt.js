import CryptoJS from 'crypto-js';

export function aesEncrypt(data, key = 'react@aesKye') {
  const crypted = CryptoJS.AES.encrypt(data, key);
  return crypted.toString();
}

export function aesDecrypt(encrypted, key = 'react@aesKye') {
  const bytes = CryptoJS.AES.decrypt(encrypted, key);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return decrypted;
}