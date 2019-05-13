#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Scopus
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */

module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  const result = {};
  const path   = parsedUrl.pathname;
  const param  = parsedUrl.query || {};

  let match;

  if (/^\/results\/citedbyresults.ur[il]$/i.test(path)) {
    // http://www.scopus.com/results/citedbyresults.url?sort=plf-f
    // &cite=2-s2.0-84863856522&src=s&imp=t
    // &sid=38BDE00A99BBFE87E2CE4B3BBB4A00E8.aqHV0EoE4xlIF3hgVWgA%3a170
    // &sot=cite&sdt=a&sl=0&origin=resultslist
    // &editSaveSearch=&txGid=38BDE00A99BBFE87E2CE4B3BBB4A00E8.aqHV0EoE4xlIF3hgVWgA%3a17
    result.mime   = 'HTML';
    result.rtype  = 'REF';
    result.unitid = param.cite;
  } else if ((match = /^\/record\/([a-z]+)\.ur[il]$/i.exec(path)) !== null) {
    // TO DO: use http://kitchingroup.cheme.cmu.edu/blog/2015/04/06/
    // Using-the-Scopus-api-with-xml-output to get metadata like doi.
    // The API requires a key.

    switch (match[1]) {
    case 'display':
      // http://www.scopus.com/record/display.url?eid=2-s2.0-33644857527
      // &origin=reflist&sort=plf-f&src=s&st1=bim
      // &st2=crowd&sid=32F992A81208A3DEC0703EA645402F89.f594dyPDCy4K3aQHRor6A%3a40&sot=b
      // &sdt=b&sl=45&s=%28TITLE-ABS-KEY%28bim%29+AND+TITLE-ABS-KEY%28crowd%29%29
      result.mime   = 'HTML';
      result.rtype  = 'ABS';
      result.unitid = param.eid;
      break;
    case 'references':
      // http://www.scopus.com/record/references.url?origin=recordpage&currentRecordPageEID=2-s2.0-84880617481
      result.mime   = 'HTML';
      result.rtype  = 'REF';
      result.unitid = param.currentRecordPageEID;
      break;
    case 'detail':
      result.mime  = 'HTML';
      result.rtype = 'BIO';
      if (param.authorId) {
        result.unitid = param.authorId;
      }
      break;
    case 'pdfdownload':
      // /record/pdfdownload.uri?origin=recordpage&sid=&src=s&stateKey=OFD_804446236&eid=2-s2.0-84952777090&sort=&listId=&clickedLink=&_selectedCitationInformationItemsAll=on&selectedCitationInformationItems=Author%28s%29
      result.rtype  = 'REF';
      result.mime   = 'PDF';
      result.unitid = param.eid;
      break;
    }
  } else if (/^\/authid\/detail\.ur[il]$/i.test(path)) {
    // http://www.scopus.com/authid/detail.url?authorId=35190313500
    result.mime  = 'HTML';
    result.rtype = 'BIO';
    if (param.authorId) {
      result.unitid = param.authorId;
    }
  } else if (/^\/citation\/print\.ur[il]$/i.test(path)) {
    // /citation/print.uri?origin=recordpage&sid=&src=s&stateKey=OFD_804446236&eid=2-s2.0-84952777090&sort=&clickedLink=&view=FullDocument&_selectedCitationInformationItemsAll=on&selectedCitationInformationItems=Author%28s%29
    result.mime  = 'PRINT';
    result.rtype = 'REF';
    if (param.eid) {
      result.unitid = param.eid;
    }
  } else if (/^\/results\/([A-z]+).uri$/i.test(path)) {
    // https://www.scopus.com:443/results/results.uri?editSaveSearch=&sort=plf-f&src=s&st1=Robots&nlo=&nlr=&nls=&sid=738cfe6dd647d3d7f26d96236249be1f&sot=b&sdt=sisr&sl=21&s=TITLE-ABS-KEY%28Robots%29&ref=%28salad%29&origin=resultslist&zone=leftSideBar&txGid=19e24613138faa85db1709fffd933364
    // https://www.scopus.com:443/results/authorNamesList.uri?origin=searchauthorlookup&src=al&edit=&poppUp=&basicTab=&affiliationTab=&advancedTab=&st1=Smith&st2=&institute=&orcidId=&authSubject=LFSC&_authSubject=on&authSubject=HLSC&_authSubject=on&authSubject=PHSC&_authSubject=on&authSubject=SOSC&_authSubject=on&s=AUTHLASTNAME%28Smith%29&sdt=al&sot=al&searchId=86319d2b10ae6a14f43258cbdd10ae4d&exactSearch=off&sid=86319d2b10ae6a14f43258cbdd10ae4d
    // https://www.scopus.com:443/results/affiliationResults.uri?origin=SearchAffiliationLookup&selectionPageSearch=afsp&affilFormOnly=true&src=af&edit=&affilCity=&affilCntry=&authorTab=&basicTab=&advancedTab=&basicAffilSearchTab=&affilName=Emory&s=AFFIL%28Emory%29&sl=12&sdt=aff&sot=afsp&sort=afcnt-f&searchId=870e06af22fd9be4356f612b0badaad0&sid=870e06af22fd9be4356f612b0badaad0
    result.mime   = 'HTML';
    result.rtype  = 'SEARCH';
  } else if (/^\/sources.uri$/i.test(path)) {
    // https://www.scopus.com:443/sources.uri?zone=TopNavBar&origin=resultslist
    result.mime   = 'HTML';
    result.rtype  = 'SEARCH';
  } else if (/^\/sources$/i.test(path)) {
    // https://www.scopus.com:443/sources?sortField=citescore&sortDirection=desc&isHiddenField=false&field=subject&subject=&asjcs=1108&Apply=Apply&_openAccess=on&_countCheck=on&count=0&countField=documentsMin&_bestPercentile=on&_quartile=on&_quartile=on&_quartile=on&_quartile=on&_type=on&_type=on&_type=on&_type=on&year=2017&offset=&resultsPerPage=20
    result.mime   = 'HTML';
    result.rtype  = 'SEARCH';
  } else if ((match = /^\/sourceid\/([0-9]+)$/i.exec(path)) !== null) {
    // https://www.scopus.com:443/sourceid/21100773746
    result.mime   = 'HTML';
    result.rtype  = 'REF';
    result.unitid = match[1];
  } else if (/^\/affil\/profile.uri$/i.test(path)) {
    // https://www.scopus.com:443/affil/profile.uri?id=60018475&origin=AuthorResultsList
    result.mime   = 'HTML';
    result.rtype  = 'REF';
    result.unitid = param.id;
  } else if (/^\/source\/retrieveDocs.uri$/i.test(path)) {
    // https://www.scopus.com:443/source/retrieveDocs.uri?sourceId=21100773746&year=2017&docType=cc&pg=1
    result.mime   = 'HTML';
    result.rtype  = 'TOC';
    result.unitid = param.sourceId;
  } else if (/^\/action\/manage$/i.test(path)) {
    // https://syndic8.scopus.com:443/action/manage?currentActivity=null
    result.mime   = 'MISC';
    result.rtype  = 'CONNECTION';
  } else if ((match = /^\/posts\/([A-z0-9-]+)$/i.exec(path)) !== null) {
    // https://blog.scopus.com:443/posts/check-out-citescore-tracker-to-see-how-a-title-s-citescore-is-building-each-month
    result.mime   = 'ARTICLE';
    result.rtype  = 'REF';
    result.unitid = match[1];
  }
  return result;
});
