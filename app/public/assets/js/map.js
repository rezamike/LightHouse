$(document).ready(function () {

    const key = "AIzaSyDrkRP7ynh5ARKO3jrv5zxc4q5AJkED0mA";
    var neighborhoodInput;
    var input;
    var neighborhoodLinks = [];
    var neighborhoods = [];
    var places = [];
    var south;
    var west;
    var east;
    var north;
    var pointMid = {};
    var location;

        // Check for click events on the navbar burger icon
    $(".navbar-menu").click(function() {
      
            // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
            // $(".navbar-link").toggleClass("is-active");
            $(".navbar-item.about").toggleClass("is-active")
            $(".navbar-item.safety").toggleClass("is-active");
            $(".navbar-item.disclaimer").toggleClass("is-active");
      
        });
     



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
            neighborhoods.push(neighborhood);
        }

        // Populate neighborhoods into the dropdown
        for (let i = 0; i < neighborhoods.length; i++) {
            var option = $("<option>");
            option.text(neighborhoods[i]).val(neighborhoods[i]);
            $("select").append(option);
        }
    });


    $("#chooseNeighborhood").on("submit", function (event) {

        event.preventDefault();
        neighborhoodInput = $("#options").val();
        console.log("Neighborhood: " + neighborhoodInput);
        var urlIndex = neighborhoods.indexOf(neighborhoodInput);
        var url = neighborhoodLinks[urlIndex];
        console.log("URL: " + url);




        // Get the coordinates defining the chosen neighborhood
        $.ajax({
            url: "https://cors-anywhere.herokuapp.com/" + url,
            method: "GET"
        }).then(function (res) {
            location = res.simple_shape.coordinates[0][0];
            initMap(location);
        }).then((res) => {
            $.get("/api/crimes/neighborhoods/" + neighborhoodInput, (response) => {
            })
        })
    });

    $("#chooseLocation").on("submit", function (event) {

        event.preventDefault();
        // var lat = (((Math.abs(north) + Math.abs(south)) / 2) * 111.32);
        // var lng = (((Math.abs(east) + Math.abs(west)) / 2) * 40075 * Math.cos(lat));
        // var radius = ((lat + lng) / 2) * 1000;
        // console.log(radius)
        var radius = 3000;
        input = $("#search").val();
        console.log(input);

        $.ajax({
            url: "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + pointMid.lat + "," + pointMid.lng + "&rankby=distance&type=establishment&keyword=" + input + "&key=" + key,
            method: "GET"
        }).then(function (res) {

            console.log(res)
            var results = res.results;
            for (let i = 0; i < results.length; i++) {
                var result = results[i];
                var name = result.name;
                var place_id = result.place_id;
                var coordinates = result.geometry.location;
                places.push(new Place(name, place_id, coordinates));
            };
            console.log(places);
            console.log(res);
            initMarkers(places);
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
        // Find neighborhood max, min, and center points
        var xArray = [];
        var yArray = [];
        for (let i = 0; i < location.length; i++) {
            xArray.push(location[i][1]);
        }
        for (let i = 0; i < location.length; i++) {
            yArray.push(location[i][0]);
        }
        west = Math.min(...xArray);
        east = Math.max(...xArray);
        south = Math.min(...yArray);
        north = Math.max(...yArray);
        pointMid.lat = ((east + west) / 2);
        pointMid.lng = ((north + south) / 2);

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

    function initMarkers(places) {

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
        for (let i = 0; i < places.length; i++) {
            var marker = new google.maps.Marker({ position: places[i].coordinates, map: map, id: places[i].place_id });
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

    //$('select').formSelect();
});