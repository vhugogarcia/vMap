vMap
====

A lightning & powerful jQuery plugin with HTML 5 that makes Google Maps v3 easy by sending a simple JSON Data Structure.

vMap not only displays the location markers in the map, but also displays a list with the locations, this list offers some extra features, for example: A location can be clicked and it will be highlighted in the map.

Copyright (c) 2012 Victor Hugo Garcia - iacido@gmail.com

How to use
----------

To get started, download the plugin, unzip it and copy files to your website/application directory.
Load files in the <head> section of your HTML document. Make sure you also add the jQuery library.

	<head>
		<script src="http://maps.googleapis.com/maps/api/js?key=abcdef&sensor=true" type="text/javascript"></script>
        <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
        <link rel="stylesheet" href="/jquery.vmap.css" type="text/css"/>
        <script type="text/javascript" src="/jquery.vmap.js"></script>
    </head>

Note, you should change `key` parameter for the one given by Google.

Add the follow HTML to your page under body tag (`section` tag is optional):
	
	<section>
		<div class="vmap">
			<div class="row">
				<!-- Search Content -->
				<div id="map_search" class="vmap-search">
					<input id="address" class="vmap-address input-control"  type="text" placeholder="Location title..." />
					<input id="search" class="button bg-color-blue" type="button" value="Search" />
				</div>
				<div id="map_directions" class="vmap-directions square">
					<input id="origin" type="text" placeholder="Origin" class="vmap-origin input-control" value="" />
					<input id="destination" type="text" placeholder="Destination" class="vmap-destination input-control" />
					<input id="route" class="button bg-color-blue" type="button" value="GO" />
					<input id="clear" class="button" type="button" value="Clear" />
					<a id="close" class="close" href="#">&times;</a>
				</div>
			</div>
			<div class="row">
				<!--Map content-->
				<div id="map_canvas" class="vmap-canvas pull-left">
				</div>
				<!--Sidebar content-->
				<div id="map_list" class="vmap-list pull-right">
				</div>
				<div class="clearfix"></div>
			</div>
		</div>
	</section>
	
Initialize the script like this:

    <script>
        $(document).ready(function() {
            $('#map_canvas').vmap({url:"/webservice/get_locations"});
        });
    </script>

It can aslo be passed optional options objects which will extend the default values. Example:

    <script>
        $(document).ready(function() {
            $('#map_canvas').vmap({
				url: "/webservice/get_locations",
				data: "{'address':'known'}",
				initLatitude: "31.74",
				initLongitude: "-95.42",
				initZoom: 4,
				classAddress: "street",
				classTitle: "title"
            });
        });
    </script>

Note, ajax requests are subject to the [same origin policy](http://en.wikipedia.org/wiki/Same_origin_policy).


Parameters
----------

<table>
  <tr>
    <th>Key</th><th>Default Value</th><th>Description</th><th>Mandatory?</th>
  </tr>
  <tr>
    <td>url</td><td>Empty String</td><td>A string containing the URL to which the request is sent.</td><td><strong>Yes</strong></td>
  </tr>
  <tr>
    <td>data</td><td>Empty String</td><td>Data to be sent to the server on the Url specified.</td><td>No</td>
  </tr>
  <tr>
    <td>initLatitude</td><td>31.74</td><td>Latitude where the map will be centered initially.</td><td>No</td>
  </tr>
  <tr>  
	<td>initLongitude</td><td>-95.42</td><td>Longitude where the map will be centered initially.</td><td>No</td>
  </tr>
  <tr>  
	<td>initZoom</td><td>4</td><td>Initial zoom of the map (integer).</td><td>No</td>
  </tr>
  <tr>
	<td>classAddress</td><td>'address'</td><td>Assign a class to the tag where the location address is displayed.</td><td>No</td>
  </tr>
  <tr>  
	<td>classTitle</td><td>'title'</td><td>Assign a class to the tag where the location title is displayed.</td><td>No</td>
  </tr>
  <tr>  
	<td>classPageLink</td><td>'page-link'</td><td>Assign a class to the location page link tag.</td><td>No</td>
  </tr>
  <tr>  
	<td>classDirectionsLink</td><td>'directions-link'</td><td>Assign a class to the location direction link tag.</td><td>No</td>
  </tr>
  <tr>  
	<td>showDirectionsLink</td><td>false</td><td>Hide or show the driving directions links under each location.</td><td>No</td>
  </tr>
  <tr>  
	<td>showPageLink</td><td>false</td><td>Hide or show the location page link under each location.</td><td>No</td>
  </tr>
  <tr>  
	<td>showList</td><td>false</td><td>Hide or show the list of locations.</td><td>No</td>
  </tr>
  <tr>  
	<td>showSearch</td><td>false</td><td>Hide or show the search bar.</td><td>No</td>
  </tr>
</table>

Server Side
----------

The data must be returned in strict JSON format, below is a sample of the structure:

	{
    "items": [{
				"Title": "Location Name 01",
				"Link": "/to-some-where.aspx",
				"Latitude": "72.372055",
				"Longitude": "-19.7305979",
				"Address": "1900 Test Road, State, Country, ZipCode"
			}, {
				"Title": "Location Name 02",
				"Link": "/any-where.aspx",
				"Latitude": "72.372055",
				"Longitude": "-19.747201",
				"Address": "1900 Test Road, State, Country, ZipCode"
			}
			]
	}
	

Supported Browsers
----------
Chrome, Safari 6+, Firefox, IE 7+, Opera 12+
	
License / Download
----------

vMap licensed under Creative Commons Attribution-NonCommercial 3.0 license.
You are free to use vMap for your personal or non-profit website projects.
You can get the author's permission to use vMap for commercial websites. 

Bug tracker
-----------

Have a bug? Please create an issue on GitHub at https://github.com/vhugogarcia/vMap/issues

[![githalytics.com alpha](https://cruel-carlota.pagodabox.com/b900f12a3465e3691a819495c7e15848 "githalytics.com")](http://githalytics.com/vhugogarcia/vMap)