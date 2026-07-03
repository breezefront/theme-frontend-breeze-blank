define([
    'jquery',
    'domReady!'
], function ($) {
    'use strict';

    if (getComputedStyle(document.body).getPropertyValue('--header-panel-slideout')) {
        $('.panel.header')
            .clone()
            .removeClass('header panel')
            .addClass('mobile-header-panel')
            .appendTo($('.navigation-section'));
    }
});
