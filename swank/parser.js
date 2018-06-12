#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform SWANK
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

  if (/^\/services\/s3services\/mobile\/playinfo$/i.test(path)) {
    // https://digitalcampus.swankmp.net:443/services/s3services/mobile/playinfo?contentId=82531&contentUrl=https:%2F%2Fdc.swankmp.net%2Fcontent%2Fcenc%2FA14093_E2_XX_XX_XX%2F37141733%2FA14093_E2_XX_XX_XX.mpd&deviceId=d6ee23af-5b83-482d-b4aa-5624b6b03dbd
    result.rtype    = 'VIDEO';
    result.mime     = 'MISC';
    result.title_id = param.contentId;
    result.unitid   = param.contentId;
  }

  return result;
});
