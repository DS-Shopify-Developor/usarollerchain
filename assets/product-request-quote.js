    function setrequestQuoteProducts(productform_content) {
        let product_id = $(productform_content).find('input.productcontent').attr('data-productid'),
        product_title = $(productform_content).find('input.productcontent').attr('data-producttitle'),
        product_handle = $(productform_content).find('input.productcontent').attr('data-producthandle'),
        product_img = $(productform_content).find('input.productcontent').attr('data-productimg'),
        product_price = $(productform_content).find('input.productcontent').attr('data-productprice'),
        product_variantid = $(productform_content).find('input[name="id"]').val(),
        product_variantlabel = $(productform_content).find('input.productcontent').attr('data-productvariantlabel'),
        product_varianttitle = $(productform_content).find('input.productcontent').attr('data-productvarianttitle'),
        product_qty = $(productform_content).find('input[name="quantity"]').val(),
        product_minqty = $(productform_content).find('input[name="quantity"]').attr('min'),
        product_stepqty = $(productform_content).find('input[name="quantity"]').attr('step'),
        product_url = $(productform_content).find('input.productcontent').attr('data-producturl');
        let option_list = '';
        if($(productform_content).find(".product-option-id").length > 0){
            $(productform_content).find("input.product-option-id").each(function(){
                const optional_productname = $(this).attr('data-optionname');
                if(option_list != ''){
                    option_list = option_list + ', '+ optional_productname;
                }else{
                    option_list = optional_productname;
                }
            });
        }else{}
        const quoteproductData = {
            productId: product_id,
            productHandle: `${product_handle}`,
            productTitle: `${product_title}`,
            productImg: `${product_img}`,
            productPrice: `${product_price}`,
            productVariantId: `${product_variantid}`,
            productVariantLabel:`${product_variantlabel}`,
            productVarianttitle: `${product_varianttitle}`,
            productQty: `${product_qty}`,
            productminQty: `${product_minqty}`,
            productstepQty: `${product_stepqty}`,
            productUrl: `${product_url}`,
            productOptionname:`${option_list}`
        };
        const quoteproductList = [];
        let quotejsonResp,quotejsonRespArr,quotejsonRespArrStr;
        const quoternumberOfProducts = 10;
        quoteproductList.push(quoteproductData);
        const quoteCurrProductPagevariantId = quoteproductData.productVariantId;
        const quoteproductDataString = JSON.stringify(quoteproductList);
        const QuotelocalData = localStorage.getItem("quoteProduct");
        if (QuotelocalData === null) {
            localStorage.setItem("quoteProduct", quoteproductDataString);
        } 
        else if (QuotelocalData) {
            const quoteoldProductData = localStorage.getItem("quoteProduct");
            const quotecountProductData = (quoteoldProductData.match(/productTitle/g) || []).length;
            const samequoteProductvariant = quoteoldProductData.includes(quoteCurrProductPagevariantId);
            if (quotecountProductData < quoternumberOfProducts && samequoteProductvariant == false) {
                quotejsonResp = JSON.parse(quoteoldProductData);
                quotejsonRespArr = quotejsonResp.concat(quoteproductList);
                quotejsonRespArrStr = JSON.stringify(quotejsonRespArr);
                localStorage.setItem("quoteProduct", quotejsonRespArrStr);
            } else{}               
        }

        addquoteproduct();
        let quoteproductsPopup = document.querySelector('.quotepopup-section');
        if(quoteproductsPopup.querySelector('.quotepopup-product-wrapper')){
            $('.quick-add-modal .quick-add-modal__toggle[aria-label="Close"]').trigger('click');
            quoteproductsPopup.classList.add('quoteopen');
            quoteproductsPopup.style.display = 'flex';
            document.body.classList.add('small-quotepopup-open');
        }else{}
    }

