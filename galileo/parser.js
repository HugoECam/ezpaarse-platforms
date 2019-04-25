#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param = parsedUrl.query || {};

  let match;

  if (((match = /^\/([A-z0-9_-]+)\/search$/i.exec(path)) !== null) || (/^\/cgi/i.test(path)) || (/^\/cgi-bin/i.test(path)) || (/^\/scholar/i.test(path))) {
    // http://aafa.galileo.usg.edu:80/aafa/search?browse-creator=first;sort=creator
    // http://dlg.galileo.usg.edu:80/cgi/bald?query=id:*&numrecs=96&format=_contact&grid=3
    // http://dlg.galileo.usg.edu:80/cgi-bin/vsbg.cgi?userid=public&dbs=vsbg&ini=vsbg.ini&action=display_marked&format=marked
    // http://www.galileo.usg.edu:80/scholar/emory/databases/
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/([A-z0-9\/_-]+)\/toc.php$/i.exec(path)) !== null) {
    // http://dlg.galileo.usg.edu:80/hawkins/toc.php
    // http://dlg.galileo.usg.edu:80/hargrett/lumpkin/toc.php
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/([A-z0-9_-]+)\/browse\/([A-z0-9_.-]+)$/i.exec(path)) !== null) {
    // http://statregister.galileo.usg.edu:80/statregister/browse/1923_1929.html
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[2];
  } else if ((match = /^\/(.*)\/([A-z0-9_-]+).pdf$/i.exec(path)) !== null) {
    // http://dlg.galileo.usg.edu:80/savannahmayor/pdf/1894.pdf
    // http://dlg.galileo.usg.edu:80/ggpd/docs/2018/ga/l412/_ps1/d3/2018_s2_h22/elec_p_btext.con/1.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.unitid   = match[2];
  } else if ((match = /^\/([A-z0-9\/_-]+)\/([A-z0-9_-]+).flv$/i.exec(path)) !== null) {
    // http://dlg.galileo.usg.edu:80/highlander/flv/efhf01/highlander_new.flv 
    result.rtype    = 'VIDEO';
    result.mime     = 'MISC';
    result.title_id = match[1];
    result.unitid   = match[2];
  } else if (((match = /^\/([A-z0-9]+)\/view/i.exec(path)) !== null) && (param.docId !== null)) {
    // http://aafa.galileo.usg.edu:80/aafa/view?docId=ead/aarl98-008-ead.xml&anchor.id=0
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.unitid = param.docId;
  } else if ((match = /^\/([A-z0-9\/_-]+)\/Sheet([0-9_-]+).html$/i.exec(path)) !== null) {
    // http://dlg.galileo.usg.edu:80/sanborn/CityCounty/Marietta1885/Sheet1.html 
    result.rtype    = 'IMAGE';
    result.mime     = 'JPEG';
    result.title_id = match[1];
    result.unitid   = 'Sheet' + match[2];
  } else if ((match = /^\/([A-z0-9\/_-]+)\/$/i.exec(path)) !== null) {
    // http://dlg.galileo.usg.edu:80/reed/
    // http://dlg.galileo.usg.edu:80/hargrett/barnard/
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if (((match = /^\/([A-z0-9\/_-]+)\/([A-z0-9_-]+).html$/i.exec(path)) !== null) || ((match = /^\/([A-z0-9\/]+)\/([A-z0-9]+).php$/i.exec(path)) !== null)) {
    // http://dlg.galileo.usg.edu:80/highlander/friended.html
    // http://dlg.galileo.usg.edu:80/hawkins/001.php
    // http://dlg.galileo.usg.edu:80/sanborn/CityCounty/Region3.html
    // http://dlg.galileo.usg.edu:80/hargrett/williams/williams2.php
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[2];
  } else if (((match = /^\/([A-z0-9]+)\/([A-z0-9]+)/i.exec(path)) !== null) && (param.item !== null)) {
    // http://dlgcsm.galib.uga.edu:80/StyleServer/calcrgn?browser=ns&cat=hagp&wid=420&hei=400&style=hagp/hagp.xsl&item=aep001.sid
    result.rtype    = 'IMAGE';
    result.mime     = 'JPEG';
    result.unitid = param.item;
  }
  return result;
});
