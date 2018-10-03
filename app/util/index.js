import { Dimensions } from 'react-native';

export const dateFormat = require('dateformat');

export const DEVICE_WIDTH = Dimensions.get('window').width;

export const DEVICE_HEIGHT = Dimensions.get('window').height;

export { NavigationActions } from 'react-navigation'

export { default as Storage } from './storage'

export const delay = time => new Promise(resolve => setTimeout(resolve, time))

export const createAction = type => payload => ({ type, payload })

export const createAct = type => payload => ({ type, ...payload })

export function addCommas(num) {
  let result = '';
  num = (num || 0).toString();
  while (num.length > 3) {
    result = `,${num.slice(-3)}${result}`;
    num = num.slice(0, num.length - 3);
  }
  if (num) { result = num + result; }
  return result;
}
