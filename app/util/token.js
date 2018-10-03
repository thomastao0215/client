import Storage from './storage';
import { aesDecrypt, aesEncrypt } from './encrypt';
let userAuth = {
  token: '',
}
Storage.get('react@userAuth', 1, {
  token: '',
}).then(val => {
  userAuth = typeof val !== 'object' ? JSON.parse(aesDecrypt(val)) : val;
});

/**
 * 设置鉴权
 * @param {string} token 令牌
 */
export function setToken(token) {
  userAuth = {
    token
  }
  Storage.set('react@userAuth', aesEncrypt(JSON.stringify(userAuth)), 1);
}
/**
 * 获取令牌
 */
export function getToken() {
  return userAuth.token;
}
