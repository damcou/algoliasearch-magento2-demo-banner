/**
 * Documentation: https://community.algolia.com/magento/doc/m2/frontend-events/
 **/

/**
 * Creates a context variable with the category title (algoliaConfig.instant.title)
 * We have to format it for the variable to be usable in the Algolia dashboard (we replace everything which
 * is not a letter or a figure by a dash)
 * for example : "Pants & Denim" becomes "Pants-Denim" so the ruleContext is "category_Pants-Denim"
 */
function algoliaHookBeforeInstantsearchInit(instantsearchOptions) {

  var categoryContext = 'category_'+ algoliaConfig.instant.categoryName.replace(/[^A-Za-z0-9_-]+/g, '-');

  if (typeof instantsearchOptions.searchParameters.ruleContexts === 'undefined') {
    instantsearchOptions.searchParameters.ruleContexts = [categoryContext];
  } else {
    instantsearchOptions.searchParameters.ruleContexts.push(categoryContext);
  }

  return instantsearchOptions;
}

/**
 * This is the function to use to display the banner in the custom JSON data (from the Query Rule)
 */
function algoliaHookBeforeWidgetInitialization(allWidgetConfiguration) {

  var wrapper = document.getElementById('algolia-right-container');

  if (wrapper === null) {
    console.log("wrapper not found.");
    return search;
  }

  var div = document.createElement('div');
  div.id = 'algolia-banner';
  wrapper.prepend(div);

  var widgetConfig = {
    templates: {
      allItems({userData}) {
        if (userData) {
          const banners = userData.map(({banner_img}) => {
            return '<img src="' + algoliaConfig.urls.assetDirectory + '/' + banner_img + '"/>';
          });
          return banners.join('');
        }
        return '';
      },
      empty: function(query) {
        return '';
      }
    },
    container: div.appendChild(createISWidgetContainer('banner')),
  };

  if (typeof allWidgetConfiguration['hits'] === 'undefined') {
    allWidgetConfiguration['hits'] = [widgetConfig];
  } else {
    var currentHits = allWidgetConfiguration['hits'];
    allWidgetConfiguration['hits'] = [currentHits, widgetConfig];
  }

  return allWidgetConfiguration;
}
