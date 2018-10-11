$(document).ready(function () {

    // Receive data from session storage
    var neighborhoodNames = JSON.parse(sessionStorage.getItem("neighborhoodNames"));
    var neighborhoodInput = sessionStorage.getItem("neighborhoodInput");

    // Define global variables
    const key = "AIzaSyDrkRP7ynh5ARKO3jrv5zxc4q5AJkED0mA";
    var location;
    var pointMid = {};
    var radius;

    // Check for click events on the navbar burger icon
    $(".navbar-menu").click(function () {

        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        // $(".navbar-link").toggleClass("is-active");
        $(".navbar-item.about").toggleClass("is-active")
        $(".navbar-item.safety").toggleClass("is-active");
        $(".navbar-item.disclaimer").toggleClass("is-active");
    });

    $.ajax({
        url: "/api/crimes/neighborhoods/" + neighborhoodInput,
        method: "GET"
    }).then(function (data) {
        $(".neighborhoodName").text(neighborhoodInput + " Rating")
        $(".rating").text("Neighborhood Safety Rating: " + data[0].rating)
        $(".totalCrimes").text("Total Crime: " + data[0].totalCrimes)
        $(".kidnap").text("Kidnapping: " + data[0].kidnap)
        $(".violent").text("Violence: " + data[0].violent)
        $(".property").text("Property: " + data[0].property)
        $(".trespass").text("Trespass: " + data[0].trespass)
        $(".lighting").text("Lighting: " + data[0].lighting)
        $(".clean").text("Cleanliness: " + data[0].clean)
        $(".population").text("Population: " + data[0].population)
    });

    // Receive neighborhood API links from LA Times
    $.ajax({
        url: "https://cors-anywhere.herokuapp.com/http://s3-us-west-2.amazonaws.com/boundaries.latimes.com/archive/1.0/boundary-set/la-county-neighborhoods-v6.json",
        method: "GET"
    }).then(function (res) {

        var neighborhoodLinks = [];
        var paths = res.boundaries;

        // Populate array of API links
        for (let i = 0; i < paths.length; i++) {
            var path = paths[i];
            path = path.substring(0, path.length - 1).concat(".json");
            var baseURL = "http://s3-us-west-2.amazonaws.com/boundaries.latimes.com/archive";
            neighborhoodLinks.push(baseURL + path);
        }

        var urlIndex = neighborhoodNames.indexOf(neighborhoodInput);
        var url = neighborhoodLinks[urlIndex];
        console.log("URL: " + url);

        // Get the coordinates defining the chosen neighborhood and initialize map
        $.ajax({
            url: "https://cors-anywhere.herokuapp.com/" + url,
            method: "GET"
        }).then(function (res) {
            location = res.simple_shape.coordinates[0][0];
            console.log(location);
            initMap(location);
        });


    // Search for a location with Google Places API and initialize markers
    $("#searchLocation").on("submit", function (event) {

        event.preventDefault();
        var placeResults = [];
        var input = $("#search").val();
        console.log(input);
        console.log("radius: " + radius);

        $.ajax({
            url: "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + pointMid.lat + "," + pointMid.lng + "&radius=" + radius + "&type=establishment&keyword=" + input + "&key=" + key,
            method: "GET"
        }).then(function (res) {

            var results = res.results;

            if (results.length === 0) {
                $(".popup").css("visibility", "visible");
                break;
            }
            else {
                $(".popup").css("visibility", "hidden");
                for (let i = 0; i < results.length; i++) {
                    var result = results[i];
                    var name = result.name;
                    var place_id = result.place_id;
                    var coordinates = result.geometry.location;
                    placeResults.push(new Place(name, place_id, coordinates));
                };
                console.log(placeResults);
                initMarkers(placeResults);
            }
        })

        });
        return false;
    });



    // Initialize map
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


            //var marker = new google.maps.Marker({ position: placeResults[i].coordinates, map: map, id: placeResults[i].place_id });

        }
        var polylineOptions = {
            path: boundary,
            strokeColor: "#000080",
            strokeWeight: 2.5
        };
        var polyline = new google.maps.Polyline(polylineOptions);
        polyline.setMap(map);

        console.log(boundary)

        // // Fit map to neighborhood bounds
        // var bounds = new google.maps.LatLngBounds();
        // for (var i = 0; i < boundary.length; i++) {
        //     bounds.extend(boundary[i].getPosition());
        // }
        // map.fitBounds(bounds);
    };

    // Initialize map with markers
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
            strokeColor: "#000080",
            strokeWeight: 2.5
        };
        var polyline = new google.maps.Polyline(polylineOptions);
        polyline.setMap(map);

        var markers = [];
        // Create markers for place search results
        for (let i = 0; i < placeResults.length; i++) {
            var marker = new google.maps.Marker({ position: placeResults[i].coordinates, map: map, id: placeResults[i].place_id });

            marker.addListener('click', function () {
                // for (placeResults[i].place)
                console.log(placeResults[i].place_id);

                var businessName = placeResults[i].name;
                var uniqueID = placeResults[i].place_id;

                sessionStorage.setItem("businessName", businessName);
                sessionStorage.setItem("uniqueID", uniqueID);

                $.ajax({
                    url: "/api/crimes/neighborhoods/" + sessionStorage.getItem("neighborhoodInput"),
                    method: "GET"
                }).then(function (res) {
                    console.log(res[0].rating)
                    $(".businessrating").html(res[0].rating)
                })

                $(".modal2").addClass("is-active");
                if ($(".modal2").hasClass("is-active")) {
                    $.ajax({
                        url: "/api/surveys",
                        method: "GET"
                    }).then(function (response) {

                        var arrayKevin = [];

                        for (let k = 0; k < response.length; k++) {
                            arrayKevin.push(response[k].a1)
                            arrayKevin.push(response[k].a2)
                            arrayKevin.push(response[k].a3)
                            arrayKevin.push(response[k].a4)
                            arrayKevin.push(response[k].a5)
                        };



                        $(".userrating").html(sumOfAll(arrayKevin));



                        for (let i = 0; i < response.length; i++) {
                            if (response[i].uniqueID === uniqueID) {
                                $(".businessName").html(response[i].businessName);

                                if (response.a1 <= 3) {
                                    $(".atmosphere").html("Calming");
                                }
                                else if (response[i].a1 < 7) {
                                    $(".atmosphere").html("Somewhat Distracting");
                                }
                                else if (response[i].a1 > 7) {
                                    $(".atmosphere").html("Alarming");
                                }

                                if (response.a2 <= 3) {
                                    $(".outside").html("Very Clean");
                                }
                                else if (response[i].a2 < 7) {
                                    $(".outside").html("Somewhat Dirty");
                                }
                                else if (response[i].a2 > 7) {
                                    $(".outside").html("Disgusting");
                                }

                                if (response.a3 <= 3) {
                                    $(".comfort").html("Relaxing");
                                }
                                else if (response[i].a3 < 7) {
                                    $(".comfort").html("Somewhat Discomforting");
                                }
                                else if (response[i].a3 > 7) {
                                    $(".comfort").html("Uncomfortable");
                                }

                                if (response.a4 <= 3) {
                                    $(".safety").html("Safe");
                                }
                                else if (response[i].a4 < 7) {
                                    $(".safety").html("Somewhat Threatening");
                                }
                                else if (response[i].a4 > 7) {
                                    $(".safety").html("Threatened");
                                }

                                if (response.a5 <= 3) {
                                    $(".crowd").html("Sparse");
                                }
                                else if (response[i].a5 < 7) {
                                    $(".crowd").html("Somewhat Busy");
                                }
                                else if (response[i].a5 > 7) {
                                    $(".crowd").html("Very Crowded");
                                }
                            }
                        }
                    });
                };
            });
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

    $(".survButton").click(function () {
        var businessName = sessionStorage.getItem("businessName");
        var uniqueID = sessionStorage.getItem("uniqueID");
        var a1 = $("#a1").val();
        var a2 = $("#a2").val();
        var a3 = $("#a3").val();
        var a4 = $("#a4").val();
        var a5 = $("#a5").val();
        var security = $("#security").val();
        var textBox = $("#textBox").val();
        var timeDay = $("#timeday").val();

        var data = { businessName, uniqueID, a1, a2, a3, a4, a5, security, textBox, timeDay };
        console.log(data)

        $.ajax({
            url: "/api/surveys",
            method: "POST",
            data: data
        });
    });



    // add everything in array and returns the average
    function sumOfAll(array) {
        var sum = 0;

        for (var i = 0; i < array.length; i++) {
            sum += array[i];
        };
        // console.log(sum);
        // returns the average of the array
        var average = sum / array.length;
        return average
        // console.log(average);
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

    // Constructor function for place results
    function Place(name, place_id, coordinates) {
        this.name = name,
            this.place_id = place_id,
            this.coordinates = coordinates
    };

    $("#goHome").click(function (data) {
        window.location.replace("../mainpage1");
    });

    // based on the form for survey submission
    // $("").on("submit", function (event) {

    //     $.post(`/neighborhoods/${input}`, (response) => {
    //         console.log(response);
    //     })
    // });
});