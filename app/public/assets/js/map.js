$(document).ready(function () {

    var neighborhoodLinks = [];
    var neighborhoods = [];
    var places = [];
    var south;
    var west;
    var east;
    var north;
    var neighborhoodInput;

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
            console.log(neighborhoodLinks[i]);
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
        var neighborhoodInput = $("#options").val();
        console.log("Neighborhood: " + neighborhoodInput);
        var urlIndex = neighborhoods.indexOf(neighborhoodInput);
        var url = neighborhoodLinks[urlIndex];
        console.log("URL: " + url);

        // Get the coordinates defining the chosen neighborhood
        $.ajax({
            url: "https://cors-anywhere.herokuapp.com/" + url,
            method: "GET"
        }).then(function (res) {
            var location = res.simple_shape.coordinates[0][0];
            initMap(location);
        }).then((res) => {
            $.get("/api/crimes/neighborhoods/" + neighborhoodInput, (response) => {
            })
        })
    });

    $("#chooseLocation").on("submit", function (event) {

        event.preventDefault();
        var key = "AIzaSyDrkRP7ynh5ARKO3jrv5zxc4q5AJkED0mA";
        var input = $("#search").val();
        console.log(input);

        $.ajax({
            url: "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" + input + "&inputtype=textquery&types=establishment&fields=photos,formatted_address,name,rating,opening_hours,geometry&locationbias=rectangle:" + south + "," + west + "|" + east + "," + north + "&key=" + key,
            method: "GET"
        }).then(function (res) {

            var placeResults = res.predictions;
            for (let i = 0; i < placeResults.length; i++) {
                var place_id = placeResults[i].place_id;
                places.push(place_id);
            }
            console.log(places);
            console.log(res);
        }).then((res) => {
            $.post(`/neighborhoods/${input}`, (response) => {
                console.log(response);
            })
        }).then((res) => {
            $.get("/api/surveys/", (res) => {

            })
        })
    });

    // Initialize Map
    function initMap(location) {

        // Find neighborhood max, min, and center points
        var xArray = [];
        var yArray = [];
        var pointMid = {};
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

        // // Fit map to bounds
        // var bounds = new google.maps.LatLngBounds();
        // for (var i = 0; i < location.length; i++) {
        //     bounds.extend(location[i].getPosition());
        // }
        // map.fitBounds(bounds);
    };

    // Places result constructor function
    // function Place(name, place_id, latitude, longitude) {
    //     this.name = raining;
    //     this.place_id = place_id;
    //     this.latitude = latitude;
    //     this.longitude = longitude;
    // };
    // $('select').formSelect();
});