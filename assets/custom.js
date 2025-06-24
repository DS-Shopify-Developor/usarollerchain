$(document).ready(function () {
  $('.block__hero-banner-left-details-sliders').slick({
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: true,
    fade: true,
    responsive: [
      {
        breakpoint: 767,
        settings: {
          fade: false,
          dots: false
        }
      }
    ]
  });

  if ($(window).width() <= 749) {
    $('.block__image-with-icon-listing').slick({
      draggable: false,
      infinite: true,
      // autoplay: true,
      arrows: false,
      // autoplaySpeed: 0,
      // speed: 5000,
      // pauseOnHover: false,
      cssEase: 'linear',
      variableWidth: true
    });
    $('.block__shop-by-department-category-box').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      initialSlide: 1,
      dots: false
    });
    $('.block__shop-by-application-listing').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      dots: false
    });
    $(document).on("click", ".block__footer-menu-listing .footer-block__heading", function () {
      var $this = $(this);
      $this.parents(".footer-block").toggleClass("active");
      $this.parents(".footer-block").find(".footer-block__details-content").slideToggle();
    });
  }




  // Product page add accessories product
  $('.main-product-accessories-gridwrapslider').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    prevArrow:$('.main-product-accessories-custombtn .main-product-accessories-prevbtn'),
    nextArrow:$('.main-product-accessories-custombtn .main-product-accessories-nextbtn'),
    dots: false,
    responsive: [
      {
        breakpoint: 419,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      }
    ]
  });

  // About Our Meet Tabify
  $('ul.block__meet_team_tabs li').click(function () {
    var tab_id = $(this).attr('data-tab');

    $('ul.block__meet_team_tabs li').removeClass('current');
    $('.block__meet_team_content').removeClass('current');

    $(this).addClass('current');
    $("#" + tab_id).addClass('current');
  })

  if ($(window).width() <= 767) {
    // About Our meet Pop-Up Js
    $(document).on("click", ".block__meet_team_member_block", function () {
      $(this).parents(".block__meet_team_member").find(".block__meet_team_member_pop_up").addClass("show_pop_up");
      $("body").addClass("show_team_pop_up");
    });
    $(document).on("click", ".block__meet_team_member_close", function () {
      $(".block__meet_team_member_pop_up").removeClass("show_pop_up");
      $("body").removeClass("show_team_pop_up");
    });
  }

  // Faq
  $(document).on("click", ".block__tabs_title", function () {
    if ($(this).parents(".block__slide").hasClass("block__change_icon")) {
      $(this).parent().find(".block__panel").slideUp();
      $(this).parents(".block__slide").removeClass("block__change_icon");
    } else {
      $(this).parents(".block__slider_main_containar").find(".block__panel").slideUp();
      $(this).parent().find(".block__panel").slideDown();
      $(this)
        .parents(".block__slider_main_containar")
        .find(".block__slide")
        .removeClass("block__change_icon");
      $(this).parents(".block__slide").addClass("block__change_icon");
    }
  });
  $(document).on("click", ".block__js_faq_heading", function () {
    var data_id = $(this).attr("data_id");
    $(".block__js_faq_heading").removeClass("active");
    $(this).addClass("active");
    var target_offset = $(".block__faq_list_block#" + data_id).offset().top - 150;
    $("html, body").animate({ scrollTop: target_offset }, 1000);
  });

  if ($(".block__js_faq_heading").length) {
    var lastId,
      menuItems = $(".block__faq_list_block"),
      scrollItems = menuItems.map(function () {
        var item = $(this);
        if (item.length) {
          return item;
        }
      });

    $(window).scroll(function () {
      var fromTop = $(this).scrollTop() + $(".header").height() + 250;
      var cur = scrollItems.map(function () {
        if ($(this).offset().top < fromTop) return this;
      });

      cur = cur[cur.length - 1];
      var id = cur && cur.length ? cur[0].id : "";

      if (lastId !== id) {
        lastId = id;
        if (cur != undefined) {
          var data_id = cur[0].id;
          $(".block__js_faq_heading").removeClass("active");
          $(".block__js_faq_heading[data_id='" + data_id + "']").addClass("active");
        }
      }
    });
  }

  $(document).on("click", ".block__mobile_faq_type_dropdown_block", function () {
    $(".block__mobile_faq_type_dropdown").slideToggle();
    $(this).toggleClass("block__show_dropdown");
  });

  $(".cart__footer-wrapper, .main-cart-block").wrapAll("<div class='page-width block__cart-row'></div>");
  if ($('.cart-block-main-cart').hasClass('is-empty')) {
    $('.block__cart-row').addClass('block__cart-empty');
  } else {
    $('.block__cart-row').removeClass('block__cart-empty');
  }

  // Menu-drawer Accordian
  $('.block__menu-drawer-acc-head').on('click', function () {
    if ($(this).hasClass('active')) {
      $(this).siblings('.block__menu-drawer-content').slideUp();
      $(this).removeClass('active');
    }
    else {
      $('.block__menu-drawer-content').slideUp();
      $('.block__menu-drawer-acc-head').removeClass('active');
      $(this).siblings('.block__menu-drawer-content').slideToggle();
      $(this).toggleClass('active');
    }
  });

  // Mega Menu Js
  $('ul.block__mega-menu-nav-block li').mouseenter(function () {
    var tab_id = $(this).attr('data-tab');
    $(this).parents(".mega-menu__content").find('ul.block__mega-menu-nav-block li').removeClass('current');
    $(this).parents(".mega-menu__content").find('.block__mega-menu-name').removeClass('current');
    $(this).addClass('current');
    $("#" + tab_id).addClass('current');
  })


  // on Hover Open Header Mega menu
  var items = $(".header__inline-menu").find("details");
  var dropdownItems = $(".header__submenu");

  items.each(function () {
    $(this).on("mouseenter", function () {
      $(".header__inline-menu details").removeAttr("open");
      $(this).attr("open", true);
      $("body").addClass("block__mega-menu-open");
      var ulElement = $(this).find("ul");
      if (ulElement !== null) {
        ulElement.on("mouseleave", function () {
          $(this).removeAttr("open");
        });
      }
    });


    $(this).on("focus", function () {
      $(".header__inline-menu details").removeAttr("open");
      $(this).attr("open", true);
      $("body").addClass("block__mega-menu-open");
    });

    $(this).on("blur", function () {
      $("body").removeClass("block__mega-menu-open");
      $(this).removeAttr("open");
    });

    $(".block__mega-menu-overlay").mouseenter(function () {
      $("body").removeClass("block__mega-menu-open");
      $(".header__inline-menu details").removeAttr("open");
    });

  });

  $('header.header--has-menu').on("mouseleave", function () {
    $(".header__inline-menu details").removeAttr("open");
    $("body").removeClass("block__mega-menu-open");
    var ulElement = $(this).find("ul");
    if (ulElement !== null) {
      ulElement.on("mouseleave", function () {
        $(this).removeAttr("open");
      });
    }
  });

  if (dropdownItems !== null) {
    dropdownItems.on("mouseleave", function () {
      items.each(function () {
        $("body").addClass("block__mega-menu-open");
        $(this).removeAttr("open");
      });
    });
  }

  document.querySelectorAll(".header__heading-logo-wrapper, .header__icons").forEach(function(el) {
    el.addEventListener("mouseenter", function () {
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
  });
  

  // Account Order Summery DropDown
  $('.block__order-acc-container .block__order-acc:nth-child(1) .block__order-acc-head').addClass('active');
  $('.block__order-acc-container .block__order-acc:nth-child(1) .block__order-acc-content').slideDown();
  $('.block__order-acc-head').on('click', function () {
    if ($(this).hasClass('active')) {
      $(this).siblings('.block__order-acc-content').slideUp();
      $(this).removeClass('active');
    }
    else {
      $('.block__order-acc-content').slideUp();
      $('.block__order-acc-head').removeClass('active');
      $(this).siblings('.block__order-acc-content').slideToggle();
      $(this).toggleClass('active');
    }
  });


  // cart drawer consent
  function cartdrawer_consent(){
    const checkboxes = document.querySelectorAll('.drawer_consent_wrapper .policy_box input#consent_box, .drawer_consent_wrapper .policy_box input#cart_consent_box');
    const cartcheckout_btn = document.querySelectorAll('.cart__checkout-button');
    const consentCheckbox = document.querySelector('input[name="consent_box"]');
    const cartconsentCheckbox = document.querySelector('input[name="cart_consent_box"]');
    if (checkboxes.length === 0) {
      return;
    }
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function () {
        console.log('sdfs');
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
  
  // Address Page pop-up
  $(".block__account-tab-nav-list-dropdown p").click(function () {
    $(this).parent(".block__account-tab-nav-list-dropdown").find("ul").slideToggle();
  });

  $(document).on("click", ".rebuy-button, .rebuy-button span", function () {
    var interval = setInterval(doStuff, 100);
    function doStuff() {
      if (!$(".rebuy-button").hasClass("working")) {
        fetch(window.Shopify.routes.root + '?section_id=cart-drawer').then((response) => response.text()).then((responseText) => {
          const cartid = 'CartDrawer'; 
          const html = new DOMParser().parseFromString(responseText, 'text/html') 
          const destination = document.querySelector('#CartDrawer'); 
          const source = html.getElementById(cartid); 
          const shipping_popup = document.getElementById("consent_box").checked;  
          if (source && destination) destination.innerHTML = source.innerHTML;
          
          $.ajax({
            url: '/?section_id=cart-icon-bubble', 
            type: 'GET', 
            dataType: 'html', 
            success: function (itemcount) {
              $("#cart-icon-bubble").html($(itemcount).html()); 
              $(".cart-count-bubble").trigger("click");
              $(".drawer").removeClass("is-empty");
              const cartcheckout_btn = document.querySelectorAll('.cart__checkout-button');
              
              if(shipping_popup == true){
                document.querySelector('#consent_box').checked = true;
                cartcheckout_btn.forEach(cartcheckout_btn => {
                  const carttotal = cartcheckout_btn.getAttribute('data-carttotal');
                  if(carttotal > cart_minimum_order){
                    cartcheckout_btn.removeAttribute("disabled");
                  }else{
                    cartcheckout_btn.setAttribute("disabled", true);
                  }
                });
              }else{
                document.querySelector('#consent_box').checked = false;
                cartcheckout_btn.forEach(cartcheckout_btn => {
                  cartcheckout_btn.setAttribute("disabled", true);
                });
              }
              cartdrawer_consent();
            },
            complete: function(){
              setTimeout(() => {
                Rebuy.init();
              }, 500);
            }
          });
        });
        clearInterval(interval);
      }
    }
  });
});

// Home Product content 

$(document).on('click', '.block__card_product-feature-head', function (event) {
  event.preventDefault();
  if ($(this).hasClass("show")) {
      $(this).find('span').text('Show Contents');
  } else {
      $(this).find('span').text('Hide Contents');
  }
  $(this).toggleClass("show");
  $(this).parents('.product-card-wrapper').toggleClass("show_feature");
  $(this).parent('.block__card_product_feature').find(".block__card_product-feature-content").toggleClass("show");
});



// collection content page description model open close
document.addEventListener('DOMContentLoaded', function() {
  var readMoreButton = document.querySelector('.collection-hero__description_readmore span');
  var modal = document.querySelector('.block_main_collection-description_popup');
  var closeButton = document.querySelector('.close');

  if (readMoreButton && modal && closeButton) {
      readMoreButton.addEventListener('click', function() {
          modal.style.display = 'flex';  
          document.body.style.overflow = 'hidden'; 
      });

      closeButton.addEventListener('click', function() {
          modal.style.display = 'none';  
          document.body.style.overflow = ''; 
      });
      modal.addEventListener('click', function(e) {
          if (e.target === modal) {
              modal.style.display = 'none';  
              document.body.style.overflow = ''; 
          }
      });
  }
});


// collection content page description readmore button show
document.addEventListener("DOMContentLoaded", function () {
  var description = document.querySelector('.collection-hero__description');
  var readMoreBtn = document.querySelector('.collection-hero__description_readmore');

  if (description && readMoreBtn) {
      var clone = description.cloneNode(true);
      clone.style.display = 'block';
      clone.style.visibility = 'hidden';
      clone.style.maxHeight = 'none';
      document.body.appendChild(clone);

      if (clone.scrollHeight > description.clientHeight) {
          readMoreBtn.style.display = 'block';
      } else {
          readMoreBtn.style.display = 'none';
      }

      document.body.removeChild(clone);
  } 
});



$(".block__accordion_title").on("click", function() {
  if ($(this).hasClass("block__change_icon")) {
    $(this).removeClass("block__change_icon");
    $(this).next(".block__accordion-panel").removeClass("block__change_icon");
    $(this).siblings(".block__accordion-panel").slideUp(500);
    $("i").removeClass("fa-angle-up").addClass("fa-angle-down");
  } else {
    $("i").removeClass("fa-angle-up").addClass("fa-angle-down");
    $(this).find("i").removeClass("fa-angle-down").addClass("fa-angle-up");
    $(".block__accordion_title").removeClass("block__change_icon");
    $(".block__accordion-panel").slideUp(500);
    $(this).addClass("block__change_icon");
    $(this).next(".block__accordion-panel").addClass('block__change_icon');
    $(this).next(".block__accordion-panel").slideDown(500);
  }
});


// collection page content triger 

$('.note .block__filter_top_contents_details_main').bind('click', function(e) {
  e.preventDefault();
  let _this = $(this); 
  let current_alphaval = _this.attr('scroll-trigger'); 
  let current_alphaval_replace = current_alphaval.replace(/(desktop-|mobile-)/, ''); 
  let scrollTarget = $('*[scroll-target='+current_alphaval_replace+']');
  $('.note').removeClass('product-category-lookup-listitem-active');
  $(this).parents('.note').addClass('product-category-lookup-listitem-active');
  $('html, body').stop().animate({
      scrollTop: scrollTarget.offset().top - 100
  }, 600 );
  return false; 
});


function adjustchatscroll() {
  setTimeout(function() {
      let getformContainer = document.getElementsByClassName("block__Get-Quote_Form-Contact");

      // Check if we found any elements
      if (getformContainer.length > 0) {
          let container = getformContainer[0]; 

          let formEmbed = container.querySelector("form-embed");
          
          if (formEmbed && formEmbed.shadowRoot) {
              let getformwidth = formEmbed.shadowRoot.querySelector("._formContainer_stahb_30");
              let getformheading = formEmbed.shadowRoot.querySelector("._textHeading_1ll8d_33");
              let getformlable = formEmbed.shadowRoot.querySelector("._formInputFieldLabel_1ydxd_37");
              let getform = formEmbed.shadowRoot.querySelector("._container_3eyaa_70");
              if (getform) {
                getform.style.display = 'unset'; 
              }
              if (getformwidth) {
                getformwidth.style.margin = '0px'; 
                getformwidth.style.maxWidth = '100%'; 
              }
              if (getformheading) {
                getformheading.style.color = 'var(--tertiary-color)'; 
                getformheading.style.fontSize = '20px'; 
              }
              if (getformlable) {
                getformlable.style.color = 'rgba(var(--primary-color), 0.8)'; 
              }
              if (getformlabels.length > 0) {
                getformlabels.forEach(label => {
                    label.style.color = 'rgba(var(--primary-color), 0.8)'; 
                });
            }
              
          } else {
              container.classList.add('default-quote-form-size');
          }
      } 
  }, 100);
}

$(window).on('load', adjustchatscroll);


// Clicking the 'Login to Request Quote' button will store a value in localStorage and redirect the user to the quote page
$(document).ready(function () {
  $('.card_product_loginbtn_quote').click(function () {
      var dataId = $(this).closest('.card_product_loginbtnwrap_quote').data('id');
      localStorage.setItem('redirectToQuote', dataId);
  });
  $('.block__product-quote-text a').click(function () {
    var dataId = $(this).closest('.block__product-quote-text a').data('id');
    localStorage.setItem('redirectToQuote', dataId);
  });

});

document.addEventListener("DOMContentLoaded", function () {
  // collection goto product js
  let anchorSelector = 'a[href^="#"][class="collection-gotolink"]';
  let offset = 100;
  // Collect all such anchor links
  let anchorList = document.querySelectorAll(anchorSelector);
  // Iterate through each of the links
  anchorList.forEach(link => {
      link.onclick = function (e) {
          e.preventDefault();
          const anchorId = this.hash.substring(1);
          let destination = document.getElementById(anchorId);
          if (destination) {
            const destinationPosition = destination.getBoundingClientRect().top + window.pageYOffset - 280;
            window.scrollTo({
                top: destinationPosition,
                behavior: 'smooth'
            });
          }
      }
  });
        

  // Boost collection page custom js

  setTimeout(function () {
    // table content show in boost html
    // collection subcategory info add in filter
    if(document.querySelector('#collection-metafield') || document.querySelector('#collection-tablecontent')){
      const metafieldElementnew = document.getElementById('collection-metafield');
      const metafieldDatanew = metafieldElementnew.innerHTML;
      // Check and display the list in another section
      const anotherSectionnew = document.getElementById('boost-collection-category');
      if(anotherSectionnew){
        anotherSectionnew.innerHTML = metafieldDatanew;
      }

      // collection table content add in filter
      const collectionTableElementnew = document.getElementById('collection-tablecontent');
      const collectiontableDatanew = collectionTableElementnew.innerHTML;
      const tabledataSectionnew = document.getElementById('boost-sd__tablecontent');
      tabledataSectionnew.innerHTML = collectiontableDatanew;

      // customer login on product card button
      function getCustomerId() { return (window?.__st?.cid || window?.meta?.page?.customerId || window?.ShopifyAnalytics?.meta?.page?.customerId); }
      function afterRender() { 
        console.log(getCustomerId());
        if (getCustomerId() == 'undefined' || getCustomerId() == undefined || getCustomerId() == '') {
          document.querySelectorAll('.card_product_loginbtnwrap').forEach((loginbtn) => {
              if (loginbtn) {
                  loginbtn.style.display = 'block';
              }
          });
          document.querySelectorAll('.boost-addtocartbtn').forEach((cartbtn) => {
              if (cartbtn) {
                  cartbtn.style.display = 'none';
              }
          });
        } else if(getCustomerId() > 0) {
          document.querySelectorAll('.card_product_loginbtnwrap').forEach((loginbtn) => {
              if (loginbtn) {
                  // loginbtn.style.display = 'none';
              }
          });
          document.querySelectorAll('.boost-addtocartbtn').forEach((cartbtn) => {
              if (cartbtn) {
                  cartbtn.style.display = 'block';
              }
          });    
        }
      }
      boostWidgetIntegration.regisCustomization(afterRender, 'filter');
    }

  },5000);
});

// header filter find dropdown mobile
document.addEventListener("DOMContentLoaded", function () {
  if (window.innerWidth <= 749) {
    document.querySelectorAll(".block__home-page-filter-heading-box").forEach(function (heading) {
      heading.addEventListener("click", function () {
        var footerBlock = this.closest(".block__homepage-filtertop-leftcontent");
        footerBlock.classList.toggle("active");

        var detailsContent = footerBlock.querySelector(".block__home-page-filter-listing-box");
        if (detailsContent.style.display === "none" || detailsContent.style.display === "") {
          detailsContent.style.display = "block";
        } else {
          detailsContent.style.display = "none";
        }
      });
    });
  }

  //  collection page collapse tabs
  document.querySelectorAll(".page-landing-content .collection-hero__description .panel .panel-heading").forEach(function (heading) {
    heading.addEventListener("click", function (e) {
      e.preventDefault();
      let panelBlock = this.closest(".panel");
      panelBlock.classList.toggle("active");

      let detailspanelContent = panelBlock.querySelector(".panel-collapse");
        detailspanelContent.classList.toggle("in");
    });
  });

  // collection page send message button click
  if(document.querySelector(".block__collection-description-section a[href='/quote-a/252.htm']") || document.querySelector(".block__collection-description-section a[href='#quote']")){
    document.querySelector(".block__collection-description-section a[href='/quote-a/252.htm'], .block__collection-description-section a[href='#quote']").addEventListener("click", function (e) {
      e.preventDefault();
      GorgiasChat.open();
    });
  }
  
  // Cart drawer consent modal js
  function cartdrawer_consentnew(){
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
  cartdrawer_consentnew();
  
});

document.addEventListener('DOMContentLoaded', function () {
  const modal = document.querySelector('.main_modal_wrapper');
  const closeModalBtn = document.querySelector('.close_modal');

  if (!modal || !closeModalBtn) return;

  function parsePrice(priceStr) {
    return parseFloat(priceStr.replace(/[^0-9.]/g, ''));
  }

  function updateCheckoutState(checkbox) {
    const totalEl = document.querySelector('.totals__total-value');
    const checkoutButtons = document.querySelectorAll('.cart__checkout-button');
    const warningEl = checkbox.closest('.drawer_consent_wrapper')?.querySelector('.cart-minimum-warning');

    if (!totalEl || checkoutButtons.length === 0) return;

    const total = parsePrice(totalEl.textContent);
    const consentChecked = checkbox.checked;
    const meetsMinimum = total >= 300;

    // Enable/disable buttons
    checkoutButtons.forEach(btn => {
      if (consentChecked && meetsMinimum) {
        btn.removeAttribute('disabled');
      } else {
        btn.setAttribute('disabled', '');
      }
    });

    if (warningEl) {
      warningEl.style.display = meetsMinimum ? 'none' : 'block';
    }
  }

  // Event delegation for any checkbox interaction
  document.addEventListener('change', function (event) {
    const checkbox = event.target;
    const isConsentBox = checkbox.matches('#consent_box, #cart_consent_box');

    if (!isConsentBox) return;

    if (checkbox.checked) {
      modal.style.display = 'flex';
      modal.classList.add('main_modal_open');
    }

    updateCheckoutState(checkbox);
  });

  // Also re-check the state on page load
  ['#consent_box', '#cart_consent_box'].forEach(selector => {
    const checkbox = document.querySelector(selector);
    if (checkbox) updateCheckoutState(checkbox);
  });

  // Modal close
  closeModalBtn.addEventListener('click', function () {
    modal.style.display = 'none';
    modal.classList.remove('main_modal_open');
  });
});

 // Collection page navigation redirector
setTimeout(function(){
  document.querySelectorAll('.page-landing-content a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (href === '#top') {
            // Scroll to the top of the page
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            // Existing logic for scrolling to a specific target with offset
            const targetId = href.substring(1); // Remove the '#' from the href
            const target = document.getElementById(targetId);
            if (target) {
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - 150;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
  });
}, 500);