import { scheduleOnce } from '@ember/runloop';
import { hash, resolve } from 'rsvp';
import { isBlank } from '@ember/utils';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';

const PageSize = 10;

export default Component.extend({
  store: service(),
  session: service(),
  searchService: service('search'),
  routing: service('-routing'),
  metrics: service(),
  focusNode: '#search-input',
  init() {
    this._super(...arguments);
    this.get('search').perform(this.get('query'));
  },
  hasSearchedAndNoResults: computed('queryIsValid', 'results.length', 'search.isIdle', function() {
    return this.get('queryIsValid') && !this.get('results.length') && this.get('search.isIdle');
  }),
  queryIsValid: computed('query', function() {
    let emMatcher = /(^e$|^em$|^emb$|^embe$|^ember$|^ember-$)/;
    let query = this.get('query');
    return !(isBlank(query) || query.length < 3 || emMatcher.test(query));
  }),
  fetchMoreAddons: task(function* () {
    let pageToFetch = this.get('_results.lastAddonPageDisplaying') + 1;
    let moreAddons = yield this._fetchPageOfAddonResults(this.get('_results.rawResults.addonResults'), pageToFetch);
    this.get('_results.displayingAddons').pushObjects(moreAddons);
    this.set('_results.lastAddonPageDisplaying', pageToFetch);
  }),
  fetchMoreMaintainers: task(function* () {
    let pageToFetch = this.get('_results.lastMaintainerPageDisplaying') + 1;
    let moreMaintainers = yield this._fetchPageOfMaintainerResults(this.get('_results.rawResults.maintainerResults'), pageToFetch);
    this.get('_results.displayingMaintainers').pushObjects(moreMaintainers);
    this.set('_results.lastMaintainerPageDisplaying', pageToFetch);
  }),
  fetchMoreCategories: task(function* () {
    let pageToFetch = this.get('_results.lastCategoryPageDisplaying') + 1;
    let moreCategories = yield this._fetchPageOfCategoryResults(this.get('_results.rawResults.categoryResults'), pageToFetch);
    this.get('_results.displayingCategories').pushObjects(moreCategories);
    this.set('_results.lastCategoryPageDisplaying', pageToFetch);
  }),
  fetchMoreReadmes: task(function* () {
    let pageToFetch = this.get('_results.lastReadmePageDisplaying') + 1;
    let moreReadmes = yield this._fetchPageOfAddonResults(this.get('_results.rawResults.readmeResults'), pageToFetch);
    this.get('_results.displayingReadmes').pushObjects(moreReadmes);
    this.set('_results.lastReadmePageDisplaying', pageToFetch);
  }),
  search: task(function* (query) {
    this.set('query', query.trim());
    if (!this.get('queryIsValid')) {
      this.set('_results', null);
      return;
    }

    yield timeout(250);

    this.get('metrics').trackEvent({ category: 'Search', action: 'Search on /', label: this.get('query') });

    let results = yield this.get('searchService.search').perform(this.get('query'), { includeReadmes: this.get('searchReadmes') });
    let firstPageOfResults = yield this._fetchFirstPageOfResults(results);

    this.set('_results', {
      displayingAddons: firstPageOfResults.addons,
      lastAddonPageDisplaying: 1,
      totalAddonsCount: results.addonResults.matchCount,
      displayingCategories: firstPageOfResults.categories,
      lastCategoryPageDisplaying: 1,
      totalCategoriesCount: results.categoryResults.matchCount,
      displayingMaintainers: firstPageOfResults.maintainers,
      totalMaintainersCount: results.maintainerResults.matchCount,
      lastMaintainerPageDisplaying: 1,
      displayingReadmes: firstPageOfResults.readmes,
      readmeMatchMap: results.readmeResults.matchMap,
      totalReadmeCount: results.readmeResults.matchCount,
      lastReadmePageDisplaying: 1,
      rawResults: results,
      length: results.length
    });
  }).restartable(),
  toggleReadmeSearch: task(function* () {
    this.toggleProperty('searchReadmes');
    yield this.get('search').perform(this.get('query'));
  }),
  _fetchFirstPageOfResults(results) {
    let addonsPromise = this._fetchPageOfAddonResults(results.addonResults, 1);
    let categoriesPromise = this._fetchPageOfCategoryResults(results.categoryResults, 1);
    let maintainersPromise = this._fetchPageOfMaintainerResults(results.maintainerResults, 1);
    let readmePromise = this._fetchPageOfAddonResults(results.readmeResults, 1);

    return hash({
      addons: addonsPromise,
      categories: categoriesPromise,
      maintainers: maintainersPromise,
      readmes: readmePromise
    });
  },
  _fetchPageOfMaintainerResults(results, page) {
    if (!results || !results.matchCount) {
      return resolve(null);
    }
    let ids = results.matchIds.slice((page - 1) * PageSize, page * PageSize);
    return this.get('store').query('maintainer', { filter: { id: ids.join(',') }, sort: 'name' }).then((maintainers) => maintainers.toArray());
  },
  _fetchPageOfCategoryResults(results, page) {
    if (!results || !results.matchCount) {
      return resolve(null);
    }
    let ids = results.matchIds.slice((page - 1) * PageSize, page * PageSize);
    return this.get('store').query('category', { filter: { id: ids.join(',') }, sort: 'name' }).then((categories) => categories.toArray());
  },
  _fetchPageOfAddonResults(results, page) {
    if (!results || !results.matchCount) {
      return resolve(null);
    }
    let ids = results.matchIds.slice((page - 1) * PageSize, page * PageSize);
    return this.get('store').query('addon', { filter: { id: ids.join(',') }, sort: '-score', include: 'categories' }).then((addons) => addons.toArray());
  },
  results: computed('query', '_results', function() {
    if (this.get('queryIsValid')) {
      return this.get('_results');
    }
    return null;
  }),
  focus() {
    this.$(this.get('focusNode')).focus();
  },
  clearSearch() {
    this.get('metrics').trackEvent({ category: 'Clear Search', action: `Clear on ${document.location.pathname}` });

    this.set('query', '');
    this.set('_results', null);
    scheduleOnce('afterRender', this, 'focus');
  }
});
