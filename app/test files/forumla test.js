// Dummy data for 'Overall Outside Rating'
var dummyCrime = [];
var dummyCleanliness = [];
var dummyLighting = [];
var dummyHomelessPop = [];

// Generate dummy data, random number from 1-10
function generateDummy(amountGenerated) {
    for (var i = 0; i < amountGenerated; i++) {
        dummyCrime.push(Math.floor(Math.random() * 10) + 1);
        dummyCleanliness.push(Math.floor(Math.random() * 10) + 1);
        dummyLighting.push(Math.floor(Math.random() * 10) + 1);
        dummyHomelessPop.push(Math.floor(Math.random() * 10) + 1);
    };
    // console.log(dummyCrime);
};

// Adds all numbers in an array together and returns the average
function sumOfAll(array) {
    var sum = 0;

    for (var i = 0; i < array.length; i++) {
        sum += array[i];
    };
    // console.log(sum);
    // returns the average of the array
    var average = sum / array.length;
    // console.log(average);
};