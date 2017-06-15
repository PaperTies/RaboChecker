const CoolLocalStorage = (function () {
  function getAll(callback) {
    chrome.storage.local.get(null, callback);
  }

  function get(key, callback) {
    chrome.storage.local.get(key, (obj) => { callback(obj[key]); });
  }

  function set(key, value) {
    return chrome.storage.local.set({ [key]: value });
  }

  return {
    getAll,
    get,
    set,
  };
}());

export default CoolLocalStorage;
