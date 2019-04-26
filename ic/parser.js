#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Ingenta Connect
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // let param  = parsedUrl.query || {};

  // use console.error for debugging
  console.error(parsedUrl); 

  let match;


  if ((match = /^\/deliver\/connect\/(([a-z]+)\/([0-9]{4})([0-9]{3}[0-9x])\/v([0-9]+)n([0-9]+)\/[a-z0-9]+)\.(pdf|html)$/i.exec(path)) !== null) {
    // http://docserver.ingentaconnect.com/deliver/connect/iapt/00400262/v66n5/s6.pdf
    // http://docserver.ingentaconnect.com/deliver/connect/cog/10522166/v14n5/s4.html

    result.rtype            = 'ARTICLE';
    result.mime             = match[7].toUpperCase();
    result.unitid           = match[1];
    result.title_id         = match[2];
    result.print_identifier = `${match[3]}-${match[4]}`;
    result.vol              = match[5];
    result.issue            = match[6];

  } else if ((match = /^\/content\/([a-z]+\/([a-z]+))$/i.exec(path)) !== null) {
    // http://www.ingentaconnect.com/content/tandf/umgd
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    result.title_id = match[2];

  } else if ((match = /^\/content\/([a-z]+\/([a-z0-9]+)\/([0-9]{4})\/([0-9]+)\/([a-z0-9]+))$/i.exec(path)) !== null) {
    // http://www.ingentaconnect.com/content/schweiz/rs/2010/00000019/00000001
    //www.ingentaconnect.com:443/content/ssam/15309932/2016/00000017/00000004
    //www.ingentaconnect.com:443/content/imp/jcs/2018/00000025/f0020005
    result.rtype            = 'TOC';
    result.mime             = 'HTML';
    result.unitid           = match[1];
    result.title_id         = match[2];
    result.publication_date = match[3];
    result.vol              = parseInt(match[4]).toString();
    if (match[5][0] === "0") {
      result.issue          = parseInt(match[5]).toString();
      } else {
      result.issue          = match[5];}

  } else if ((match = /^\/contentone|content\/([a-z]+\/([a-z]+)\/([0-9]{4})\/([0-9]+)\/([0-9]+)\/[a-z0-9_.-]+)$/i.exec(path)) !== null) {
    // http://www.ingentaconnect.com/contentone/springer/usw/2017/00000001/00000001/art00005
    // https://www.ingentaconnect.com:443/contentone/imp/jcs/2018/00000025/f0020005/art00009
    // https://www.ingentaconnect.com:443/content/bsc/ans/2017/00000087/00000004/art00003    
    result.rtype            = 'ABS';
    result.mime             = 'HTML';
    result.unitid           = match[1];
    result.title_id         = match[2];
    result.publication_date = match[3];
    result.vol              = parseInt(match[4]).toString();
    if (match[5][0] === "0") {
      result.issue          = parseInt(match[5]).toString();
      } else {
      result.issue          = match[5];}

  } else if (/^\/search\/article/i.test(path)) {
    //https://www.ingentaconnect.com:443/search/article?option1=tka&value1=cancer&pageSize=10&index=1
    result.rtype = 'ABS';
    result.mime  = 'HTML';

  } else if (/^\/search$|search;jsessionid|content\/subject$|content\/subcat$|content\/bup/i.test(path)) {
    // https://www.ingentaconnect.com:443/search;jsessionid=r3lsfa7wb6y3.x-ic-live-01?form_name=quicksearch&ie=%E0%A5%B0&option1=tka&value1=cancer
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';
  
  } else if (/^\/search\/article/i.test(path)) {
    //https://www.ingentaconnect.com:443/search/article?option1=tka&value1=cancer&pageSize=10&index=1
    result.rtype = 'ABS';
    result.mime  = 'HTML';
  
  } else if ((match = /^\/content\/([a-z]+\/([0-9]{8}))$/i.exec(path)) !== null){
    //www.ingentaconnect.com:443/content/ssam/15309932
    result.rtype            = 'TOC';
    result.mime             = 'HTML';
    result.unitid           = match[1];
    result.title_id         = match[2];
  };

  return result;
});
