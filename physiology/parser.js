#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform American Physiological Society
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

  if (/^\/action\/doSearch|author|keyword/i.test(path)) {
    // https://www.physiology.org:443/action/doSearch?AllField=rainbow&startPage=&SeriesKey=ajpregu
    // https://www.physiology.org:443/author/Burton%2C+R+R
    // https://www.physiology.org:443/keyword/Emphysema
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';

  } else if ((match = /^\/(journal|topic)\/([a-z0-9-/]+)$/i.exec(path)) !== null) {
    // https://www.physiology.org:443/journal/ajpheart
    // https://www.physiology.org:443/topic/advances-collections/2018-institute-for-teaching-and-learning?seriesKey=&tagCode=
    result.rtype = 'TOC';
    result.mime  = 'HTML';
    result.title_id = match[2];
    result.unitid = match[2];

  } else if ((match = /^\/toc\/([a-z-]+)\/([a-z0-9-/]+)/i.exec(path)) !== null) {
    // https://www.physiology.org:443/toc/ajprenal/316/5
    // https://www.physiology.org:443/toc/physiologyonline/34/3
    // https://www.physiology.org:443/toc/ajprenal/current
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.title_id = match[1];
    result.unitid = match[2];

  } else if ((match = /^\/([a-z0-9-]+)\/about$/i.exec(path)) !== null) {
    // https://www.physiology.org:443/ajprenal/about
    result.rtype = 'REF';
    result.mime = 'HTML';
    result.title_id = match[1];
    result.unitid = match[1];

  } else if ((match = /^\/doi\/abs\/([0-9a-z-/.]+)$/i.exec(path)) !== null) {
    // https://www.physiology.org:443/doi/abs/10.1152/jappl.1967.22.4.782
    result.rtype = 'ABS';
    result.mime = 'HTML';
    result.title_id = match[1];
    result.unitid = match[1];
    result.doi = match[1];

  } else if ((match = /^\/doi\/full\/([0-9a-z-/.]+)$/i.exec(path)) !== null) {
    // https://www.physiology.org:443/doi/full/10.1152/ajpheart.00004.2019
    // https://www.physiology.org:443/doi/full/10.1152/physiol.00007.2019
    // https://www.physiology.org:443/doi/full/10.1152/advan.00045.2019
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
    result.title_id = match[1];
    result.unitid = match[1];
    result.doi = match[1];

  } else if ((match = /^\/doi\/pdf\/([0-9a-z-/.]+)$/i.exec(path)) !== null) {
    // https://www.physiology.org:443/doi/pdf/10.1152/ajpheart.00004.2019
    // https://www.physiology.org:443/doi/pdf/10.1152/physiol.00007.2019
    // https://www.physiology.org:443/doi/pdf/10.1152/jappl.1967.22.4.782
    result.rtype = 'ARTICLE';
    result.mime = 'PDF';
    result.title_id = match[1];
    result.unitid = match[1];
    result.doi = match[1];

  }

  return result;
});
