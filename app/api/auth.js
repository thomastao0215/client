import networking from '../config';
import { get, post } from '../util/request';
import { setToken, getToken } from '../util/token';

export async function guestSign(deviceId) {
  let url = networking.baseURL + "user/guest";
  let data = await post(url, {
    deviceId
  });
  !data.error && setToken(data.token);
  return data;
}

export async function loginCheck({ email, password }) {
  let url = networking.baseURL + "user/login";
  let data = await post(url, { email, password });
  !data.error && setToken(data.token);
  return data;
}

export async function googleCheck(idToken) {
  let url = `${networking.baseURL}/user/google`;
  let data = await post(url, {
    idToken
  });
  return data;
}

export async function fbCheck(id) {
  let url = `${networking.baseURL}/user/facebook`;
  let data = await post(url, {
    id
  });
  return data;
}

export async function registerverified(email) {
  let url = networking.baseURL + "user/verifycode";
  return await post(url, { email });
}

export async function register({ email, code, password, password2 }) {
  let url = networking.baseURL + "user/register";
  return await post(url, { email, code, password, password2 });
}

export async function resetPassword(email) {
  let url = networking.baseURL + "user/reset";
  return await post(url, { email }, getToken());
}