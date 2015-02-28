// ----------------------------------------------------------------------------
// Keep track of basic stats
// ----------------------------------------------------------------------------

var population = 0;
var year = 1800;
var birthrate = 2;
var deathrate = 1;

// ----------------------------------------------------------------------------
// Keep track of upgrade cost
// ----------------------------------------------------------------------------

var lustCost = 10;
var lustUpgraded = false;

// ----------------------------------------------------------------------------
// Game internal states
// ----------------------------------------------------------------------------

var gameUpdateInterval = 10; // ms

// ----------------------------------------------------------------------------
// User interactions
// ----------------------------------------------------------------------------

// Increase population every time mate-button is clicked
$('#mate-button').on('click', function () {
    population++;
});

// Lust upgrades
$('#lust-upgrade').on('click', function () {
    lustUpgraded = true;  
    birthrate++;
});

$('#lust-downgrade').on('click', function() {
    lustUpgraded = false;
    birthrate--;
});

// ----------------------------------------------------------------------------
// Run UI update code every x ms
// ----------------------------------------------------------------------------

window.setInterval(function () {

    // incr amount for every 1ms
    var incr = (1/1000) * gameUpdateInterval;
    
    updateYear(incr);
    updatepopulation(incr * (birthrate - deathrate) );

    updateUIStats();
    updateUITechTree();

}, gameUpdateInterval);

// ----------------------------------------------------------------------------
// Update functions
// ----------------------------------------------------------------------------

function updateYear(incr)
{
    year += incr;
}

function updatepopulation(incr)
{
    population += incr;
}

function updateBirthrate()
{

}

function updateDeathrate()
{

}

function updateUIStats() {
    $('#human-count').text(populationString());
    $('#year').text(yearString());
    $('#birthrate').text(birthrateString());
    $('#deathrate').text(deathrateString());
}

function updateUITechTree()
{
    // Enable/disable the lust buttons based on our population
    $('#lust-upgrade').prop('disabled', lustCost > population);    
    $('#lust-downgrade').prop('disabled', lustCost > population);    
}

// ----------------------------------------------------------------------------
// String representations
// ----------------------------------------------------------------------------

function birthrateString() {
    return Math.ceil(birthrate) + 'k/year';
}

function deathrateString() {
    return Math.ceil(deathrate) + 'k/year';
}

function populationString() {
    // show how many humans we have, using Math.floor() to round down
    return Math.floor(population) + 'k';
}

function yearString() {
    return Math.floor(year);
}
