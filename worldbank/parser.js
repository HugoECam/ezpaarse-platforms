#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform World Bank
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param = parsedUrl.query || {};
  // console.error(parsedUrl);

  let match;

  if ((/^\/action\/doSearch$/i.test(path)) || (/^\/action\/showPublications$/i.test(path)) || (/^\/topic\/([a-zA-Z0-9]+)$/i.test(path)) || (/^\/page\/([a-zA-Z-]+)$/i.test(path))) {
    // https://elibrary.worldbank.org:443/action/doSearch?AllField=bananas
    // https://elibrary.worldbank.org:443/action/showPublications?PubType=type-other-research&SeriesKey=kp03
    // https://elibrary.worldbank.org:443/topic/t021
    // https://elibrary.worldbank.org:443/page/wb-other-research
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if (((match = /^\/loi\/(.*)/i.exec(path)) !== null) || ((match = /^\/toc\/(.*)/.exec(path)) !== null)) {
    // https://elibrary.worldbank.org:443/loi/deor
    // https://elibrary.worldbank.org:443/toc/wber/24/3
    // https://elibrary.worldbank.org:443/toc/deor/current
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];

  } else if (/^\/action\/showDataView$/i.test(path)) {
    if (param.download == 'csv') {
    // https://elibrary.worldbank.org:443/action/showDataView?indicator=SH.DYN.MORT&download=csv
      result.mime    = 'CSV';
    }
    if (param.download !== 'csv') {
    // https://elibrary.worldbank.org:443/action/showDataView?indicator=SH.DYN.MORT&download=csv
      result.mime    = 'HTML';
    }
    result.rtype    = 'DATA';
    result.title_id = param.region || param.indicator;
    result.unitid   = param.region || param.indicator;

  } else if ((match = /^\/doi\/book\/(.*)/i.exec(path)) !== null) {
    if (param.chapterTab == 'true') {
    // https://elibrary.worldbank.org:443/action/showDataView?indicator=SH.DYN.MORT&download=csv
      result.rtype   = 'TOC';
    }
    if (param.chapterTab !== 'true') {
    // https://elibrary.worldbank.org:443/action/showDataView?indicator=SH.DYN.MORT&download=csv
      result.rtype   = 'ABS';
    }
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
    result.doi      = match[1];

  } else if ((match = /^\/doi\/abs\/(.*)/i.exec(path)) !== null) {
    // https://elibrary.worldbank.org:443/doi/abs/10.1596/1020-797X_12_2_19
    // https://elibrary.worldbank.org:443/doi/abs/10.1596/9780821396353_CH02
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
    result.doi      = match[1];

  // NOTE: FOR THIS ONE WE WENT WITH ARTICLE BECAUSE THERE IS NO WAY TO DIFFERENTIATE BOOKS AND ARTICLES FROM THE LINK
  } else if ((match = /^\/doi\/pdf\/(.*)/i.exec(path)) !== null) {
    // https://elibrary.worldbank.org:443/doi/pdf/10.1596/978-1-4648-1281-1_ch3
    // https://elibrary.worldbank.org:443/doi/pdf/10.1596/978-1-4648-1281-1
    // https://elibrary.worldbank.org:443/doi/pdf/10.1093/wber/lhq018
    // https://elibrary.worldbank.org:443/doi/pdf/10.1596/1020-797X_12_2_19
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.unitid   = match[1];
    result.doi      = match[1];

  }

  return result;
});
