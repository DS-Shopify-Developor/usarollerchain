class FacetFiltersForm extends HTMLElement {
  constructor() {
    super();
    this.onActiveFilterClick = this.onActiveFilterClick.bind(this);

    this.debouncedOnSubmit = debounce((event) => {
      this.onSubmitHandler(event);
    }, 500);

    const facetForm = this.querySelector('form');
    facetForm.addEventListener('input', this.debouncedOnSubmit.bind(this));

    const facetWrapper = this.querySelector('#FacetsWrapperDesktop');
    if (facetWrapper) facetWrapper.addEventListener('keyup', onKeyUpEscape);
  }

  static setListeners() {
    const onHistoryChange = (event) => {
      const searchParams = event.state ? event.state.searchParams : FacetFiltersForm.searchParamsInitial;
      if (searchParams === FacetFiltersForm.searchParamsPrev) return;
      FacetFiltersForm.renderPage(searchParams, null, false);
    };
    window.addEventListener('popstate', onHistoryChange);
  }

  static toggleActiveFacets(disable = true) {
    document.querySelectorAll('.js-facet-remove').forEach((element) => {
      element.classList.toggle('disabled', disable);
    });
  }

  static renderPage(searchParams, event, updateURLHash = true) {
    FacetFiltersForm.searchParamsPrev = searchParams;
    const sections = FacetFiltersForm.getSections();
    const countContainer = document.getElementById('ProductCount');
    const countContainerDesktop = document.getElementById('ProductCountDesktop');
    const loadingSpinners = document.querySelectorAll(
      '.facets-container .loading__spinner, facet-filters-form .loading__spinner'
    );
    loadingSpinners.forEach((spinner) => spinner.classList.remove('hidden'));
    document.getElementById('ProductGridContainer').querySelector('.collection').classList.add('loading');
    if (countContainer) {
      countContainer.classList.add('loading');
    }
    if (countContainerDesktop) {
      countContainerDesktop.classList.add('loading');
    }

    sections.forEach((section) => {
      const url = `${window.location.pathname}?section_id=${section.section}&${searchParams}`;
      const filterDataUrl = (element) => element.url === url;

      FacetFiltersForm.filterData.some(filterDataUrl)
        ? FacetFiltersForm.renderSectionFromCache(filterDataUrl, event)
        : FacetFiltersForm.renderSectionFromFetch(url, event);
    });

    if (updateURLHash) FacetFiltersForm.updateURLHash(searchParams);
  }

  static renderSectionFromFetch(url, event) {
    fetch(url)
      .then((response) => response.text())
      .then((responseText) => {
        const html = responseText;
        FacetFiltersForm.filterData = [...FacetFiltersForm.filterData, { html, url }];
        FacetFiltersForm.renderFilters(html, event);
        FacetFiltersForm.renderProductGridContainer(html);
        FacetFiltersForm.renderProductCount(html);
        if (typeof initializeScrollAnimationTrigger === 'function') initializeScrollAnimationTrigger(html.innerHTML);
      });
  }

  static renderSectionFromCache(filterDataUrl, event) {
    const html = FacetFiltersForm.filterData.find(filterDataUrl).html;
    FacetFiltersForm.renderFilters(html, event);
    FacetFiltersForm.renderProductGridContainer(html);
    FacetFiltersForm.renderProductCount(html);
    if (typeof initializeScrollAnimationTrigger === 'function') initializeScrollAnimationTrigger(html.innerHTML);
  }

  static renderProductGridContainer(html) {
    document.getElementById('ProductGridContainer').innerHTML = new DOMParser()
      .parseFromString(html, 'text/html')
      .getElementById('ProductGridContainer').innerHTML;

    document
      .getElementById('ProductGridContainer')
      .querySelectorAll('.scroll-trigger')
      .forEach((element) => {
        element.classList.add('scroll-trigger--cancel');
      });
  }

  static renderProductCount(html) {
    const count = new DOMParser().parseFromString(html, 'text/html').getElementById('ProductCount').innerHTML;
    const container = document.getElementById('ProductCount');
    const containerDesktop = document.getElementById('ProductCountDesktop');
    container.innerHTML = count;
    container.classList.remove('loading');
    if (containerDesktop) {
      containerDesktop.innerHTML = count;
      containerDesktop.classList.remove('loading');
    }
    const loadingSpinners = document.querySelectorAll(
      '.facets-container .loading__spinner, facet-filters-form .loading__spinner'
    );
    loadingSpinners.forEach((spinner) => spinner.classList.add('hidden'));
  }

  static renderFilters(html, event) {
    const parsedHTML = new DOMParser().parseFromString(html, 'text/html');
    const facetDetailsElementsFromFetch = parsedHTML.querySelectorAll(
      '#FacetFiltersForm .js-filter, #FacetFiltersFormMobile .js-filter, #FacetFiltersPillsForm .js-filter'
    );
    const facetDetailsElementsFromDom = document.querySelectorAll(
      '#FacetFiltersForm .js-filter, #FacetFiltersFormMobile .js-filter, #FacetFiltersPillsForm .js-filter'
    );

    // Remove facets that are no longer returned from the server
    Array.from(facetDetailsElementsFromDom).forEach((currentElement) => {
      if (!Array.from(facetDetailsElementsFromFetch).some(({ id }) => currentElement.id === id)) {
        currentElement.remove();
      }
    });

    const matchesId = (element) => {
      const jsFilter = event ? event.target.closest('.js-filter') : undefined;
      return jsFilter ? element.id === jsFilter.id : false;
    };
    const facetsToRender = Array.from(facetDetailsElementsFromFetch).filter((element) => !matchesId(element));
    const countsToRender = Array.from(facetDetailsElementsFromFetch).find(matchesId);

    facetsToRender.forEach((elementToRender, index) => {
      const currentElement = document.getElementById(elementToRender.id);
      // Element already rendered in the DOM so just update the innerHTML
      if (currentElement) {
        document.getElementById(elementToRender.id).innerHTML = elementToRender.innerHTML;
      } else {
        if (index > 0) {
          const { className: previousElementClassName, id: previousElementId } = facetsToRender[index - 1];
          // Same facet type (eg horizontal/vertical or drawer/mobile)
          if (elementToRender.className === previousElementClassName) {
            document.getElementById(previousElementId).after(elementToRender);
            return;
          }
        }

        if (elementToRender.parentElement) {
          document.querySelector(`#${elementToRender.parentElement.id} .js-filter`).before(elementToRender);
        }
      }
    });

    FacetFiltersForm.renderActiveFacets(parsedHTML);
    FacetFiltersForm.renderAdditionalElements(parsedHTML);

    if (countsToRender) {
      const closestJSFilterID = event.target.closest('.js-filter').id;

      if (closestJSFilterID) {
        FacetFiltersForm.renderCounts(countsToRender, event.target.closest('.js-filter'));
        FacetFiltersForm.renderMobileCounts(countsToRender, document.getElementById(closestJSFilterID));

        const newFacetDetailsElement = document.getElementById(closestJSFilterID);
        const newElementSelector = newFacetDetailsElement.classList.contains('mobile-facets__details')
          ? `.mobile-facets__close-button`
          : `.facets__summary`;
        const newElementToActivate = newFacetDetailsElement.querySelector(newElementSelector);
        if (newElementToActivate) newElementToActivate.focus();
      }
    }
  }

  static renderActiveFacets(html) {
    const activeFacetElementSelectors = ['.active-facets-mobile', '.active-facets-desktop'];

    activeFacetElementSelectors.forEach((selector) => {
      const activeFacetsElement = html.querySelector(selector);
      if (!activeFacetsElement) return;
      document.querySelector(selector).innerHTML = activeFacetsElement.innerHTML;
    });

    FacetFiltersForm.toggleActiveFacets(false);
  }

  static renderAdditionalElements(html) {
    const mobileElementSelectors = ['.mobile-facets__open', '.mobile-facets__count', '.sorting'];

    mobileElementSelectors.forEach((selector) => {
      if (!html.querySelector(selector)) return;
      document.querySelector(selector).innerHTML = html.querySelector(selector).innerHTML;
    });

    document.getElementById('FacetFiltersFormMobile').closest('menu-drawer').bindEvents();
  }

  static renderCounts(source, target) {
    const targetSummary = target.querySelector('.facets__summary');
    const sourceSummary = source.querySelector('.facets__summary');

    if (sourceSummary && targetSummary) {
      targetSummary.outerHTML = sourceSummary.outerHTML;
    }

    const targetHeaderElement = target.querySelector('.facets__header');
    const sourceHeaderElement = source.querySelector('.facets__header');

    if (sourceHeaderElement && targetHeaderElement) {
      targetHeaderElement.outerHTML = sourceHeaderElement.outerHTML;
    }

    const targetWrapElement = target.querySelector('.facets-wrap');
    const sourceWrapElement = source.querySelector('.facets-wrap');

    if (sourceWrapElement && targetWrapElement) {
      const isShowingMore = Boolean(target.querySelector('show-more-button .label-show-more.hidden'));
      if (isShowingMore) {
        sourceWrapElement
          .querySelectorAll('.facets__item.hidden')
          .forEach((hiddenItem) => hiddenItem.classList.replace('hidden', 'show-more-item'));
      }

      targetWrapElement.outerHTML = sourceWrapElement.outerHTML;
    }
  }

  static renderMobileCounts(source, target) {
    const targetFacetsList = target.querySelector('.mobile-facets__list');
    const sourceFacetsList = source.querySelector('.mobile-facets__list');

    if (sourceFacetsList && targetFacetsList) {
      targetFacetsList.outerHTML = sourceFacetsList.outerHTML;
    }
  }

  static updateURLHash(searchParams) {
    history.pushState({ searchParams }, '', `${window.location.pathname}${searchParams && '?'.concat(searchParams)}`);
  }

  static getSections() {
    return [
      {
        section: document.getElementById('product-grid').dataset.id,
      },
    ];
  }

  createSearchParams(form) {
    const formData = new FormData(form);
    return new URLSearchParams(formData).toString();
  }

  onSubmitForm(searchParams, event) {
    FacetFiltersForm.renderPage(searchParams, event);
  }

  onSubmitHandler(event) {
    event.preventDefault();
    const sortFilterForms = document.querySelectorAll('facet-filters-form form');
    if (event.srcElement.className == 'mobile-facets__checkbox') {
      const searchParams = this.createSearchParams(event.target.closest('form'));
      this.onSubmitForm(searchParams, event);
    } else {
      const forms = [];
      const isMobile = event.target.closest('form').id === 'FacetFiltersFormMobile';

      sortFilterForms.forEach((form) => {
        if (!isMobile) {
          if (form.id === 'FacetSortForm' || form.id === 'FacetFiltersForm' || form.id === 'FacetSortDrawerForm') {
            const noJsElements = document.querySelectorAll('.no-js-list');
            noJsElements.forEach((el) => el.remove());
            forms.push(this.createSearchParams(form));
          }
        } else if (form.id === 'FacetFiltersFormMobile') {
          forms.push(this.createSearchParams(form));
        }
      });
      this.onSubmitForm(forms.join('&'), event);
    }
  }

  onActiveFilterClick(event) {
    event.preventDefault();
    FacetFiltersForm.toggleActiveFacets();
    const url =
      event.currentTarget.href.indexOf('?') == -1
        ? ''
        : event.currentTarget.href.slice(event.currentTarget.href.indexOf('?') + 1);
    FacetFiltersForm.renderPage(url);
  }
}