function setrequestQuoteOptionProducts(productform_content) {
    $(productform_content).find("input.product-option-id").each(function(){
        let product_id = $(this).attr('data-optionid'),
        product_title = $(this).attr('data-optionname'),
        product_handle = $(this).attr('data-optionhandle'),
        product_img = $(this).attr('data-optionimg'),
        product_price = $(this).attr('data-optionprice'),
        product_variantid = $(this).val(),
        product_variantlabel = $(this).attr('data-productvariantlabel'),
        product_varianttitle = $(this).attr('data-optionvarianttitle'),
        product_qty = $(productform_content).find('input[name="quantity"]').val(),
        product_minqty = $(productform_content).find('input[name="quantity"]').attr('min'),
        product_stepqty = $(productform_content).find('input[name="quantity"]').attr('step'),
        product_url = $(this).attr('data-optionurl');  
        const option_main_product = $(this).attr('data-mainproductname');      
        const quoteproductData = {
            productId: product_id,
            productHandle: `${product_handle}`,
            productTitle: `${product_title}`,
            productImg: `${product_img}`,
            productPrice: `${product_price}`,
            productVariantId: `${product_variantid}`,
            productVariantLabel:`${product_variantlabel}`,
            productVarianttitle: `${product_varianttitle}`,
            productQty: `${product_qty}`,
            productminQty: `${product_minqty}`,
            productstepQty: `${product_stepqty}`,
            productUrl: `${product_url}`,
            productOptionname:`Main_product: ${option_main_product}`
        };
        const quoteproductList = [];
        let quotejsonResp,quotejsonRespArr,quotejsonRespArrStr;
        const quoternumberOfProducts = 10;
        quoteproductList.push(quoteproductData);
        const quoteCurrProductPagevariantId = quoteproductData.productVariantId;
        const quoteproductDataString = JSON.stringify(quoteproductList);
        const QuotelocalData = localStorage.getItem("quoteProduct");
        if (QuotelocalData === null) {
            localStorage.setItem("quoteProduct", quoteproductDataString);
        } 
        else if (QuotelocalData) {
            const quoteoldProductData = localStorage.getItem("quoteProduct");
            const quotecountProductData = (quoteoldProductData.match(/productTitle/g) || []).length;
            const samequoteProductvariant = quoteoldProductData.includes(quoteCurrProductPagevariantId);
            if (quotecountProductData < quoternumberOfProducts && samequoteProductvariant == false) {
                quotejsonResp = JSON.parse(quoteoldProductData);
                quotejsonRespArr = quotejsonResp.concat(quoteproductList);
                quotejsonRespArrStr = JSON.stringify(quotejsonRespArr);
                localStorage.setItem("quoteProduct", quotejsonRespArrStr);
            } else{}               
        }

        addquoteproduct();
    });
}

