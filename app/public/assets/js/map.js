$(document).ready(function () {

    var neighborhoodLinks = [];
    var neighborhoods = [];

    $.ajax({
        url: "https://cors-anywhere.herokuapp.com/http://s3-us-west-2.amazonaws.com/boundaries.latimes.com/archive/1.0/boundary-set/la-county-neighborhoods-v6.json",
        method: "GET"
    }).then(function (res) {

        var paths = res.boundaries;

        // Populate array of API links
        for (let i = 0; i < paths.length; i++) {
            var path = paths[i];
            path = path.substring(0, path.length - 1).concat(".json");
            var baseURL = "http://s3-us-west-2.amazonaws.com/boundaries.latimes.com/archive";
            neighborhoodLinks.push(baseURL + path);
            console.log(neighborhoodLinks[i]);
        }

        // Populate array of neighborhood names
        for (let i = 0; i < paths.length; i++) {
            var path = paths[i];
            var neighborhood = path.slice(14, -27).replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
            neighborhoods.push(neighborhood);
            console.log(neighborhoods[i]);
        }

        // Populate neighborhoods into the dropdown
        for (let i = 0; i < neighborhoods.length; i++) {
            var option = $("<option>");
            option.text(neighborhoods[i]).val(neighborhoods[i]);
            $("#options").append(option);
        }
    });

    $("form").on("submit", function (event) {

        event.preventDefault();
        var neighborhoodInput = $("#options").val();
        console.log("Neighborhood: " + neighborhoodInput);
        var urlIndex = neighborhoods.indexOf(neighborhoodInput);
        var url = neighborhoodLinks[urlIndex];
        console.log("URL: " + url);

        // Get the coordinated defining the chosen neighborhood
        $.ajax({
            url: "https://cors-anywhere.herokuapp.com/" + url,
            method: "GET"
        }).then(function (res) {
            console.log(res);
            var location = res.simple_shape.coordinates[0][0];
            console.log(location);
            initMap(location);
        });

        // Initialize Map
        function initMap(location) {

            // Need to calculate center within neighborhood!!!

            // Display map and center on the neighborhood
            var mapDiv = document.getElementById('map');
            var center;
            var mapOptions = {
                center: {lat: 34.0522, lng: -118.2437},
                zoom: 13
            };
            var map = new google.maps.Map(mapDiv, mapOptions);

            // Later: set markers for certain data points from other API's
            var marker = new google.maps.Marker({ position: { lat: 34.0522, lng: -118.2437 }, map: map });
            // var marker2 = new google.maps.Marker({ position: location2, map: map });

            // Display neighborhood boundary on the map 
            var boundary = [];
            for (let i = 0; i < location.length; i++) {
                // Pass each point of the polygon to bounds
                var coordinates = location[i];
                var latitude = coordinates[1];
                var longitude = coordinates[0];
                boundary.push(new google.maps.LatLng(latitude, longitude));
            }
            var polylineOptions = {
                path: boundary,
                strokeColor: "#ADD8E6",
                strokeWeight: 5
            };
            var polyline = new google.maps.Polyline(polylineOptions);
            polyline.setMap(map);
        };
    });
});