FacetFiltersForm.filterData = [];
FacetFiltersForm.searchParamsInitial = window.location.search.slice(1);
FacetFiltersForm.searchParamsPrev = window.location.search.slice(1);
customElements.define('facet-filters-form', FacetFiltersForm);
FacetFiltersForm.setListeners();

class PriceRange extends HTMLElement {
  constructor() {
    super();
    this.querySelectorAll('input').forEach((element) =>
      element.addEventListener('change', this.onRangeChange.bind(this))
    );
    this.setMinAndMaxValues();
  }

  onRangeChange(event) {
    this.adjustToValidValues(event.currentTarget);
    this.setMinAndMaxValues();
  }

  setMinAndMaxValues() {
    const inputs = this.querySelectorAll('input');
    const minInput = inputs[0];
    const maxInput = inputs[1];
    if (maxInput.value) minInput.setAttribute('max', maxInput.value);
    if (minInput.value) maxInput.setAttribute('min', minInput.value);
    if (minInput.value === '') maxInput.setAttribute('min', 0);
    if (maxInput.value === '') minInput.setAttribute('max', maxInput.getAttribute('max'));
  }

  adjustToValidValues(input) {
    const value = Number(input.value);
    const min = Number(input.getAttribute('min'));
    const max = Number(input.getAttribute('max'));

    if (value < min) input.value = min;
    if (value > max) input.value = max;
  }
}

