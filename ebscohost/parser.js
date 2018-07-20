#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');
const URL    = require('url');

/**
 * Matching between the parameters found in openurl queries and EC fields
 */
const openUrlFields = {
  'issn': 'print_identifier',
  'isbn': 'print_identifier',
  'volume': 'vol',
  'issue': 'num',
  'spage': 'first_page',
  'title': 'publication_title',
  'id': 'unitid'
};

/**
 * Identifie les consultations de la plateforme EbscoHost
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param  = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/(ehost|eds)\/([a-z]+)(?:\/[a-z]+)?$/i.exec(path)) !== null) {
    const category = match[2].toLowerCase();

    if (match[1].toLowerCase() === 'eds') {
      result.platform_name = 'EBSCO Discovery Service';
    }

    switch (category) {
    case 'results':
    case 'resultsadvanced':
      // /ehost/resultsadvanced?sid=1f85c7ec-9906-4b8e-917f-fb4c7171ffe4%40sessionmgr4007&vid=3&hid=4201&bdata=JmRiPWE5aCZicXVlcnk9JmNsaTA9RlQmY2x2MD1ZJmNsaTE9U08mY2x2MT1tZWRlY2luZSZjbGkyPVBaMSZjbHYyPUFydGljbGUmbGFuZz1mciZ0eXBlPTEmc2l0ZT1laG9zdC1saXZl
      // /ehost/results?sid=6323ca41-66ca-4e71-a8d9-c2a2cae26f16%40sessionmgr110&vid=2&hid=103&bquery=JN+%22Computers+in+Libraries%22+AND+DT+20130901&bdata=JmRiPXJ6aCZsYW5nPWZyJnR5cGU9MSZzaXRlPWVob3N0LWxpdmU%3d
      result.rtype = 'TOC';
      result.mime  = 'MISC';
      break;
    case 'ebookviewer':
      // /ehost/ebookviewer/ebook?sid=f89d9812-0d3a-44ed-9c97-dda110cc60a3%40sessionmgr106&vid=0&hid=124&format=EB
      result.rtype = 'BOOK';
      result.mime  = 'PDF';
      break;
    case 'pdfviewer':
      // /ehost/pdfviewer/pdfviewer?sid=6323ca41-66ca-4e71-a8d9-c2a2cae26f16%40sessionmgr110&vid=4&hid=103
      result.rtype = 'ARTICLE';
      result.mime  = 'PDF';
      break;
    case 'search':
      // /ehost/search/advanced?sid=1f85c7ec-9906-4b8e-917f-fb4c7171ffe4%40sessionmgr4007&vid=1&hid=4201
      // /ehost/search/basic?sid=609d197f-439e-4da7-b804-f78b65af2807@sessionmgr120&vid=19&tid=2003EB
      result.rtype = 'SEARCH';
      result.mime  = 'MISC';
      break;
    case 'detail':
      // /ehost/detail?sid=6323ca41-66ca-4e71-a8d9-c2a2cae26f16%40sessionmgr110&vid=1&hid=103&bdata=Jmxhbmc9ZnImc2l0ZT1laG9zdC1saXZl#db=rzh&jid=CLB
      // /ehost/detail?vid=3&sid=6323ca41-66ca-4e71-a8d9-c2a2cae26f16%40sessionmgr110&hid=103&bdata=Jmxhbmc9ZnImc2l0ZT1laG9zdC1saXZl#db=rzh&AN=2012317453
      // /ehost/detail/detail?vid=4&sid=1f85c7ec-9906-4b8e-917f-fb4c7171ffe4%40sessionmgr4007&hid=4201&bdata=Jmxhbmc9ZnImc2l0ZT1laG9zdC1saXZl#AN=118470727&db=a9h
      result.rtype = 'REF';
      result.mime  = 'HTML';

      if (parsedUrl.hash) {
        const hashedUrl = URL.parse(parsedUrl.hash.replace('#', '/?'), true);
        const query     = hashedUrl.query || {};

        if (query.AN) { result.unitid = query.AN; }
      }
      break;
    }

  } else if ((match = /^\/pdf[a-z0-9_]*\/pdf\/\S+\/([a-z0-9]+)\.pdf$/i.exec(path)) !== null) {
    // https://content.ebscohost.com/pdf29_30/pdf/2013/CLB/01Sep13/90496319.pdf?T=P&P=AN&
    // K=2012317464&S=R&D=rzh&EbscoContent=dGJyMNXb4kSeqa44zdnyOLCmr0ueprJSsKi4Sa%2BWxWXS&
    // ContentCustomer=dGJyMPGvrkm2p7JKuePfgeyx44Dt6fIA
    result.rtype  = 'ARTICLE';
    result.mime   = 'PDF';
    result.unitid = match[1];

  } else if (path.toLowerCase() === '/contentserver.asp') {
    // http://content.ebscohost.com:80/ContentServer.asp?T=P&P=AN&K=96283258&S=R&
    // D=aph&EbscoContent=dGJyMNLe80SeqK84v%2BvlOLCmr0yep65Srqi4S7CWxWXS&
    // ContentCustomer=dGJyMPGpsky2qLNQuczHXbnb5ofx6gAA
    result.rtype = 'ARTICLE';
    result.mime  = 'PDF';

    if (param.K) { result.unitid = param.K; }

  } else if (path.toLowerCase() === '/openurl') {
    // /openurl?sid=EBSCO:a9h&genre=article&issn=0399077X&ISBN=&volume=46&issue=7&date=20161001&spage=372
    // &pages=372-379&title=Medecine%20&%20Maladies%20Infectieuses
    // &atitle=Community-acquired%20Clostridium%20difficile%20infections%20in%20emergency%20departments.
    // &aulast=Lefevre-Tantet-Etchebarne%2C%20D.&id=DOI:10.1016/j.medmal.2016.06.002
    result.rtype = 'OPENURL';
    result.mime  = 'HTML';

    for (const key in param) {
      const matchingValue = openUrlFields[key];

      if (matchingValue) {
        result[matchingValue] = param[key];
      }
    }

    if (param.pages) {
      const pagesMatch = /^(\d+)-(\d+)$/.exec(param.pages);

      if (pagesMatch) {
        result.first_page = pagesMatch[1];
        result.last_page  = pagesMatch[2];
      }
    }

    if (result.unitid && result.unitid.toLowerCase().startsWith('doi:')) {
      result.doi = result.unitid = result.unitid.substr(4);
    }
  } if (/^\/(login.aspx|start)$/i.test(path)) {
    // http://search.ebscohost.com:80/login.aspx?authtype=ip,uid&profile=ehost&defaultdb=apn
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
    if (param.defaultdb === 'apn') {
      result.publication_title = 'Alternative Press Index';
    } else if (param.defaultdb === 'a9h') {
      result.publication_title = 'Academic Search Complete';
    } else if (param.defaultdb === '31h') {
      result.publication_title = 'America: History & Life with Full Text ';
    } else if (param.defaultdb === 'ant') {
      result.publication_title = 'Anthropology Plus';
    } else if (param.defaultdb === 'aft') {
      result.publication_title = 'Art Full Text (H.W. Wilson)';
    } else if (param.defaultdb === 'bah') {
      result.publication_title = 'Business Source Alumni Edition';
    } else if (param.defaultdb === 'cin20') {
      result.publication_title = 'CINAHL';
    } else if (param.defaultdb === 'dmp') {
      result.publication_title = 'DynamedPlus';
    } else if (param.defaultdb === 'nlebk') {
      result.publication_title = 'eBook Collection';
    } else if (param.defaultdb === 'eoh') {
      result.publication_title = 'Econlit with Full Text';
    } else if (param.defaultdb === 'eft') {
      result.publication_title = 'Education Full Text (H.W. Wilson) ';
    } else if (param.defaultdb === 'eric') {
      result.publication_title = 'ERIC';
    } else if (param.defaultdb === 'hia') {
      result.publication_title = 'Historical Abstratcs';
    } else if (param.defaultdb === 'hsr') {
      result.publication_title = 'Humanities & Social Sciences Index Retrospective: 1907-1984 (H.W. Wilson)';
    } else if (param.defaultdb === 'qth') {
      result.publication_title = 'LGBT Life w/Full Text';
    } else if (param.defaultdb === 'lii') {
      result.publication_title = 'Library Literature & Information Science Index (H.W. Wilson)';
    } else if (param.defaultdb === 'lih') {
      result.publication_title = 'LISTA with Full Text';
    } else if (param.defaultdb === 'cmedm') {
      result.publication_title = 'MEDLINE';
    } else if (param.defaultdb === 'loh') {
      result.publication_title = 'Mental Measurements Yearbook';
    } else if (param.defaultdb === 'mzh') {
      result.publication_title = 'MLA International Bibliography';
    } else if (param.defaultdb === 'pif') {
      result.publication_title = 'The Philosopher\'s Index with Full Text';
    } else if (param.defaultdb === 'pdh') {
      result.publication_title = 'PsycARTICLES';
    } else if (param.defaultdb === 'psyh') {
      result.publication_title = 'PsycINFO';
    } else if (param.defaultdb === 'pst') {
      result.publication_title = 'PsycTESTS';
    } else if (param.defaultdb === 'rgr') {
      result.publication_title = 'Readers\' Guide Retrospective: 1890-1982 (H.W. Wilson)';
    } else if (param.defaultdb === 'rft') {
      result.publication_title = 'RILM Abstracts of Music Literature with Full Text';
    } else if (param.defaultdb === 'ssf') {
      result.publication_title = 'Social Sciences Full Text (H.W. Wilson)';
    } else if (param.defaultdb === 'sih') {
      result.publication_title = 'SocINDEX with Full Text';
    } else if (param.defaultdb === 'fyh') {
      result.publication_title = 'Women\'s Studies International';
    } else if (param.defaultdb === 'lsdar') {
      result.publication_title = 'ATLA Religion Database with ATLASerials PLUS';
    } else if (param.defaultdb === 'rvh') {
      result.publication_title = 'New Testament Abstracts';
    } else if (param.defaultdb === 'oah') {
      result.publication_title = 'Old Testament Abstracts';
    }
  }

  return result;
});
