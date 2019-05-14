#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Duke University Press
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

  if (/^\/search-results$/i.test(path)) {
    // https://read.dukeupress.edu:443/search-results?page=1&q=aristotle
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if (/^\/books\/search-results$/i.test(path)) {
    // https://read.dukeupress.edu:443/books/search-results?page=1&f_FacetCategoryIDs_1=6&fl_SiteID=1000007&allBooks=1
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if (/^\/books\/pages\/Browse_by_([a-zA-Z]+)$/i.test(path)) {
    // https://read.dukeupress.edu:443/books/pages/Browse_by_Subject
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if (/^\/journals\/pages\/Browse_by_([a-zA-Z]+)$/i.test(path)) {
    // https://read.dukeupress.edu:443/journals/pages/Browse_by_Title
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/books\/book\/([0-9]+)\/([a-zA-Z0-9-]+)$/i.exec(path)) !== null) {
    // https://read.dukeupress.edu:443/books/book/2045/Natural-and-Moral-History-of-the-Indies
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.title_id = match[1].concat('/', match[2]);
    result.unitid   = match[2];
  } else if ((match = /^\/([a-z]+)\/article\/([0-9]+)\/$/i.exec(path)) !== null) {
    // https://read.dukeupress.edu:443/tikkun/article/30383/?searchresult=1&searchresult=1
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.title_id = match[2];
    result.unitid   = match[2];
  } else if ((match = /^\/([a-z]+)\/article-abstract\/([0-9]+)\/([0-9]+)\/([0-9]+)\/([0-9]+)\/([a-zA-Z0-9-]+)$/i.exec(path)) !== null) {
    // https://read.dukeupress.edu:443/hope/article-abstract/18/3/523/11287/Aristotle-as-a-Welfare-Economist-A-Comment-with-a?searchresult=1
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.title_id = match[2].concat('/', match[3], '/', match[4], '/', match[5]);
    result.unitid   = match[6];
  } else if ((match = /^\/([a-z]+)\/article-pdf\/([0-9]+)\/([a-zA-Z0-9_-]+).pdf$/i.exec(path)) !== null) {
    // https://read.dukeupress.edu:443/hope/article-pdf/423764/ddhope_17_3_391.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[2];
    result.unitid   = match[3];
  } else if ((match = /^\/([a-z]+)\/chapter-pdf\/([0-9]+)\/([a-zA-Z0-9_-]+).pdf$/i.exec(path)) !== null) {
    // https://read.dukeupress.edu:443/books/chapter-pdf/494704/9780822383932-011.pdf
    result.rtype    = 'BOOK_PART';
    result.mime     = 'PDF';
    result.title_id = match[2];
    result.unitid   = match[3];
  }
  return result;
});
