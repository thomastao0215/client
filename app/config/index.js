export const searchType = {
  neighbor: Symbol('neighbor search'),
  zipCode: Symbol('zipCode search'),
  google: Symbol('google addr search'),
};

export default {
  devURL: 'https://realty-analytics.herokuapp.com/api_v1/',
  testURL: "http://localhost:8000/api_v1/",
  // baseURL: 'http://104.196.181.194:3009/'
  baseURL:'http://localhost:3009/'
}
