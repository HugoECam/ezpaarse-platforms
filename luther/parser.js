#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Luthers Werke
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

  // let match;

  if (/^\/(english|deutsch)\/frames\/werke\/search$/i.test(path)) {
    // http://luther.chadwyck.com:80/english/frames/werke/search
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if (/^\/(english|deutsch)\/frames\/werke\/htxview$/i.test(path)) {
    // http://luther.chadwyck.com:80/english/frames/werke/htxview?template=toc_hdft.htx&content=toc_top.htx
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
  } else if (/^\/(english|deutsch)\/frames\/werke\/toc$/i.exec(path)) {
    // http://luther.chadwyck.com:80/english/frames/werke/toc?action=byid&id=L0000085&CONTROL=ON
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = param.id;
    result.unitid   = param.id;
  } else if (/^\/(english|deutsch)\/frames\/werke\/fulltext$/i.test(path)) {
    // http://luther.chadwyck.com:80/english/frames/werke/fulltext?ALL=Y&action=byid&warn=Y&size=2877&id=Z000018206&div=0&sequence=0&file=../session/1528322223_25559
    result.rtype    = 'BOOK';
    result.mime     = 'HTML';
    result.title_id = param.id;
    result.unitid   = param.id;
  }

  return result;
});
