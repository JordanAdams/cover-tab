const Twitter = require('twitter');
const url = require('url');
const fs = require('fs-promise');
const fsPath = require('path');
const { filter, map, chain, path, prop, propOr, pipe, flatten, both, propSatisfies, test, replace, split, head, last, uniq, take, reject, isNil, match, contains } = require('ramda');
const imgur = require('./lib/imgur');

const { TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_TOKEN_SECRET } = process.env;
const OUTPUT_PATH = fsPath.resolve(__dirname, '../data/covers.json');

const twitter = new Twitter({
  consumer_key: TWITTER_CONSUMER_KEY,
  consumer_secret: TWITTER_CONSUMER_SECRET,
  access_token_key: TWITTER_ACCESS_TOKEN,
  access_token_secret: TWITTER_ACCESS_TOKEN_SECRET
});

const tweetUrls = pipe(
  path(['entities', 'urls']),
  map(prop('expanded_url'))
);

const isImgurAlbumUrl = pipe(
  url.parse,
  both(
    propSatisfies(test(/(?:m.)?imgur.com/), 'hostname'),
    propSatisfies(test(/^\/a\//), 'path')
  )
);

const albumIdFromUrl = pipe(
  url.parse,
  prop('pathname'),
  replace('/a/', '')
);

const getAlbumImages = pipe(albumIdFromUrl, imgur.getAlbumImages);

const titleFromDescription = pipe(
  split('\n'),
  head,
  replace(/\(.*\)$/, ''),
  replace(/#\d+/, '')
);

const publisherFromDescription = pipe(split('\n'), last);

const issueFromDescription = pipe(
  split('\n'),
  head,
  match(/#(\d+).*$/),
  propOr(null, 1)
);

const createImageItem = ({ link: url, description }) => {
    return {
      url,
      title: titleFromDescription(description),
      publisher: publisherFromDescription(description),
      issue: issueFromDescription(description),
    };
};

const publisherIsOneOf = publishers => image => {
  return contains(prop('publisher', image), publishers);
};

const titleIsOneOf = titles => image => {
  return contains(prop('title', image), titles);
};

console.log('Getting twitter statuses for @TextlessCovers');
twitter.get('statuses/user_timeline', { screen_name: 'TextlessCovers' })
  .then(chain(tweetUrls))
  .then(filter(isImgurAlbumUrl))
  .then(uniq)
  .then(map(getAlbumImages))
  .then(p => Promise.all(p))
  .then(flatten)
  .then(map(createImageItem))
  .then(reject(publisherIsOneOf(['Zenescope', 'Amryl Entertainment'])))
  .then(reject(titleIsOneOf(['WWE'])))
  .then(JSON.stringify)
  .then(json => fs.writeFile(OUTPUT_PATH, json))
  .catch(err => console.error(err))
