(function () {
    'use strict';

    $.mixin('collapsible', {
        isLayeredNavigation: function () {
            return this.element.hasClass('filter') &&
                this.element.has('.filter-options').length;
        },

        create: function (original) {
            if (this.isLayeredNavigation()) {
                this.filters = this.element.find('.filter-content');
                this.focusTrap = this.createFocusTrap(this.filters);
                this._on(document, 'breeze:resize-x', () => {
                    if (this.filters.css('position') !== 'fixed') {
                        this.close();
                    }
                });
            }

            original();
        },

        open: function (original) {
            if (this.isLayeredNavigation()) {
                if (this.filters.css('visibility') !== 'hidden') {
                    return;
                }

                $.breeze.scrollbar.hide();
                this.filters.one('transitionend', this.focusTrap.activate);
            }

            original();
        },

        close: function (original) {
            if (this.isLayeredNavigation()) {
                $.breeze.scrollbar.reset();
                this.focusTrap.deactivate();
            }

            original();
        }
    });

    if ($('body').var('--swatches-over-image')) {
        $(document).on('click', 'a [class^="swatch-opt-"]', function (e) {
            e.preventDefault();
        });
    }

    $(document).on('breeze:load', function () {
        if ($('body').var('--swatches-over-image')) {
            $.async([
                '.products-grid .product-item-details [class^="swatch-opt-"]',
                '[data-appearance="carousel"] .product-item-details [class^="swatch-opt-"]',
            ].join(','), function (el) {
                $(el).appendTo($(el).closest('.product-item-info').find('.product-item-photo'));
            });
        }

        $.async('.breeze-carousel .products-grid', (el) => {
            $(el).pagebuilderCarousel({
                arrows: true
            });
            $(el).parents('.hide.show-on-ready').removeClass('hide');
        });

        if ($('body').var('--header-panel-slideout')) {
            $('.panel.header')
                .clone()
                .removeClass('header panel')
                .addClass('mobile-header-panel')
                .data('breeze-temporary', true)
                .appendTo($('.navigation-wrapper'));
        }
    });
})();
