
$(document).ready(function() {
  
    let uniquedraftid = [...new Set(customerOrderQuoteId)];
    let cid = $(".block_main_account-section").attr('data-customerid');

    //  get customer draft order data
      $.ajax({
        url: 'https://draftapi.usarollerchain.com/draftorderlist.php',
        type: 'POST',
        dataType: 'json',
        data: {
          customerid: cid
        },
        success: function(data) {
          data.message.forEach(function(order, index) {
            if (uniquedraftid.includes(order.name)) {
              // current quote placed as real order so no needed to show quote here
              QuoteorderData(order, index);
            }else{
              if(order.days){
                const today = new Date().toISOString().split('T')[0];
                const start = new Date(order.days);
                const daysDiff = Math.ceil((new Date(today) - start) / (1000 * 60 * 60 * 24));
                // Other Tags
                let quotetags = order.tags;
                quotetags = quotetags.replace(/Issued|Open|Submitted|Unissued|Accepted|issued|open|submitted|unissued|accepted|Active|active/g, '').trim();
                quotetags = quotetags.replace(/,\s*,/g, ', ').replace(/^\s*,|,\s*$/g, '').trim();
                quotetags = quotetags + ", Closed";
    
                if(daysDiff >= 30){
                  let draftOrderid = order.id;
                  $.ajax({
                        url: 'https://draftapi.usarollerchain.com/delete_draft_order.php',
                        type: 'POST',
                        data: {
                            draft_order_id: draftOrderid,
                            newtag: quotetags
                        },
                        success: function(response) {
                        },
                        error: function(xhr, status, error) {
                            //alert('AJAX error: ' + status + ', ' + error);
                        }
                  });
                }else{}
              }else{}
  
              let current_drafttag = order.tags;
              if(current_drafttag.indexOf('Void') != -1 || current_drafttag.indexOf('void') != -1){
              }else{
                QuoteorderData(order, index);
              }
            }
          });
          modalRemove();
  
        },
        error: function(xhr, status, error) {
          $('.block__quote__emptycontent').remove();
          $('.quote-content-loader .loading__spinner').addClass('hidden');
          $('.main_account_quotetab-content').prepend('<div class="block__quote__emptycontent"><h2 class="empty-quote block__content-heading block__tabcontent-heading">Quote is empty.</h2><div class="block__quoteempty-btn"><a href="/pages/shop-by-category" class="custom_btn black_btn">Continue Shopping</a></div></div>');
        }
      });
  
      function QuoteorderData(order, index){
        let ordersHtml = '';
        let orderdate = new Date(order.created_at);
        let order_tag = order.tags;
        let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let month = monthNames[orderdate.getMonth()];
        let day = orderdate.getDate();
        let year = orderdate.getFullYear();
        let formattedDate = month + " " + (
          day < 10
            ? '0' + day
            : day
        ) + ", " + year;
        // quote activate date difference
          let quote_daysDiff = 0;
        let quote_activetoday = new Date().toISOString().split('T')[0];
              let quote_activestart = new Date(order.days);
              if(order.days){
                quote_daysDiff = Math.ceil((new Date(quote_activetoday) - quote_activestart) / (1000 * 60 * 60 * 24));
              }else{}
  
        // price convertor
        function getEuros(priceconvert) {
          return (Currency.convert(priceconvert, 'USD', currency_code)).toFixed(2);
        }
  
        let main_first_quoteindex = '',
        order_invoicefile = '';
        if (index == 0) {
          main_first_quoteindex = 'is-open';
        } else {} 
        let totalItems = order.line_items ? order.line_items.length : 0;
        ordersHtml += '<div class="main_account_quotehistory ' + main_first_quoteindex + '">';
        ordersHtml += '<div class="main_account_quotecontent-head">';
        ordersHtml += '<div class="main_account-lefthead-quotecontent main_account_quotepadding">';
        ordersHtml += '<div class="main_account_quotenumber medium_body"><span>Quote ID : <strong>' + order.name + '</strong></span><span class="main_account-managequote-arrow"></span></div>';
        ordersHtml += '<div class="main_account_bottom_head"><div class="main_account_quotedate_inner"><span class="main_account_quotedate extra_small_body14">Date : <time datetime="' + order.created_at + '">' + formattedDate + '</time></span></div>';
        ordersHtml += '<div class="order_items_count">Total items : <span>' + totalItems  + '</span></div>';
        ordersHtml += '<div class="main_quote_order_cancle quote_order_cancle_btn" data-draft-order-id="'+order.id+'" title="Cancle your current quote"><div class="quote_order_cancle" ></div><span>Remove</span></div>';
      //   if (order_tag.indexOf('Submitted') != -1 || order_tag.indexOf('submitted') != -1 || order_tag.indexOf('Unissued') != -1 || order_tag.indexOf('unissued') != -1) {
      //     ordersHtml += '<div class="remove_submitted_order"  data-draft-order-id="'+order.id+'" title="Cancle your current quote"><div class="quote_order_cancle1"></div><span>Remove</span></div>';
      //  }else{
      //     ordersHtml += '<div class="main_quote_order_cancle quote_order_cancle_btn" data-draft-order-id="'+order.id+'" title="Cancle your current quote"><div class="quote_order_cancle" ></div><span>Remove</span></div>';
      //  }
        ordersHtml += '</div>';
        
        if(order.order_invoice_file){
          order_invoicefile = order.order_invoice_file
          ordersHtml += '<div class="main_account-invoicefile">';
          ordersHtml += '<a href="'+order_invoicefile.replace("https://cdn.shopify.com/s/files/1/0670/0443/2631/files", '//value-tronics.myshopify.com/cdn/shop/files')+'" class="main_account_invoice_download extra_small_body13" download="Invoice_file">';
          ordersHtml += '<span class="account_download_icon"><svg width="13" height="15" viewBox="0 0 13 15" fill="none" xmlns="http://www.w3.org/2000/svg">';
          ordersHtml += '<path d="M6.32422 11.8438L1.82422 7.34375C1.61589 7.11458 1.61589 6.88542 1.82422 6.65625C2.05339 6.44792 2.28255 6.44792 2.51172 6.65625L6.16797 10.2812V1C6.1888 0.6875 6.35547 0.520833 6.66797 0.5C6.98047 0.520833 7.14714 0.6875 7.16797 1V10.2812L10.8242 6.65625C11.0534 6.44792 11.2826 6.44792 11.5117 6.65625C11.7201 6.88542 11.7201 7.11458 11.5117 7.34375L7.01172 11.8438C6.90755 11.9479 6.79297 12 6.66797 12C6.54297 12 6.42839 11.9479 6.32422 11.8438ZM12.168 13.5C12.4805 13.5208 12.6471 13.6875 12.668 14C12.6471 14.3125 12.4805 14.4792 12.168 14.5H1.16797C0.855469 14.4792 0.688802 14.3125 0.667969 14C0.688802 13.6875 0.855469 13.5208 1.16797 13.5H12.168Z" fill="currentColor"></path></svg></span>';
          ordersHtml += 'Invoice</a></div>';
        }else{}
        ordersHtml += '</div>';
        ordersHtml += '</div>';
        ordersHtml += '<div class="main_account_quotecontent-body">';
        if (!order_tag.includes("Submitted") || !order_tag.includes("submitted") && !order_tag.includes("Unissued") || !order_tag.includes("unissued") && !order_tag.includes("Active") || !order_tag.includes("active") && !order_tag.includes("Issued") || !order_tag.includes("issued") && !order_tag.includes("Open") || !order_tag.includes("open")) {
          ordersHtml += '<form id="quoteproduct-listform" class="hidden-customerinfo">';
          ordersHtml += '<input type="hidden" name="tags" value="Unissued"><input type="hidden" name="salesperson" value="Jimena Quartieri"><input type="hidden" class="form-control" name="customerName" value="'+customer_firstname+'">';
          ordersHtml += '<input type="hidden" class="form-control" name="customerEmail" value="'+customer_email+'"><input type="hidden" class="form-control" name="customerCountry" value="'+customer_country+'"><input type="hidden" class="form-control" name="customerZipcode" value="'+customer_zipcode+'">';
          ordersHtml += '<input type="hidden" class="form-control" name="customerPhoneNumber" value="'+customer_phone+'"><input type="hidden" class="form-control" name="days" value=""><input type="hidden" class="form-control" name="customerNotes" value=""><input type="hidden"  class="form-control" name="fileimage[]" multiple>';
        }else{
          if(quote_daysDiff >= 30){
            ordersHtml += '<form id="quoteproduct-listform" class="hidden-customerinfo">';
            ordersHtml += '<input type="hidden" name="tags" value="Unissued"><input type="hidden" name="salesperson" value="Jimena Quartieri"><input type="hidden" class="form-control" name="customerName" value="'+customer_firstname+'">';
            ordersHtml += '<input type="hidden" class="form-control" name="customerEmail" value="'+customer_email+'"><input type="hidden" class="form-control" name="customerCountry" value="'+customer_country+'"><input type="hidden" class="form-control" name="customerZipcode" value="'+customer_zipcode+'">';
            ordersHtml += '<input type="hidden" class="form-control" name="customerPhoneNumber" value="'+customer_phone+'"><input type="hidden" class="form-control" name="days" value=""><input type="hidden" class="form-control" name="customerNotes" value=""><input type="hidden"  class="form-control" name="fileimage[]" multiple>';
          }else{
            ordersHtml += '';
          }
        }
        
        order.line_items.forEach(function(item) {
          console.log(item);
          ordersHtml += '<div class="main_account_quoteitem"><input type="hidden" name="quotealltag" value="'+order.tags+'" />';
  
          if(quote_daysDiff < 30){
            if(order_tag.indexOf('Submitted') != -1 || order_tag.indexOf('Submitted') != -1 || order_tag.indexOf('Unissued') != -1 || order_tag.indexOf('unissued') != -1){
              ordersHtml += '<input type="hidden" name="quotedraftid" value="'+order.name+'"/><input type="hidden" name="quotevariant" value="'+item.variant_id+'"/><input type="hidden" name="quoteqty" value="'+item.product_quantity+'"/>';
              ordersHtml += '<input type="hidden" class="newtag" name="newtag" value="">';
            }else if(order_tag.indexOf('Active') != -1 || order_tag.indexOf('active') != -1 || order_tag.indexOf('completed') != -1 || order_tag.indexOf('Issued') != -1 || order_tag.indexOf('issued') != -1 || order_tag.indexOf('Open') != -1 || order_tag.indexOf('open') != -1){
              ordersHtml += '<input type="hidden" name="quotedraftid" value="'+order.name+'"/><input type="hidden" name="quotevariant" value="'+item.variant_id+'"/><input type="hidden" name="quoteqty" value="'+item.product_quantity+'"/>';
              ordersHtml += '<input type="hidden" class="newtag" name="newtag" value="">';
            }else{
              ordersHtml += '<input type="hidden" name="variantId[]" value="'+item.variant_id+'"/><input type="hidden" name="quantity[]" value="'+item.product_quantity+'"/>';
              ordersHtml += "<input type='hidden' name='p_title[]' value='"+item.product_title+"'/><input type='hidden' name='p_price[]' value='"+item.product_price+"'/>";
            }
          }else{
            ordersHtml += '<input type="hidden" name="variantId[]" value="'+item.variant_id+'"/><input type="hidden" name="quantity[]" value="'+item.product_quantity+'"/>';
            ordersHtml += "<input type='hidden' name='p_title[]' value='"+item.product_title+"'/><input type='hidden' name='p_price[]' value='"+item.product_price+"'/>";
          }
  
          ordersHtml += '<div class="main_account_quoteitem-img-con-wrap">';
          ordersHtml += '<div class="main_account_quoteitem-imgwrap">';
          if (item.product_image_src == undefined || item.product_image_src == "") {
            ordersHtml += '<img src="https://cdn.shopify.com/s/files/1/0633/0187/7925/files/card_placeholder_img-new.png?v=1737523734" alt="Quote item" width="" height="">';
          } else {
            ordersHtml += '<img src="' + item.product_image_src + '" alt="Quote item" width="" height="">';
          } ordersHtml += '</div>';
          ordersHtml += '<div class="main_account_quoteitem-titlecontent">';
          ordersHtml += '<div class="main_account_quoteitem-title"><a href="/products/'+item.product_handle+'" class="main_account_quoteitem-titlelink">' + item.product_title + '</a></div>';
          ordersHtml += '<div class="main_account_quoteitem-mobilecontent">';
          ordersHtml += '<div class="main_account__quoteitem-qtycontent extra_small_body14"><span class="main_account__quoteitem-qty">Qty : <strong>' + item.product_quantity + '</strong></span></div>';
          ordersHtml += '<div class="main_account__quoteitem-pricecontent extra_small_body14"><span class="main_account__quoteitem-price">Quoted Price : <strong>'+ currency_symbol + getEuros(item.product_price) +'</strong></span></div>';
          ordersHtml += '</div>';
          ordersHtml += '</div>';
          ordersHtml += '</div>';
          ordersHtml += '<div class="main_account_quoteitem-content">';
          ordersHtml += '<div class="main_account__quoteitem-qtycontent extra_small_body14"><span class="main_account__quoteitem-qty">Qty : <strong>' + item.product_quantity + '</strong></span></div>';
          ordersHtml += '<div class="main_account__quoteitem-pricecontent extra_small_body14"><span class="main_account__quoteitem-price">Quoted Price : <strong>'+ currency_symbol + getEuros(item.product_price) +'</strong></span></div>';
          ordersHtml += '</div>';
          ordersHtml += '</div>';
          
        });
        if (!order_tag.includes("Submitted") || !order_tag.includes("Submitted") && !order_tag.includes("Unissued") || !order_tag.includes("unissued") && !order_tag.includes("Active") || !order_tag.includes("active") && !order_tag.includes("Issued") || !order_tag.includes("issued") && !order_tag.includes("Open") || !order_tag.includes("open")) {
          ordersHtml += '</form>';
        }else{
          if(quote_daysDiff >= 30){
            ordersHtml += '</form>';
          }else{
            ordersHtml += '';
          }
        }
        ordersHtml += '<div class="main_account__quoteitem-chatnote">';
        ordersHtml += '<div class="main_account__quoteitem-chatwrap block__chat-shopifyinbox extra_small_body14"> <a onclick="GorgiasChat.open();" href="javascript:void(0);" class="livechat-gorgias-content"><span class="main_account__quoteitem-chattxt">Request Assistance with Quote</span></a></div>';
        if(order.note != ''){
          ordersHtml += '<div class="main_account__quoteitem-quotenote extra_small_body14">Order Notes : <span class="main_account__quoteitem-notetxt">'+ order.note +'</span></div>';
        }else{}
        ordersHtml += '</div>';
        ordersHtml += '</div>';
        ordersHtml += '<div class="main_account-righthead-quotecontent">';
        ordersHtml += '<div class="main_account-quotetotal main_account_quotepadding medium_body">Total : <strong>'+ currency_symbol + getEuros(order.total_price)+ '</strong></div>';
        ordersHtml += '<div class="main_account-managequote main_account_quotepadding extra_small_body14"><a href="'+order.invoice_url+'" class="custom_btn black_btn placeorder_btn" bis_skin_checked="1">Place Order</a>';
        if(order_tag.includes("Won") || order_tag.includes("won")){
          ordersHtml += '<div class="custom_btn blue_btn order-compated_btn">Order Completed</div>';
        }
        ordersHtml += '<a href="javascript:void(0);" class="custom_btn black_btn resubmitted_btn" data-draft-order-id="'+order.id+'">Re-submit</a></div>';
        ordersHtml += '</div>';
        ordersHtml += '</div>';
        $('.quote-content-loader .loading__spinner').addClass('hidden');
        $('.block__quote-order-filterwrap').css('display','flex');
        if(quote_daysDiff < 30){
          if(order_tag.indexOf('Won') == -1){
            if(order_tag.indexOf('Submitted') != -1 || order_tag.indexOf('submitted') != -1 || order_tag.indexOf('Unissued') != -1 || order_tag.indexOf('unissued') != -1){
              $('#quote-submitted-container').parents('.block__quote-ordercontentwrap').addClass('available-quote').css('display','block');
              $('#quote-submitted-container').append(ordersHtml);
            }else if(order_tag.indexOf('Active') != -1 || order_tag.indexOf('active') != -1 || order_tag.indexOf('completed') != -1 || order_tag.indexOf('Issued') != -1 || order_tag.indexOf('issued') != -1 || order_tag.indexOf('Open') != -1 || order_tag.indexOf('open') != -1){
              $('#quote-activated-container').parents('.block__quote-ordercontentwrap').addClass('available-quote').css('display','block');
              $('#quote-activated-container').append(ordersHtml);
              $('#quote-activated-container').find('.main_account_quotehistory').eq(0).addClass('is-open');
            }else{
              $('#quote-closed-container').parents('.block__quote-ordercontentwrap').addClass('available-quote').css('display','block');
              $('#quote-closed-container').append(ordersHtml);
            }
          }
          else{
            $('#quote-closed-container').parents('.block__quote-ordercontentwrap').addClass('available-quote').css('display','block');
            $('#quote-closed-container').append(ordersHtml);
          }
        }else{
          $('#quote-closed-container').parents('.block__quote-ordercontentwrap').addClass('available-quote').css('display','block');
          $('#quote-closed-container').append(ordersHtml);
        }

      }


  // resubmit button click in the darft order pending  and new  darft order submited 
      $(document).on('click', '.resubmitted_btn', function (e) {
        e.preventDefault(); 
        const $this = $(this);
        $this.addClass('cancle-loading'); 
        const parentElement = $this.closest('.main_account_quotehistory')[0];
       const formElement = parentElement ? parentElement.querySelector('#quoteproduct-listform') : null; 

       
        if (!formElement) {
          $this.removeClass('cancle-loading'); 
          return;
        }
        console.log(formElement);
        const formData = new FormData(formElement);
        console.log('formData');
       console.log(formData);
        const removebtnEle = $this[0];
            function moveAlong(){
            let params = {
                type: 'POST',
                url: 'https://draftapi.usarollerchain.com/graphql/draftorder-create.php',
                data: formData,
                dataType: 'json',
                contentType: false,  
                processData: false,  
                  success: function(line_item) { 
                    console.log('added');
                    console.log(line_item);
                      removebtnEle.classList.remove('cancle-loading');
                      window.location.reload();
                      
                  },
                  error: function(response_error) {
                   console.log("fail");
                   console.log(response_error);
                  removebtnEle.classList.remove('cancle-loading');
                  }
                };
            $.ajax(params);
            };
            moveAlong();
   
    });


      $(document).on('click', '.main_account_quotenumber .main_account-managequote-arrow', function(e) {
        e.preventDefault();
        $(this).parents('.main_account_quotehistory').toggleClass('is-open');
      });


        // submitted draft order is remove model open
      function modalRemove(){
        // const readMoreButtons = document.querySelectorAll(".quote-order-submitted .main_account_quotehistory");
        const readMoreButtons = document.querySelectorAll(".main_account_quotehistory");
          const modal = document.querySelector(".block_main_remove_quote_popup"); 
          const closeButton = modal.querySelector('.close');
          const popupCloseButton = modal.querySelector('.popup-go-back-btn');
          const quoteremoveButton = modal.querySelector('.popup-remove-quote-btn');
          const closeModal = () => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
          };
          closeButton.addEventListener('click', closeModal);
          popupCloseButton.addEventListener('click', closeModal);
      
          modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
          });
          readMoreButtons.forEach(button => {
            let removeBtnEle = button.querySelector('.quote_order_cancle_btn');
            removeBtnEle.addEventListener("click", (e) => {
                e.preventDefault();
                modal.dataset.triggeringButton = removeBtnEle.getAttribute('data-draft-order-id');
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            });
          });
      
          quoteremoveButton?.addEventListener('click', function handleRemove(e) {
              e.preventDefault();
      
              const button = modal.dataset.triggeringButton;
              if (!button) {
                  // console.error("Triggering button not found.");
                  return;
              }
              let removebtnEle = document.querySelector('.quote_order_cancle_btn[data-draft-order-id="'+button+'"]');
              removebtnEle.classList.add('cancle-loading');
      
              const quotedraftOrderId = button;
      
              const parent = removebtnEle.closest('.main_account_quotehistory');
              let canclequotetags = parent.querySelector('.main_account_quoteitem input[name="quotealltag"]').value;
      
              canclequotetags = canclequotetags.replace(/Issued|Open|Submitted|Unissued|Accepted|issued|open|submitted|unissued|accepted|Active|active/g, '').trim();
              canclequotetags = canclequotetags.replace(/,\s*,/g, ', ').replace(/^\s*,|,\s*$/g, '').trim();
              canclequotetags += ", Closed";
              $.ajax({
                  url: 'https://draftapi.usarollerchain.com/delete_draft_order.php',
                  type: 'POST',
                  data: {
                      draft_order_id: quotedraftOrderId,
                      newtag: canclequotetags
                  },
                  success: function(response) {
                      const result = JSON.parse(response);
                      if (result.status === 'success') {
                        removebtnEle.classList.remove('cancle-loading');
                          window.location.reload();
                      } else {
                        removebtnEle.classList.remove('cancle-loading');
                      }
                  },
                  error: function(xhr, status, error) {
                      // console.error('AJAX error:', status, error);
                      removebtnEle.classList.remove('cancle-loading');
                  }
              });
              closeModal();
          });
      }
  
    
});


