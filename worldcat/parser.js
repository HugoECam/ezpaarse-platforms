#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Worldcat
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
  console.error(parsedUrl);

  let match;

  if (/^\/search$/i.test(path)) {
    // https://emory.on.worldcat.org:443/search?databaseList=283&queryString=se:The%20Oxford%20Mark%20Twain
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';
  
    } else if ((match = /^\/ajax\/public\/holdings\/([0-9]+)\/1$/i.exec(path)) !== null) {
    // https://emory.on.worldcat.org:443/ajax/public/holdings/1782154/1?address=&scope=
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  }

  return result;
});
