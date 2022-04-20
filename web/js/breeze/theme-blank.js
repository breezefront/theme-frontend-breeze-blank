(function () {
    'use strict';

    $.widget('slideout', {
        component: 'slideout',
        options: {
            active: 'active'
        },

        /** [create description] */
        create: function () {
            this.toggler = this.element.find(this.options.toggler);
            this.panel = this.element.find(this.options.panel);
            this.focusTrap = this.createFocusTrap(this.panel);
            this.closeBtn = $('<button>').addClass('button-close filter-content-close');
            this.panel.prepend(this.closeBtn);

            this._on(document, {
                keydown: function (e) {
                    if (e.key === 'Escape' && this.element.hasClass(this.options.active)) {
                        this.close();
                    }
                }.bind(this)
            });

            this._on(this.toggler, {
                click: this.toggle,
                keydown: function (e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.toggle();
                    }
                }.bind(this)
            });

            this._on(this.closeBtn, {
                click: this.close
            });
        },

        /** [destroy description] */
        destroy: function () {
            this.close();
            this._super();
        },

        /** [toggle description] */
        toggle: function () {
            if (this.element.hasClass(this.options.active)) {
                this.close();
            } else {
                this.open();
            }
        },

        /** [open description] */
        open: function () {
            $.breeze.scrollbar.hide();
            this.panel.one('transitionend', this.focusTrap.activate);
            this.element.addClass(this.options.active);
        },

        /** [close description] */
        close: function () {
            $.breeze.scrollbar.reset();
            this.focusTrap.deactivate();
            this.element.removeClass(this.options.active);
        }
    });

    $(document).on('breeze:load', function () {
        if ($('body').var('--swatches-over-image')) {
            $.async('.products-grid .product-item-details [class^="swatch-opt-"]', function (el) {
                $(el).appendTo($(el).closest('.product-item-info').find('.product-item-photo'));
            })
            $(document).on('click', 'a [class^="swatch-opt-"]', function (e) {
                e.preventDefault();
            });
        }
    });
})();
