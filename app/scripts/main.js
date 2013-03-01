require.config({
    paths: {
        jquery: '../components/jquery/jquery',
        components: '../components',
        bootstrap: 'vendor/bootstrap'
    },
    shim: {
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        }
    }
});

require(['app', 'jquery', 'bootstrap'], function (app, $) {
    'use strict';

    var $content = $("#content");
    app($content);
});