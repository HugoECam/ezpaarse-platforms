#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform OpticsInfoBase
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

  if ((match = /^\/([a-z]+)\/issue.cfm?$/i.exec(path)) !== null) {
    // https://www-osapublishing-org.gaelnomade.ujf-grenoble.fr/jot/issue.cfm?volume=83&issue=2
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.volume   = param.volume;
    result.issue    = param.issue;
  } else if ((match = /^\/([a-z]+)\/abstract.cfm$/i.exec(path)) !== null) {
    // https://www-osapublishing-org.gaelnomade.ujf-grenoble.fr/jot/abstract.cfm?uri=jot-83-2-81
    // https://www-osapublishing-org.gaelnomade.ujf-grenoble.fr/jot/abstract.cfm?uri=jot-83-2-81#articleReferences
    if (parsedUrl.hash === null) {
      result.rtype    = 'ABS';
    } else {
      result.rtype    = 'REF';
    }
    result.unitid   = param.uri;
    result.mime     = 'HTML';
    result.title_id = match[1];
  } else if ((match = /^\/([a-z]+)\/viewmedia.cfm$/i.exec(path)) !== null) {
    // https://www-osapublishing-org.gaelnomade.ujf-grenoble.fr/jot/viewmedia.cfm?uri=jot-83-2-81&seq=0
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.unitid   = param.uri;
  }
  return result;
});
