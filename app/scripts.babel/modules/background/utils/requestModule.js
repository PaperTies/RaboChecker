import 'whatwg-fetch';

const requestHTMLContent = function request(url) {
  return fetch(url)
    .then(response => response.text());
};

export default requestHTMLContent;
