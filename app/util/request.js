import axios from 'axios';
import { setToken, getToken } from '../util/token';

axios.interceptors.response.use((response) => {
  return response;
}, (err) => {
  if(err.response.status === 401) {
    console.log('token is expired, please login again.');
    getToken('');
  }
  if (err.response === undefined) {
    console.log('服务器未开启或无网络');
    err.response = {
      data: {
        code: -1
      }
    };
  }
  return Promise.reject(err);
});

axios.defaults.timeout = 5000; // 设置超时时间

export async function get(url, appToken = '') {
  let data;
  try {
    const res = appToken !== '' ? await axios.get(url, {
      headers: {
        'Authorization': appToken
      }
    }) : await axios.get(url);
    data = res.data;
  } catch (err) {
    data = err.response.data;
  } finally {
    return data;
  }
}

export async function post(url, payload = {}, appToken = '') {
  let data;
  try {
    const res = appToken !== '' ? await axios.post(url, payload, {
      headers: {
        'Authorization': appToken
      }
    }) : await axios.post(url, payload);
    data = res.data;
  } catch (err) {
    data = err.response.data;
  } finally {
    return data;
  }
}

export async function put(url, payload = {}, appToken = '') {
  let data;
  try {
    const res = appToken !== '' ? await axios.put(url, payload, {
      headers: {
        'Authorization': appToken
      }
    }) : await axios.put(url, payload);
    data = res.data;
  } catch (err) {
    data = err.response.data;
  } finally {
    return data;
  }
}

export async function del(url, appToken = '') {
  let data;
  try {
    const res = appToken !== '' ? await axios.delete(url, {
      headers: {
        'Authorization': appToken
      }
    }) : await axios.delete(url);
    data = res.data;
  } catch (err) {
    data = err.response.data;
  } finally {
    return data;
  }
}