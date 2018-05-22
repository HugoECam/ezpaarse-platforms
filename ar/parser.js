#!/usr/bin/env node

/**
 * parser for www.annualreviews.org platform
 * http://analogist.couperin.org/platforms/annualreviews/
 */
'use strict';
const Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  let result = {};
  let path   = parsedUrl.pathname;
  let match;

  if ((match = /^\/(journal|loi|toc)\/([a-z]+[0-9]?)(\/current)?$/.exec(path)) !== null) {
    // /journal/achre4
    // /toc/achre4/current
    result.title_id = match[2];
    result.unitid   = match[2] + (match[3] || '');
    result.rtype    = 'TOC';
    result.mime     = 'MISC';

  } else if ((match = /\/toc\/([a-z]+[0-9]?)\/([0-9]+)\/([0-9]+)$/.exec(path)) !== null) {
    // /toc/achre4/46/4
    result.unitid   = match[1] + '/' + match[2] + '/' + match[3];
    result.title_id = match[1];
    result.rtype    = 'TOC';
    result.mime     = 'MISC';
    result.vol      = match[2];
    result.issue    = match[3];

  } else if ((match = /^\/doi\/(abs|pdf|full|citedby|suppl)\/([0-9]{2}\.[0-9]{4}\/(annurev[.-]([a-z]+)[.\-0-9-a-z]+))$/.exec(path)) !== null) {
    // http://www.annualreviews.org.gate1.inist.fr/doi/abs/10.1146/annurev-neuro-062111-150343
    // http://www.annualreviews.org.gate1.inist.fr/doi/pdf/10.1146/annurev.anchem.1.031207.113026
    // http://www.annualreviews.org.insmi.bib.cnrs.fr/doi/full/10.1146/annurev-st-04-022817-100001
    result.doi      = match[2];
    result.unitid   = match[3];
    result.title_id = match[4];

    switch (match[1]) {
    case 'abs':
      result.rtype = 'ABS';
      result.mime  = 'HTML';
      break;
    case 'pdf':
      result.rtype = 'ARTICLE';
      result.mime  = 'PDF';
      break;
    case 'full':
      result.rtype = 'ARTICLE';
      result.mime  = 'HTML';
      break;
    case 'citedby':
      result.rtype = 'REF';
      result.mime  = 'HTML';
      break;
    case 'suppl':
      result.rtype = 'SUPPL';
      result.mime  = 'MISC';
      break;
    }
  } else if ((match = /^\/doi\/([0-9]{2}\.[0-9]{4}\/(annurev[.-]([a-z]+)[.\-0-9-a-z]+))$/i.exec(path)) !== null) {
    // https://www.annualreviews.org:443/doi/10.1146/annurev-anthro-102116-041244
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.doi      = match[1];
    result.unitid   = match[2];
    result.title_id = match[3];
  } else if (/^\/action\/showPublications$/i.test(path)) {
    // https://www.annualreviews.org:443/action/showPublications
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
  } else if (/^\/action\/doSearch$/i.test(path)) {
    // https://www.annualreviews.org:443/action/doSearch?AllField=alcohol
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/na101\/home\/literatum\/publisher\/ar\/journals\/content\/(.*?)\/([0-9]+)\/(.*?)\/.*[.jpeg|.ppt]$/i.exec(path)) !== null) {
    // https://www.annualreviews.org:443/na101/home/literatum/publisher/ar/journals/content/clinpsy/2013/clinpsy.2013.9.issue-1/annurev-clinpsy-050212-185610/20130321/images/large/cp90703.f1.jpeg
    result.rtype    = 'IMAGE';
    result.mime     = 'MISC';
    result.title_id = match[1];
    result.unitid   = match[3];
  }

  return result;
});
