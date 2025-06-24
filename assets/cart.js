class CartRemoveButton extends HTMLElement {
  constructor() {
    super();

    this.addEventListener('click', (event) => {
      event.preventDefault();
      const cartItems = this.closest('cart-items') || this.closest('cart-drawer-items');
      cartItems.updateQuantity(this.dataset.index, 0);
    });
  }
}

customElements.define('cart-remove-button', CartRemoveButton);

class CartItems extends HTMLElement {
  constructor() {
    super();
    this.lineItemStatusElement =
      document.getElementById('shopping-cart-line-item-status') || document.getElementById('CartDrawer-LineItemStatus');

    const debouncedOnChange = debounce((event) => {
      this.onChange(event);
    }, ON_CHANGE_DEBOUNCE_TIMER);

    this.addEventListener('change', debouncedOnChange.bind(this));
  }

  cartUpdateUnsubscriber = undefined;

  connectedCallback() {
    this.cartUpdateUnsubscriber = subscribe(PUB_SUB_EVENTS.cartUpdate, (event) => {
      if (event.source === 'cart-items') {
        return;
      }
      this.onCartUpdate();
    });
  }

  disconnectedCallback() {
    if (this.cartUpdateUnsubscriber) {
      this.cartUpdateUnsubscriber();
    }
  }

  onChange(event) {
    this.updateQuantity(event.target.dataset.index, event.target.value, document.activeElement.getAttribute('name'), event.target.dataset.quantityVariantId);
  }

