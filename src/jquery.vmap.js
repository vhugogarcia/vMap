﻿/*!
* vMap - jQuery Plugin
* version: 1.1.0 (Friday, 10 December 2012)
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

    jQuery.expr[':'].Contains = function (a, i, m) {
        return (a.textContent || a.innerText || "").toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
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

        // Drawing the Map
        drawMap(data, options, map);

        // If user enabled Directions
        if (options.showDirectionsLink) {
            var directionsDisplay = new google.maps.DirectionsRenderer();
            var directionsService = new google.maps.DirectionsService();

            $('.' + options.classDirectionsLink).on("click", function (event) {
                $('#map_search').hide();
                $('#map_directions').show();
                $('#map_directions #destination').val($(this).attr("data-destination"));
            });

            $('#map_directions #route').on("click", function (event) {
                var locOrigin = $('#map_directions #origin').val();
                var locDestination = $('#map_directions #destination').val();

                if (locOrigin.length > 0) {
                    calcRoute(locOrigin, locDestination, map, directionsDisplay, directionsService);
                } else {
                    alert("Origin location is required to get a route.");
                }
            });

            $('#map_directions #clear').on("click", function (event) {
                if (directionsDisplay != null) 
                    directionsDisplay.setMap(null);
            });

            $('#map_directions #close').on("click", function (event) {
                $('#map_directions').hide();
                if (options.showSearch)
                    $('#map_search').show();
            });
        } 

        // If user enabled Search
        if (options.showSearch) {
            $('#map_search #search').on("click", function (event) {
                search($('#map_search #address').val(), map, options);
            });
            $('#map_search').show();
        }
    }

    function search(keywords, map, options) {
        if (keywords) {
            $('#map_list').find(".location .title:not(:Contains(" + keywords + "))").parent().hide();
            $('#map_list').find(".location .title:Contains(" + keywords + ")").parent().show();
            var lat = $('#map_list .location:visible:first').attr("data-latitude");
            var lon = $('#map_list .location:visible:first').attr("data-longitude");
            if (lat && lon) {
                map.setZoom(10);
                map.setCenter(new google.maps.LatLng(lat, lon));
            }
        } else { $('#map_list').find(".location").show(); map.setZoom(options.initZoom); }
    }

    function getInfo(i) {
        google.maps.event.trigger(markerArray[i], 'click');
    }

    function calcRoute(start, end, map, directionsDisplay, directionsService) {
        var request = {
            origin: start,
            destination: end,
            travelMode: google.maps.DirectionsTravelMode.DRIVING
        };

        directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
            }
        });
        
        directionsDisplay.setMap(map);
    }

    function error(exception) {
        console.log(exception);
    }

    function drawMap(data, options, map) {
        // Clear List
        if (options.showList)
            $('#map_list').html('');
        
        var infowindow = new google.maps.InfoWindow();
        var marker, i;

        // Parse each location and set up a marker
        $.each(data.items, function (index, value) {
            marker = new google.maps.Marker({ position: new google.maps.LatLng(value.Latitude, value.Longitude), map: map });

            marker.html = "<a href='" + value.Link + "' class='info-title'>" + value.Title + "</a><div class='info-address'>" + value.Address + "</div>";
            google.maps.event.addListener(marker, 'click', (function (marker, i) {
                return function () {
                    infowindow.setContent(this.html);
                    infowindow.open(map, marker);
                }
            })(marker, i));

            markerArray[index] = marker;

            if (options.showList) {
                var itemTitle = "<div data-index='" + index + "' class='" + options.classTitle + "'>" + value.Title + "</div>";
                var itemAddress = "<div class='" + options.classAddress + "'>" + value.Address + "</div>";
                var itemPageLink = (options.showPageLink == true) ? "<a href='" + value.Link + "' class='" + options.classPageLink + "' title='Go to location page'><span>Get Details</span></a>" : "";
                var itemDirectionsLink = (options.showDirectionsLink == true) ? "<a href='javascript:;' class='" + options.classDirectionsLink + "' title='Get driving directions' data-destination='" + value.Address + "'><span>Get Driving Directions</span></a>" : "";
                $('#map_list').append("<div class='location' data-latitude='" + value.Latitude + "' data-longitude='" + value.Longitude + "'>" + itemTitle + itemAddress + itemPageLink + itemDirectionsLink + "</div>");
                $('#map_list').show();
            }
        });

        // Attach event Click to each item on the list
        if (options.showList) {
            $('.' + options.classTitle).on("click", function (event) {
                getInfo($(this).attr("data-index"));
            });
        }

        if (options.showDirectionsLink) {
            $('.' + options.classDirectionsLink).on("click", function (event) {
                $('#map_search').hide();
                $('#map_directions').show();
                $('#map_directions #destination').val($(this).attr("data-destination"));
            });
        }

        return map;
    }

    //Default Options
    $.vmap.defaultOptions = {
        initLatitude: '31.74',
        initLongitude: '-95.42',
        url: '',
        data: '',
        initZoom: 4,
        classAddress: 'address',
        classTitle: 'title',
        classPageLink: 'page-link',
        classDirectionsLink: 'directions-link',
        showDirectionsLink: false,
        showPageLink: false,
        showList: false,
        showSearch: false,
        noLocationsFoundMessage: "No Locations Found, please try again."
    }
})(jQuery);