function addquoteproduct(){
    let productsPopup_section = document.querySelector('.quotepopup-section');
    const quoteProducts = localStorage.getItem('quoteProduct');
    const productsArray = quoteProducts ? JSON.parse(quoteProducts) : [];
    let popupContent = '';
    productsArray.forEach(function(product) {
        let productVariantLabel_avail = product.productVariantLabel;
        if(productVariantLabel_avail || productVariantLabel_avail != '' || productVariantLabel_avail != undefined){
            productVariantLabel_avail = productVariantLabel_avail + ' : ';
        }else{
            productVariantLabel_avail = '';
        }
        
        let product_price = product.productPrice;
        product_price = product_price.replace("$", "");
        let finaloptional_textval = ``;
        if(product.productOptionname != undefined){
            if(product.productOptionname != '' && !product.productOptionname.includes('Main_product')){
                const product_property = `Optional :`+product.productOptionname;
                const text = product_property.trim();
                const parts = text.split('Optional :');
                
                if (parts.length > 1 && parts != '') {
                    let options = parts[1].split(',');
                    finaloptional_textval = '<span>Optional : </span><ul>';
                    for (var i = 0; i < options.length; i++) {
                        finaloptional_textval += '<li>' + options[i].trim() + '</li>';
                    }
                    finaloptional_textval += '</ul>';
                }
            }else{
                finaloptional_textval = ``;
            }
        }else{
            finaloptional_textval = ``;
        }


        popupContent += `
        <div class="quotepopup-product-item">
            <div class="quotepopup-product-img">
                <a href="${product.productUrl}" class="quotepopup-product-imglink">
                    <img src="${product.productImg}" alt="Quote popup product image"/>
                </a>
            </div>
            <div class="quotepopup-product-content">
                <div class="quotepopup-product-titlecontent">
                    <a href="${product.productUrl}" class="quotepopup-product-title small_body" data-producthandle="${product.productHandle}">${product.productTitle}</a>
                </div>
                ${product_price > 0 
                ? `<div class="quotepopup-product-price quoteprice-${product_price} small_body">${product.productPrice}</div>` 
                :``
                }
                
                <div class="quotepopup-product-variantcontent">
                    <div class="quotepopup-product-varianttxt">
                        ${ product.productVarianttitle != ''
                        ? `<span class="quotepopup-product-varianttitle">${productVariantLabel_avail}</span>
                        <span class="quotepopup-product-variantval">${product.productVarianttitle}</span>`
                        : ''
                        }
                        <input type="hidden" name="variantId[]" value="${product.productVariantId}"/>
                        <span class="quotepopup-product-price hide hidden visually-hidden">${product_price}</span>
                    </div>
                    <div class="quotepopup-product-propertywrap small_body">
                        <span class="quotepopup-product-propertytxt">${finaloptional_textval}</span>
                    </div>
                </div>
                <div class="quotepopup-product-qtyremove-content">
                    <div class="quotepopup-product-qtycontent">
                    <quantity-input class="quantity" data-url="${product.productUrl}" data-section="template--${product.productId}__main">
                        <button class="quantity__button no-js-hidden disabled" name="minus" type="button">
                            <svg width="12" height="2" viewBox="0 0 12 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L11 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                            </svg>
                        </button>
                        <input class="quantity__input" type="number" name="quantity" 
                        id="Quantity-template--${product.productId}__main" data-productqtyid="${product.productVariantId}" data-cart-quantity="" data-min="${product.productminQty}" min="${product.productminQty}" step="${product.productstepQty}" value="${product.productQty}" form="product-form-template--${product.productTitle}__main">
                        <button class="quantity__button no-js-hidden" name="plus" type="button">
                            <svg width="12" height="12" class="icon icon-plus" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 1V11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                                <path d="M1 6L11 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                            </svg>
                        </button>
                    </qunatity-input>
                    </div>
                    <input type="hidden" name="quantity[]" value="${product.productQty}">
                    <input type="hidden" name="p_title[]" value="${product.productTitle}">
                    <input type="hidden" name="p_price[]" value="${product_price}">
                    <div class="quotepopup-product-removecontent">
                        <a href="javascript:void(0);" class="quotepopup-product-removelink" data-productid="${product.productId}" data-productremoveid="${product.productVariantId}">
                            <svg class="quotepopup-product-removelinksvg" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.375 3.49967L4.725 1.45801H9.275L9.625 3.49967" stroke="black" stroke-linejoin="round"/>
                                <path d="M1.75 3.5H12.25" stroke="black" stroke-linecap="round"/>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M10.7916 3.5L10.2083 12.5417H3.79159L3.20825 3.5H10.7916Z" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M5.54175 10.208H8.45841" stroke="black" stroke-linecap="round"/>
                            </svg>
                            <span class="quotepopup-product-removetxt">Remove</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        `;
    });
    if(popupContent != ''){
        popupContent += `<div class="quotepopup-product-notewrap">
            <div class="quotepopup-note"><textarea name="customerNotes" class="form-control quotepopup-product-note" placeholder="Add Note"></textarea></div>
            <div class="quotepopup-product-shippingnote"><span>Note:</span> Shipping cost is not final until a final order is submitted</div>
        </div>
        `
        popupContent += `<div class="quotepopup-product-item quotepopup-product-moreitem">
            <a href="javascript:void(0);" class="quotepopup-moreproduct">
                <span class="quotepopup-moreproduct-icon">
                <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.1999 7.69998H8.80002V1.29995C8.80002 0.858446 8.44158 0.5 7.99993 0.5C7.55842 0.5 7.19998 0.858446 7.19998 1.29995V7.69998H0.799949C0.358446 7.69998 0 8.05842 0 8.49993C0 8.94158 0.358446 9.30002 0.799949 9.30002H7.19998V15.6999C7.19998 16.1416 7.55842 16.5 7.99993 16.5C8.44158 16.5 8.80002 16.1416 8.80002 15.6999V9.30002H15.1999C15.6416 9.30002 16 8.94158 16 8.49993C16 8.05842 15.6416 7.69998 15.1999 7.69998Z" fill="#2A3492"/>
                </svg>                                   
                </span>
            </a>
            <div class="quotepopup-product-moreitem-txt small_body">(Add more items to quote)</div>
        </div>`;
    }else{}
    if(productsPopup_section.querySelector('.quotepopup-product-wrapper')){
        productsPopup_section.querySelector('.quotepopup-product-wrapper').innerHTML = popupContent;
        //productsPopup.style.display = 'block';
    }else{}

    document.querySelector('.quotepopup-countproduct').innerHTML = productsArray.length;
    if(productsArray.length == 0){
        document.querySelector('.quotepopup-headingwrap').classList.add('quotepopup-centerheading');
        document.querySelector('.quotepopup-heading-available').style.display = 'none';
        document.querySelector('.quotepopup-heading-empty').style.display = 'flex';
        document.querySelector('.quotepopup-section').classList.add('empty-quotesection');
        //document.querySelector('.quotepopup-innerwrapper').style.display = 'none';
    }else{
        document.querySelector('.quotepopup-headingwrap').classList.remove('quotepopup-centerheading');
            document.querySelector('.quotepopup-heading-empty').style.display = 'none';
            document.querySelector('.quotepopup-heading-available').style.display = 'flex';
            document.querySelector('.quotepopup-section').classList.remove('empty-quotesection');
            //document.querySelector('.quotepopup-innerwrapper').style.display = 'flex';
    }

    var quotedrawer_productlist = document.querySelector('.quoteproduct-list-wrapper');
    if(quotedrawer_productlist){
        quotedrawer_productlist.querySelector('.quotedrawer-product-wrapper').innerHTML = popupContent;
    }else{}


    // productsPopup_section.addEventListener('click', function(e) {
    //     if (e.target === productsPopup_section) {
    //         // productsPopup.style.display = 'none';
    //         document.querySelector('.quotepopup-closebtn').click();
    //     }
    // });

    // Remove item from localstorage 
    $('.quotepopup-product-removecontent .quotepopup-product-removelink').click(function(){
        const product_variantid = $(this).attr('data-productremoveid');
        removeProductById(product_variantid);
        addquoteproduct();
    });

    //quantity update
    $('.quotepopup-product-qtycontent .quantity__button').click(function(){
        let product_qty_update = $(this).parents('.quantity').find('.quantity__input').val(),
        product_qty_id = $(this).parents('.quantity').find('.quantity__input').attr('data-productqtyid');
        $(this).parents('.quotepopup-product-qtyremove-content').find('input[name="quantity[]"]').val(product_qty_update);
        updateProductQuantity(product_qty_id, product_qty_update);
    });

    $('.quotepopup-section .quotepopup-closebtn').unbind().click(function(event){
        event. stopPropagation();
        let quoteProducts_storage = localStorage.getItem('quoteProduct');
        let quoteProducts_length = quoteProducts_storage ? JSON.parse(quoteProducts_storage) : [];
        if(quoteProducts_length.length == 0){
            $('.quotepopup-section').removeClass('quoteopen').css('display','none');
            $('body').removeClass('small-quotepopup-open');
        }else{
            $('.quotepopup-section').toggleClass('quoteopen').css('display','flex');
            $('body').toggleClass('small-quotepopup-open');
        }
    });

    // quotepopup minimize close btn
    $(document).on('click', '.quotepopup-section:not(.quoteopen) .quotepopup-wrapper', function(e) {
        e.preventDefault();
        if (!$(this).parents('.quotepopup-section').hasClass("quoteopen")) {
            let quoteProducts_storage = localStorage.getItem('quoteProduct');
            let quoteProducts_length = quoteProducts_storage ? JSON.parse(quoteProducts_storage) : [];
            if(quoteProducts_length.length == 0){
                $('.quotepopup-section').removeClass('quoteopen').css('display','none');
                $('body').removeClass('small-quotepopup-open');
            }else{
                $('.quotepopup-section').toggleClass('quoteopen').css('display','flex');
                $('body').toggleClass('small-quotepopup-open');
            }
        }else{ return; }
    });

}

