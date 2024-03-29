function isPhone(phoneInput){
    const telephonePattern = /^09[0-9]{8}$|^01[0-9]{9}$|^08[0-9]{8}$|^07[0-9]{8}$|^03[0-9]{8}$|^05[0-9]{8}$/;
    if (!telephonePattern.test(phoneInput)) {
        return false;
    }
    return true;
}
function isEmail(emailInput){
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (!emailPattern.test(emailInput)) {
        return false;
    }
    return true;
}
function handleChangeUserName(e) {
    var that = $(e);
    var username = that.val();
    var isDisabled = true;
    var buttonSend = $(that.attr('rel'));
    if (isEmail(username) || isPhone(username)) {
        isDisabled = false
    }
    buttonSend.prop("disabled", isDisabled);
    if(!isDisabled) {
        buttonSend.removeClass('hidden');
        buttonSend.prev().addClass('hidden');        
    }
}
var timer;
var intervalID;
function startTimer(duration, display, callback) {
    timer = duration;
    var minutes, seconds;
    intervalID = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        display.text(minutes + ":" + seconds);

        if (--timer < 0) {
            callback();
            window.clearTimeout(timer);
            timer = duration;
        }
    }, 1000);
}
function countDown(timeResend, elCountDown) {
    clearInterval(intervalID);
    startTimer(timeResend, elCountDown, () => {
        window.clearTimeout(timer);
        clearInterval(intervalID);
        $(elCountDown).next().removeClass('hidden').prop("disabled", false);
    });
}
function handleVerify(e, isRegisterPage = false) {
    var that = $(e);
    var username = $(that.attr('rel')).val();
    if(!isEmail(username) && !isPhone(username)) {
        return;
    }
    that.prop("disabled", true);
    var elementShowMessage = that.data("error");
    $(elementShowMessage).removeClass('hidden alert alert-success alert-danger');
    $.ajax({
        url: '/ajax?api=user.verifyUserName&username=' + username,
        type: 'GET',
        dataType: 'json',
        beforeSend: function () {
            if(isRegisterPage) {
                showLoading();
            } else {
                $('#lg_register .loading_lb').show();
            }
        },
        success: function(res) {
            if(isRegisterPage) {
                hideLoading();
            } else {
                $('#lg_register .loading_lb').hide();
            }
            let data = res.data || {
                next_time: undefined,
                next_time_text: undefined
            };
            let next_time = data.next_time || (data.next_time != undefined ? 600 : 0);
            let classMessage;
            if (res.error) {
                classMessage = 'alert-danger';
            } else {
                classMessage = 'alert-success';
            }
            $(elementShowMessage)
                .addClass('alert ' + classMessage)
                .text(res.message);
            if(next_time > 0) {
                let next_time_text = data.next_time_text;
                let elCountDown = that.prev();
                elCountDown.attr('data-resend-time', next_time);
                next_time_text ? elCountDown.text(next_time_text) : null;
                elCountDown.removeClass('hidden');
                that.addClass('hidden')
                countDown(next_time, elCountDown, that);
            } else {
                that.prop("disabled", false).removeClass('hidden');
            }
        }
    }).always(function() {            
    });
    
}
function imgError(ele, image = null) {
    ele.onerror = "";
    ele.src = image ? image : "/img/placeholder.svg";
    return true;
}
function offImageRatingError() {
    $(".item_image_customer img").each(function(){ 
        var image = $(this); 
        if(image[0].naturalWidth == 0){  
        image.parent().unbind("error").hide();
        } 
    }); 
}
function showmenu(){
    $('body').addClass('showmenu');
}
function hidemenu(){
    $('body').removeClass('showmenu');
}
function hiddenBlockLocal() {
    $('#top_bar_hasaki .block_local').removeClass('show_content');
    $('.input_change_address').hide();
}
$(document).mouseup(function(e){
    var container = $("#top_bar_hasaki .main_block_local, #top_bar_hasaki .block_local");    
    if (!container.is(e.target) && container.has(e.target).length === 0 )
    {
        $('#top_bar_hasaki .block_local').removeClass('show_content');
    }    
    var containerSearch = $("#search, #block_suggest_search, #search_mobile_input, #block_suggest_search_mb");    
    if (!containerSearch.is(e.target) && containerSearch.has(e.target).length === 0 )
    {
        $(".block_suggest_search").hide();//
        //
        $('.v3_block_search_header').removeClass('show_susgest_data')
    }
})
function renderKeywordsSearchHistory() {
    return;
    var suggestion = '#suggestion_history';
    var suggestionElement = $(suggestion);
    var limitItem = suggestionElement.data('limit-items');
    var elementHistory = suggestionElement.find('.item_text_search');
    if(elementHistory.length !== 0) {
        var showContent = suggestionElement.hasClass('show_content');
        var hasProductListShow = $('#suggestion_products').is(':visible');
        elementHistory.each(function(index) {
            if(
                hasProductListShow === false && (index < limitItem || showContent)
            ) $(this).show(); else $(this).hide();
        }); 
    } else {
        suggestionElement.hide();
    }    
}
function icon_del_search(_keyword, parentItemId) {
    var searchJson = localStorage.getItem('str_history_search');   
    var parentDelete = '#'+parentItemId;
    var positionDelete = $(parentDelete).attr('rel');
    $(parentDelete).remove();
    var searchArr = JSON.parse(searchJson);
    if(Array.isArray(searchArr)) {
        var searchData = [];
        searchArr.forEach(function(item, index) {
            if(positionDelete != index) {
                searchData.push(item);
            }
        });
        var numSearch = searchData.length;
        if(numSearch === 0){
            $(parentDelete).parent().remove();
        } else if (numSearch <= 3) {
            $('.block_text_view_more').remove()
        }
        renderKeywordsSearchHistory();
        localStorage.setItem('str_history_search', JSON.stringify(searchData));
    }
};
$(document).on('click', '.btnChangeOrderGift', function () {
    var ruleId = $(this).data('rule-id');
    var elementParent = $('.cart_bonus');
    if($('.btnChangeOrderGift[data-rule-id="'+ruleId+'"]', elementParent).length > 1) {
        $('.btnChangeOrderGift[data-rule-id="'+ruleId+'"]', elementParent).prop('checked', false);
    }
    $(this).prop('checked', true);
});
$(document).on('change', '.btnChangePromotion1', function() {
    $('.btnChangePromotion1').prop('checked', false);
    $(this).prop('checked', true);
    let promotionId = $(this).data('promotion-id');
    let productId = $(this).val();
    // Send update product gift
});
$(document).on('click', '.btnRepaySpa', function () {
    var  orderCode = $(this).data().order;
    $.get("/ajax?api=cart.getVnPayTransRepaySpa&order_code=" + orderCode, function (data, status) {
        if (status === "success" && data.error === 0) {
            window.location.href = data.data;
        } else {
            alert(data.message);
            return false;
        }
    });
});
$(document).on('click', '.order_repurchase', function () {
    var that = $(this);
    var products = that.data("products");
    $.ajax({
        async: true,
        type: 'POST',
        url: that.data("href"),
        data: {
            products,
        },
        dataType: 'json',
        beforeSend: function () {
            // showLoading();
        },
        success: function (response) {
            hideLoading();
            if (response.error == 0) {
                location.href = '/checkout/cart';
            } else if(response.message != ''){
                showAlert('', response.message, 'danger');
            }
        },
        error: function () {},
        complete: function () {}
    });
});
function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return typeof sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
};
function getOrders(params) {
    var link = location.pathname;
    link += '?'+params;
    $.ajax({
        async: true,
        type: 'GET',
        url: link,
        dataType: 'json',
        beforeSend: function () {
            showLoading();
        },
        success: function (response) {
            hideLoading();
            if (response.error == 0) {
                var {filtersHtml = null , ordersHtml = null, pagingHtml = null} = response.data;
                $('#container-filters').html(filtersHtml);
                $('#container-list-orders').html(ordersHtml);
                $('#order-paging').html(pagingHtml);
            } else if(response.message != ''){
                showAlert('', data.message, 'danger');
            }
        },
        error: function () {},
        complete: function () {}
    });
}
$(document).on('click', '._order_filler_status', function () {
    var that = $(this);
    if(that.hasClass('active')) return false;
    var filter_status = that.data('filter_status');
    var type = getUrlParameter('type');
    var params = $.param({filter_status, type});
    getOrders(params)

});
$(document).on('click', '._order_filler_times', function () {
    var that = $(this);
    if(that.parent().hasClass('active')) return false;
    var filter_time = that.data('filter_time');
    var type = getUrlParameter('type');
    var params = $.param({filter_time, type});
    getOrders(params);
});
$(document).on('click', '#orders-page .page-link', function () {
    var that = $(this);
    if(that.parent().hasClass('active')) return false;
    var page = that.data('page');
    if(!page) return false;
    var statusActiveElement = $('._order_filler_status.active');
    var timeActiveElement = $('.active ._order_filler_times');
    var filter_status = statusActiveElement.data('filter_status');
    var filter_time = timeActiveElement.data('filter_time');
    var type = getUrlParameter('type');
    var params = $.param({filter_time, filter_status, type, page});
    getOrders(params);
});
$(document).on('click', '._btnAddFollowBrand', function() {
    var el = $(this);
    var checkLogin = isLogin();
    if (checkLogin == false) {
        if (isMobile) {
            var currentUrl = location.href;
            location.href = '/customer/account/login/?ref1=' + currentUrl;
        } else {
            showLoginPopup();
            return false;
        }
    }
    var brandId = el.data().id;
    var followed = el.attr('data-followed');
    followed = parseInt(followed);
    $.ajax({
        async: true,
        type: 'POST',
        url: '/ajax?api=brand.addFollow',
        data: {
            brand_id: brandId,
            followed: followed,
        },
        dataType: 'json',
        beforeSend: function () {
            showLoading();
        },
        success: function(data, status) {
            if (status == 'success' && data.error == 0) {
                var newFollowed = followed ? 0 : 1;
                $('._btnAddFollowBrand')
                    .removeClass('btn_site_1, btn_site_2')
                    .addClass(newFollowed ? 'btn_site_1': 'btn_site_2')
                    .attr('data-followed', newFollowed);
                $('.state_follow').text(data.data);
                var numFollow = $('.count_follow').text() ? parseInt($('.count_follow').text()) : 0;
                $('.count_follow').html(numFollow + (followed ? -1 : 1));
                showAlert('', data.message, 'success');
            } else if (data.message != '') {
                showAlert('', data.message, 'danger');
            }
            hideLoading();
        },
        error: function() {
            hideLoading();
        }
    });
});
function stores(ele) {
    this.container = ele;
    this.provinceElement = $('select[name="province"]');
    this.districtElement = $('select[name="district"]');
    this.yourCurrentAddress = $('.your_current_address');
    this.inputChangeAddress = $('.input_change_address');
    this.wardElement = $('select[name="ward"]');
    $(this.provinceElement, this.container).on( "change",() => {
        this.addresses(this.districtElement, '_getDistricts', {province_id: this.provinceElement.val()});
    });
    $(this.districtElement, this.container).on( "change",() => {
        if (typeof params == "undefined") {
            var params = {};
            params.district_id = this.provinceElement.val();
        }
        this.addresses(this.wardElement, '_getWards', {district_id: this.districtElement.val()});
    });
    $('.toggle_address', this.container).on( "click",() => {
        if(this.inputChangeAddress.is(':visible')) {
            this.inputChangeAddress.hide();
        } else {
            this.inputChangeAddress.show();
            if (this.provinceElement.find('option').length <= 1) {
                this.addresses(this.provinceElement, '_getProvinces');
            }
        }
    });
    $('.btn_save_location', this.container).on( "click",() => {
        var parentInput = $('.input_change_address');
        var provinceElement = $('select[name="province"]', parentInput);
        var districtElement = $('select[name="district"]', parentInput);
        var wardElement = $('select[name="ward"]', parentInput);

        provinceElement.parent().removeClass('has-error').find('.help-block').remove();
        districtElement.parent().removeClass('has-error').find('.help-block').remove();
        wardElement.parent().removeClass('has-error').find('.help-block').remove();

        var provinceValue = provinceElement.val();
        var districtValue = districtElement.val();
        var wardValue = wardElement.val();

        var isValidate = true;

        if(provinceValue == '' || provinceValue == null){
            provinceElement.parent().addClass('has-error').append('<span id="fullName-error" class="help-block">Vui lòng chọn khu vực</span>');
            isValidate = false;
        }
        if(districtValue == '' || districtValue == null){
            districtElement.parent().addClass('has-error').append('<span id="fullName-error" class="help-block">Vui lòng chọn quận/ huyện</span>');
            isValidate = false;
        }
        if(wardValue == '' || wardValue == null){
            wardElement.parent().addClass('has-error').append('<span id="fullName-error" class="help-block">Vui lòng chọn phường/ xã</span>');
            isValidate = false;
        }
        if(isValidate == false){
            return false;
        }
        this.submitAddress(true);
    });
    this.addresses = function(ele, action, params) {
        var loadLocation = this.loadLocation;
        $.ajax({
            type: 'GET',
            url: '/ajax?api=address.' + action,
            data: params,
            dataType: 'json',
            beforeSend: function () {

            },
            success: function (response, status) {
                hideLoading();
                if (status == 'success' && response.error == 0) {
                    loadLocation(ele, response);
                } else if(response.message != ''){
                    showAlert('', response.message, 'danger');
                }
            },
            error: function () {},
            complete: function () {}
        });
    }
    this.loadLocation = function(ele, response) {
        ele.find('option').not(':first').remove();
        var response = response.data;
        $(ele).chosen("destroy");
        $.each( response.list, function(id, name) {
            ele.append('<option value="' + id + '">' + name + '</option>');
        });
        $(ele).chosen({width: "100%"});
    }
    this.loadListStoresByWard = function() {
        var ward_id = this.wardElement.val();
        var district_id = this.districtElement.val();
        var product_id = $('input[name="productId"]') && $('input[name="productId"]').val() || 0;
        this.ajax({func: 'user.stores', ward_id, district_id, product_id}, (response) => {
            window.location.reload();
            // var {user_stores = null, product_stores = null} = response.data || {};
            // $('.list_stores').html(user_stores);            
            // if(product_stores) {
            //     $('.block_store_quaility').remove();
            //     $( ".box-tocart .actions" ).prepend( product_stores );
            // }
        })
    }
    this.ajax = function (params, callBack) {
        var {func = ''} = params;
        $.ajax({
            type: 'GET',
            url: '/ajax?api=' + func,
            dataType: 'json',
            data: params,
            beforeSend: function () {

            },
            success: function (response, status) {
                hideLoading();
                callBack(response);
            },
            error: function () {},
            complete: function () {}
        });
    }
    this.submitAddress = function () {
        var province_id = this.provinceElement.val();
        var district_id = this.districtElement.val();
        var ward_id = this.wardElement.val();
        var provinceName;
        var districtName;
        var wardName;
        var address;
        $('option', this.provinceElement).each(function () {
            if ($(this).val() == province_id) {
                provinceName = $(this).text();
            }
        });
        $('option', this.districtElement).each(function () {
            if ($(this).val() == district_id) {
                districtName = $(this).text();
            }
        });
        $('option', this.wardElement).each(function () {
            if ($(this).val() == ward_id) {
                wardName = $(this).text();
            }
        });
        if (wardName && districtName && provinceName) {
            address = `${wardName}, ${districtName}, ${provinceName}`;            
            this.yourCurrentAddress.html(address);
            this.inputChangeAddress.hide();
            this.loadListStoresByWard();
        }
    }
}
function showComboInfoV2(productId) {
    $.get("/ajax?api=product.getComboInfo&is_v2=true&id=" + productId, function(data, status){
        if(status == "success" && data.error == 0){
            $('.block_tach_combo').remove();
            $('.block_gop_combo').remove();
            $('.box-tocart > div').append(data.data);
        }
    });
}
$(document).on('click', '.block_expand_address', function () {
    var parentElement = $(this).parents();
    if($(this).parents('.box_address_footer').hasClass('expand_address_gd')){
        parentElement.removeClass('expand_address_gd');
        $(this).html('Xem tất cả chi nhánh Hasaki');
    } else {
        parentElement.addClass('expand_address_gd');
        $(this).html('Xem thu gọn địa chỉ');
    }
})
function onclickMenu(link) {
    if ($('#main_menu_site .show_submenu').length > 0) {
        location.href = link;
    }
}
function countDownDeal() {
    var listIntervalDealProcessHome = [];
    listIntervalDealProcessHome.forEach(clearInterval);
    $(".timmer_deal_brand").each(function (e) {
        var el = $(this);
        var now = parseInt(el.data().now);
        var countDownDate = parseInt(el.data().date);
        var x = setInterval(function () {
            var elTimer = el;
            var distance = countDownDate - now;
            // Time calculations for days, hours, minutes and seconds
            var days = Math.floor(distance / (60 * 60 * 24));
            var hours = Math.floor((distance % (60 * 60 * 24)) / (60 * 60));
            var minutes = Math.floor((distance % ( 60 * 60)) / ( 60));
            var seconds = Math.floor(distance % 60);

            // Display the result in the element with id="demo"

            if (hours < 10) {
                hours = '0' + hours;
            }
            if (minutes < 10) {
                minutes = '0' + minutes;
            }
            if (seconds < 10) {
                seconds = '0' + seconds;
            }
            elTimer.find('.days').html(days);
            elTimer.find('.hour').html(hours);
            elTimer.find('.minute').html(minutes);
            elTimer.find('.second').html(seconds);
            if (distance < 0) {
                clearInterval(x);
                elTimer.parent().html('Deal đã hết hạn');
            }
            now = now + 1;

            listIntervalDealProcessHome.push(x);
        }, 1000);
    });
}
function hskTopCampaign(){
    if(isWebView === 1 || $('.page-campaign,.brand-page-shop').length > 0 || (ignoreAjax !== undefined && ignoreAjax === 1)) {
        $("body").addClass('no_banner_top');
        $("#top-bar-banner").remove();
        return false;
    }
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let noCache = urlParams.get('no_cache');
    let clearCache = "";
    if (noCache !== null && noCache == 1){
        clearCache = '&no_cache='+ noCache;
    }
    $.get("/ajax?api=campaign.getTopBarBanner"+clearCache, function(data, status){
        if(data.error == 0){
            if(data.data == null) {
                $("body").addClass('no_banner_top');
                $("#top-bar-banner").remove();
            } else {
                $("body").removeClass('no_banner_top');
                $("#top-bar-banner").show().html(data.data);
                // $('#top_bar_hasaki').css("padding-top", "139px");
                // $('#v3_header').css({"top": "0"});                
                // $('#v3_banner_site').css({"margin-top": "62px"});                
                // $('#breadcrumb').css("margin-top", "62px");
                // $('.brand-page-brandChild #breadcrumb').css({"margin-top":"62px", "margin-bottom":"0","padding-top":"10px"});
                // $('#section_menu_site').css("padding-top", "52px");
                // // $('.box-menu.fixed_top').css("padding-top", "101px");
                // $('#v3_wrapper_container').css('padding-top', '14px');
                // $('.brand-page-shop #v3_wrapper_container').css('padding-top', '50px');                
                // $('.is-mobile.brand-page-shop #v3_wrapper_container').css('padding-top', '0px');
                // $('.desktop-v2.module-user #v3_wrapper_container').css("padding-top", "50px");
                // $('.desktop-v2.module-user.loyalty-page #v3_wrapper_container').css("padding-top", "0px");
                // $('.desktop-v2.booking-page #v3_wrapper_container').css("padding-top", "48px");
                // $('.index-page-deal #v3_wrapper_container').css('padding-top', '52px');
                // $('.desktop-v2.checkout-page #v3_wrapper_container').css({"padding-top": "80px"});
            }
        }
    });
}
(function($) {
    $.fn.inputFilter = function(inputFilter, format = true) {
        return this.on("input change keydown keyup mousedown mouseup select contextmenu drop", function() {
            if($(this).prop('disabled')) return false;
            var tmp = this.value;
            if(format) {
                tmp = tmp.replace(/,/g, '');
                tmp = tmp.replace(/\./g, '');
                if(tmp >= 1000) {
                    tmp = number_format(tmp).replace(/,/g, '.');
                }
            }
            this.value = tmp;
            $(this).attr('data-val', this.value);
            if (inputFilter(tmp, $(this))) {
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                this.value = this.oldValue;
                $(this).attr('data-val', this.oldValue);
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            } else if($(this).attr('max')) {
                this.value = parseInt($(this).attr('max'));
            } else if($(this).attr('min')) {
                this.value = parseInt($(this).attr('min'));
            } else {
                this.value = '';
            }
        });
    };
}(jQuery));
$(document).on('click', '.search_price', function() {
    var priceFrom = $('.filter__input_from').val();
    var priceTo = $('.filter__input_to').val();
    if(priceFrom) {
        priceFrom = priceFrom.replace(/\./g, '');
        priceFrom = parseInt(priceFrom);
    }
    if(priceTo) {
        priceTo = priceTo.replace(/\./g, '');
        priceTo = parseInt(priceTo);
    }
    var queryParams = new URLSearchParams(window.location.search);
    if(priceFrom || priceTo) {
        var rangePrice = priceFrom+'-'+priceTo;
        if(priceFrom > 0 && priceTo >= 0 && priceTo < priceFrom) {
            rangePrice = priceTo+'-'+priceFrom;
        }
        queryParams.set("price", rangePrice);
    }
    if(queryParams.toString()) {
        history.replaceState(null, null, "?"+queryParams.toString());
        window.location.reload();
    }
});
$(function () {
    $('#search_mini_form,#search_mini_form_mb').submit(function (event) {
        event.preventDefault();
        showLoading();
        var keyword = $('input[name="q"]',this).val();
        $.ajax({
            type: 'GET',
            url: '/ajax?api=search.query&q='+encodeURIComponent(keyword),
            dataType: 'json',
            beforeSend: function () {
                showLoading();
            },
            success: function (response, status) {
                hideLoading();                    
                var {is_redirect = false, url = null} = response.data;
                var searchUrl = url;
                if(typeof dataLayer != 'undefined' && dataLayer) {
                    dataLayer.push({
                        'event': 'siteSearch',
                        'category' : 'Site search',
                        'action' : is_redirect ? 'Keyword mapping' : 'Not keyword mapping',
                        'label': getCookie('HASAKI_SESSID') + ' >>> ' + keyword + ' >>> ' + searchUrl
                    })
                }
                
                function findIndexByProperty(data, key, value) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i][key] == value) {
                            return i;
                        }
                    }
                    return -1;
                }
                var historySearch = localStorage.getItem('str_history_search') ? JSON.parse(localStorage.getItem('str_history_search')) : [];                    
                var keywordIndex = findIndexByProperty(historySearch, 'title', keyword);
                var updatedKeyword = {title: keyword, url: searchUrl};
                if (keywordIndex > -1) {
                    historySearch[keywordIndex] = updatedKeyword;
                } else {
                    historySearch.unshift(updatedKeyword);
                }
                localStorage.setItem('str_history_search', JSON.stringify(historySearch));
                location.href = searchUrl;   
                
            },
            error: function () {},
            complete: function () {}
        });
        return false;
    });
    $(".filter__input_from, .filter__input_to").inputFilter(function(value) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    });
    $(".wrap_qty .qty").inputFilter(function(value, ele) {
        if($(ele).attr('min') && parseInt($(ele).attr('min')) > value) {
            return false;
        }
        if($(ele).attr('max') && parseInt($(ele).attr('max')) < value) {
            return false;
        }
        return /^\d*$/.test(value);
    }, false);
    hskTopCampaign();
    var _stores = new stores();
    var listIntervalDealProcessHome = [];
    listIntervalDealProcessHome.forEach(clearInterval);
    if($(".timer_countdown").length > 0) {

        listIntervalDealProcessHome.forEach(clearInterval);
        $(".timer_countdown").each(function (e) {
            var el = $(this);
            var now = parseInt(el.data().now);
            var countDownDate = parseInt(el.data().date);
            if (typeof el.data().now == "undefined") {

            } else {
                var x = setInterval(function () {
                    var elTimer = el;
                    var distance = countDownDate - now;
                    // Time calculations for days, hours, minutes and seconds
                    var days = Math.floor(distance / (60 * 60 * 24));
                    var hours = Math.floor((distance % (60 * 60 * 24)) / (60 * 60));
                    var minutes = Math.floor((distance % ( 60 * 60)) / ( 60));
                    var seconds = Math.floor(distance % 60);
                    if (minutes < 10) {minutes = "0"+minutes;}
                    if (seconds < 10) {seconds = "0"+seconds;}

                    // Display the result in the element with id="demo"
                    elTimer.html("còn " + days + " ngày " + hours + ":" + minutes + ":" + seconds);

                    if (distance < 0) {
                        clearInterval(x);
                        elTimer.parent().html('Deal đã hết hạn');
                    }
                    now = now + 1;

                    listIntervalDealProcessHome.push(x);
                }, 1000);
            }
        });
    }    
    $(".timmer_deal_brand").each(function (e) {
        var el = $(this);
        var now = parseInt(el.data().now);
        var countDownDate = parseInt(el.data().date);
        var x = setInterval(function () {
            var elTimer = el;
            var distance = countDownDate - now;
            // Time calculations for days, hours, minutes and seconds
            var days = Math.floor(distance / (60 * 60 * 24));
            var hours = Math.floor((distance % (60 * 60 * 24)) / (60 * 60));
            var minutes = Math.floor((distance % ( 60 * 60)) / ( 60));
            var seconds = Math.floor(distance % 60);

            // Display the result in the element with id="demo"

            if (hours < 10) {
                hours = '0' + hours;
            }
            if (minutes < 10) {
                minutes = '0' + minutes;
            }
            if (seconds < 10) {
                seconds = '0' + seconds;
            }
            elTimer.find('.days').html(days);
            elTimer.find('.hour').html(hours);
            elTimer.find('.minute').html(minutes);
            elTimer.find('.second').html(seconds);
            if (distance < 0) {
                clearInterval(x);
                elTimer.parent().html('Deal đã hết hạn');
            }
            now = now + 1;

            listIntervalDealProcessHome.push(x);
        }, 1000);
    });
    $(document).on('click', '.login-facebook', function() {
        window.open($(this).data().href, "_blank", "width=800, height=" + $(window).height());
    });
    $(document).on('click', '.login-google', function() {
        window.open($(this).data().href, "_blank", "width=800, height=" + $(window).height());
    });
    $(document).on('click', '#suggestion_history .block_text_view_more', function() {
        var parentElement = $(this).parent();
        if (parentElement.hasClass('show_content')) {
            parentElement.removeClass('show_content');
            var more = $('<span>').addClass('text_xemthem').text('Xem thêm');
            var carret = $('<span>').addClass('icon_carret_down');
        } else {
            parentElement.addClass('show_content');
            var more = $('<span>').addClass('text_xemthem').text('Thu gọn');
            var carret = $('<span>').addClass('icon_carret_up');
        } 
        $(this).html('');
        $(this).append(more);
        $(this).append(carret);
        renderKeywordsSearchHistory();
    });
    // $("#search").focusout(function() {
        
    // })
    $('#bar_menu').click(function(){
        showmenu();
    });
    $('.mask_menu').click(function(){
        hidemenu();
    });
    $('.close_menu').click(function(){
        hidemenu();
    });
    $('.parent_submenu').click(function(){
        $(this).parents('.item_menu_site').addClass('show_submenu');
    });
    $('.back_sub_menu').click(function(){
        $(this).parents('.item_menu_site').removeClass('show_submenu');
    });
    $('#top_bar_hasaki .item_local_user').click(function () {
        if ($(this).parents('.block_local').hasClass('show_content')) {
            $(this).parents('.block_local').removeClass('show_content');
        }
        else
            $(this).parents('.block_local').addClass('show_content');
    });
    $('#slider_item_big_top').find('.flexslider').flexslider({
        animation: "slide",
        animationLoop: true,
        pagination: true,
        itemMargin: 0,
        smoothHeight: true,
        animateHeight: false,
        slideshowSpeed: 15000,
    });
    $('#box_thuonghieu_noibat .list_thuonghieu').flexslider({
        animating: false,
        animation: "slide",
        animationLoop: false,
        itemWidth: 167,
        itemMargin: 10
    });
    $('.box_flexslider').flexslider({
        animating: false,
        animation: "slide",
        animationLoop: false,
        itemWidth: 220,
        pagination: true,
        itemMargin: 0,
        slideshowSpeed: 15000,
    });    
    if($('#box_hotsale').length > 0){
        $.ajax({
            url: '/ajax/bestseller',
            type: 'GET',
            async: false,
            dataType: 'json',
            beforeSend: function () {
                showLoading();
            },
            success: function (res) {
                var box_hotsale = $('#box_hotsale');
                box_hotsale.append(res.data);
                box_hotsale.find('.flexslider').flexslider({
                    animation: "slide",
                    animationLoop: false,
                    animating: false,
                    pagination: true,
                    slideshowSpeed: 15000,
                    itemWidth: 220,
                    itemMargin: 10
                });
                hideLoading();
            }
        }).always(function () {
            hideLoading();
        });
    }
    function loadSuggestions() {
        var sku = '';
        $('#box_goiy_choban').find('.item_sp_hasaki a:nth-child(2)').each(function () {
            sku += '&ids[]=' + $(this).data('product');
        });
        $.ajax({
            url: '/ajax?api=product.getSuggestHomev2' + sku,
            type: 'GET',
            async: false,
            dataType: 'json',
            beforeSend: function () {
                showLoading();
            },
            success: function (res) {
                if(!res.data) {
                    $('.view_all_goiy').hide();
                } else {
                    $.each(res.data, function(index, value) {
                        var itemHtml = $('<div>').addClass('ProductGridItem__itemOuter');
                        var childHtml = $('<div>').addClass('ProductGridItem__item');
                        childHtml.append(value);
                        itemHtml.append(childHtml);
                        $('#box_goiy_choban .items').append(itemHtml);
                    });
                }
                hideLoading();
                new LazyLoad();
            }
        }).always(function () {
            hideLoading();
        });
    }
    if($('#box_goiy_choban').length > 0){
        loadSuggestions(0);
        $('.view_more_goiy').click(function () {
            var offset = $('#box_goiy_choban .item_goiy').length;
            loadSuggestions(offset);
        });
    }
    $(document).on('click', '.btnSubscribe', function(){
        var form = $('#formSubscribe')[0];
        var formData = new FormData(form);
        $.ajax({
            url: '/ajax/newsletterSubscribe',
            type: 'POST',
            data: formData,
            contentType: false,
            cache: false,
            processData: false,
            dataType: 'JSON',
            beforeSend: function () {
                showLoading();
            },
            success: function (res) {
                if (!res.error) {
                    showAlert('', res.message, 'success');
                } else {
                    showAlert('', res.message, 'error');
                }
                hideLoading();
            }
        }).always(function () {
            hideLoading();
        });
    });
    $(document).on('click', '.loadMoreDeals', function(){
        var that  = $(this);
        var page = $('input[name="page_deal"]').val() ? parseInt($('input[name="page_deal"]').val()) : 1;
        ++page;
        $.ajax({
            url: '/ajax?api=product.loadMoreDeals&' + (location.search && location.search.substring(1)) + '&p=' + page,
            type: 'GET',
            async: false,
            dataType: 'json',
            beforeSend: function () {
                showLoading();
            },
            success: function (res) {
                if(!res.data) {
                    that.hide();
                } else {
                    $('.list-product-category').append(res.data);
                    $('input[name="page_deal"]').val(page);
                }
                new LazyLoad();
                hideLoading();
            }
        }).always(function () {
            hideLoading();
        });
    })
    offImageRatingError();
});

