#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Thesaurus Linguae Graecae
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /Search$/i.exec(path)) !== null) {
    // http://stephanus.tlg.uci.edu:80/Iris/lsj/WordSearch?word=omega
    // http://stephanus.tlg.uci.edu:80/Iris/lsj/Search?searchterm=medicine&searchtype=meanings&exact=1&nres=500&
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/platform\/path\/to\/(document-([0-9]+)-test\.html)$/i.exec(path)) !== null) {
    // http://parser.skeleton.js/platform/path/to/document-123456-test.html?sequence=1
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[2];
  }

  return result;
});
