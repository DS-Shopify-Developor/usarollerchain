class DetailsModal extends HTMLElement {
  constructor() {
    super();
    this.detailsContainer = this.querySelector('details');
    this.summaryToggle = this.querySelector('summary');

    this.detailsContainer.addEventListener('keyup', (event) => event.code.toUpperCase() === 'ESCAPE' && this.close());
    this.summaryToggle.addEventListener('click', this.onSummaryClick.bind(this));
    this.querySelector('button[type="button"]').addEventListener('click', this.close.bind(this));
    this.detailsContainer.addEventListener('mouseenter', () => { 
      document.querySelectorAll(".header__inline-menu details").forEach(function(detail) {
        detail.removeAttribute("open");
      });
      document.body.classList.remove("block__mega-menu-open");
      
      const ulElement = this.querySelector("ul");
      if (ulElement !== null) {
        ulElement.addEventListener("mouseleave", function () {
          const parentDetail = this.closest("details");
          if (parentDetail) {
            parentDetail.removeAttribute("open");
          }
        });
      }      
    });
    this.summaryToggle.setAttribute('role', 'button');
  }

  isOpen() {
    return this.detailsContainer.hasAttribute('open');
  }

  onSummaryClick(event) {
    event.preventDefault();
    event.target.closest('details').hasAttribute('open') ? this.close() : this.open(event);
    if(this.summaryToggle.classList.contains('header__icon--search')){
      document.querySelector('.header-searchmodel').classList.toggle('opensearch');
      document.body.classList.remove('overflow-hidden');
      document.body.classList.toggle('boost-sd__search-opening');
      $(".header__inline-menu details").removeAttr("open");
    }else{
      document.body.classList.remove('overflow-hidden');
      document.querySelector('.header-searchmodel').classList.remove('opensearch');
      $(".header__inline-menu details").removeAttr("open");
    }
  }

  onBodyClick(event) {
    if (!this.contains(event.target) || event.target.classList.contains('modal-overlay')) this.close(false);
  }

  open(event) {
    this.onBodyClickEvent = this.onBodyClickEvent || this.onBodyClick.bind(this);
    event.target.closest('details').setAttribute('open', true);
    document.body.addEventListener('click', this.onBodyClickEvent);
    if(!this.summaryToggle.classList.contains('header__icon--search')){
      document.body.classList.add('overflow-hidden');
    }

    trapFocus(
      this.detailsContainer.querySelector('[tabindex="-1"]'),
      this.detailsContainer.querySelector('input:not([type="hidden"])')
    );
  }

  close(focusToggle = true) {
    removeTrapFocus(focusToggle ? this.summaryToggle : null);
    if (window.innerWidth >= 989) {
      if(!this.summaryToggle.classList.contains('header__icon--search')){
        this.detailsContainer.removeAttribute('open');
        document.body.removeEventListener('click', this.onBodyClickEvent);
        document.body.classList.remove('overflow-hidden');
      }
    }else{
        this.detailsContainer.removeAttribute('open');
        document.body.removeEventListener('click', this.onBodyClickEvent);
        document.body.classList.remove('overflow-hidden');
    }
  }
}

customElements.define('details-modal', DetailsModal);