  onCartUpdate() {
    if (this.tagName === 'CART-DRAWER-ITEMS') {
      fetch(`${routes.cart_url}?section_id=cart-drawer`)
        .then((response) => response.text())
        .then((responseText) => {
          const html = new DOMParser().parseFromString(responseText, 'text/html');
          const selectors = ['cart-drawer-items', '.cart-drawer__footer'];
          for (const selector of selectors) {
            const targetElement = document.querySelector(selector);
            const sourceElement = html.querySelector(selector);
            if (targetElement && sourceElement) {
              targetElement.replaceWith(sourceElement);
            }
          }
        })
        .catch((e) => {
          console.error(e);
        });
    } else {
      fetch(`${routes.cart_url}?section_id=main-cart-items`)
        .then((response) => response.text())
        .then((responseText) => {
          const html = new DOMParser().parseFromString(responseText, 'text/html');
          const sourceQty = html.querySelector('cart-items');
          this.innerHTML = sourceQty.innerHTML;
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }

  getSectionsToRender() {
    return [
      {
        id: 'main-cart-items',
        section: document.getElementById('main-cart-items').dataset.id,
        selector: '.js-contents',
      },
      {
        id: 'cart-icon-bubble',
        section: 'cart-icon-bubble',
        selector: '.shopify-section',
      },
      {
        id: 'cart-live-region-text',
        section: 'cart-live-region-text',
        selector: '.shopify-section',
      },
      {
        id: 'main-cart-footer',
        section: document.getElementById('main-cart-footer').dataset.id,
        selector: '.js-contents',
      },
    ];
  }

  updateQuantity(line, quantity, name, variantId) {
    this.enableLoading(line);
    const body = JSON.stringify({
      line,
      quantity,
      sections: this.getSectionsToRender().map((section) => section.section),
      sections_url: window.location.pathname,
    });

    fetch(`${routes.cart_change_url}`, { ...fetchConfig(), ...{ body } })
      .then((response) => {
        return response.text();
      })
      .then((state) => {
        const parsedState = JSON.parse(state);
        const quantityElement =
          document.getElementById(`Quantity-${line}`) || document.getElementById(`Drawer-quantity-${line}`);
        const items = document.querySelectorAll('.cart-item');

        if (parsedState.errors) {
          quantityElement.value = quantityElement.getAttribute('value');
          this.updateLiveRegions(line, parsedState.errors);
          return;
        }

        this.classList.toggle('is-empty', parsedState.item_count === 0);
        const cartDrawerWrapper = document.querySelector('cart-drawer');
        const cartFooter = document.getElementById('main-cart-footer');

        if (cartFooter) cartFooter.classList.toggle('is-empty', parsedState.item_count === 0);
        if (cartDrawerWrapper) cartDrawerWrapper.classList.toggle('is-empty', parsedState.item_count === 0);
        var shipping_popupchecked = false;
        const shipping_element = document.getElementById("cart_consent_box") || document.getElementById("consent_box");
        console.log(shipping_element.checked);
        if(shipping_element.checked == true){
          shipping_popupchecked = true;
        }else{}
        console.log(shipping_popupchecked);
        console.log('shipping_popupchecked');
        this.getSectionsToRender().forEach((section) => {
          const elementToReplace =
            document.getElementById(section.id).querySelector(section.selector) || document.getElementById(section.id);
          elementToReplace.innerHTML = this.getSectionInnerHTML(
            parsedState.sections[section.section],
            section.selector
          );
        });
        
        

        const updatedValue = parsedState.items[line - 1] ? parsedState.items[line - 1].quantity : undefined;
        let message = '';
        if (items.length === parsedState.items.length && updatedValue !== parseInt(quantityElement.value)) {
          if (typeof updatedValue === 'undefined') {
            message = window.cartStrings.error;
          } else {
            message = window.cartStrings.quantityError.replace('[quantity]', updatedValue);
          }
        }
        this.updateLiveRegions(line, message);

        const lineItem =
          document.getElementById(`CartItem-${line}`) || document.getElementById(`CartDrawer-Item-${line}`);
        if (lineItem && lineItem.querySelector(`[name="${name}"]`)) {
          cartDrawerWrapper
            ? trapFocus(cartDrawerWrapper, lineItem.querySelector(`[name="${name}"]`))
            : lineItem.querySelector(`[name="${name}"]`).focus();
        } else if (parsedState.item_count === 0 && cartDrawerWrapper) {
          trapFocus(cartDrawerWrapper.querySelector('.drawer__inner-empty'), cartDrawerWrapper.querySelector('a'));
        } else if (document.querySelector('.cart-item') && cartDrawerWrapper) {
          trapFocus(cartDrawerWrapper, document.querySelector('.cart-item__name'));
        }

        publish(PUB_SUB_EVENTS.cartUpdate, { source: 'cart-items', cartData: parsedState, variantId: variantId });
        
        const cartcheckout_btnall = document.querySelectorAll('.cart__checkout-button');  
        console.log(shipping_popupchecked);
        if(shipping_popupchecked == true){
          if(document.querySelector('#cart_consent_box')){
            document.querySelector('#cart_consent_box').checked = true;
          }
          if(document.querySelector('#consent_box')){
            document.querySelector('#consent_box').checked = true;
          }
          if(parsedState.total_price > cart_minimum_order){
            cartcheckout_btnall.forEach(cartcheckout_btn => {
              cartcheckout_btn.removeAttribute("disabled");
            });
          }else{
            cartcheckout_btnall.forEach(cartcheckout_btn => {
              cartcheckout_btn.setAttribute("disabled", true);
            });
          }
        }else{
          if(document.querySelector('#cart_consent_box')){
            document.querySelector('#cart_consent_box').checked = false;
          }
          if(document.querySelector('#consent_box')){
            document.querySelector('#consent_box').checked = false;
          }
          cartcheckout_btnall.forEach(cartcheckout_btn => {
            cartcheckout_btn.setAttribute("disabled", true);
          });
        }

         // cart drawer consent
          function cartdrawer_consentpage(){
            const checkboxes = document.querySelectorAll('.drawer_consent_wrapper .policy_box input#consent_box, .drawer_consent_wrapper .policy_box input#cart_consent_box');
            const cartcheckout_btn = document.querySelectorAll('.cart__checkout-button');
            const consentCheckbox = document.querySelector('input[name="consent_box"]');
            const cartconsentCheckbox = document.querySelector('input[name="cart_consent_box"]');
            if (checkboxes.length === 0) {
              return;
            }
            checkboxes.forEach(checkbox => {
              checkbox.addEventListener('change', function () {
                const modalWrapper = document.querySelector('.main_modal_wrapper');
                if (!modalWrapper) {
                  return;
                }
          
                if(cartconsentCheckbox){
                  if (this.name === 'consent_box' && this.checked) {
                    cartconsentCheckbox.checked = true;
                  }else if(this.name === 'consent_box' && !this.checked){
                    cartconsentCheckbox.checked = false;
                  }
                }
                
                if (this.name === 'cart_consent_box' && this.checked) {
                  consentCheckbox.checked = true;
                }else if(this.name === 'cart_consent_box' && !this.checked){
                  consentCheckbox.checked = false;
                }
          
                if (this.checked) {
                  modalWrapper.style.display = 'flex';
                  modalWrapper.classList.add('main_modal_open');
                  cartcheckout_btn.forEach(cartcheckout_btn => {
                    const carttotal = cartcheckout_btn.getAttribute('data-carttotal');
                    if(carttotal > cart_minimum_order){
                      cartcheckout_btn.removeAttribute("disabled");
                    }else{
                        cartcheckout_btn.setAttribute("disabled", true);
                    }
                  });
                } else {
                  modalWrapper.style.display = 'none';
                  modalWrapper.classList.remove('main_modal_open');
                  cartcheckout_btn.forEach(cartcheckout_btn => {
                    cartcheckout_btn.setAttribute("disabled",true);
                  });
                }
              });
            }); 
            
            document.querySelector('.main_modal_wrapper .modal_wrapper_inner .close_modal')?.addEventListener('click', function() {
              const modalWrapper = document.querySelector('.main_modal_wrapper');
              modalWrapper.style.display = 'none';
              modalWrapper.classList.remove('main_modal_open');
            });
          }
          cartdrawer_consentpage()
        // Cart Collection sliders
        // initializeSlickSlider();
      })
      .catch(() => {
        this.querySelectorAll('.loading__spinner').forEach((overlay) => overlay.classList.add('hidden'));
        const errors = document.getElementById('cart-errors') || document.getElementById('CartDrawer-CartErrors');
        errors.textContent = window.cartStrings.error;
      })
      .finally(() => {
        this.disableLoading(line);
        
        // Add Class
        let cart = $.getJSON('/cart.js');
        cart.done(function(){
          cart = cart.responseJSON;
          let items = cart.items;
          console.log(items)
          if (items.length == 0) {
            $('.block__cart-row').addClass('block__cart-empty');
            $('cart-note.cart__note').hide();
          } else {
            $('.block__cart-row').removeClass('block__cart-empty');
            $('cart-note.cart__note').show();
          }
        });
      });
  }

  updateLiveRegions(line, message) {
    const lineItemError =
      document.getElementById(`Line-item-error-${line}`) || document.getElementById(`CartDrawer-LineItemError-${line}`);
    if (lineItemError) lineItemError.querySelector('.cart-item__error-text').innerHTML = message;

    this.lineItemStatusElement.setAttribute('aria-hidden', true);

    const cartStatus =
      document.getElementById('cart-live-region-text') || document.getElementById('CartDrawer-LiveRegionText');
    cartStatus.setAttribute('aria-hidden', false);

    setTimeout(() => {
      cartStatus.setAttribute('aria-hidden', true);
    }, 1000);
  }

  getSectionInnerHTML(html, selector) {
    return new DOMParser().parseFromString(html, 'text/html').querySelector(selector).innerHTML;
  }

  enableLoading(line) {
    const mainCartItems = document.getElementById('main-cart-items') || document.getElementById('CartDrawer-CartItems');
    mainCartItems.classList.add('cart__items--disabled');

    const cartItemElements = this.querySelectorAll(`#CartItem-${line} .loading__spinner`);
    const cartDrawerItemElements = this.querySelectorAll(`#CartDrawer-Item-${line} .loading__spinner`);

    [...cartItemElements, ...cartDrawerItemElements].forEach((overlay) => overlay.classList.remove('hidden'));

    document.activeElement.blur();
    this.lineItemStatusElement.setAttribute('aria-hidden', false);
  }

  disableLoading(line) {
    const mainCartItems = document.getElementById('main-cart-items') || document.getElementById('CartDrawer-CartItems');
    mainCartItems.classList.remove('cart__items--disabled');

    const cartItemElements = this.querySelectorAll(`#CartItem-${line} .loading__spinner`);
    const cartDrawerItemElements = this.querySelectorAll(`#CartDrawer-Item-${line} .loading__spinner`);

    cartItemElements.forEach((overlay) => overlay.classList.add('hidden'));
    cartDrawerItemElements.forEach((overlay) => overlay.classList.add('hidden'));
  }
}

customElements.define('cart-items', CartItems);

if (!customElements.get('cart-note')) {
  customElements.define(
    'cart-note',
    class CartNote extends HTMLElement {
      constructor() {
        super();

        this.addEventListener(
          'input',
          debounce((event) => {
            const body = JSON.stringify({ note: event.target.value });
            fetch(`${routes.cart_update_url}`, { ...fetchConfig(), ...{ body } });
          }, ON_CHANGE_DEBOUNCE_TIMER)
        );
      }
    }
  );
}
