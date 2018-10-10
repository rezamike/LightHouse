$(document).ready(function () {

    var neighborhoodNames = [];

    // Check for click events on the navbar burger icon
    $(".navbar-menu").click(function () {

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

        // Populate array of neighborhood names
        for (let i = 0; i < paths.length; i++) {
            var path = paths[i];
            var neighborhood = path.slice(14, -27).replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
            neighborhoodNames.push(neighborhood);
        }
        sessionStorage.setItem("neighborhoodNames", JSON.stringify(neighborhoodNames));

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
        sessionStorage.setItem("neighborhoodInput", neighborhoodInput);
    });

    // $("#chose").click(function (data) {
    //     window.location.replace(`../mainmapresults`);
    // });

    $("#goHome").click(function (data) {
        window.location.replace("../mainpage1");
    });

});