//Drawer outside click
let quotedrawer_outside = document.querySelector('quote-drawer');
if(quotedrawer_outside){
    quotedrawer_outside.addEventListener('click', function(e) {
        if (e.target === quotedrawer_outside) {
            // productsPopup.style.display = 'none';
            document.querySelector('.quotedrawer__close').click();
        }
    });
}


//Remove function
function removeProductById(productIdToRemove) {
    let storedProducts = localStorage.getItem('quoteProduct');
    let productArray = storedProducts ? JSON.parse(storedProducts) : [];
  
    let updatedProductArray = productArray.filter(function(product) {
      return product.productVariantId !== productIdToRemove;
    });
  
    localStorage.setItem('quoteProduct', JSON.stringify(updatedProductArray));
}

//Quantity function
function updateProductQuantity(productVariantId, newQuantity) {
    let storedProducts = localStorage.getItem('quoteProduct');
    let productArray = storedProducts ? JSON.parse(storedProducts) : [];
    let productIndex = productArray.findIndex(function(product) {
      return product.productVariantId === productVariantId;
    });
  
    if (productIndex !== -1) {
      productArray[productIndex].productQty = newQuantity;
      localStorage.setItem('quoteProduct', JSON.stringify(productArray));
    } else {
      console.error('Product with ID', productId, 'not found.');
    }
}
  

