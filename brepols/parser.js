#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme Brepols
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // var param  = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;
  let title;

  if ((match = /^\/([a-z]+)\/search.cfm$/.exec(path)) !== null) {
    // http://apps.brepolis.net/bmb/search.cfm?action=search_simple_detail_single&startrow=1&
    // endrow=1&search_order=year_desc&FULL_TEXT=chateau&SOURCE=IMB%20OR%20BCM&search_selection=
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid=match[1];
  } else if ((match = /^\/([a-z]+)\/pages\/([^.]+).aspx$/.exec(path)) !== null) {
    // http://clt.brepolis.net/emgh/pages/FullText.aspx?ctx=AGAFJG
    // http://clt.brepolis.net/emgh/pages/Exporter.aspx?ctx=31193
    // http://clt.brepolis.net/dld/pages/ArticlePrinter.aspx?dict=BP&id=24222
    // http://clt.brepolis.net/dld/pages/QuickSearch.aspx
    // http://clt.brepolis.net/dld/pages/ImageProvider.aspx?name=DC7_215&x=661&y=642
    result.rtype    = 'BOOK_SECTION';
    result.title_id = match[1];
    result.unitid=match[1];
    if (match[2] === 'FullText') {
      result.mime     = 'HTML';
    } else if (match[2] === 'Exporter') {
      result.mime     = 'PDF';
    } else if (match[2] === 'ArticlePrinter') {
      result.rtype    = 'ARTICLE';
      result.mime     = 'PDF';
    } else if (match[2] === 'QuickSearch') {
      result.rtype    = 'ARTICLE';
      result.mime     = 'HTML';
    } else if (match[2] === 'ImageProvider') {
      result.rtype    = 'ARTICLE';
      result.mime     = 'MISC';
    }
  } else if (/^\/action\/doSearch$/i.test(path)) {
    // http://www.brepolsonline.net:80/action/doSearch?AllField=pascal
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if (/^\/author\/.*$/i.test(path)) {
    // http://www.brepolsonline.net:80/author/Payen%2C+Pascal
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/doi\/(([0-9.]*)\/(.*))$/i.exec(path)) !== null) {
    // http://www.brepolsonline.net:80/doi/10.1484/J.VIATOR.2.301507
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.doi      = match[1];
    result.unitid   = match[3];
  } else if ((match = /^\/doi\/abs\/(([0-9.]*)\/(.*))$/i.exec(path)) !== null) {
    // http://www.brepolsonline.net:80/doi/abs/10.1484/J.ASH.1.102901
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.doi      = match[1];
    result.unitid   = match[3];
  } else if ((match = /^\/doi\/book\/(([0-9.]*)\/(.*))$/i.exec(path)) !== null) {
    // http://www.brepolsonline.net:80/doi/book/10.1484/M.AS-EB.5.107423
    result.rtype    = 'BOOK';
    result.mime     = 'HTML';
    result.doi      = match[1];
    result.unitid   = match[3];
  } else if ((match = /^\/doi\/pdf\/(([0-9.]*)\/(.*))$/i.exec(path)) !== null) {
    // http://www.brepolsonline.net:80/doi/pdf/10.1484/J.ASH.1.102904
    result.rtype    = 'BOOK';
    result.mime     = 'PDF';
    result.doi      = match[1];
    result.unitid   = match[3];
  } else if ((match = /^\/loi\/([a-z]*)$/i.exec(path)) !== null) {
    // http://www.brepolsonline.net/loi/almagest
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    title           = match[1];
    if (title === 'almagest') {
      result.publication_title = 'Almagest';
    } else if (title === 'aboll') {
      result.publication_title = 'Analecta Bollandiana';
    } else if (title === 'asr') {
      result.publication_title = 'Annali di Scienze Religiose';
    } else if (title === 'at') {
      result.publication_title = 'Antiquité Tardive';
    } else if (title === 'apocra') {
      result.publication_title = 'Apocrypha';
    } else if (title === 'arch') {
      result.publication_title = 'Archeion';
    } else if (title === 'arihs') {
      result.publication_title = 'Archives Internationales d\'Histoire des Sciences';
    } else if (title === 'jal') {
      result.publication_title = 'Ars Lyrica';
    } else if (title === 'bpm') {
      result.publication_title = 'Bulletin de Philosophie Médiévale';
    } else if (title === 'cde') {
      result.publication_title = 'Chronique d\'Egypte';
    } else if (title === 'csha') {
      result.publication_title = 'Cleveland Studies in the History of Art';
    } else if (title === 'convi') {
      result.publication_title = 'Convivium';
    } else if (title === 'emd') {
      result.publication_title = 'European Medieval Drama';
    } else if (title === 'eyhp') {
      result.publication_title = 'European Yearbook of the History of Psychology';
    } else if (title === 'food') {
      result.publication_title = 'Food and History';
    } else if (title === 'frag') {
      result.publication_title = 'Fragmenta';
    } else if (title === 'gif') {
      result.publication_title = 'Giornale Italiano di Filologia';
    } else if (title === 'ham') {
      result.publication_title = 'Hortus Artium Medievalium';
    } else if (title === 'ikon') {
      result.publication_title = 'IKON';
    } else if (title === 'ima') {
      result.publication_title = 'In Monte Artium';
    } else if (title === 'jhes') {
      result.publication_title = 'Journal for the History of Environment and Society';
    } else if (title === 'jiaa') {
      result.publication_title = 'Journal of Inner Asian Art and Archaeology';
    } else if (title === 'jml') {
      result.publication_title = 'The Journal of Medieval Latin';
    } else if (title === 'jmms') {
      result.publication_title = 'Journal of Medieval Monastic Studies';
    } else if (title === 'jaf') {
      result.publication_title = 'Journal of the Alamire Foundation';
    } else if (title === 'jaaj') {
      result.publication_title = 'Judaïsme Ancien - Ancient Judaism';
    } else if (title === 'jr') {
      result.publication_title = 'Le Journal de la Renaissance';
    } else if (title === 'lmfr') {
      result.publication_title = 'Le Moyen Français';
    } else if (title === 'llr') {
      result.publication_title = 'Les Lettres Romanes';
    } else if (title === 'la') {
      result.publication_title = 'Liber Annuus';
    } else if (title === 'mss') {
      result.publication_title = 'Manuscripta';
    } else if (title === 'tmj') {
      result.publication_title = 'The Mediaeval Journal';
    } else if (title === 'ms') {
      result.publication_title = 'Mediaeval Studies';
    } else if (title === 'mmm') {
      result.publication_title = 'Medieval and Modern Matters';
    } else if (title === 'mlc') {
      result.publication_title = 'The Medieval Low Countries';
    } else if (title === 'jmma') {
      result.publication_title = 'Metropolitan Museum Journal';
    } else if (title === 'nml') {
      result.publication_title = 'New Medieval Literatures';
    } else if (title === 'nms') {
      result.publication_title = 'Nottingham Medieval Studies';
    } else if (title === 'pecia') {
      result.publication_title = 'Pecia';
    } else if (title === 'perit') {
      result.publication_title = 'Peritia';
    } else if (title === 'pceeb') {
      result.publication_title = 'Publications du Centre Européen d\'Etudes Bourguignonnes';
    } else if (title === 'quaestio') {
      result.publication_title = 'Quaestio';
    } else if (title === 'ra') {
      result.publication_title = 'Recherches Augustiniennes et Patristiques';
    } else if (title === 'rb') {
      result.publication_title = 'Revue Bénédictine';
    } else if (title === 'rea') {
      result.publication_title = 'Revue d\'Etudes Augustiniennes et Patristiques';
    } else if (title === 'rhef') {
      result.publication_title = 'Revue d\'Histoire de l\'Eglise de France';
    } else if (title === 'rht') {
      result.publication_title = 'Revue d\'Histoire des Textes';
    } else if (title === 'rhe') {
      result.publication_title = 'Revue d\'Histoire Ecclésiastique';
    } else if (title === 'rm') {
      result.publication_title = 'Revue Mabillon';
    } else if (title === 'rph') {
      result.publication_title = 'Romance Philology';
    } else if (title === 'se') {
      result.publication_title = 'Sacris Erudiri';
    } else if (title === 'sec') {
      result.publication_title = 'Semitica et Classica';
    } else if (title === 'socc') {
      result.publication_title = 'Studia Orientalia Christiana';
    } else if (title === 'troia') {
      result.publication_title = 'Troianalexandrina';
    } else if (title === 'viator') {
      result.publication_title = 'Viator';
    } else if (title === 'viatml') {
      result.publication_title = 'Viator (English and Multilingual Edition)';
    } else if (title === 'vms') {
      result.publication_title = 'Viking and Medieval Scandinavia';
    } else if (title === 'yls') {
      result.publication_title = 'The Yearbook of Langland Studies';
    }
  }

  return result;
});
