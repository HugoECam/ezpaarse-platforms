#!/usr/bin/env node

// ##EZPAARSE

'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme maitron
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;
  var match;

  if ((match = /^\/products\/([a-z]+)\/([a-z]+)\/([0-9]{2}.[0-9]+)\/(([a-z]{1})-([0-9]+)-([0-9]+))$/.exec(path)) !== null) {
    // https://www.thieme-connect.com/products/ejournals/html/10.1055/s-0033-1357180
    if (match[2] === 'html') {
      result.mime  = 'HTML';
      result.rtype = 'ARTICLE';
    } else {
      result.mime  = 'MISC';
      result.rtype = 'TOC';
    }
    result.unitid   =  match[4];
    result.doi      = match[3] + '/' + match[4];
    result.title_id = match[4];
  } else if ((match = /^\/products\/([a-z]+)\/([a-z]+)\/([0-9]{2}.[0-9]+)\/(([a-z]{1})-([0-9]+)-([0-9]+)).pdf$/.exec(path)) !== null) {
    // https://www.thieme-connect.de/products/ejournals/pdf/10.1055/s-0034-1369742.pdf
    result.unitid   =  match[4];
    result.doi      = match[3] + '/' + match[4];
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[4];
  } else if (/^\/cp\/search/i.test(path)) {
    // https://medone-education.thieme.com:443/cp/search;;searchterm=gunshot
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/ebook\/(.*)$/i.exec(path)) !== null) {
    // https://medone-education.thieme.com:443/ebooks/1210827
    result.rtype    = 'BOOK';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if ((match = /^\/p\/author\/profile\/(.*)$/i.exec(path)) !== null) {
    // https://medone-education.thieme.com:443/p/author/profile/0000400241
    result.rtype    = 'BIO';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if ((match = /^\/media\/[0-9]+\/((.*)\/(.*))$/i.exec(path)) !== null) {
    // https://medone-education.thieme.com:443/media/2156930/ebook_2156930_SL82197621/im2156903
    result.rtype    = 'IMAGE';
    result.mime     = 'HTML';
    result.title_id = match[2];
    result.unitid   = match[1];
  }

  return result;
});

