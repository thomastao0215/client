import networking from "../config";
import { post, get } from '../util/request';
import { getToken } from "../util/token";


export async function searchNeighbor({ timeStart, timeSortOrder
  , priceSortOrder, timeEnd, AmtStart, AmtEnd, stateType,
  county = '', locality = '', neighbor = '', keyword = '', page = 1 }) {
  let testUrl = networking.baseURL + "search/neighbor";
  const option = {
    timeStart,
    timeEnd,
    timeSortOrder,
    priceSortOrder,
    AmtStart,
    AmtEnd,
    stateType,
    county,
    locality,
    neighbor,
    keyword,
    page
  }
  console.log(option);
  return await post(testUrl, option, getToken());
}

export async function searchZipCode({ timeStart, timeSortOrder
  , priceSortOrder, timeEnd, AmtStart, AmtEnd, zipcode, keyword = '', page = 1 }) {
  let testUrl = networking.baseURL + "search/zipcode";
  let { data } = await post(testUrl, {
    timeStart,
    timeEnd,
    timeSortOrder,
    priceSortOrder,
    AmtStart,
    AmtEnd,
    zipcode,
    keyword,
    page
  }, getToken());
  return { data }
}

export async function searchGoogle({ zipcode, autoCompleteObj, keyword = '', page = 1 }) {
  let testUrl = networking.baseURL + "search/google";
  return await post(testUrl, {
    zipcode,
    autoCompleteObj,
    keyword,
    page
  }, getToken());
}

export async function searchDetail({ id }) {
  let testUrl = networking.baseURL + "search/unit";
  return await post(testUrl, {
    id
  }, getToken());
}

export async function getNeighborCounty({ county, state }) {
  let testUrl = networking.baseURL + "search/getNeighborCounty";
  return await post(testUrl, {
    county,
    state
  }, getToken());
}

export async function searchNearby({ address, zipcode, state }) {
  let testUrl = networking.baseURL + "search/nearby";
  return await post(testUrl, {
    address,
    zipcode,
    state,
  }, getToken());
}

export async function searchChart({ timeStart, timeSortOrder
  , priceSortOrder, timeEnd, AmtStart, AmtEnd, zipcode,neigbor }) {
  let testUrl = networking.baseURL + "search/agg";
  return await post(testUrl, {
    timeStart,
    timeEnd,
    timeSortOrder,
    priceSortOrder,
    AmtStart,
    AmtEnd,
    zipcode,
    neigbor
  }, getToken());
}



export async function searchChartList({ zipcode, year, month,state, county, locality, neighbor }) {
  let testUrl = networking.baseURL + "search/chartlist";
  return await post(testUrl, {
    zipcode,
    year,
    month,
    state, county, locality, neighbor
  }, getToken());
}
