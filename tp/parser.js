#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Transplantation Proceedings
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let host   = parsedUrl.hostname;
  // uncomment this line if you need parameters
  // let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);


  if (/www.transplantation-proceedings.org/i.test(host)) {
    // http://www.transplantation-proceedings.org:80/
    result.rtype    = 'REF';
    result.mime     = 'HTML';
  }

  return result;
});
