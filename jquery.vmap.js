/*!
* vMap - jQuery Plugin
* version: 1.0.0 (Friday, 30 November 2012)
* @requires jQuery v1.7 or later
*
* License: Under Creative Commons Attribution-NonCommercial 3.0 license. 
*		   You are free to use vMap for your personal or non-profit website projects. 
*		   You can get the author's permission to use vMap for commercial websites. 
*
* Copyright 2012 Victor Hugo Garcia - iacido@gmail.com
*
*/

(function ($) {
    $.vmap = function (element, options) {
        this.options = {};
        element.data('vmap', this);
        this.init = function (element, options) {
            this.options = $.extend({}, $.vmap.defaultOptions, options);

            retrieveData(element, this.options);
        };

        this.init(element, options);
    };

    $.fn.vmap = function (options) {
        return this.each(function () {
            (new $.vmap($(this), options));
        });
    };

    var markerArray = [];

    function retrieveData(element, options) {
        if (options.url == '') return false;
        $.ajax({
            type: "POST",
            url: options.url,
            data: options.data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                draw(data, options);
            },
            error: function (jqXHR, exception) {
                error(exception);
            }
        });
    }

    function draw(data, options) {
        // Setting up initial map location
        var map = new google.maps.Map(document.getElementById('map_canvas'), {
            zoom: options.initZoom,
            center: new google.maps.LatLng(options.initLatitude, options.initLongitude),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        var infowindow = new google.maps.InfoWindow();
        var marker, i;

        // Parse each location and set up a marker
        $.each(data.items, function (index, value) {
            marker = new google.maps.Marker({ position: new google.maps.LatLng(value.Latitude, value.Longitude), map: map });

            marker.html = "<a href='" + value.Link + "' class='info-title'>" + value.Title + "</a><br />" + value.Address;
            google.maps.event.addListener(marker, 'click', (function (marker, i) {
                return function () {
                    infowindow.setContent(this.html);
                    infowindow.open(map, marker);
                }
            })(marker, i));

            markerArray[index] = marker;

            // Set up each item on the list
            $('#map_list').append("<address class='location'><div data-index='" + index + "' class='" + options.classTitle + "'>" + value.Title + "</div><div class='" + options.classAddress + "'>" + value.Address + "</div></address>");

        });

        // Atttach Click event to each location in the list
        $('.' + options.classTitle).on("click", function (event) {
            getInfo($(this).attr("data-index"));
        });
    }

    function getInfo(i) {
        google.maps.event.trigger(markerArray[i], 'click');
    }

    function error(exception) {
        console.log(exception);
    }

    //Default Options
    $.vmap.defaultOptions = {
        initLatitude: '31.74',
        initLongitude: '-95.42',
        url: '',
        data: '',
        initZoom: 4,
        classAddress: 'street',
        classTitle: 'title'
    }
})(jQuery);