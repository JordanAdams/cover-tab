const request = require('request-promise-native');
const { prop, replace, pipe } = require('ramda');

const { IMGUR_CLIENT_ID } = process.env;

const get = (endpoint, qs) => {
  const url = `https://api.imgur.com/3${endpoint}`;
  const headers = { Authorization: `Client-ID ${IMGUR_CLIENT_ID} `};

  console.log(`GET ${url}`);
  return request({ url, qs, headers, json: true });
};

const getAlbumImages = id => {
  return get(`/album/${id}/images`)
    .then(prop('data'));
};

const getSmallThumbnailUrl = pipe(
  replace('.png', 't.png'),
  replace('.jpg', 't.jpg'),
  replace('.jpeg', 't.jpeg')
);

module.exports = {
  get,
  getAlbumImages,
  getSmallThumbnailUrl
};
