#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 180*/

/**
 * parser for acs platform
 * http://analogist.couperin.org/platforms/acs/
 */
'use strict';
const doi_prefix = '10.1093/';
var Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  var result = {};
  var path   = parsedUrl.pathname;
  var hostname = parsedUrl.hostname;
  // uncomment this line if you need parameters
  let param = parsedUrl.query || {};
  // use console.error for debuging
  // console.error(parsedUrl);

  var match;
  var matchUrl;

  if (path == '/content/current') {
    // /content/current
    result.title_id = parsedUrl.host.split('.')[0]; // petrology.oxfordjournals.org.biblioplanets.gate.inist.fr
    result.rtype = 'TOC';
    result.mime  = 'MISC';
    result.unitid = 'current';
  } else if ((match = /^\/content\/(.*)\.short$/.exec(path)) !== null) {
    // /content/early/2014/01/11/petrology.egt077.short
    result.title_id = parsedUrl.host.split('.')[0]; // petrology
    result.rtype  = 'ABS';
    result.mime   = 'HTML';
    result.doi    = '10.1093/' + match[1].split('/').pop().replace('.', '/'); // 10.1093/petrology/egt077
    result.unitid ='10.1093/' + match[1].split('/').pop().replace('.', '/');
    result.publication_date= match[1].split('/')[1];
  } else if ((match = /^\/content\/(.*)\.full$/.exec(path)) !== null) {
    // http://petrology.oxfordjournals.org.biblioplanets.gate.inist.fr/content/early/2014/01/11/petrology.egt077.full
    result.title_id = parsedUrl.host.split('.')[0]; // petrology
    result.rtype  = 'ARTICLE';
    result.mime   = 'HTML';
    result.doi    = '10.1093/' + match[1].split('/').pop().replace('.', '/'); // 10.1093/petrology/egt077
    result.unitid ='10.1093/' + match[1].split('/').pop().replace('.', '/');
    result.publication_date= match[1].split('/')[1];
  } else if ((match = /^\/content\/(.*)\.full.pdf(|\+html)$/.exec(path)) !== null) {
    // http://petrology.oxfordjournals.org.biblioplanets.gate.inist.fr/content/early/2014/01/11/petrology.egt077.full.pdf+html
    result.title_id = parsedUrl.host.split('.')[0]; // petrology
    result.rtype  = 'ARTICLE';
    result.mime   = 'PDF';
    result.doi    = '10.1093/' + match[1].split('/').pop().replace('.', '/'); // 10.1093/petrology/egt077
    result.unitid ='10.1093/' + match[1].split('/').pop().replace('.', '/');
    result.publication_date= match[1].split('/')[1];
  } else if ((match = /^\/content\/(.*)\/suppl\/(.*)$/.exec(path)) !== null) {
    // http://petrology.oxfordjournals.org.biblioplanets.gate.inist.fr/content/55/2/241/suppl/DC1
    result.title_id    = parsedUrl.host.split('.')[0]; // petrology
    result.rtype  = 'SUPPL';
    result.mime   = 'MISC';
    result.unitid = match[2]; // DC1
  } else if ((match = /\.figures-only$/.exec(path)) !== null) {
    // /content/113/3/403.figures-only
    matchUrl = path.split('/');
    result.title_id = parsedUrl.host.split('.')[0]; // aob.oxfordjournals.org.gate1.inist.fr
    result.rtype = 'FIGURES';
    result.mime  = 'MISC';
    result.unitid =  matchUrl[2]+'/' +matchUrl[3] +'/' +matchUrl[4];
    // result.unitid = elementUnitId[2] +"/" +elementUnitId[3] +"/" +elementUnitId[4] +"/" + matchUrl[7];
  } else if (/^\/fileasset\//i.test(path)) {
    // http://www.oxfordclinicalpsych.com:80/fileasset/OxfordPsychologyOnlineLIVETitleList_Jan_2018.xlsx
    result.rtype    = 'REF';
    result.mime     = 'MISC';
    if (/oxfordclinicalpsych.com/i.test(hostname)) {
      result.publication_title = 'Oxford Clinical Psychology';
    } else if (/oxfordmusiconline.com/i.test(hostname)) {
      result.publication_title = 'Oxford Music Online';
    } else if (/oxfordbibliographies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Bibliographies';
    } else if (/oxfordreference.com/i.test(hostname)) {
      result.publication_title = 'Oxford Reference';
    } else if (/oxfordbiblicalstudies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Biblical Studies Online';
    } else if (/oxfordwesternmusic.com/i.test(hostname)) {
      result.publication_title = 'Oxford History of Western Music';
    } else if (/oed.com/i.test(hostname)) {
      result.publication_title = 'Oxford English Dictionary';
    }
  } else if (/^\/search$/i.test(path) || /^\/browse$/i.test(path)) {
    // http://www.oxfordclinicalpsych.com:80/search?q=freud&searchBtn=Search&isQuickSearch=true
    // http://www.oxfordclinicalpsych.com:80/browse?t0=OXPSYCH_SPECIALTY:SCI02210
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
    if (/oxfordclinicalpsych.com/i.test(hostname)) {
      result.publication_title = 'Oxford Clinical Psychology';
    } else if (/oxfordmusiconline.com/i.test(hostname)) {
      result.publication_title = 'Oxford Music Online';
    } else if (/oxfordbibliographies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Bibliographies';
    } else if (/oxfordreference.com/i.test(hostname)) {
      result.publication_title = 'Oxford Reference';
    } else if (/oxfordbiblicalstudies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Biblical Studies Online';
    } else if (/oxfordwesternmusic.com/i.test(hostname)) {
      result.publication_title = 'Oxford History of Western Music';
    } else if (/oed.com/i.test(hostname)) {
      result.publication_title = 'Oxford English Dictionary';
    }
  } else if ((match = /\/view\/(([0-9.]*)\/(.*?)\/(.*?))\/(.*)/i.exec(path)) !== null) {
    // http://www.oxfordclinicalpsych.com:80/view/10.1093/med:psych/9780190271350.001.0001/med-9780190271350-chapter-10
    // http://www.oxfordmusiconline.com:80/grovemusic/view/10.1093/gmo/9781561592630.001.0001/omo-9781561592630-e-0000000094?rskey=vkrXog&result=7
    result.rtype    = 'BOOK';
    if (/\.pdf$/i.test(path)) {
      result.mime = 'PDF';
    } else if (param.print === 'pdf') {
      result.mime = 'PDF';
    } else {
      result.mime     = 'HTML';
    }
    result.doi      = match[1];
    result.unitid   = match[5];
  } else if ((match = /downloaddocsetaspdf:download\/(.*)/i.exec(path)) !== null) {
    // http://www.oxfordclinicalpsych.com:80/oso/search.downloaddocsetaspdf:download/OXPSYCH_SERIES:best_practices_in_forensic_mental_health_assessments?t0=OXPSYCH_SERIES%3Abest_practices_in_forensic_mental_health_assessments
    result.rtype    = 'REF';
    result.mime     = 'PDF';
    result.unitid   = match[1];
    if (/oxfordclinicalpsych.com/i.test(hostname)) {
      result.publication_title = 'Oxford Clinical Psychology';
    } else if (/oxfordmusiconline.com/i.test(hostname)) {
      result.publication_title = 'Oxford Music Online';
    } else if (/oxfordbibliographies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Bibliographies';
    } else if (/oxfordreference.com/i.test(hostname)) {
      result.publication_title = 'Oxford Reference';
    } else if (/oxfordbiblicalstudies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Biblical Studies Online';
    } else if (/oxfordwesternmusic.com/i.test(hostname)) {
      result.publication_title = 'Oxford History of Western Music';
    } else if (/oed.com/i.test(hostname)) {
      result.publication_title = 'Oxford English Dictionary';
    }
  } else if ((match = /^\/page\/.*\/(.*)$/i.exec(path)) !== null) {
    // http://www.oxfordclinicalpsych.com:80/page/307/%20Treatments%20That%20Work
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    if (/oxfordclinicalpsych.com/i.test(hostname)) {
      result.publication_title = 'Oxford Clinical Psychology';
    } else if (/oxfordmusiconline.com/i.test(hostname)) {
      result.publication_title = 'Oxford Music Online';
    } else if (/oxfordbibliographies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Bibliographies';
    } else if (/oxfordreference.com/i.test(hostname)) {
      result.publication_title = 'Oxford Reference';
    } else if (/oxfordbiblicalstudies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Biblical Studies Online';
    } else if (/oxfordwesternmusic.com/i.test(hostname)) {
      result.publication_title = 'Oxford History of Western Music';
    } else if (/oed.com/i.test(hostname)) {
      result.publication_title = 'Oxford English Dictionary';
    }
  } else if ((match = /\/view\/document\/(.*)\/(.*).xml$/i.exec(path)) !== null) {
    // http://www.oxfordbibliographies.com:80/view/document/obo-9780195393361/obo-9780195393361-0110.xml
    // 10.1093/OBO/9780195393361
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.doi      = doi_prefix + match[1].replace('-', '/');
    result.unitid   = match[2];
  } else if ((match = /^\/[a-z]{3}\/page\/(.*)$/i.exec(path)) !== null) {
    // http://www.oxfordbibliographies.com:80/obo/page/biblical-studies
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    if (/oxfordclinicalpsych.com/i.test(hostname)) {
      result.publication_title = 'Oxford Clinical Psychology';
    } else if (/oxfordmusiconline.com/i.test(hostname)) {
      result.publication_title = 'Oxford Music Online';
    } else if (/oxfordbibliographies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Bibliographies';
    } else if (/oxfordreference.com/i.test(hostname)) {
      result.publication_title = 'Oxford Reference';
    } else if (/oxfordbiblicalstudies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Biblical Studies Online';
    } else if (/oxfordwesternmusic.com/i.test(hostname)) {
      result.publication_title = 'Oxford History of Western Music';
    } else if (/oed.com/i.test(hostname)) {
      result.publication_title = 'Oxford English Dictionary';
    }
  } else if ((match = /^\/[a-z]{3}\/exportcitations/i.exec(path)) !== null) {
    // http://www.oxfordbibliographies.com:80/obo/exportcitations:export/$002fdocument$002fobo-9780199874002$002fobo-9780199874002-0075.xml/obo-9780199874002-0075-bibItem-0002/END_NOTE?t:ac=$002fdocument$002fobo-9780199874002$002fobo-9780199874002-0075.xml/obo-9780199874002-0075-bibItem-0002
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    if (/oxfordclinicalpsych.com/i.test(hostname)) {
      result.publication_title = 'Oxford Clinical Psychology';
    } else if (/oxfordmusiconline.com/i.test(hostname)) {
      result.publication_title = 'Oxford Music Online';
    } else if (/oxfordbibliographies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Bibliographies';
    } else if (/oxfordreference.com/i.test(hostname)) {
      result.publication_title = 'Oxford Reference';
    } else if (/oxfordbiblicalstudies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Biblical Studies Online';
    } else if (/oxfordwesternmusic.com/i.test(hostname)) {
      result.publication_title = 'Oxford History of Western Music';
    } else if (/oed.com/i.test(hostname)) {
      result.publication_title = 'Oxford English Dictionary';
    }
  } else if (/^\/newsitem\//i.test(path) || /^\/news\//i.test(path)) {
    // http://www.oxfordbibliographies.com:80/newsitem/176/December$00202017$002fJanuary$00202018$0020Update$0020Live
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    if (/oxfordclinicalpsych.com/i.test(hostname)) {
      result.publication_title = 'Oxford Clinical Psychology';
    } else if (/oxfordmusiconline.com/i.test(hostname)) {
      result.publication_title = 'Oxford Music Online';
    } else if (/oxfordbibliographies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Bibliographies';
    } else if (/oxfordreference.com/i.test(hostname)) {
      result.publication_title = 'Oxford Reference';
    } else if (/oxfordbiblicalstudies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Biblical Studies Online';
    } else if (/oxfordwesternmusic.com/i.test(hostname)) {
      result.publication_title = 'Oxford History of Western Music';
    } else if (/oed.com/i.test(hostname)) {
      result.publication_title = 'Oxford English Dictionary';
    }
  } else if ((match = /^\/page\/(.*)$/i.exec(path)) !== null) {
    // http://www.oxfordmusiconline.com:80/page/2008-letter-from-the-editor
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    if (/oxfordclinicalpsych.com/i.test(hostname)) {
      result.publication_title = 'Oxford Clinical Psychology';
    } else if (/oxfordmusiconline.com/i.test(hostname)) {
      result.publication_title = 'Oxford Music Online';
    } else if (/oxfordbibliographies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Bibliographies';
    } else if (/oxfordreference.com/i.test(hostname)) {
      result.publication_title = 'Oxford Reference';
    } else if (/oxfordbiblicalstudies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Biblical Studies Online';
    } else if (/oxfordwesternmusic.com/i.test(hostname)) {
      result.publication_title = 'Oxford History of Western Music';
    } else if (/oed.com/i.test(hostname)) {
      result.publication_title = 'Oxford English Dictionary';
    }
  } else if ((match = /\/images\/((.*?)-(.*?)-(.*))$/i.exec(path)) !== null) {
    // http://www.oxfordbiblicalstudies.com:80/article/book/obso-9780191001581/obso-9780191001581-div1-22/images/obso-9780191001581-figureGroup-33?_hi=20&_pos=1
    result.rtype    = 'IMAGE';
    result.mime     = 'MISC';
    result.print_identifier = match[3];
    result.unitid   = match[1];
    if (/oxfordclinicalpsych.com/i.test(hostname)) {
      result.publication_title = 'Oxford Clinical Psychology';
    } else if (/oxfordmusiconline.com/i.test(hostname)) {
      result.publication_title = 'Oxford Music Online';
    } else if (/oxfordbibliographies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Bibliographies';
    } else if (/oxfordreference.com/i.test(hostname)) {
      result.publication_title = 'Oxford Reference';
    } else if (/oxfordbiblicalstudies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Biblical Studies Online';
    } else if (/oxfordwesternmusic.com/i.test(hostname)) {
      result.publication_title = 'Oxford History of Western Music';
    } else if (/oed.com/i.test(hostname)) {
      result.publication_title = 'Oxford English Dictionary';
    }
  } else if ((match = /^\/article\/book\/[a-z]*-([0-9]*)\//i.exec(path)) !== null) {
    // http://www.oxfordbiblicalstudies.com:80/article/book/obso-9780192835253/obso-9780192835253-div1-729
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'HTML';
    result.print_identifier = match[1];
    if (/oxfordclinicalpsych.com/i.test(hostname)) {
      result.publication_title = 'Oxford Clinical Psychology';
    } else if (/oxfordmusiconline.com/i.test(hostname)) {
      result.publication_title = 'Oxford Music Online';
    } else if (/oxfordbibliographies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Bibliographies';
    } else if (/oxfordreference.com/i.test(hostname)) {
      result.publication_title = 'Oxford Reference';
    } else if (/oxfordbiblicalstudies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Biblical Studies Online';
    } else if (/oxfordwesternmusic.com/i.test(hostname)) {
      result.publication_title = 'Oxford History of Western Music';
    } else if (/oed.com/i.test(hostname)) {
      result.publication_title = 'Oxford English Dictionary';
    }
  } else if ((match = /^\/article\/bibref\/(.*)$/i.exec(path)) !== null) {
    // http://www.oxfordbiblicalstudies.com.proxy.library.emory.edu/article/bibref/Tanakh/Mic/1
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    if (/oxfordclinicalpsych.com/i.test(hostname)) {
      result.publication_title = 'Oxford Clinical Psychology';
    } else if (/oxfordmusiconline.com/i.test(hostname)) {
      result.publication_title = 'Oxford Music Online';
    } else if (/oxfordbibliographies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Bibliographies';
    } else if (/oxfordreference.com/i.test(hostname)) {
      result.publication_title = 'Oxford Reference';
    } else if (/oxfordbiblicalstudies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Biblical Studies Online';
    } else if (/oxfordwesternmusic.com/i.test(hostname)) {
      result.publication_title = 'Oxford History of Western Music';
    } else if (/oed.com/i.test(hostname)) {
      result.publication_title = 'Oxford English Dictionary';
    }
  } else if ((match = /^\/article\/full\/bibref\/(.*)$/i.exec(path)) !== null) {
    // http://www.oxfordbiblicalstudies.com:80/article/full/bibref/NRSV/Num/13
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    if (/oxfordclinicalpsych.com/i.test(hostname)) {
      result.publication_title = 'Oxford Clinical Psychology';
    } else if (/oxfordmusiconline.com/i.test(hostname)) {
      result.publication_title = 'Oxford Music Online';
    } else if (/oxfordbibliographies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Bibliographies';
    } else if (/oxfordreference.com/i.test(hostname)) {
      result.publication_title = 'Oxford Reference';
    } else if (/oxfordbiblicalstudies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Biblical Studies Online';
    } else if (/oxfordwesternmusic.com/i.test(hostname)) {
      result.publication_title = 'Oxford History of Western Music';
    } else if (/oed.com/i.test(hostname)) {
      result.publication_title = 'Oxford English Dictionary';
    }
  } else if ((match = /^\/article\/[a-z]*-[a-z]*\/opr\/[a-z0-9]*\/[a-z0-9]*\/bibref\/(.*)$/i.exec(path)) !== null) {
    // http://www.oxfordbiblicalstudies.com:80/article/concord-dual/opr/t259/e4/bibref/NRSV/Rev/2?verse=4
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    if (/oxfordclinicalpsych.com/i.test(hostname)) {
      result.publication_title = 'Oxford Clinical Psychology';
    } else if (/oxfordmusiconline.com/i.test(hostname)) {
      result.publication_title = 'Oxford Music Online';
    } else if (/oxfordbibliographies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Bibliographies';
    } else if (/oxfordreference.com/i.test(hostname)) {
      result.publication_title = 'Oxford Reference';
    } else if (/oxfordbiblicalstudies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Biblical Studies Online';
    } else if (/oxfordwesternmusic.com/i.test(hostname)) {
      result.publication_title = 'Oxford History of Western Music';
    } else if (/oed.com/i.test(hostname)) {
      result.publication_title = 'Oxford English Dictionary';
    }
  } else if ((match = /^\/article\/opr\/(.*)$/i.exec(path)) !== null) {
    // http://www.oxfordbiblicalstudies.com:80/article/opr/t120/e0638
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    if (/oxfordclinicalpsych.com/i.test(hostname)) {
      result.publication_title = 'Oxford Clinical Psychology';
    } else if (/oxfordmusiconline.com/i.test(hostname)) {
      result.publication_title = 'Oxford Music Online';
    } else if (/oxfordbibliographies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Bibliographies';
    } else if (/oxfordreference.com/i.test(hostname)) {
      result.publication_title = 'Oxford Reference';
    } else if (/oxfordbiblicalstudies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Biblical Studies Online';
    } else if (/oxfordwesternmusic.com/i.test(hostname)) {
      result.publication_title = 'Oxford History of Western Music';
    } else if (/oed.com/i.test(hostname)) {
      result.publication_title = 'Oxford English Dictionary';
    }
  } else if ((match = /^\/article\/sidebyside\/bibref\/(.*)$/i.exec(path)) !== null) {
    // http://www.oxfordbiblicalstudies.com:80/article/sidebyside/bibref/KJV/bibref/Tanakh/Isa/40?verse=
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    if (/oxfordclinicalpsych.com/i.test(hostname)) {
      result.publication_title = 'Oxford Clinical Psychology';
    } else if (/oxfordmusiconline.com/i.test(hostname)) {
      result.publication_title = 'Oxford Music Online';
    } else if (/oxfordbibliographies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Bibliographies';
    } else if (/oxfordreference.com/i.test(hostname)) {
      result.publication_title = 'Oxford Reference';
    } else if (/oxfordbiblicalstudies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Biblical Studies Online';
    } else if (/oxfordwesternmusic.com/i.test(hostname)) {
      result.publication_title = 'Oxford History of Western Music';
    } else if (/oed.com/i.test(hostname)) {
      result.publication_title = 'Oxford English Dictionary';
    }
  } else if (/^\/concordancebrowse$/i.test(path)) {
    // http://www.oxfordbiblicalstudies.com:80/concordancebrowse?work=/opr/t259/
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
    if (/oxfordclinicalpsych.com/i.test(hostname)) {
      result.publication_title = 'Oxford Clinical Psychology';
    } else if (/oxfordmusiconline.com/i.test(hostname)) {
      result.publication_title = 'Oxford Music Online';
    } else if (/oxfordbibliographies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Bibliographies';
    } else if (/oxfordreference.com/i.test(hostname)) {
      result.publication_title = 'Oxford Reference';
    } else if (/oxfordbiblicalstudies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Biblical Studies Online';
    } else if (/oxfordwesternmusic.com/i.test(hostname)) {
      result.publication_title = 'Oxford History of Western Music';
    } else if (/oed.com/i.test(hostname)) {
      result.publication_title = 'Oxford English Dictionary';
    }
  } else if (/Search/i.test(path)|/search/i.test(path)) {
    // http://www.oxfordbiblicalstudies.com:80/AdvancedSearch.html
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
    if (/oxfordclinicalpsych.com/i.test(hostname)) {
      result.publication_title = 'Oxford Clinical Psychology';
    } else if (/oxfordmusiconline.com/i.test(hostname)) {
      result.publication_title = 'Oxford Music Online';
    } else if (/oxfordbibliographies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Bibliographies';
    } else if (/oxfordreference.com/i.test(hostname)) {
      result.publication_title = 'Oxford Reference';
    } else if (/oxfordbiblicalstudies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Biblical Studies Online';
    } else if (/oxfordwesternmusic.com/i.test(hostname)) {
      result.publication_title = 'Oxford History of Western Music';
    } else if (/oed.com/i.test(hostname)) {
      result.publication_title = 'Oxford English Dictionary';
    }
  } else if (/^\/Timeline/i.test(path)) {
    // http://www.oxfordbiblicalstudies.com:80/Timeline.html?_hi=22&_start=31
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    if (/oxfordclinicalpsych.com/i.test(hostname)) {
      result.publication_title = 'Oxford Clinical Psychology';
    } else if (/oxfordmusiconline.com/i.test(hostname)) {
      result.publication_title = 'Oxford Music Online';
    } else if (/oxfordbibliographies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Bibliographies';
    } else if (/oxfordreference.com/i.test(hostname)) {
      result.publication_title = 'Oxford Reference';
    } else if (/oxfordbiblicalstudies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Biblical Studies Online';
    } else if (/oxfordwesternmusic.com/i.test(hostname)) {
      result.publication_title = 'Oxford History of Western Music';
    } else if (/oed.com/i.test(hostname)) {
      result.publication_title = 'Oxford English Dictionary';
    }
  } else if ((match = /^\/view\/[0-9a-zA-Z]*\/([a-z]*-([0-9]*)-(.*)).xml$/i.exec(path)) !== null) {
    // http://www.oxfordwesternmusic.com:80/view/Volume5/actrade-9780195384857-div1-007002.xml?rskey=R8nvhr&result=1
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    result.print_identifier = match[2];
    if (/oxfordclinicalpsych.com/i.test(hostname)) {
      result.publication_title = 'Oxford Clinical Psychology';
    } else if (/oxfordmusiconline.com/i.test(hostname)) {
      result.publication_title = 'Oxford Music Online';
    } else if (/oxfordbibliographies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Bibliographies';
    } else if (/oxfordreference.com/i.test(hostname)) {
      result.publication_title = 'Oxford Reference';
    } else if (/oxfordbiblicalstudies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Biblical Studies Online';
    } else if (/oxfordwesternmusic.com/i.test(hostname)) {
      result.publication_title = 'Oxford History of Western Music';
    } else if (/oed.com/i.test(hostname)) {
      result.publication_title = 'Oxford English Dictionary';
    }
  } else if (/^\/appeals$/i.test(path)) {
    // http://public.oed.com:80/appeals
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    if (/oxfordclinicalpsych.com/i.test(hostname)) {
      result.publication_title = 'Oxford Clinical Psychology';
    } else if (/oxfordmusiconline.com/i.test(hostname)) {
      result.publication_title = 'Oxford Music Online';
    } else if (/oxfordbibliographies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Bibliographies';
    } else if (/oxfordreference.com/i.test(hostname)) {
      result.publication_title = 'Oxford Reference';
    } else if (/oxfordbiblicalstudies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Biblical Studies Online';
    } else if (/oxfordwesternmusic.com/i.test(hostname)) {
      result.publication_title = 'Oxford History of Western Music';
    } else if (/oed.com/i.test(hostname)) {
      result.publication_title = 'Oxford English Dictionary';
    }
  } else if ((match = /^\/appeals\/(.*)\/$/i.exec(path)) !== null) {
    // http://public.oed.com:80/appeals/arnold-palmer/
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    if (/oxfordclinicalpsych.com/i.test(hostname)) {
      result.publication_title = 'Oxford Clinical Psychology';
    } else if (/oxfordmusiconline.com/i.test(hostname)) {
      result.publication_title = 'Oxford Music Online';
    } else if (/oxfordbibliographies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Bibliographies';
    } else if (/oxfordreference.com/i.test(hostname)) {
      result.publication_title = 'Oxford Reference';
    } else if (/oxfordbiblicalstudies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Biblical Studies Online';
    } else if (/oxfordwesternmusic.com/i.test(hostname)) {
      result.publication_title = 'Oxford History of Western Music';
    } else if (/oed.com/i.test(hostname)) {
      result.publication_title = 'Oxford English Dictionary';
    }
  } else if (/^\/appeals-news/i.test(path)) {
    // http://public.oed.com:80/appeals-news/
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    if (/oxfordclinicalpsych.com/i.test(hostname)) {
      result.publication_title = 'Oxford Clinical Psychology';
    } else if (/oxfordmusiconline.com/i.test(hostname)) {
      result.publication_title = 'Oxford Music Online';
    } else if (/oxfordbibliographies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Bibliographies';
    } else if (/oxfordreference.com/i.test(hostname)) {
      result.publication_title = 'Oxford Reference';
    } else if (/oxfordbiblicalstudies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Biblical Studies Online';
    } else if (/oxfordwesternmusic.com/i.test(hostname)) {
      result.publication_title = 'Oxford History of Western Music';
    } else if (/oed.com/i.test(hostname)) {
      result.publication_title = 'Oxford English Dictionary';
    }
  } else if (/^\/appeals-tags/i.test(path)) {
    // http://public.oed.com:80/appeals-tags/food-drink/
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    if (/oxfordclinicalpsych.com/i.test(hostname)) {
      result.publication_title = 'Oxford Clinical Psychology';
    } else if (/oxfordmusiconline.com/i.test(hostname)) {
      result.publication_title = 'Oxford Music Online';
    } else if (/oxfordbibliographies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Bibliographies';
    } else if (/oxfordreference.com/i.test(hostname)) {
      result.publication_title = 'Oxford Reference';
    } else if (/oxfordbiblicalstudies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Biblical Studies Online';
    } else if (/oxfordwesternmusic.com/i.test(hostname)) {
      result.publication_title = 'Oxford History of Western Music';
    } else if (/oed.com/i.test(hostname)) {
      result.publication_title = 'Oxford English Dictionary';
    }
  } else if (/^\/aspects-of-english\/$/i.test(path)) {
    // http://public.oed.com:80/aspects-of-english/
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    if (/oxfordclinicalpsych.com/i.test(hostname)) {
      result.publication_title = 'Oxford Clinical Psychology';
    } else if (/oxfordmusiconline.com/i.test(hostname)) {
      result.publication_title = 'Oxford Music Online';
    } else if (/oxfordbibliographies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Bibliographies';
    } else if (/oxfordreference.com/i.test(hostname)) {
      result.publication_title = 'Oxford Reference';
    } else if (/oxfordbiblicalstudies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Biblical Studies Online';
    } else if (/oxfordwesternmusic.com/i.test(hostname)) {
      result.publication_title = 'Oxford History of Western Music';
    } else if (/oed.com/i.test(hostname)) {
      result.publication_title = 'Oxford English Dictionary';
    }
  } else if ((match = /^\/aspects-of-english\/(.*)$/i.exec(path)) !== null) {
    // http://public.oed.com:80/aspects-of-english/english-in-use/south-african-english/
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    if (/oxfordclinicalpsych.com/i.test(hostname)) {
      result.publication_title = 'Oxford Clinical Psychology';
    } else if (/oxfordmusiconline.com/i.test(hostname)) {
      result.publication_title = 'Oxford Music Online';
    } else if (/oxfordbibliographies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Bibliographies';
    } else if (/oxfordreference.com/i.test(hostname)) {
      result.publication_title = 'Oxford Reference';
    } else if (/oxfordbiblicalstudies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Biblical Studies Online';
    } else if (/oxfordwesternmusic.com/i.test(hostname)) {
      result.publication_title = 'Oxford History of Western Music';
    } else if (/oed.com/i.test(hostname)) {
      result.publication_title = 'Oxford English Dictionary';
    }
  } else if (/^\/historical-thesaurus-of-the-oed\/$/i.test(path)) {
    // http://public.oed.com:80/historical-thesaurus-of-the-oed/
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    if (/oxfordclinicalpsych.com/i.test(hostname)) {
      result.publication_title = 'Oxford Clinical Psychology';
    } else if (/oxfordmusiconline.com/i.test(hostname)) {
      result.publication_title = 'Oxford Music Online';
    } else if (/oxfordbibliographies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Bibliographies';
    } else if (/oxfordreference.com/i.test(hostname)) {
      result.publication_title = 'Oxford Reference';
    } else if (/oxfordbiblicalstudies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Biblical Studies Online';
    } else if (/oxfordwesternmusic.com/i.test(hostname)) {
      result.publication_title = 'Oxford History of Western Music';
    } else if (/oed.com/i.test(hostname)) {
      result.publication_title = 'Oxford English Dictionary';
    }
  } else if ((match = /^\/historical-thesaurus-of-the-oed\/(.*)\/$/i.exec(path)) !== null) {
    // http://public.oed.com:80/historical-thesaurus-of-the-oed/how-to-use-the-historical-thesaurus-of-the-oed/
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    if (/oxfordclinicalpsych.com/i.test(hostname)) {
      result.publication_title = 'Oxford Clinical Psychology';
    } else if (/oxfordmusiconline.com/i.test(hostname)) {
      result.publication_title = 'Oxford Music Online';
    } else if (/oxfordbibliographies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Bibliographies';
    } else if (/oxfordreference.com/i.test(hostname)) {
      result.publication_title = 'Oxford Reference';
    } else if (/oxfordbiblicalstudies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Biblical Studies Online';
    } else if (/oxfordwesternmusic.com/i.test(hostname)) {
      result.publication_title = 'Oxford History of Western Music';
    } else if (/oed.com/i.test(hostname)) {
      result.publication_title = 'Oxford English Dictionary';
    }
  } else if (/^\/history-of-the-oed\/$/i.test(path)) {
    // http://public.oed.com:80/history-of-the-oed/
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    if (/oxfordclinicalpsych.com/i.test(hostname)) {
      result.publication_title = 'Oxford Clinical Psychology';
    } else if (/oxfordmusiconline.com/i.test(hostname)) {
      result.publication_title = 'Oxford Music Online';
    } else if (/oxfordbibliographies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Bibliographies';
    } else if (/oxfordreference.com/i.test(hostname)) {
      result.publication_title = 'Oxford Reference';
    } else if (/oxfordbiblicalstudies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Biblical Studies Online';
    } else if (/oxfordwesternmusic.com/i.test(hostname)) {
      result.publication_title = 'Oxford History of Western Music';
    } else if (/oed.com/i.test(hostname)) {
      result.publication_title = 'Oxford English Dictionary';
    }
  } else if ((match = /^\/view\/Entry\/(.*)$/i.exec(path)) !== null) {
    // http://www.oed.com:80/view/Entry/135565
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    if (/oxfordclinicalpsych.com/i.test(hostname)) {
      result.publication_title = 'Oxford Clinical Psychology';
    } else if (/oxfordmusiconline.com/i.test(hostname)) {
      result.publication_title = 'Oxford Music Online';
    } else if (/oxfordbibliographies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Bibliographies';
    } else if (/oxfordreference.com/i.test(hostname)) {
      result.publication_title = 'Oxford Reference';
    } else if (/oxfordbiblicalstudies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Biblical Studies Online';
    } else if (/oxfordwesternmusic.com/i.test(hostname)) {
      result.publication_title = 'Oxford History of Western Music';
    } else if (/oed.com/i.test(hostname)) {
      result.publication_title = 'Oxford English Dictionary';
    }
  } else if ((match = /^\/view\/source\/(.*)$/i.exec(path)) !== null) {
    // http://www.oed.com:80/view/source/135565
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    if (/oxfordclinicalpsych.com/i.test(hostname)) {
      result.publication_title = 'Oxford Clinical Psychology';
    } else if (/oxfordmusiconline.com/i.test(hostname)) {
      result.publication_title = 'Oxford Music Online';
    } else if (/oxfordbibliographies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Bibliographies';
    } else if (/oxfordreference.com/i.test(hostname)) {
      result.publication_title = 'Oxford Reference';
    } else if (/oxfordbiblicalstudies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Biblical Studies Online';
    } else if (/oxfordwesternmusic.com/i.test(hostname)) {
      result.publication_title = 'Oxford History of Western Music';
    } else if (/oed.com/i.test(hostname)) {
      result.publication_title = 'Oxford English Dictionary';
    }
  } else if (/^\/audio$/i.test(path)) {
    // http://www.oed.com:80/audio?file=%2Fsoundfiles%2Fa%2Fat%2Fato%2Fatol%3Fpub_sig%3DYkUp2HE0gNwRjj4B3ePRa5wVpU2KtOoHH%252B4l%252FjVAn%252FI%253D%231_us_1_abbr.mp32018-03-05.mp3
    result.rtype    = 'AUDIO';
    result.mime     = 'MISC';
    result.unitid   = param.file;
    if (/oxfordclinicalpsych.com/i.test(hostname)) {
      result.publication_title = 'Oxford Clinical Psychology';
    } else if (/oxfordmusiconline.com/i.test(hostname)) {
      result.publication_title = 'Oxford Music Online';
    } else if (/oxfordbibliographies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Bibliographies';
    } else if (/oxfordreference.com/i.test(hostname)) {
      result.publication_title = 'Oxford Reference';
    } else if (/oxfordbiblicalstudies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Biblical Studies Online';
    } else if (/oxfordwesternmusic.com/i.test(hostname)) {
      result.publication_title = 'Oxford History of Western Music';
    } else if (/oed.com/i.test(hostname)) {
      result.publication_title = 'Oxford English Dictionary';
    }
  } else if (/^\/browsedictionary$/i.test(path)) {
    // http://www.oed.com:80/browsedictionary?scope=SENSE&subjectClass=Agriculture+and+Horticulture
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
    if (/oxfordclinicalpsych.com/i.test(hostname)) {
      result.publication_title = 'Oxford Clinical Psychology';
    } else if (/oxfordmusiconline.com/i.test(hostname)) {
      result.publication_title = 'Oxford Music Online';
    } else if (/oxfordbibliographies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Bibliographies';
    } else if (/oxfordreference.com/i.test(hostname)) {
      result.publication_title = 'Oxford Reference';
    } else if (/oxfordbiblicalstudies.com/i.test(hostname)) {
      result.publication_title = 'Oxford Biblical Studies Online';
    } else if (/oxfordwesternmusic.com/i.test(hostname)) {
      result.publication_title = 'Oxford History of Western Music';
    } else if (/oed.com/i.test(hostname)) {
      result.publication_title = 'Oxford English Dictionary';
    }
  }

  return result;
});
