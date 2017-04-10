require('./index.css');
const covers = require('../data/covers');
const { knuthShuffle } = require('knuth-shuffle');
const { splitEvery, pipe, map, take } = require('ramda');

const coverImageWrapperElem = document.querySelector('#cover-image');
const coverImageElem = document.querySelector('#cover-image img');
const canvasElem = document.querySelector('#canvas');
const infoElem = document.querySelector('#info');

const resolveImageData = pipe(
  splitEvery(4),
  map(take(3)),
  map(([r, g, b]) => `rgb(${r}, ${g}, ${b})`)
);

const renderBackground = () => {
  canvasElem.width = window.innerWidth;
  canvasElem.height = window.innerHeight;

  const ctx = canvasElem.getContext('2d');
  ctx.filter = 'blur(50px) opacity(50%) saturate(200%)';
  ctx.drawImage(coverImageElem, 0, 0, window.innerWidth, window.innerHeight);
}

coverImageElem.onload = () => {
  renderBackground();

  canvasElem.classList.remove('hide');
  setTimeout(() => {
    coverImageWrapperElem.classList.remove('hide')
    infoElem.classList.remove('hide')
  }, 200);
}

window.onresize = () => renderBackground();

const cover = knuthShuffle(covers.slice(0))[0];
coverImageElem.src = cover.url;

if (cover.issue !== null) {
  infoElem.querySelector('.issue').innerHTML = `#${cover.issue}`
};
infoElem.querySelector('.title').innerHTML = cover.title;
infoElem.querySelector('.publisher').innerHTML = cover.publisher;