customElements.define('price-range', PriceRange);

class FacetRemove extends HTMLElement {
  constructor() {
    super();
    const facetLink = this.querySelector('a');
    facetLink.setAttribute('role', 'button');
    facetLink.addEventListener('click', this.closeFilter.bind(this));
    facetLink.addEventListener('keyup', (event) => {
      event.preventDefault();
      if (event.code.toUpperCase() === 'SPACE') this.closeFilter(event);
    });
  }

  closeFilter(event) {
    event.preventDefault();
    const form = this.closest('facet-filters-form') || document.querySelector('facet-filters-form');
    form.onActiveFilterClick(event);
  }
}

customElements.define('facet-remove', FacetRemove);


// collection page grid view js

function PriceRangeprogressbar(removeprice){
  var removepricerange = removeprice;
  var filter_min_value = $('#Mobile-Filter-Price-GTE').attr('min');
  var filter_max_value = $('#Mobile-Filter-Price-LTE').attr('max');
  var min_val = Math.round(filter_min_value);
  var max_val = Math.round(filter_max_value);

  var filter_min = $('#Mobile-Filter-Price-LTE').attr('min');
  var filter_max = $('#Mobile-Filter-Price-GTE').attr('max');

  var min = Math.round(filter_min);
  var max = Math.round(filter_max);

  $(".facets__filterprice-content").each(function() {
    // $this is a reference to .slider in current iteration of each
      $this = $(this);
      // find any .slider-range element WITHIN scope of $this
      $(".price-slider-range", $this).slider({
          range: true,
          min: parseInt(min_val),
          max: parseInt(max_val),
          values: [parseInt(min), parseInt(max)],
          change: function(event, ui) {
            document.getElementById("Mobile-Filter-Price-LTE").setAttribute("min", ui.values[ 0 ]);
            $('#Mobile-Filter-Price-GTE').val(ui.values[ 0 ]);
            document.getElementById("Mobile-Filter-Price-GTE").setAttribute("max", ui.values[ 1 ]);
            $('#Mobile-Filter-Price-LTE').val(ui.values[ 1 ]);
            console.log(removepricerange);
            if(removepricerange){
              var priceInput = document.getElementById('Mobile-Filter-Price-LTE');
              var priceinputEvent = new Event('input', {
                  bubbles: true,
                  cancelable: true,
                });
                //priceInput.dispatchEvent(priceinputEvent);
            }else{}
          },
          slide: function( event, ui ) {
              document.getElementById("Mobile-Filter-Price-LTE").setAttribute("min", ui.values[ 0 ]);
              $('#Mobile-Filter-Price-GTE').val(ui.values[ 0 ]);
              document.getElementById("Mobile-Filter-Price-GTE").setAttribute("max", ui.values[ 1 ]);
              $('#Mobile-Filter-Price-LTE').val(ui.values[ 1 ]);
              console.log(removepricerange);
              if(removepricerange){
                var priceInput = document.getElementById('Mobile-Filter-Price-LTE');
                var priceinputEvent = new Event('input', {
                    bubbles: true,
                    cancelable: true,
                  });
                  priceInput.dispatchEvent(priceinputEvent);
              }else{}
          }
      });
  });
    
}