$(window).on('load', function() {
    const url = new URL(window.location.href);
    if (url.hash === '#popup-register'){
        let clean_uri = url.href.substring(0, url.href.indexOf("#"));
        window.history.replaceState({}, document.title, clean_uri);
        if($('.popup-register').length > 0){
            $('.popup-register').trigger('click');
        }
    }
    if (url.hash === '#popup-login'){
        let clean_uri = url.href.substring(0, url.href.indexOf("#"));
        window.history.replaceState({}, document.title, clean_uri);
        if ($('.popup-login').length > 0){
            $('.popup-login').trigger('click');
        }
    }
})
$(document).on('click', '.block_info_item_sp, .item_shopping, .item_shopping_deal, .item_daxem, .v3_thumb_common_sp', function () {
    if (window.pageGtm) {
        $(this).parent().find('a').each(function () {
            if($(this).data('item_list_id')) {
                window.pageGtm.onClick('productClick', this);
            }
        })
    }
});
$(document).ready(function () {
    if ($('.page-campaign.campaign-template-4 select.input_info_ev.store').length > 0) {
        $.ajax({
            url: '/ajax?api=booking.getListBranch',
            type: 'GET',
            async: false,
            dataType: 'json',
            success: function(res) {
                $('.page-campaign.campaign-template-4 select.input_info_ev.store option').remove();
                $('.page-campaign.campaign-template-4 select.input_info_ev.store').append('<option value="">Chọn Chi Nhánh</option>');
                $.each( res.data, function( key, value ) {
                    let cnNumber = key + 1;
                    $('.page-campaign.campaign-template-4 select.input_info_ev.store').append('<option value="' + value.id + '">CN' + cnNumber + ' : ' + value.address + '</option>');
                });
            }
        })
    }

    if ($('#suggestion_categories').length > 0) {
        $.ajax({
            url: '/ajax?api=homecategory.getSuggestionCategories',
            type: 'GET',
            async: false,
            dataType: 'json',
            success: function(res) {
                $('#suggestion_categories').append(res.data);
                new LazyLoad();
            }
        })
    }
});
function insertParam(key, value, checked) {
    key = encodeURIComponent(key);
    value = encodeURIComponent(value);
    let queryParams = new URLSearchParams(window.location.search);
    if (checked === false && queryParams.get(key) !== null){
        let valueParam = queryParams.get(key);
        let valueRq = valueParam.split(',');
        let keyObject = Object.keys(valueRq).find(key => valueRq[key] === value);
        valueRq.splice(keyObject,1);
        if (valueRq.length <= 0){
            queryParams.delete(key);
            return queryParams.toString();
        }
        queryParams.set(key, valueRq.toString())
        return queryParams.toString();
    }
    if (queryParams.get(key)){
        let valueParam = queryParams.get(key);
        value +=','+valueParam;
        queryParams.set(key, valueParam);
    }
    queryParams.set(key, value);
    return queryParams.toString();
}
function paramsToObject(entries) {
    const result = {}
    for(const [key, value] of entries) {
        result[key] = value;
    }
    return result;
}
$(document).on('change','#catalog_filter .checkBoxFilter', function() {
    var value = this.value;
    var name = this.name;
    if (this.checked){
        $('#'+$(this).data('boxcheck')).addClass('checked');
    }else{
        $('#'+$(this).data('boxcheck')).removeClass('checked');
    }
    queryParams = insertParam(name,value, this.checked);
    let url = window.location.href;
    if( url.endsWith("?") ) {
        url = url.substring( 0, url.length-1 );
        location.href = url;
    }else{
        location.href = window.location.pathname+"?" + queryParams;
    }
});
$(document).on('change','#brand_filter .checkBoxFilter', function() {
    var value = this.value;
    var name = this.name;
    if (this.checked){
        $('#'+$(this).data('boxcheck')).addClass('checked');
    }else{
        $('#'+$(this).data('boxcheck')).removeClass('checked');
    }
    queryParams = insertParam(name,value, this.checked);
    location.href = window.location.pathname+"?" + queryParams;
    // fixUrl();
});
function getListingFilterProduct(params){
    let slug = url => new URL(url).pathname.match(/[^\/]+/g)
    params.category_slug = slug(window.location.href);
    $.ajax({
        url: "/ajax?api=product.getListingFilterProduct",
        type: "GET",
        data: JSON.stringify(params ),
        contentType: false,
        cache: false,
        processData:false,
        success: function(result)
        {
            console.log(result)
        },
        error: function()
        {
            //console.log("failed to send the data");
        }
    });
};