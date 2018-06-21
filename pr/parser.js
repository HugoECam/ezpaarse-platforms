#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform PressReader
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  if (/^\/Authentication\/ConfirmCookies$/i.test(path)) {
    // http://www.pressreader.com:80/Authentication/ConfirmCookies?_=1528393102616
    result.rtype    = 'CONNECTION';
    result.mime     = 'HTML';
  } else if (/^\/pressdisplay\/PageViewManager.aspx$/i.test(path)) {
    // http://library.pressdisplay.com:80/pressdisplay/PageViewManager.aspx?action=showpages&issue=12642018061200000000001001&page=2&page2=3&cpage=1&cpage2=1
    result.rtype    = 'ARTICLE';
    result.mime     = 'MISC';
    result.unitid   = param.issue;
  } else if (/^\/pressdisplay\/pageview.aspx$/i.exec(path)) {
    // http://library.pressdisplay.com:80/pressdisplay/pageview.aspx?issue=25262018060900000000001001&page=1&articleid=1840083106&previewmode=2
    result.rtype    = 'ARTICLE';
    result.mime     = 'MISC';
    result.title_id = param.articleid;
    result.unitid   = param.issue;
  }

  return result;
});
