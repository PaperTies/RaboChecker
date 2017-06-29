import requestHTMLContent from './modules/background/utils/requestModule';
import keywordFinder from './modules/background/utils/keywordFinder';
import CoolLocalStorage from './modules/background/utils/localStorageModule.js';

chrome.runtime.onInstalled.addListener((details) => {
  console.log('previousVersion', details.previousVersion);
});

CoolLocalStorage.set('cara', 'culo');

requestHTMLContent('https://bandit.io').then((data) => {
  console.log(keywordFinder(data,'bandit'));
});


console.log(CoolLocalStorage.get('cara', (object) => { console.log(`Object:${object}`); }));

chrome.browserAction.setBadgeText({ text: '\'Allo' });

console.log('\'Allo \'Allo! Event Page for Browser Action');
