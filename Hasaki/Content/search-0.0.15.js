function getAjax(queryString, callBack) {
    $.ajax({
        url: '/ajax?api=search.' + queryString,
        type: 'GET',
        dataType: 'json',
        success: function (res) {
            callBack(res)
        }
    }).always(function () {
    });
}
function pushEventRedirect(ele) {
    dataLayer.push({
        'event': 'siteSearch',
        'category' : 'Site search',
        'action' : 'Keyword mapping',
        'label': getCookie('HASAKI_SESSID') + ' >>> ' + $(ele).data('keyword') + ' >>> ' + $(ele).attr('href')
    })
}
function getCategoriesByRecentProduct(callBack) {
    getAjax('getCategoriesByRecentProduct', callBack);
}
function getBrandHot(callBack) {
    getAjax('getBrandHot', callBack);
}
function renderCategoriesDefaultHtml(items) {
    var htmlItems = '<div class="block_item_suggest">';
    $.each(items, function (index, item) {
        htmlItems += '<div class="item_main_search_suggest"><a class="item" href="' + item.url + '"><div class="thumb_suggest"><img class="img-container" src="' + item.image + '" /></div><div class="info_shopping"><h2 class="title_item_shopping">' + item.label + '</h2></div></a></div>';
    });
    htmlItems += '</div>';
    return htmlItems
}
function renderBrandDefaultHtml(items) {
    var htmlItems = '';
    $.each(items, function (index, item) {
        htmlItems += '<a class="brand_item" href="' + item.url + '" title=' + item.name + '><img src="' + item.image + '" /></a>';
    })
    return htmlItems
}
(function ($) {
    var domElement = function (selector) {
        let localHistory;
        localHistory = localStorage.getItem('str_history_search') ? JSON.parse(localStorage.getItem('str_history_search')) : [];
        this.historySearch = localHistory.reduce(function (memo, e1) {
            if (!e1.url || !e1.title) {
                return memo;
            }
            var matches = memo.filter(function (e2) {
                return e1.title == e2.title;
            })
            if (matches.length == 0) {
                e1.url = e1.url.replace('/catalogsearch/result/cat', '/catalogsearch/result/?cat');
                memo.push(e1)
            }
            return memo;
        }, []);
        localStorage.setItem('str_history_search', JSON.stringify(this.historySearch));
        this.selector = selector || null;
        this.element = null;
        this.parentElement = null;
        this.showAll = false;
        this.itemLimit = 3;
        this.moreData = this.historySearch.length > this.itemLimit && true;
    };
    domElement.prototype.init = function (selector) {
        this.parentElement = this.selector;
        this.element = document.createElement('div');
        this.element.setAttribute("id", selector);
        this.parentElement.append(this.element);
        this.renderItems();
    };
    domElement.prototype.renderItems = function () {
        var htmlRender = '';
        var showAll = this.showAll;
        var itemLimit = this.itemLimit;
        deleteItem = this.deleteItem.bind(this);
        this.historySearch.map(function (item, index) {
            var hiddenClass = showAll == false && index >= itemLimit ? 'hidden' : '';
            var parentItemId = "block_meta_search_" + index;
            htmlRender += '<div id="' + parentItemId + '" rel="' + index + '" class="' + hiddenClass + '">';
            htmlRender += '<div class="item_text_search"><!--<img src="/images/graphics/history.png" class="icon_history">--><a rel="nofollow" href="' + item.url +
                '">' +
                item.title +
                '</a><a href="javascript:;" class="icon_del_search" onclick="deleteItem(\'' + parentItemId + '\')">' +
                '<img src="/images/graphics/icon_close_x_gray.svg" class="icon_search"></a></div>';
            htmlRender += '</div>';
        })
        if (this.moreData) {
            openAll = this.openAll.bind(this);
            if (this.showAll == false) {
                htmlRender += '<div class="block_text_view_more" onclick="openAll(true)"><span class="text_xemthem">Xem thêm</span> <span class="icon_carret_down"></span>';
            } else {
                htmlRender += '<div class="block_text_view_more" onclick="openAll(false)"><span class="text_xemthem">Thu gọn</span> <span class="icon_carret_up"></span>';
            }
        }
        if(htmlRender) {
            this.prepend(htmlRender);
        } else {
            this.hide();
        }
    }
    domElement.prototype.openAll = function (isOpen) {
        this.showAll = isOpen;
        this.renderItems();
    }
    domElement.prototype.deleteItem = function (parentItemId) {
        var parentDelete = '#' + parentItemId;
        var positionDelete = $(parentDelete).attr('rel');
        $(parentDelete).remove();
        if (Array.isArray(this.historySearch)) {
            var searchData = [];
            this.historySearch.forEach(function (item, index) {
                if (positionDelete != index) {
                    searchData.push(item);
                }
            });
            this.historySearch = searchData;
            localStorage.setItem('str_history_search', JSON.stringify(searchData));
            this.moreData = searchData.length > this.itemLimit && true;
            this.renderItems();
        }
    }
    domElement.prototype.prepend = function (html) {
        this.element.innerHTML = html;
    };
    domElement.prototype.hide = function () {
        this.element.style.display = "none";
    };
    $.fn.hskSearchPlugin = function (version = false) {
        var requestIndex = 0;
        var searchSelector = $(this).data('box-parent');
        var searchContainer = $(searchSelector);
        var productsSelector = 'suggestion_products';
        var promotionSelector = 'suggestion_campaigns';
        var historySelector = 'suggestion_history';
        var defaultSelector = 'suggestion_default';
        var categoriesPopularSelector = 'suggestion_category_popular';
        var brandSelector = 'suggestion_brands';
        var productElement = $('#' + productsSelector) || $('<div>').attr('id', productsSelector);
        this.searching = null;
        function debounce(func, timeout = 250){
            let timer;
            return (...args) => {
                clearTimeout(timer);
                timer = setTimeout(() => { func.apply(this, args); }, timeout);
            };
        }
        function search (event, index) {
            var value = event.target.value;
            if(value == '') {
                $('#' + defaultSelector).show();
                $('#' + productsSelector).hide();
                return;
            }
            if(value.length < 2) return;
            $('#' + defaultSelector).hide();
            if (searchContainer.find('#' + productsSelector).length === 0) {
                productElement = $('<div>').attr('id', productsSelector);
                searchContainer.append(productElement);
            }
            searchContainer.show();
            getAjax('suggestion&q=' + encodeURIComponent(value), function(res) {
                if(index === requestIndex) {
                    $(searchSelector).show();
                    productElement.empty('');
                    var html = '';
                    if(res.keywords) {
                        $.each(res.keywords, function (i, item) {
                            html += '<a class="item_keyword" onclick="pushEventRedirect(this)" data-keyword="'+value+'" href="' + item.url + '"><img class="item_icon" src="/images/graphics/icon_search_item.png"/>' +
                                item.label + '</a>';
                        });
                    } else {
                        html += '<a class="item_keyword" href="/catalogsearch/result/?q=' + encodeURIComponent(value) + '"><img class="item_icon" src="/images/graphics/icon_search_item.png"/>' +
                            value + '</a>';
                    }
                    productElement.append(html).show();
                    if (res.suggestions) {
                        html = "";
                        $.each(res.suggestions, function (i, item) {
                            html += '<a href="' + item.url + '" data-keyword="'+value+'" class="item_keyword cat_ad"><div class="item-icon"><img src="' + item.image + '" />' +
                                '</div><div class="content"><div class="cate_title">Danh mục</div>' +
                                '<div class="cate_subtitle txt_color_1">' + item.label + '</div></div></a>';
                        });
                        productElement.append(html).show();
                    }
                    if (res.brands) {
                        html = "";
                        $.each(res.brands, function (i, item) {
                            html += '<a href="' +
                                item.url +
                                '" data-keyword="'+value+'" class="item_keyword cat_ad"><div class="item-icon"><img src="' +
                                item.image +
                                '" />' +
                                '</div><div class="content"><div class="cate_title">Thương hiệu</div>' +
                                '<div class="cate_subtitle txt_color_1">' +
                                item.label +
                                "</div></div></a>";
                        })
                        productElement.append(html).show();
                    }
                    if (res.keyword_in_brands) {
                        html = "";
                        $.each(res.keyword_in_brands, function (i, item) {
                            html +=
                                "" +
                                '<a class="item_keyword" href="' +
                                item.url +
                                '"><img class="item_icon" src="/images/graphics/icon_search_item.png"/>' +
                                item.label +
                                "</a>";
                        });
                        html += '</div>';
                        productElement.append(html).show();
                    }
                    if (res.products) {
                        html = '';
                        $.each(res.products, function (i, item) {
                            html += '' +
                                '<div class="item_main_search_suggest">' +
                                '<a href="/' + item.url + '">' +
                                '<div class="thumb_suggest">' +
                                '<img alt="' + item.title + '" src="' + item.image_80 + '">' +
                                '</div>' +
                                '<div class="info_shopping">' +
                                '<div class="price_item_shopping"><span class="giamoi">' + item.price_str + '</span> </div><h2 class="title_item_shopping">' + item.title + '</h2>' +
                                '</div>' +
                                '</a>' +
                                '</div>';
                        });
                        html += '</div>';
                        productElement.append(html).show();
                        searchContainer.append(productElement);
                    }
                    if(res.keyword_in_brands_more) {
                        html = '<div class="item_brand_more"><div class="kw_brand_title space_bottom_10"><b>Theo thương hiệu</b></div>';
                        $.each(res.keyword_in_brands_more, function (i, item) {
                            html += '' +
                                '<a class="item_keyword_brand" href="' + item.url + '">' +
                                item.label + '</a>';
                        });
                        html += '</div>';
                        productElement.append(html).show();
                    }
                    if (!res.products
                        && !res.brands && !res.suggestions
                        && !res.keyword_in_brands_more
                        && !res.keywords
                        && !res.keyword_in_brands
                    ) {
                        productElement.hide();
                    }
                }
            });
        }
        $(this).focus(function (event) {
            // if (version === 'v4'){
            // }
            $('.v3_block_search_header').addClass('show_susgest_data');
            if ($(this).val() != '') {
                search(event, ++requestIndex);
                $('#' + productsSelector).show();
                searchContainer.show();
                return;
            }
            var isLoadedDefault = $('#' + defaultSelector, searchContainer).length !== 0;
            if (isLoadedDefault) {
                $('#' + defaultSelector).show();
                searchContainer.show();
                return;
            }
            var elementDefault = $('<div>').attr('id', defaultSelector);
            var promotionElement = $('<div>', {id: promotionSelector, class: 'block_meta_search'});
            var categoriesPopularElement = $('<div>').attr({ 'id': categoriesPopularSelector });
            var brandElement = $('<div>').attr({ 'id': brandSelector,'class': 'block_item_suggest' });
            searchContainer.empty('');
            searchContainer.append(elementDefault)
            searchContainer.show();
            var campaigns = $(this).attr('campaign-rel');
            if(campaigns != undefined) {
                campaigns = JSON.parse(campaigns) || [];
                if(campaigns.length !== 0) {
                    $.each(campaigns, function(index) {
                        var itemCampaign = campaigns[index];
                        var childPromotion = $('<div>').attr({'class': 'item_mega_search'});
                        childPromotion.append($('<a>', {href: itemCampaign['url'], ref:'sponsored'}).text(itemCampaign['label']));
                        console.log(childPromotion)
                        promotionElement.append(childPromotion);
                    });
                    elementDefault.append(promotionElement);
                }
            }
            var el = new domElement(elementDefault);
            el.init(historySelector);
            elementDefault.append(categoriesPopularElement);
            getCategoriesByRecentProduct((response) => {
                categoriesPopularElement.html(renderCategoriesDefaultHtml(response));
            });
            elementDefault.append(brandElement);
            getBrandHot((response) => {
                brandElement.html(renderBrandDefaultHtml(response));
            });
        }).blur(function () {
            // searchContainer.hide();
        });

        $(this).keyup((event) => {
            var index = ++requestIndex;
            clearTimeout(this.searching);
            this.searching = debounce(search(event, index), 10);
        });
    }
})(jQuery)

// localStorage.setItem('str_history_search', '[{"title":"son 1","url":"/sdfdf"},{"title":"son 2","url":"/sdfdf"},{"title":"son 3","url":"/sdfdf"},{"title":"son 4","url":"/sdfdf"},{"title":"son 5","url":"/sdfdf"},{"title":"son 6","url":"/sdfdf"},{"title":"son 7","url":"/sdfdf"}]');;;