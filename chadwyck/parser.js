#!/usr/bin/env node

'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Chadwyck-Healey Literature Collections
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  var param  = parsedUrl.query || {};
  var host   = parsedUrl.hostname;

  // use console.error for debuging
  // console.error(parsedUrl);

  if (/\/fulltext$/i.test(path)) {
    // http://acta.chadwyck.co.uk/all/fulltext?ALL=Y&action=byid&warn=N&id=Z300036009&div=3&file=../session/1475585193_28984&SOMQUERY=1&DBOFFSET=40649769&ENTRIES=46&CURDB=acta
    result.rtype    = 'ENCYCLOPAEDIA_ENTRY';
    result.mime     = 'HTML';
    result.title_id = param.id || param.ID;
    result.unitid   = param.id || param.ID;
  } else if (/\/search$/i.test(path)) {
    // http://luther.chadwyck.com:80/english/frames/werke/search
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if (/\/htxview$/i.test(path)) {
    // http://luther.chadwyck.com:80/english/frames/werke/htxview?template=toc_hdft.htx&content=toc_top.htx
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
  } else if (/\/toc$/i.exec(path)) {
    // http://luther.chadwyck.com:80/english/frames/werke/toc?action=byid&id=L0000085&CONTROL=ON
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = param.id || param.ID;
    result.unitid   = param.id || param.ID;
  }

  if (result.rtype !== null) {
    if (/(acta.chadwyck.com|acta.chadwyck.co.uk)/i.test(host)) {
      // acta.chadwyck.com
      result.publication_title = 'Acta Sanctorum';
    } else if (/ble.chadwyck.com/i.test(host)) {
      // ble.chadwyck.com
      result.publication_title = 'Chadwyck Bibliografia de la Literature Espanola';
    } else if (/britishperiodicals.chadwyck.co.uk/i.test(host)) {
      // britishperiodicals.chadwyck.co.uk
      result.publication_title = 'Chadwyck ProQuest British Periodicals';
    } else if (/colonial.chadwyck.com/i.test(host)) {
      // colonial.chadwyck.com
      result.publication_title = 'Chadwyck Colonial State Papers Collection';
    } else if (/collections.chadwyck.com/i.test(host)) {
      // collections.chadwyck.com
      result.publication_title = 'Chadwyck Literature Collections';
    } else if (/lion.chadwyck.com/i.test(host)) {
      // lion.chadwyck.com
      result.publication_title = 'Chadwyck Literature Online';
    } else if (/pld.chadwyck.co.uk/i.test(host)) {
      // pld.chadwyck.co.uk
      result.publication_title = 'Chadwyck Patrologia Latina';
    } else if (/www.journal.csj.jp/i.test(host)) {
      // www.journal.csj.jp
      result.publication_title = 'Chemistry Letters';
    } else if (/(luther.chadwyck.com|luther.chadwyck.co.uk)/i.test(host)) {
      // luther.chadwyck.com
      result.publication_title = 'Luthers Werke';
    }
  }

  return result;
});
