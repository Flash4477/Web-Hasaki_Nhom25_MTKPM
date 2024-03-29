const ServiceClinic = {
    spaClinic : function (obj) {

    }

};
function hiddenBlockLocal() {
    $('#top_bar_hasaki .block_local').removeClass('show_content');
}
function hiddenBlockAddress() {
    $('#top_bar_hasaki #block_input_chance_add').removeClass('show_box');
    $('#top_bar_hasaki .block_local').removeClass('show_content');
}
function showFormChangeAddress (){
    $('#block_input_chance_add').addClass('show_box');
}
$(function () {
    getFlashDeal();
    $('.sub_item_menu').hover(function() {
            if ($(this).find('.conten_hover_submenu').length > 0){
                $('#sub_menu_web').css('width','800px');
                $(this).addClass('hovermenu');
                $(this).children('.conten_hover_submenu').stop(true, true).fadeIn(100);
            }
        },
        function(){
            if ($(this).find('.conten_hover_submenu').length > 0){
                $('#sub_menu_web').css('width','auto');
                $('.conten_hover_submenu').stop(true, true).fadeOut(300);
                $('.sub_item_menu').removeClass('hovermenu');
            }
        }
    );
    $('#text_doidiachi').click(function(){
        showFormChangeAddress();
    });
    $('.parent_submenu').click(function(){
        $(this).parents('.item_menu_site').addClass('show_submenu');
    });
    $('.back_sub_menu').click(function(){
        $(this).parents('.item_menu_site').removeClass('show_submenu');
    });
    /*$('#top_bar_hasaki .item_local_user').click(function () {
        if ($(this).parents('.block_local').hasClass('show_content')) {
            $(this).parents('.block_local').removeClass('show_content');
        }
        else{
            console.log($(this).parents('.block_local'))
            $(this).parents('.block_local').addClass('show_content');
        }
    });*/
    $('#slider_item_big_top').find('.flexslider').flexslider({
        animation: "slide",
        animationLoop: true,
        pagination: true,
        itemMargin: 0,
        slideshowSpeed: 15000,
    });
    $('#v4_flash_sale').find('.flexslider').flexslider({
        animation: "slide",
        animationLoop: true,
        itemWidth: 220,
        pagination: true,
        itemMargin: 10,
        slideshowSpeed: 15000,
    });
    $('#box_danhmuc').find('.flexslider').flexslider({
        animation: "slide",
        animationLoop: true,
        itemWidth: 124,
        pagination: true,
        itemMargin: 10,
        slideshowSpeed: 15000,
    });
    $('#list_right_thuonghieu').find('.flexslider').flexslider({
        animation: "slide",
        animationLoop: true,
        itemWidth: 191,
        pagination: true,
        itemMargin: 20,
        slideshowSpeed: 15000,
    });
    $('#list_left_thuonghieu').find('.flexslider').flexslider({
        animation: "slide",
        animationLoop: true,
        pagination: true,
        slideshowSpeed: 15000,
    });

    $('#box_hotsale_v2').find('.flexslider').flexslider({
        animation: "slide",
        animationLoop: true,
        itemWidth: 190,
        pagination: true,
        itemMargin: 15,
        slideshowSpeed: 15000,
    });
    $('#box_daxem').find('.flexslider').flexslider({
        animation: "slide",
        animationLoop: true,
        itemWidth: 100,
        pagination: true,
        itemMargin: 15,
        slideshowSpeed: 15000,
    });
    callSliderSpa();
});
function callSliderSpa() {
    $('.tabSpa .list-item').find('.flexslider').flexslider({
        animation: "slide",
        animationLoop: true,
        itemWidth: 225,
        pagination: true,
        itemMargin: 15,
        slideshowSpeed: 15000,
    });
    $('.tabSpa .banners').find('.flexslider').flexslider({
        animation: "slide",
        animationLoop: true,
        pagination: true,
        itemMargin: 0,
        slideshowSpeed: 15000,
    });
    $('.tabSpa .list-item-price').find('.flexslider').flexslider({
        animation: "slide",
        animationLoop: true,
        pagination: true,
        itemMargin: 0,
        slideshowSpeed: 15000,
    });
}
function loadSuggestions() {
    var sku = '';
    $('#box_goiy_choban_v4').find('.item_sp_hasaki a:nth-child(2)').each(function () {
        sku += '&ids[]=' + $(this).data('product');
    });
    $.ajax({
        url: '/ajax?api=product.getSuggestHomev4' + sku,
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
                    var itemHtml = $('<div>').addClass('item_goiy col-lg-2 col-md-3 col-sm-4');
                    // var childHtml = $('<div>').addClass('ProductGridItem__item');
                    itemHtml.append(value);
                    itemHtml.append(itemHtml);
                    $('#box_goiy_choban_v4 .items_v4').append(itemHtml);
                });
            }
            hideLoading();
            new LazyLoad();
        }
    }).always(function () {
        hideLoading();
    });
}
function loadNow2h() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let no_cache = urlParams.get('no_cache');
    let clearCache = '';
    if (no_cache !== null){
        clearCache = "&no_cache="+no_cache
    }
    var sku = '';
    $('#box_goiy_choban_v4').find('.item_sp_hasaki a:nth-child(2)').each(function () {
        sku += '&ids[]=' + $(this).data('product');
    });
    $.ajax({
        url: '/ajax?api=product.getNow2h' + sku + clearCache,
        type: 'GET',
        async: false,
        dataType: 'json',
        beforeSend: function () {
            showLoading();
        },
        success: function (res) {
            new LazyLoad();
            if(!res.data) {
                $('.view_all_goiy').hide();
            } else {
                $.each(res.data, function(index, value) {
                    var itemHtml = $('<div>').addClass('item_goiy col-lg-2 col-md-3 col-sm-4');
                    // var childHtml = $('<div>').addClass('ProductGridItem__item');
                    itemHtml.append(value);
                    itemHtml.append(itemHtml);
                    $('#box_goiy_choban_v4 .items_v4').append(itemHtml);
                });
            }
            hideLoading();
            // new LazyLoad();
        }
    }).always(function () {
        hideLoading();
    });
}