$(document).ready(function() {
  function updateLocalStorage() {
      const urlParams = new URLSearchParams(window.location.search);
      const currentPage = urlParams.get('page');

      if (currentPage) {
          const savedGridView = localStorage.getItem('gridView');
          if (savedGridView) {
              localStorage.setItem('currentPage', currentPage);
          } else {
              localStorage.setItem('gridView', '3'); 
              localStorage.setItem('currentPage', currentPage);
          }
      } else {
          localStorage.removeItem('currentPage');
          localStorage.setItem('gridView', '3'); 
      }
  }

  updateLocalStorage();
  const savedGridView = localStorage.getItem('gridView') || '3';
  const defaultGridViewItem = $('.facets-product-viewitem[data-gridcolumn="' + savedGridView + '"]');
  //productGridview(defaultGridViewItem);
  
  $('.facets-product-viewitem').on('click', function() {
      var current_gridcolumn = $(this).attr('data-gridcolumn');
      //productGridview(this);
      localStorage.setItem('gridView', current_gridcolumn); 
      
      const urlParams = new URLSearchParams(window.location.search);
      const currentPage = urlParams.get('page');
      if (currentPage) {
          localStorage.setItem('currentPage', currentPage); 
      }
  });

  $('.pagination-link').on('click', function(e) {
      e.preventDefault(); 
      const pageNumber = $(this).data('page'); 

      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set('page', pageNumber);
      window.history.replaceState({}, '', `${window.location.pathname}?${urlParams}`); 

      localStorage.setItem('currentPage', pageNumber);
      loadProductsForPage(pageNumber);
  });
  function loadProductsForPage(page) {
      console.log("Loading products for page:", page);
  }
});


