"use strict";

(function () {


    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    var oldQuery = getUrlParameter("q");
    if (oldQuery) {
        document.querySelector(".algolia-search-input").value = oldQuery.toLowerCase();
    }

    const search = instantsearch({
        appId: '7PQXV9R7S7',
        apiKey: '725627777b49b3635fa6a752dadc2554',
        indexName: 'demo-RoomAndBoard',
        routing: true,
        searchParameters: {
            query: oldQuery,
            hitsPerPage: 52,
            getRankingInfo: true,
            ruleContexts: ''
        }
    });

    search.addWidget(
        instantsearch.widgets.hits({
            container: '#hits',
            templates: {
                item: '<a href="{{link}}" class="hit {{_rankingInfo.promoted}}"><div class="hit-img" style="background-image: url({{image}})"></div><p class="hit-title">{{{_highlightResult.title.value}}}</p><p class="hit-price">{{price}}</p></div>'
              },
              escapeHits: true
        })
    );

    search.addWidget(
        instantsearch.widgets.hierarchicalMenu({
          container: '#hierarchical-categories',
          attributes: ['category.lvl0', 'category.lvl1'],
          templates: {
            header: 'Categories'
          }
        })
      );

      search.addWidget(
        instantsearch.widgets.refinementList({
          container: '#colors',
          attributeName: 'Color',
          operator: 'or',
          limit: 10,
          templates: {
            header: 'Colors'
          }
        })
      );

      search.addWidget(
        instantsearch.widgets.rangeSlider({
          container: '#price',
          attributeName: 'price',
          templates: {
            header: 'Price'
          },
          tooltips: {
            format: function(rawValue) {
              return '$' + Math.round(rawValue).toLocaleString();
            }
          }
        })
      );

      search.addWidget(
        instantsearch.widgets.stats({
          container: '#stats-container',
          templates: {
            body: '<span class="stats-hits">{{nbHits}}</span> results <span class="stats-query">{{query}}</span>'
          }
        })
      );

      search.addWidget(
        instantsearch.widgets.sortBySelector({
          container: '#sort-by-container',
          indices: [
            {name: 'demo-RoomAndBoard', label: 'Relevance'},
            {name: 'demo-RoomAndBoard-price-asc', label: 'Lowest price'},
            {name: 'demo-RoomAndBoard-price-desc', label: 'Highest price'}
          ],
          templates: {
              header: 'Sort By'
          }
        })
      );

      search.addWidget(
        instantsearch.widgets.pagination({
          container: '#pagination-container',
          maxPages: 20,
          // default is to scroll to 'body', here we disable this behavior
          scrollTo: false,
          showFirstLast: false,
          labels: {
            next: "View More"
          }
        })
      );

      search.addWidget({
        render: function(renderOptions) {
          const results = renderOptions.results;
          const banner = document.querySelector('#algBanner');
          if (results.userData) {
            if (results.userData[0].bannerImg) {
                banner.innerHTML = `<a href="` + results.userData[0].bannerUrl + `"><span>` + results.userData[0].bannerText + `</span><div style="background-image: url('` + results.userData[0].bannerImg + `')"></div></a>`;
            }
            else {
              banner.innerHTML = '';
            }
            if (results.userData[0].highlightPromoted) {
                document.querySelector(".ais-hits").classList.add("promotedHit");
            }
            else {
              document.querySelector(".ais-hits").classList.remove("promotedHit");
            }
          }
          else {
            banner.innerHTML = '';
            document.querySelector(".ais-hits").classList.remove("promotedHit");
          }
        }
      });

       search.addWidget({
          render: function(opts, isFirstRendering) {
            const helper = opts.helper;
            const state = opts.state;
            const hFacets = state.hierarchicalFacetsRefinements['category.lvl0'] && state.hierarchicalFacetsRefinements['category.lvl0'].length > 0 ? state.hierarchicalFacetsRefinements['category.lvl0'][0].toLowerCase()
            .replace(/ > /g, '_')
            .replace(/>/g, '_')
            .replace(/ /g, '-') : "";
            console.log(hFacets);
            if (helper.getQueryParameter('ruleContexts') != hFacets) {
                helper.setQueryParameter('ruleContexts', hFacets).search();
            }
          }
      }); 

    search.start();

})();