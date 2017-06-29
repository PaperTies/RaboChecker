const keywordFinder = function (content, keyword) {
  const re = new RegExp(keyword, 'ig');
  return content.match(re);
};

export default keywordFinder;