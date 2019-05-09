#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform InfoWeb Readex
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

  let match;

  if (/^\/apps\/news\/results$|issue-browse$|hot-topics/i.test(path)) {
  // https://infoweb.newsbank.com:443/apps/news/results?p=WORLDNEWS&fld-base-0=alltext&sort=YMD_date%3AD&maxresults=20&val-base-0=rainbow&t=product%3AAWNB
  // https://infoweb.newsbank.com:443/apps/news/issue-browse?p=WORLDNEWS&t=pubname%3AAEA5%21Albany%2BExaminer%2B%2528GA%2529/year%3A2016%212016/mody%3A0216%21February%2B16&action=browse&format=text
  // https://infoweb.newsbank.com:443/apps/news/hot-topics/science%2C-technology-%26-health?p=Hottopics&pnews=WORLDNEWS    
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';
  
  } else if (/^\/iw-search\/we\/Static\/$/i.test(path)) {
  // https://infoweb.newsbank.com:443/iw-search/we/Static/?p_product=Earth&f_location=earth&p_theme=current&p_action=list&p_nbid=O67S53VOMTU1NjEwOTk5Ny44ODI2Mzg6MToxNToxNzAuMTQwLjE0Mi4yNTI
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';

  } else if ((match = /^\/apps\/news\/document-view$/i.exec(path)) !== null) {
  // https://infoweb.newsbank.com:443/apps/news/document-view?p=WORLDNEWS&t=product%3AAWNB/stp%3ABlog%21Blog&sort=YMD_date%3AD&fld-base-0=alltext&maxresults=20&val-base-0=rainbow&docref=news/172FFE5E4D54A8A0    
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = param.docref;
    result.title_id = param.docref;

  } else if ((match = /^\/iw-search\/we\/Static$/i.exec(path)) !== null) {
  //https://infoweb.newsbank.com:443/iw-search/we/Static?p_product=Earth&f_location=earth&p_theme=current&p_action=doc&p_nbid=O67S53VOMTU1NjEwOTk5Ny44ODI2Mzg6MToxNToxNzAuMTQwLjE0Mi4yNTI&f_docnum=172F8EE719450268&f_topic=1&f_prod=BTI2&f_type=&d_refprod=SPECIALREPORTS
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = param.f_docnum;
    result.title_id = param.f_docnum;
  }

  return result;
});