// Request quote product
addquoteproduct();

// JavaScript code
$(document).on('click', '.product-requestquote-btn', function(e) {
    e.preventDefault();
    let productform_content = $(this).closest('product-form'); // Find the closest form element
    console.log(productform_content);
    setrequestQuoteProducts(productform_content);
    if($(this).closest('product-form').find(".product-option-id").length > 0){
        setrequestQuoteOptionProducts(productform_content);
    }else{}
});

$(document).on('click','.mainproduct-checkavailability-txt', function(){
    $(this).parents('.product-form').find('.product-requestquote-btn').trigger('click');
});

//wishlist page quote btn
$(document).on('click', '.swym-product-quote-btn', function() {
    let productform_content = $(this).closest('.swym-product-actionbtnwrap'); // Find the closest form element
    setrequestQuoteProducts(productform_content);
});

$('.header-wrapper .quote_btn').click(function(){

    let storedProducts = localStorage.getItem('quoteProduct');
    let retstoredProducts = JSON.parse(storedProducts);
    if(storedProducts && storedProducts != null && retstoredProducts.length > 0){
        if($('body').hasClass('block_menu-open')){
            $('.menu-drawer-closebtn').trigger('click');
        }else{}

        let productsquoteDrawer = document.querySelector('.requestquote-drawer');
        if(productsquoteDrawer){
            productsquoteDrawer.classList.add('quotedrawer_active');
            document.body.classList.add('body_quotedrawer_active');
        }else{}
    }else{
        window.location.href = '/account';
    }
    
});

    $('.quotepopup-section .get_quotepopup_btn').click(function(event) {
        event.stopPropagation();
        let productsPopup = $('.quotepopup-section');
        if (productsPopup.find('.quotepopup-product-wrapper').length) {
            productsPopup.removeClass('quoteopen');
            $('body').removeClass('small-quotepopup-open');
        }
    
        let productsquoteDrawer = $('.requestquote-drawer');
        if (productsquoteDrawer.length) {
            productsquoteDrawer.addClass('quotedrawer_active');
            $('body').addClass('body_quotedrawer_active');
        }
    });

    // Request Quote drawer close functionality
    $('.quotedrawer__close').click(function(){
        $(this).parents('.requestquote-drawer').removeClass('quotedrawer_active');
        $('body').removeClass('body_quotedrawer_active');
        let storedProducts = localStorage.getItem('quoteProduct');
        let retstoredProducts = JSON.parse(storedProducts);
        if(!storedProducts && storedProducts == null || retstoredProducts.length == 0){
            setTimeout(function(){
                $('#quoteproduct-listform').removeClass('quote-products-hide').css('display','block');
                $('.quotedrawer-product-mainheading').css('display','block');
                $('.quotedrawer-product-submittedcontent').removeClass('quote-submit-active').css('display','none');
                localStorage.removeItem("quoteProduct");
            },1000);
            
        }else{}
    });

$('.quote_guestaccount_formlink').click(function(e){
    e.preventDefault();
    $('.requestquote-login-formwrap').css('display','none');
    $('#quote-register').css('display','block');
});

$('.quote_loginaccount_linktxt').click(function(e){
    e.preventDefault();
    $('#quote-register').css('display','none');
    $('.requestquote-login-formwrap').css('display','block');
})

