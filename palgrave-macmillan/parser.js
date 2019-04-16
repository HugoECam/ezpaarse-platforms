#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Palgrave Macmillan
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

  if ((match = /^((\/us\/campaigns)|(\/gp\/series))\/(.*)$/i.exec(path)) !== null) {
    // https://www.palgrave.com:443/us/campaigns/media-and-marginalisation
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[4];
  } else if ((match = /^\/us\/book\/(.*)$/i.exec(path)) !== null) {
    // https://www.palgrave.com:443/us/book/9783319905808
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.print_identifier = match[1];
    result.unitid   = match[1];
  } else if (/^\/us\/search$/i.test(path)) {
    // https://www.palgrave.com:443/us/search?query=sandwich
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
