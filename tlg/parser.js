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

  if (/Search$/i.test(path)) {
    // http://stephanus.tlg.uci.edu:80/Iris/lsj/WordSearch?word=omega
    // http://stephanus.tlg.uci.edu:80/Iris/lsj/Search?searchterm=medicine&searchtype=meanings&exact=1&nres=500&
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if (/^\/[A-Za-z]+\/[a-z]+\/DictData$/i.test(path)) {
    // http://stephanus.tlg.uci.edu:80/Iris/lbg/DictData?eid1=13707&eid2=13715&n_eid=2&with_def=1&with_pages=1&with_rend_head=1&
    result.rtype    = 'REF';
    result.mime     = 'HTML';
  }

  return result;
});
