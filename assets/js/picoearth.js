// Basic variable declaration - keep track of how many of each
// item we currently own, and how much the new ones should cost.
var numHumans = 0;
var numLust = 0;
var lustCost = 10;

// Increase numHumans every time mate-button is clicked
$('#mate-button').on('click', function () {
    numHumans++;
});

// Lust upgrades
$('#lust-upgrade').on('click', function () {    
    numLust++;

    // Deduct cost
    numHumans -= lustCost;
    
    // Increase cost for the next one, using Math.ceil() to round up
    lustCost = Math.ceil(lustCost * 1.1);
});

// Run UI update code every 10ms
window.setInterval(function () {
    // Lust add 1 per second (1/100 every 10ms)
    numHumans += (numLust * 1 / 100);

    // Update the text showing how many humans we have, using Math.floor() to round down
    $('#human-count').text(Math.floor(numHumans));

    // Update the lust cost with its price
    $('#lust-upgrade').text('Get more lust - ' + lustCost);

    // Enable/disable the lust buttons based on our numHumans
    $('#lust-upgrade').prop('disabled', lustCost > numHumans);
}, 10);