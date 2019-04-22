#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/([a-z]+)\/FullTextPDF\/([0-9]{4})\/(([0-9]+).pdf)$/i.exec(path)) !== null) {
    // http://www.cabi.org/cabebooks/FullTextPDF/2016/20163382836.pdf
    // http://www.cabdirect.org:443/cabdirect/FullTextPDF/2019/20193035305.pdf
    if ((match[1] === 'cabebooks') || (match[1] === 'cabdirect')) {
      result.rtype    = 'BOOK_SECTION';
      result.mime     = 'PDF';
      result.unitid   = match[4];
      result.title_id = match[4];
    }

  } else if ((match = /^\/cabebooks\/ebook\/([0-9]+)$/i.exec(path)) !== null) {
    // http://www.cabi.org/cabebooks/ebook/20163382850
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    result.title_id = match[1];

  } else if (((match = /^\/cabdirect\/search\/$/i.exec(path)) !== null) || ((match = /^\/cabthesaurus\/mtwdk.exe$/i.exec(path)) !== null)) {
    // http://www.cabdirect.org:443/cabdirect/search/?q=rainbow&facet1f=Your%20Products&facet1o=OR&facet1v=FT&facets=1
    // http://www.cabdirect.org:443/cabdirect/search/?q=au%3a%22Babaheydari%2c+S.+B.%22
    // http://www.cabi.org:443/cabthesaurus/mtwdk.exe?searchstring=&k=default&w=rainbow&l=60&s=1&t=1&n=15&x=0&tt=0
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/cabdirect\/abstract\/([a-zA-Z0-9]+)$/i.exec(path)) !== null) {
    result.rtype    = 'ABSTRACT';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    result.title_id = match[1];

  }

  return result;
});
