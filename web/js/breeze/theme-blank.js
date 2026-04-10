define([
    'mage/utils/wrapper',
    'mage/translate'
], (wrapper, $t) => {
    'use strict';

    $.mixin('collapsible', {
        create: function (original) {
            if (this.element.hasClass('filter') && this.element.has('.filter-options').length) {
                this.prepareForLayeredNavigation();
            }
            original();
        },

        prepareForLayeredNavigation: function () {
            this.isDropdown = () => this.filters?.css('--layered-navigation-mode') === 'dropdown';

            this.open = wrapper.wrap(this.open, function (o) {
                if (!this.filters) {
                    this.filters = this.element.find('.filter-content');
                    this.filters.prepend(`
                        <button type="button" class="button-close">
                            <span>${$t('Close')}</span>
                        </button>
                    `);
                    this.focusTrap = this.createFocusTrap(this.filters);
                    this._on('click .filter-content > .button-close', this.close);
                    this._on(document, 'keyup', (e) => {
                        if (e.code === 'Escape' && this.isActive()) {
                            this.close();
                        }
                    });
                    this._on(document, 'breeze:resize-x', () => {
                        if (this.isActive() && this.filters.css('position') !== 'fixed') {
                            this.close();
                        }
                    });
                }

                if (this.filters.css('visibility') !== 'hidden') {
                    return;
                }

                if (this.filters.css('--layered-navigation-mode') === 'slideout') {
                    $.breeze.scrollbar.hide();
                    this.filters.one('transitionend', this.focusTrap.activate);
                }

                o();
            });

            this.close = wrapper.wrap(this.close, function (o) {
                if (this.isActive()) {
                    $.breeze.scrollbar.reset();
                    this.focusTrap?.deactivate();
                }
                o();
            });
        }
    });

    $(document).on('click', 'a [class^="swatch-opt-"]', function (e) {
        e.preventDefault();
    });

    $(document).on('breeze:load', function () {
        if ($('body').var('--swatches-over-image')) {
            $.async([
                '.products-grid .product-item-details [class^="swatch-opt-"]',
                '[data-appearance="carousel"] .product-item-details [class^="swatch-opt-"]'
            ].join(','), function (el) {
                $(el).appendTo($(el).closest('.product-item-info').find('.product-item-photo'));
            });
        }

        $.async('div:has(>.hide.show-on-ready .breeze-carousel)', el => {
            $.onReveal(el, () => $.async({
                selector: '.breeze-carousel .products-grid',
                ctx: el
            }, el => {
                $(el).pagebuilderCarousel().parents('.hide.show-on-ready').removeClass('hide');
            }));
        });

        $.async('.breeze-carousel .products-grid', el => {
            $.onReveal(el, () => $(el).pagebuilderCarousel());
        });

        // Use the same border-radius for zoom element as used in pagebuilder
        $.async('.hover-zoom:has(a > [data-background-images])', el => {
            $(el).one('mouseenter', () => {
                if (parseFloat($(el).css('border-radius'))) {
                    return;
                }

                $(el).css('border-radius', $('a > [data-background-images]', el).css('border-radius'));
            });
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
            .appendTo($('.navigation-section'));

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
});
