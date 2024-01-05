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

    $(document).on('click', 'a [class^="swatch-opt-"]', function (e) {
        e.preventDefault();
    });

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
            $.onReveal(el, () => require(['pagebuilderCarousel'], () => {
                $(el).pagebuilderCarousel({
                    arrows: true
                });
                $(el).parents('.hide.show-on-ready').removeClass('hide');
            }));
        });
    });

    $(document).on('menuSlideout:beforeOpen', () => {
        if (!$('body').var('--header-panel-slideout') ||
            $('.navigation-wrapper .mobile-header-panel').length
        ) {
            return;
        }

        $('.panel.header')
            .clone()
            .removeClass('header panel')
            .addClass('mobile-header-panel')
            .data('breeze-temporary', true)
            .appendTo($('.navigation-wrapper'));

        $('.mobile-header-panel').find('[data-breeze-processed]').removeAttr('data-breeze-processed');
        $('.mobile-header-panel')
            .trigger('contentUpdated')
            .find('[id],[for]')
            .each((i, el) => {
                el = $(el);

                if (el.attr('for')) {
                    el.attr('for', el.attr('for') + '_clone');
                }

                if (el.attr('id')) {
                    el.attr('id', el.attr('id') + '_clone');
                }
            });
    });
})();