function loadContent(url) {
      var current_grid_desktopView =  $('.facets-product-viewfilter .facets-product-viewitem.active-grid');
      var current_grid_mobileView =  $('.collection-filter-mobile-viewicons .facets-product-viewitem.active-grid');
      $.ajax({
          url: url,
          type: 'GET',
          success: function(response) {
              // Update page content
              const collectionhtml = new DOMParser().parseFromString(response, 'text/html');
              const selected_collection_content = collectionhtml.querySelector('.collection-filter-productgrid').innerHTML;
              $('.collection-filter-productgrid').html(selected_collection_content);
              //productGridview(current_grid_desktopView);
              //productGridview(current_grid_mobileView);
              $('.collection-productwrap .collection').removeClass('loading');
              history.pushState({}, '', `${url}`);
              collectionCategoryclick();
              $('body').removeClass('overflow-hidden-mobile');
               PriceRangeprogressbar(true);
               $('.block__card_product-feature-head').on("click", function () {
                if ($(this).hasClass("show")) {
                    $(this).find('span').text('Show Specs');
                } else {
                    $(this).find('span').text('Hide Specs');
                }
                $(this).toggleClass("show");
                $(this).parents('.product-card-wrapper').toggleClass("show_feature");
                $(this).parent('.block__card_product_feature').find(".block__card_product-feature-content").toggleClass("show");
              });
              // $('.facets-product-viewitem').click(function(){
              //   var current_view = $(this);
              //   productGridview(current_view);
              // });
          },
          error: function(xhr, status, error) {
              console.error(error);
          }
      });
}


$(document).ready(function(){
  PriceRangeprogressbar(true);

});