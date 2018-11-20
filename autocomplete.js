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
    
    var aglSearchAPIKey = "725627777b49b3635fa6a752dadc2554";
    var aglSearchAppID = "7PQXV9R7S7";
    var aglCatalogIndexName = "demo-RoomAndBoard";
    var aglSuggestionsIndexName = "fill";
    var aglContentIndexName = "demo_RoomandBoardWP";
    var client = algoliasearch(aglSearchAppID, aglSearchAPIKey);
    
    var query = "";
    var targetURL = "/search.html";

    function algoliaSearch() {

        var queries = [{
            indexName: aglCatalogIndexName,
            query: query,
            params: {
                hitsPerPage: 4
            }
        }, {
            indexName: aglContentIndexName,
            query: query,
            params: {
                hitsPerPage: 3
            }
        }];

        client.search(queries, function (err, content) {
            if (err) throw err;

            if (content.results[0].hits.length > 0) {

                // Generate products column
                var products = content.results[0].hits;
                var productsMarkup = products.map(function (product) {
                    return createProductMarkup(product);
                });
                document.querySelector("#algolia-ac-products").innerHTML = productsMarkup.join("");
                document.querySelector(".algolia-ac-container").classList.remove("no-products");
            } else {
                document.querySelector(".algolia-ac-container").classList.add("no-products");
            }

            // Generate number of results
            var nbHits = content.results[0].nbHits;
            document.querySelector(".algolia-ac-link").innerHTML = "View All Results" + `<span>(` + nbHits + `)</span>`;

            // Generate popular searchs
/*             var popular = content.results[1].hits;
            if (popular.length > 0) {
                var popularMarkup = popular.map(function (popular, index) {
                    return createPopularMarkup(popular, index);
                });
                document.querySelector(".algolia-ac-popular").innerHTML = popularMarkup.join("");
                document.querySelector(".algolia-ac-results").classList.remove("no-popular");
            } else {
                document.querySelector(".algolia-ac-results").classList.add("no-popular");
            } */

            // Generate related content
            var related = content.results[1].hits;
            if (related.length > 0) {
                var relatedMarkup = related.map(function (related) {
                    return createRelatedMarkup(related);
                });
                document.querySelector("#algolia-ac-related").innerHTML = relatedMarkup.join("");
                document.querySelector(".algolia-ac-container").classList.remove("no-content");
            } else {
                document.querySelector(".algolia-ac-container").classList.add("no-content");
            }

            document.querySelector(".algolia-search-container").classList.remove("closed");
        });

        function createDeptMarkup(dept) {
            return "<li>\n                    <button class=\"algolia-ac-tabs-btn " + (currentDept === dept ? 'active' : '') + "\">" + dept + "</button>\n                </li>";
        }

        function createProductMarkup(product) {
            return "<a class=\"algolia-ac-product-container\" href=\"" + product.link + "\">\n            <div class=\"algolia-ac-product-image\" style=\"background-image: url(" + product.image + ")\"></div>\n                <div class=\"algolia-ac-product-info\">\n                    " + "\n                    <p class=\"algolia-ac-product-title\">" + product.title + " </p>\n                    <p class=\"algolia-ac-product-price " + "\">\n                        <span class=\"ac-ogprice\">$" + product.price + "</span>\n                        " + (product.discounted_price > 0 ? "<span class=\"ac-newprice\">" + product.discounted_price_display + "</span>" : "") + "\n                    </p>\n                </div>\n            </a>";
        }

        function createPopularMarkup(popular, index) {
            return "<li>\n                <a class=\"algolia-ac-popular-link\">" + popular._highlightResult.query.value + "</a>\n                " + (index === 0 ? (algoliaCreds.qidx ? popular[algoliaCreds.qidx] : popular.prod_uk_catalog_index).facets.exact_matches['hierarchical_categories.lvl0'].map(function (lvl) {
                return "<a class=\"algolia-ac-popular-link-cat\">" + i18n('In') + " " + lvl.value + "</a>";
            }).join("") : "") + "\n            </li>";
        }

        function createRelatedMarkup(related) {
            return "<a class=\"algolia-ac-related-container\" href=\"" + related.link + "\">\n            <div class=\"algolia-ac-related-image\" style=\"background-image: url(" + related.image + ")\"></div>\n               <p class=\"algolia-ac-related-title\">\n                " + related.title + "\n                </p>\n            </a>";
        }
    }

    document.querySelector(".algolia-search-input").addEventListener("input", function (evt) {
        query = evt.target.value;
        query ? algoliaSearch() : document.querySelector(".algolia-search-container").classList.add("closed");
    });

    document.querySelector(".algolia-search-input").addEventListener("keydown", function (evt) {
        if (evt.key === "Enter") {
            evt.preventDefault();
            redirectToSearch(query);
        }
    });

    document.querySelector(".algolia-ac-link").addEventListener("click", function (evt) {
        redirectToSearch(query);
    });

    document.querySelector(".algolia-ac-popular").addEventListener("click", function (evt) {
        if (evt.target.className === "algolia-ac-popular-link") {
            redirectToSearch(evt.target.innerText);
        }
        if (evt.target.className === "algolia-ac-popular-link-cat") {
            console.log(evt);
            var category = evt.target.innerText.split(" ").splice(-1).join("");
            var currentQuery = evt.target.parentElement.firstElementChild.innerText;
            window.location.href = targetURL + "?q=" + currentQuery + "&dept=" + category;
        }
    });

    function redirectToSearch(query) {
    	window.location.href = targetURL + "?q=" + query;
    }
})();
