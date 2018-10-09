$(document).ready(function () {

    const key = "AIzaSyDrkRP7ynh5ARKO3jrv5zxc4q5AJkED0mA";
    var neighborhoodLinks = [];
    var neighborhoodNames = [];
    var location;
    var pointMid = {};
    var radius;
    var placeResults = [];

    // Receive neighborhood names from LA Times API
    $.ajax({
        url: "https://cors-anywhere.herokuapp.com/http://s3-us-west-2.amazonaws.com/boundaries.latimes.com/archive/1.0/boundary-set/la-county-neighborhoods-v6.json",
        method: "GET"
    }).then(function (res) {

        var paths = res.boundaries;
        console.log(paths);

        // Populate array of API links
        for (let i = 0; i < paths.length; i++) {
            var path = paths[i];
            path = path.substring(0, path.length - 1).concat(".json");
            var baseURL = "http://s3-us-west-2.amazonaws.com/boundaries.latimes.com/archive";
            neighborhoodLinks.push(baseURL + path);
        }

        // Populate array of neighborhood names
        for (let i = 0; i < paths.length; i++) {
            var path = paths[i];
            var neighborhood = path.slice(14, -27).replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
            neighborhoodNames.push(neighborhood);
        }

        // Populate neighborhoods into the dropdown
        for (let i = 0; i < neighborhoodNames.length; i++) {
            var option = $("<option>");
            option.text(neighborhoodNames[i]).val(neighborhoodNames[i]);
            $("select").append(option);
        }
    });

    $("#chooseNeighborhood").on("submit", function (event) {

        event.preventDefault();
        var neighborhoodInput = $("#options").val();
        console.log("Neighborhood: " + neighborhoodInput);
        var urlIndex = neighborhoodNames.indexOf(neighborhoodInput);
        var url = neighborhoodLinks[urlIndex];
        console.log("URL: " + url);

        // Get the coordinates defining the chosen neighborhood
        $.ajax({
            url: "https://cors-anywhere.herokuapp.com/" + url,
            method: "GET"
        }).then(function (res) {
            location = res.simple_shape.coordinates[0][0];
            initMap(location);
        }).then(() => {
            console.log("hello");
            $.get("/api/crimes/neighborhoods/" + neighborhoodInput, (response) => {
                console.log(response);
                sessionStorage.setItem("response", response)
            })
        })
    });

    $("#chose").click(function (data) {
        window.location.replace(`../mainmapresults`);
    });

    $("#goHome").click(function (data) {
        window.location.replace("../mainpage1");
    });

    $("#chooseLocation").on("submit", function (event) {

        event.preventDefault();
        var input = $("#search").val();
        console.log(input);
        console.log("radius: " + radius);

        $.ajax({
            url: "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + pointMid.lat + "," + pointMid.lng + "&radius=" + radius + "&type=establishment&keyword=" + input + "&key=" + key,
            method: "GET"
        }).then(function (res) {

            var results = res.results;
            for (let i = 0; i < results.length; i++) {
                var result = results[i];
                var name = result.name;
                var place_id = result.place_id;
                var coordinates = result.geometry.location;
                placeResults.push(new Place(name, place_id, coordinates));
            };
            console.log(placeResults);
            initMarkers(placeResults);
        }).then((res) => {
            $.post(`/neighborhoods/${input}`, (response) => {
                console.log(response);
            })
        }).then((res) => {
            $.get("/api/surveys/", (res) => {

            })
        });
    });

    // Initialize Map
    function initMap(location) {

        // Calculate neighborhood latitude/longitude max & min, center point, and radius
        var xArray = [];
        var yArray = [];
        for (let i = 0; i < location.length; i++) {
            xArray.push(location[i][1]);
        }
        for (let i = 0; i < location.length; i++) {
            yArray.push(location[i][0]);
        }
        var latMin = Math.min(...xArray);
        var latMax = Math.max(...xArray);
        var lngMin = Math.min(...yArray);
        var lngMax = Math.max(...yArray);
        pointMid.lat = ((latMax + latMin) / 2);
        pointMid.lng = ((lngMax + lngMin) / 2);
        radius = haversineFormula(latMin, lngMin, latMax, lngMax);

        // Display centered map
        var mapDiv = document.getElementById('map');
        var mapOptions = {
            center: pointMid,
            zoom: 12
        };
        var map = new google.maps.Map(mapDiv, mapOptions);

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
            strokeWeight: 2.5
        };
        var polyline = new google.maps.Polyline(polylineOptions);
        polyline.setMap(map);

        // // Fit map to neighborhood bounds
        // var bounds = new google.maps.LatLngBounds();
        // for (var i = 0; i < location.length; i++) {
        //     bounds.extend(location[i].getPosition());
        // }
        // map.fitBounds(bounds);
    };

    function Place(name, place_id, coordinates) {
        this.name = name,
            this.place_id = place_id,
            this.coordinates = coordinates
    };

    function initMarkers(placeResults) {

        // Display centered map
        var mapDiv = document.getElementById('map');
        var mapOptions = {
            center: pointMid,
            zoom: 12
        };
        var map = new google.maps.Map(mapDiv, mapOptions);

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
            strokeWeight: 2.5
        };
        var polyline = new google.maps.Polyline(polylineOptions);
        polyline.setMap(map);

        // Create markers for place search results
        var markers = [];
        for (let i = 0; i < placeResults.length; i++) {
            var marker = new google.maps.Marker({ position: placeResults[i].coordinates, map: map, id: placeResults[i].place_id });
            markers.push(marker);
        }
        console.log(markers);

        // Fit map to marker bounds
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < markers.length; i++) {
            bounds.extend(markers[i].getPosition());
        }
        map.fitBounds(bounds);
    };

    // Haversine formula to calculate distance in meters from 2 coordinates
    function haversineFormula(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = (lat2 - lat1) * (Math.PI / 180);  // Convert from degrees to radians
        var dLon = (lon2 - lon1) * (Math.PI / 180);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = ((R * c) * 1000) / 2; // Average radius in m 
        return d;
    }
    //$('select').formSelect();
});