#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Elgaronline
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // let param = parsedUrl.query || {};
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/platform\/path\/to\/(document-([0-9]+)-test\.pdf)$/i.exec(path)) !== null) {
    // http://parser.skeleton.js/platform/path/to/document-123456-test.pdf?sequence=1
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[1];
  } else if ((match = /^\/platform\/path\/to\/(document-([0-9]+)-test\.html)$/i.exec(path)) !== null) {
    // http://parser.skeleton.js/platform/path/to/document-123456-test.html?sequence=1
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[2];

  } else if (/^\/browse$/i.test(path)) {
    // https://www.elgaronline.com:443/browse?pageSize=10&level=parent&sort=datedescending&t0=Economics_Main_ID
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if (/^\/search$/i.test(path)) {
    // https://www.elgaronline.com:443/search?type_0=series&f_0=series&q_0=Leuven%20Global%20Governance%20series
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/abstract\/([a-zA-Z0-9_-]+)\/([0-9]+)\/([0-9]+).xml$/i.exec(path)) !== null) {
    // https://www.elgaronline.com:443/abstract/Research_Reviews/9781786438904/9781786438904.xml?rskey=2VKG4N&result=1
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.title_id = match[2];
    result.unitid   = match[3];
  } else if ((match = /^\/view\/nlm-book\/([0-9]+)\/([a-zA-Z0-9_-]+).xml$/i.exec(path)) !== null) {
    // https://www.elgaronline.com:443/view/nlm-book/9781849807777/c04_sec85.xml?rskey=qoQRWS&result=1
    result.rtype    = 'BOOK_PART';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[2];
  } else if ((match = /^\/view\/([0-9]+).([0-9]+).xml$/i.exec(path)) !== null) {
    // https://www.elgaronline.com:443/view/9781784711450.00017.xml?rskey=Ye4whX&result=5
    result.rtype    = 'BOOK_PART';
    result.mime     = 'XML';
    result.title_id = match[1];
    result.unitid   = match[1].concat('.', match[2]);
  } else if ((match = /^\/downloadpdf\/([0-9]+).([0-9]+).pdf$/i.exec(path)) !== null) {
    // https://www.elgaronline.com:443/downloadpdf/9781784711450.00014.pdf
    result.rtype    = 'BOOK_PART';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.unitid   = match[1].concat('.', match[2]);
  }
  return result;
});
