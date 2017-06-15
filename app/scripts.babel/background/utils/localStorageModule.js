import storage from 'chrome.storage.local';

const LocalStorageModule = (function () {
  function getAll(callback) {
    storage.get(null, callback);
  }

  function get(key, callback) {
    storage.get(key, (obj) => { callback(obj[key]); });
  }

  function set(key, value) {
    return storage.set({ [key]: value });
  }

  return {
    getAll,
    get,
    set,
  };
}());

export default LocalStorageModule;
