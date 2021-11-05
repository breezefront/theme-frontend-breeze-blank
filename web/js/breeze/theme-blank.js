(function () {
    'use strict';

    $.widget('slideout', {
        component: 'slideout',
        options: {
            active: 'active'
        },

        /** [create description] */
        _create: function () {
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
})();
