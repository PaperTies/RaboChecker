'use strict';
import localStorage from 'background/utils/localStorageModule.js';

chrome.runtime.onInstalled.addListener(details => {
  console.log('previousVersion', details.previousVersion);
});

localStorage.set('cara', 'culo');

console.log(localStorage.get('cara'));

chrome.browserAction.setBadgeText({text: '\'Allo'});

console.log('\'Allo \'Allo! Event Page for Browser Action');
