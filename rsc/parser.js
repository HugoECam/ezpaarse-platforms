#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');
const URL    = require('url');

const doiPrefix = '10.1039';

/**
 * Identifie les consultations de la plateforme Royal Society of Chemistry
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param  = parsedUrl.query || {};

  let match;
  let hashedUrl;

  if (parsedUrl.hash) {
    hashedUrl = URL.parse(parsedUrl.hash.replace('#!', '/?'), true);
  }

  if ((match = /^\/en\/journals\/journalissues\/([a-zA-Z]{2,})$/i.exec(path)) !== null) {
    // /en/journals/journalissues/ay
    // #!issueid=ay006014&type=current&issnprint=1759-9660
    result.rtype    = 'TOC';
    result.mime     = 'MISC';
    result.title_id = match[1];

    if (hashedUrl && hashedUrl.query) {
      if (hashedUrl.query.issnprint) { result.print_identifier = hashedUrl.query.issnprint; }
      if (hashedUrl.query.issueid) { result.unitid = hashedUrl.query.issueid; }
    }

  } else if ((match = /^\/en\/content\/article(html|pdf)\/([0-9]+)\/([a-z0-9]+)\/([a-z0-9]+)$/i.exec(path)) !== null) {
    // /en/content/articlehtml/2014/rp/c4rp00006d
    result.rtype    = 'ARTICLE';
    result.mime     = match[1].toUpperCase();
    result.title_id = match[3].toLowerCase();
    result.unitid   = match[4].toLowerCase();
    result.doi      = `${doiPrefix}/${result.unitid}`;

    result.publication_date = match[2];

  } else if ((match = /^\/en\/content\/ebook\/([0-9-]+)$/i.exec(path)) !== null) {
    // /en/content/ebook/978-1-84973-424-0#!divbookcontent
    if (hashedUrl && hashedUrl.query && !hashedUrl.query.divbookcontent) {
      result.rtype = 'TOC';
    }

    result.mime             = 'MISC';
    result.unitid           = match[1].replace(/-/g, '');
    result.print_identifier = match[1].replace(/-/g, '');

  } else if ((match = /^\/en\/content\/chapter(html|pdf)\/([0-9]+)\/(([0-9]+)-[0-9]+)$/i.exec(path)) !== null) {
    // /en/content/chapterpdf/2013/9781849734738-00001?isbn=978-1-84973-424-0&sercode=bk
    result.rtype  = 'BOOK_SECTION';
    result.mime   = match[1].toUpperCase();
    result.unitid = match[3];
    result.doi    = `${doiPrefix}/${match[3]}`;
    result.online_identifier = match[4];
    result.publication_date  = match[2];

    if (param.isbn) {
      result.print_identifier = param.isbn.replace(/-/g, '');
    }
  } else if ((match = /^\/en\/content\/articlelanding\/(.*)\/(.*)\/(.*)$/i.exec(path)) !== null) {
    // http://pubs.rsc.org:80/en/content/articlelanding/2017/gc/c7gc01801k
    result.rtype  = 'ABS';
    result.mime   = 'HTML';
    result.unitid = match[3];
    result.doi    = `${doiPrefix}/${match[3]}`;
  } else if ((match = /^\/en\/content\/chapter\/[a-z]+([-0-9]+)\/([-0-9]+)$/i.exec(path)) !== null) {
    // http://pubs.rsc.org:80/en/content/chapter/bk9780854042166-00118/978-0-85404-216-6
    result.rtype  = 'ABS';
    result.mime   = 'HTML';
    result.unitid = match[1];
    result.print_identifier = match[2].replace(/-/g, '');
  } else if ((match = /^\/lus\/[-a-z]+\/article\/(.*)$/i.exec(path)) !== null) {
    // http://pubs.rsc.org:80/lus/analytical-abstracts/article/B377448
    result.rtype  = 'ABS';
    result.mime   = 'HTML';
    result.unitid = match[1];
  } else if ((match = /^\/en\/content\/chapterepub\/(.*)\/bk([-0-9]+)$/i.exec(path)) !== null) {
    // http://pubs.rsc.org:80/en/content/chapterepub/2017/bk9781782621713-00060?isbn=978-1-78262-171-3
    result.rtype  = 'BOOK_SECTION';
    result.mime   = 'MISC';
    result.unitid = match[2];
    result.publication_date = match[1];
    result.print_identifier = param.isbn.replace(/-/g, '');
  } else if (/results|search/i.test(path)) {
    // http://pubs.rsc.org:80/lus/analytical-abstracts/search/quicksearch?afreetext=nanotechnology
    if (/downloadimage/i.test(path)) {
      result.rtype = 'IMAGE';
      result.mime  = 'MISC';
      if (param.id) {
        result.unitid = param.id;
      }
    } else {
      result.rtype  = 'SEARCH';
      result.mime   = 'HTML';
    }
  } else if (/^\/en\/journals\//i.test(path)) {
    // http://pubs.rsc.org:80/en/journals/issues
    result.rtype  = 'TOC';
    result.mime   = 'HTML';
  } else if ((match = /^\/news-events\/profiles\/(.*?)\/$/i.exec(path)) !== null) {
    // http://www.rsc.org:80/news-events/profiles/2018/may/eloise-laity/
    result.rtype  = 'BIO';
    result.mime   = 'HTML';
    result.unitid = match[1];
  } else if (/^\/Merck-Index\/reference\//i.test(path)) {
    // https://www.rsc.org:443/Merck-Index/reference/Glossary
    result.rtype  = 'REF';
    result.mime   = 'HTML';
  } else if ((match = /^\/news-events\/articles\/((.*?)\/(.*?)\/(.*?))\/$/i.exec(path)) !== null) {
    // http://www.rsc.org:80/news-events/articles/2018/may/ib-moves-to-oup/
    result.rtype  = 'ARTICLE';
    result.mime   = 'HTML';
    result.unitid = match[1];
    result.publication_date = match[2] + '/' + match[3];
  } else if (/^\/en\/ebooks$/i.test(path)) {
    // http://pubs.rsc.org:80/en/ebooks
    result.rtype  = 'TOC';
    result.mime   = 'HTML';
  }

  return result;
});