$(window).on('load', function () {
    new LazyLoad();
    topSale();
    topSearch();
    watched();
    suggestionWidgets();
    window.pageGtmHsk.getFlashDeal();
});

function topSearch() {
    const targetElement = $("#box_danhmuc")[0];
    let elements = '#box_top_search_v2_ajax';
    getWidgetsBlock(targetElement, elements, 'topSearch').then(function (data) {
        $(elements).html(data);
        new LazyLoad();
    });
}

function topSale() {
    const targetElement = $("#box_danhmuc")[0];
    let elements = '#box_hotsale_v2_ajax';
    getWidgetsBlock(targetElement, elements, 'topSale').then(function (data) {
        $(elements).html(data);
        $('#box_hotsale_v2').find('.flexslider').flexslider({
            animation: "slide",
            animationLoop: true,
            itemWidth: 190,
            pagination: true,
            itemMargin: 15,
            slideshowSpeed: 15000,
        });
        new LazyLoad();
    });
}

function watched() {
    const targetElement = $("#box_top_search_v2_ajax")[0];
    let elements = '#box_daxem_ajax';
    getWidgetsBlock(targetElement, elements, 'watched').then(function (data) {
        $(elements).html(data);
        $('#box_daxem').find('.flexslider').flexslider({
            animation: "slide",
            animationLoop: true,
            itemWidth: 100,
            pagination: true,
            itemMargin: 15,
            slideshowSpeed: 15000,
        });
        new LazyLoad();
        window.pageGtmHsk.getHomeViewed();
    })
}

function suggestionWidgets(){
    const targetElement = $("#box_dichvuphongkham_v2")[0];
    let elements = '#box_goiy_choban_ajax';
    getWidgetsBlock(targetElement, elements, 'suggestions').then(function (data) {
        $(elements).html(data);
        window.pageGtmHsk.getHomeSuggestions();
        new LazyLoad();
    })
}

