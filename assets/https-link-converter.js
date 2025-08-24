/**
 * HTTPS Link Converter Script
 * Converts all HTTP links to HTTPS within the main product descriptions section
 */

(function() {
  'use strict';
  function convertHttpToHttps() {
    const productDescSection = document.querySelector('.block__product-description--section');
    
    if (!productDescSection) {
      console.warn('Product description section not found');
      return;
    }

    const contentAreas = productDescSection.querySelectorAll([
      '.block__product-desc-wrapper',
      '.block__product-feature-content', 
      '.block__product-techspecification'
    ].join(', '));

    let linksConverted = 0;

    contentAreas.forEach(area => {
      const httpLinks = area.querySelectorAll('a[href^="http://"]');
      
      httpLinks.forEach(link => {
        const oldHref = link.href;
        const newHref = oldHref.replace(/^http:\/\//, 'https://');
        
        link.href = newHref;
        linksConverted++;
      });

      const innerHTML = area.innerHTML;
      const updatedInnerHTML = innerHTML.replace(
        /href=["']http:\/\//g, 
        'href="https://'
      );
      
      if (innerHTML !== updatedInnerHTML) {
        area.innerHTML = updatedInnerHTML;
        const additionalConversions = (innerHTML.match(/href=["']http:\/\//g) || []).length;
        linksConverted += additionalConversions;
      }
    });

    const allLinks = productDescSection.querySelectorAll('a[href^="http://"]');
    allLinks.forEach(link => {
      const oldHref = link.href;
      const newHref = oldHref.replace(/^http:\/\//, 'https://');
      link.href = newHref;
      linksConverted++;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', convertHttpToHttps);
  } else {
    convertHttpToHttps();
  }

  const observer = new MutationObserver(function(mutations) {
    let shouldRecheck = false;
    
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) { // Element node
            if (node.matches && (
              node.matches('.block__product-desc-wrapper') ||
              node.matches('.block__product-feature-content') ||
              node.matches('.block__product-techspecification') ||
              node.querySelector('.block__product-desc-wrapper, .block__product-feature-content, .block__product-techspecification')
            )) {
              shouldRecheck = true;
            }
          }
        });
      }
    });
    
    if (shouldRecheck) {
      setTimeout(convertHttpToHttps, 100); // Small delay to ensure content is fully loaded
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

})();
