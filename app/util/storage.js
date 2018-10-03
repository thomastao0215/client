import { AsyncStorage } from 'react-native'

function clear() { // type < 0的时候全部清空
  AsyncStorage.clear();
}
/**
 * 
 * @param {string} key 
 * @param {number} type 获取的类型，0是对象，1是文本
 * @param {*} defaultValue 
 */
async function get(key, type = 0, defaultValue = null) {
  if (typeof type !== 'number') {
    defaultValue = type;
  }
  let value = await AsyncStorage.getItem(key);
  if (value !== null) {
    return type === 1 ? value : JSON.parse(value);
  } else return defaultValue;
}

/**
 * 
 * @param {string} key 
 * @param {*} value 
 * @param {number} type 储存的类别，1代表是string，0代表是object
 */
function set(key, value, type = 0) {
  AsyncStorage.setItem(key, type === 1 ? value : JSON.stringify(value));
}
/**
 * 
 * @param {string} key 
 */
function remove(key) {
  return AsyncStorage.removeItem(key);
}
/**
 * 
 * @param {string} keys 
 */
function multiGet(keys) {
  return AsyncStorage.multiGet([...keys]).then(stores => {
    const data = {};
    stores.forEach((result, i, store) => {
      data[i] = JSON.parse(store[i][1]);
    });
    return data;
  })
}
/**
 * 
 * @param {string} keys 
 */
function multiRemove(keys) {
  return AsyncStorage.multiRemove([...keys]);
}

export default {
  clear,
  get,
  set,
  remove,
  multiGet,
  multiRemove,
}
