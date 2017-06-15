(function () {
'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var CoolLocalStorage = function () {
  function getAll(callback) {
    chrome.storage.local.get(null, callback);
  }

  function get(key, callback) {
    chrome.storage.local.get(key, function (obj) {
      callback(obj[key]);
    });
  }

  function set(key, value) {
    return chrome.storage.local.set(_defineProperty({}, key, value));
  }

  return {
    getAll: getAll,
    get: get,
    set: set
  };
}();

chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
});

CoolLocalStorage.set('cara', 'culo');

console.log(CoolLocalStorage.get('cara', function (object) {
  console.log('Object:' + object);
}));

chrome.browserAction.setBadgeText({ text: '\'Allo' });

console.log('\'Allo \'Allo! Event Page for Browser Action');

}());