function getWidgetsBlock(targetElement, elements, block){
    return new Promise((resolve, reject) => {
        let hasLoadedContent = false;
        function handleScroll() {
            if (!hasLoadedContent && targetElement !== undefined){
                isElementInViewport(targetElement).then(function () {
                    new LazyLoad();
                    const queryString = window.location.search;
                    const urlParams = new URLSearchParams(queryString);
                    let no_cache = urlParams.get('no_cache');
                    let clearCache = '';
                    if (no_cache !== null){
                        clearCache = "&no_cache="+no_cache
                    }
                    $.ajax({
                        async: true,
                        type: 'GET',
                        url: '/ajax?api=homeV4.getBlock'+clearCache,
                        data: {
                            'type' : block
                        },
                        dataType: 'json',
                        beforeSend: function () {
                            loadding(elements);
                        },
                        success: function (response) {
                            if (response.error == 0) {
                                let data = JSON.parse(response.data);
                                resolve(data);
                            }
                        },
                        error: function () {},
                        complete: function () {}
                    });

                });
                hasLoadedContent = true;
            }
        }
        window.addEventListener("scroll", handleScroll);
    });
}
function loadding(el) {
    if ($('#loadding_hasaki').length <= 0){
        $htmlLoading =  "<div style=\"padding: 30px; text-align: center;\">\n" +
            "<div id=\"loadding_hasaki_new\">\n" +
            "<div class=\"loading_new\"></div>\n" +
            "<img src=\"images/graphics/loadding_hasaki.png\">\n" +
            "</div>\n" +
            "</div>";
        $(el).html($htmlLoading);
    }

}
function isElementInViewport(element) {
    return new Promise((resolve, reject) => {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting || entry.boundingClientRect.top <= 0) {
                    resolve(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {});
        observer.observe(element);
    });
}
$(document).ready(function() {

    $('#box_dichvuphongkham_v2 .clinicTitle').click(function () {
        let type = $(this).data('type');
        if ($(this).parents('li').hasClass('active') === true){
            return;
        }
        new LazyLoad();
        showLoadingClinic();
        getAjaxBlock(type).then(function (data) {
            $('.tabSpa').html(data);
            callSliderSpa();
            new LazyLoad();

        })
    });

    $('#box_goiy_choban_ajax').on('click', '#box_goiy_choban .suggestionsTab', function() {
        if ($(this).hasClass('active') === true){
            return;
        }
        $('#box_goiy_choban .suggestionsTab').removeClass('active');
        let type = $(this).data('type');
        $(this).addClass('active');
        $htmlLoading =  "<div style=\"padding: 30px; text-align: center;\">\n" +
            "<div id=\"loadding_hasaki_new\">\n" +
            "<div class=\"loading_new\"></div>\n" +
            "<img src=\"images/graphics/loadding_hasaki.png\">\n" +
            "</div>\n" +
            "</div>";
        $('.list_goiy_choban').html($htmlLoading);

        getAjaxBlock(type).then(function (data) {
            $('.list_goiy_choban').html(data);
            if (type == 'hasakiNow'){
                window.pageGtmHsk.getHomeNow2h();
            }
            new LazyLoad();

        });
    });
    // $('#box_goiy_choban .suggestionsTab').click(function () {
    //
    // })

    // $('.view_more_goiy').click(function () {
    //     var offset = $('#box_goiy_choban .item_goiy').length;
    //     loadSuggestions(offset);
    // });
});
$(document).on('click', '.view_more_goiy', function(){
    var offset = $('#box_goiy_choban .item_goiy').length;
    loadSuggestions();
});

$(document).on('click', '.view_more_2h', function(){
    loadNow2h();
});
function getAjaxBlock(block = null) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let no_cache = urlParams.get('no_cache');
    let clearCache = '';
    if (no_cache !== null){
        clearCache = "&no_cache="+no_cache
    }
    return  new Promise((resolve, reject) => {
        new LazyLoad();
        $.ajax({
            async: true,
            type: 'GET',
            url: '/ajax?api=homeV4.getClinic'+clearCache,
            data: {
                'type' : block
            },
            dataType: 'json',
            beforeSend: function () {
            },
            success: function (response) {
                if (response.error == 0) {
                    let data = JSON.parse(response.data);
                    resolve(data);
                }
            },
            error: function () {},
            complete: function () {

            }
        });
    });
}


function showLoadingClinic() {
    $htmlLoading =  "<div style=\"padding: 30px; text-align: center;\">\n" +
        "<div id=\"loadding_hasaki_new\">\n" +
        "<div class=\"loading_new\"></div>\n" +
        "<img src=\"images/graphics/loadding_hasaki.png\">\n" +
        "</div>\n" +
        "</div>";

    $('.tabSpa').html($htmlLoading)
}
function hideLoadingClinic() {
    $('.tabSpa').html("")
}
function getFlashDeal() {
    getAjaxBlockFlasDeal()
}

function getAjaxBlockFlasDeal(block = null) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let no_cache = urlParams.get('no_cache');
    let clearCache = '';
    if (no_cache !== null){
        clearCache = "&no_cache="+no_cache
    }
    $.ajax({
        url: '/ajax?api=homeV4.getFlashDealV4'+clearCache,
        type: 'GET',
        async: true,
        dataType: 'json',
        beforeSend: function () {
            // showLoading();
        },
        success: function (res) {
            if(!res.data) {
                // $('.view_all_goiy').hide();
            } else {
                // resolve(res.data);
                $('#v4_flash_sale .box_load').html('');
                $.each(res.data, function(index, value) {
                    var itemHtml = $('<li>');
                    itemHtml.append(value);
                    itemHtml.append(itemHtml);
                    $('#v4_flash_sale ul.slides').append(itemHtml);
                });
                $('#v4_flash_sale').find('.flexslider').flexslider({
                    animation: "slide",
                    animationLoop: true,
                    itemWidth: 220,
                    pagination: true,
                    itemMargin: 10,
                    slideshowSpeed: 15000,
                });
            }
            // hideLoading();
            new LazyLoad();
        }
    }).always(function () {
        // hideLoading();
    });

}
;