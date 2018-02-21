#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform CQ Press Library
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
  console.error(parsedUrl);

  let match;

  if (/^\/[a-z]*\/document.php$/i.test(path)) {
    // http://library.cqpress.com:80/cqresearcher/document.php?id=cqr_ht_energy_policy_2017
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    if ((match = /^(.*).pdf$/i.exec(param.id)) !== null) {
      result.title_id = match[1];
      result.unitid   = param.id;
      result.mime     = 'PDF';
    } else {
      result.title_id = param.id;
      result.unitid   = param.id;
    }
  } else if (/^\/[a-z]*\/file.php$/i.test(path)) {
    // http://library.cqpress.com:80/cqalmanac/file.php?path=Floor%20Votes%20Tables/cqal60_1960_House_Floor_Votes_34-37.pdf
    result.rtype    = 'REF';
    result.mime     = 'PDF';
    result.title_id = param.path;
    result.unitid   = param.path;
  }

  return result;
});