// Request Quote submit button
$('.quotedrawer-product-submitbtn').unbind().click(function(e){
    e.preventDefault();
    e.stopPropagation();
    console.log('clickbtn');
    $(this).find('.quotedrawer-product-submitbtn-txt').addClass('hidden');
    $(this).find('.quotedrawer-product-submitbtn-loading').removeClass('hidden');
    var formElement = document.querySelector('#quoteproduct-listform');

    if (formElement) {
        if (!formElement.querySelector('[name="phone_number"]')) {
            var phoneInput = document.createElement('input');
            phoneInput.type = 'hidden';
            phoneInput.name = 'phone_number';
            phoneInput.value = '';
            formElement.appendChild(phoneInput);
        }
        if (!formElement.querySelector('[name="companyname"]')) {
            var companyInput = document.createElement('input');
            companyInput.type = 'hidden';
            companyInput.name = 'companyname';
            companyInput.value = '';
            formElement.appendChild(companyInput);
        }
    }
    var submittoAdd = new FormData(formElement);
    function moveAlong(){
            let params = {
                type: 'POST',
                url: 'https://draftapi.usarollerchain.com/graphql/draftorder-create.php',
                data: submittoAdd,
                dataType: 'json',
                contentType: false,  // Important to set these to false for file uploads
                processData: false,  // Important to set these to false for file uploads
                success: function(line_item) { 
                    console.log("Product Added to Cart");
                    //moveAlong();
                    console.log(line_item);
                    $('#quoteproduct-listform').addClass('quote-products-hide').css('display','none');
                    $('.quotedrawer-product-mainheading').css('display','none');
                    $('.quotedrawer-product-submittedcontent').addClass('quote-submit-active').css('display','block');
                    const quoteProducts1 = localStorage.getItem('quoteProduct');
                    const productsArray1 = quoteProducts1 ? JSON.parse(quoteProducts1) : [];
                    let popupContent1 = '';
                    productsArray1.forEach(function(product) {
                        popupContent1 += `
                                <div class="main__quotepopup-product-item">
                                    <div class="main__quotepopup-product-img">
                                        <a href="${product.productUrl}" class="main__quotepopup-product-imglink">
                                            <img src="${product.productImg}" alt="Quote popup product image"/>
                                        </a>
                                    </div>
                                    <div class="main__quotepopup-product-content">
                                        <div class="main__quotepopup-product-titlecontent">
                                            <a href="${product.productUrl}" class="main__quotepopup-product-title small_body" data-producthandle="${product.productHandle}">${product.productTitle}</a>
                                        </div>
                                        <div class="main__productquote-qty"><span>Qty.:</span>${product.productQty}</div>
                                        </div>
                                    </div>
                                </div>
                         `;
                    });

                    document.querySelector('.quotedrawer-productlist-submitted').innerHTML = popupContent1;
                    

                    localStorage.removeItem("quoteProduct");
                    $(this).find('.quotedrawer-product-submitbtn-txt').removeClass('hidden');
                    $(this).find('.quotedrawer-product-submitbtn-loading').addClass('hidden');
                    const quoteProducts = localStorage.getItem('quoteProduct');
                    const productsArray = quoteProducts ? JSON.parse(quoteProducts) : [];
                    if(productsArray.length == 0){
                        document.querySelector('.quotepopup-headingwrap').classList.add('quotepopup-centerheading');
                        document.querySelector('.quotepopup-heading-available').style.display = 'none';
                        document.querySelector('.quotepopup-heading-empty').style.display = 'flex';
                        document.querySelector('.quotepopup-section').classList.add('empty-quotesection');
                    }else{
                        document.querySelector('.quotepopup-headingwrap').classList.remove('quotepopup-centerheading');
                        document.querySelector('.quotepopup-heading-empty').style.display = 'none';
                        document.querySelector('.quotepopup-heading-available').style.display = 'flex';
                        document.querySelector('.quotepopup-section').classList.remove('empty-quotesection');
                    }
                },
                error: function(response_error) {
                console.log("fail");
                console.log(response_error);
               // moveAlong();

                }
            };
            $.ajax(params);
    };
    moveAlong();
});


// Account login submit functionality

let urlParams = new URLSearchParams(window.location.search);
if (urlParams.has("showDrawer") && urlParams.get("showDrawer") === "true") {
  // Open the drawer/modal
  let productsquoteDrawer = document.querySelector('.requestquote-drawer');
  if(productsquoteDrawer){
      productsquoteDrawer.classList.add('quotedrawer_active');
      document.body.classList.add('body_quotedrawer_active');
      let orignalurl = window.location.origin + window.location.pathname;
      history.pushState({}, '', `${orignalurl}`);
  }else{}
}

// Quote popup plus button
document.addEventListener('click', function(e) {
    if (e.target.closest('.quotepopup-moreproduct')) {
        e.preventDefault();
        let closeBtn = document.querySelector('.quotepopup-wrapper .quotepopup-closebtn');
        if (closeBtn) closeBtn.click();
        if (window.innerWidth >= 989) {
            let searchIcon = document.querySelector('.block__header-inlinemenu-search .header__icon--search');
            if (searchIcon) searchIcon.click();
        }else{
            let searchIconmob = document.querySelector('.block__header-menu-search .header__icon--search');
            if (searchIconmob) searchIconmob.click();
        }
    }
});