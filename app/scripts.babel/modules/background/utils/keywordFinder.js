const keywordFinder = function (content, keyword) {
  const re = new RegExp(keyword, 'ig');
  return content.match(re).length > 0;
};

export default keywordFinder;
