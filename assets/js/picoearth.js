// ----------------------------------------------------------------------------
// Keep track of basic stats
// ----------------------------------------------------------------------------

const DEATHRATE_MAX = BIRTHRATE_MAX = 1000;
const DEATHRATE_MIN = BIRTHRATE_MIN = 0;
const A_HUNDRED_PERCENT = 100;
const ZERO_PERCENT = 0;
const ZERO = 0;
const MATE_INCREASE = 1000;

var g_population = 1000000;
var g_year = -10000;
var g_birthrate = 40.01;
var g_deathrate = 40; // @todo: capture this as infant mortality + lifespan
var g_foodSource = 1000000;

// ----------------------------------------------------------------------------
// Internal game stats
// ----------------------------------------------------------------------------

var g_gameSpeed = 1;

// ----------------------------------------------------------------------------
// Game internal states
// ----------------------------------------------------------------------------

var gameUpdateInterval = 10; // ms

// ----------------------------------------------------------------------------
// User interactions
// ----------------------------------------------------------------------------

// ---
// Buttons
// ---
$('#mate-button').on('click', mate);
$('#forward-button').on('click', forwardGame);

// ---
// Graph area
// ---
$('#graph-accordion').on('toggled', function (event, accordion) {
    
    // Toggle arrow when expand/close graph
    if ($('#graph-area').hasClass("active")) {
        $('#graph-banner').html("Graph <i class='fa fa-arrow-up right'></i>");    
    } else {
        $('#graph-banner').html("Graph <i class='fa fa-arrow-down right'></i>");    
    }    
});

// ---
// Log
// ---
$('#log-accordion').on('toggled', function (event, accordion) {
    
    // Toggle arrow when expand/close log
    if ($('#log').hasClass("active")) {
        $('#log-banner').html("Log <i class='fa fa-arrow-up right'></i>");    
    } else {
        $('#log-banner').html("Log <i class='fa fa-arrow-down right'></i>");    
    }    
});

// ----------------------------------------------------------------------------
// Initialization
// ----------------------------------------------------------------------------

$(document).ready( function () {
    for (var tech in g_techTree) {
        addTechPreview(tech);
    }
});


// Setup graph area
var ctx = $('#graph-population').get(0).getContext("2d");
var g_popGraphData = {
    labels: [yearString()],
    datasets: [
        {
            label: "Population",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [g_population]
        }
    ]
};
var g_popChart = new Chart(ctx).Line(g_popGraphData, {
    pointDot : false,
    bezierCurve : true,
    datasetStrokeWidth : 1,
    scaleFontSize: 8,
    animation: false,
    scaleShowHorizontalLines: false,
});

ctx = $('#graph-BRDR').get(0).getContext("2d");
var g_BRDRGraphData = {
    labels: [yearString()],
    datasets: [
        {
            label: "Birthrate",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [g_birthrate]
        },
        {
            label: "Deathrate",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: [g_deathrate]
        }
    ]
};
var g_BRDRChart = new Chart(ctx).Line(g_BRDRGraphData, {
    pointDot : false,
    bezierCurve : true,
    datasetStrokeWidth : 1,
    scaleFontSize: 8,
    animation: false,
    scaleShowHorizontalLines: false,
});

// ----------------------------------------------------------------------------
// Game functions
// ----------------------------------------------------------------------------

function checkGameOver() {
    if (g_foodSource == 0) {
        return true;
    }

    return false;
}

var g_shownGameOver = false;
function showGameOver() {
    
    if (g_shownGameOver == false) {
        alert("Game over");
        g_shownGameOver = true;
    }

}

// ----------------------------------------------------------------------------
// Game loop
// ----------------------------------------------------------------------------

window.setInterval(function () {

    if(!checkGameOver()) {
        runWorldEvents();
        updateStats();
        updateTechTree();
    } else {
        showGameOver();
    }

}, gameUpdateInterval);

// ----------------------------------------------------------------------------
// Update stats functions
// ----------------------------------------------------------------------------

function updateStats()
{
    // incr amount for every *gameSpeed* in ms
    var incr = (g_gameSpeed/1000) * gameUpdateInterval;

    updateYear(incr);
    updatePopulation(incr);
    updateFoodSource(incr);
    updateUIStats();
}

function updateYear(incr)
{
    var curYear = year();
    g_year += incr;
    
    // Check for new year events   
    if (curYear != year()) {
        evNewYear();
    }
}

function updatePopulation(incr)
{
    var newHumans = ((g_birthrate - g_deathrate) / 1000) * g_population * incr;

    // Make sure population doesn't go negative
    if (g_population + newHumans > 0) {
        g_population += newHumans;
    }
}

function updateFoodSource(incr)
{
    // Gather all tech that can effect food source per year
    var newFs = 0;
    for (var tech in g_techTree) {

        if (getVFK(g_techTree, tech, "unlocked")) {
            var fsOffset = getVFK(g_techTree, tech, "per-year", "food-source");
            var techAdoptionPercentage = getVFK(g_techTree, tech, "adopt-percent");
            
            if (isDefined(fsOffset)) {

                // If there's a food source offset, apply it
                newFs += (fsOffset * (techAdoptionPercentage / 100) * g_population);  
            }
        }
    }

    newFs *= incr;

    // Make sure food source doesn't go negative
    if (g_foodSource + newFs > 0) {
        g_foodSource += newFs;
    } else {
        g_foodSource = 0;
    }
}

function updateUIStats() {
    $('#game-speed-label').text(gameSpeedString());
    $('#population').text(populationString());
    $('#year').text(yearString());
    $('#birthrate').text(birthrateString());
    $('#deathrate').text(deathrateString());
    $('#food').text(foodSourceString());
}

function addDataToGraphs()
{
    g_popChart.addData([population()], yearString());
    g_BRDRChart.addData([g_birthrate, g_deathrate], yearString());    
}

function removeDataFromGraphs()
{
    g_popChart.removeData();
    g_BRDRChart.removeData();
}

// ----------------------------------------------------------------------------
// Update tech tree
// ----------------------------------------------------------------------------

function updateTechTree()
{
    for (var tech in g_techTree) {

        if (shouldUnlockTech(tech)) {
            addTech(tech);
        }
        updateTech(tech);
    }
}

function addTechPreview(tech) 
{
    $('#tech-tree').append(' \
        <div class="row tech-row" id="' + tech + '-row"> \
            <div class="large-8 columns right tech-row"> \
                <ul class="button-group round"> \
                    <li><button class="tiny tech-button secondary disabled" id="' + tech +'-promote"> ???? </button> \
                    </li> \
                    <li><button class="tiny tech-button secondary disabled" id="' + tech +'-ban"> ???? </button> \
                    </li> \
                </ul> \
            </div> \
        </div> \
        ');    
}

function addTech(tech)
{
    var percentAdopted = adoptionString(tech);
    var tooltipString = "";
    
    // Display per-year effects
    var brOffset = getVFK(g_techTree, tech, "per-year", "birth-per-thousand");
    if (isDefined(brOffset)) {
        tooltipString += brOffset + " birth/thousand/year\n";
    }

    var drOffset = getVFK(g_techTree, tech, "per-year", "death-per-thousand");
    if (isDefined(drOffset)) {
        tooltipString += drOffset + " death/thousand/year\n";
    }

    var fsOffset = getVFK(g_techTree, tech, "per-year", "food-source");
    if (isDefined(fsOffset)) {
        tooltipString += fsOffset + " food/year\n";
    }

    $('#' + tech + '-row').html(' \
        <div class="large-8 columns right tech-row"> \
            <ul class="button-group round"> \
                <li><button class="tiny tech-button success" id="' + tech +'-promote"> + ' + tech + '</button> \
                </li> \
                <li><button class="tiny tech-button alert" id="' + tech +'-ban"> - ' + tech + '</button> \
                </li> \
            </ul> \
        </div> \
        <div class="large-1 columns tech-row"> \
            <span data-tooltip aria-haspopup="true" title="' + tooltipString + '" class="has-tip tip-left small-font">' + tech + '</span> \
        </div> \
        <div class="large-3 columns tech-row"> \
            <div class="percent-adoption progress"> \
                <span id="' + tech +'-adoption" class="meter" style="width:' + percentAdopted + '%;padding-left:10px">' + percentAdopted + '%</span> \
            </div> \
        </div> \
        ');

    // Log event
    var eventMessage = tech + ' is unlocked at year ' + yearString() + '.';
    logging(eventMessage, true);

    // bind promote/ban buttons events
    bindPromoteBanButonEvents(tech);

    // First promote
    promoteBanTech(tech, true);
}

function shouldUnlockTech(tech)
{
    const popThres = getVFK(g_techTree, tech, "require", "population");
    const yearThres = getVFK(g_techTree, tech, "require", "year");
    const techThres = getVFK(g_techTree, tech, "require", "techs");
    const eventThres = getVFK(g_techTree, tech, "require", "events");

    if (getVFK(g_techTree, tech, "unlocked") == false) {

        // Check if population & year threshold are reached
        if (g_population >= popThres && g_year >= yearThres) {

            // Check if required techs are all unlocked
            g_techTree[tech]["unlocked"] = true;        

            for (var requiredTech in eventThres) {
                if (getVFK(g_techTree, requiredTech, "unlocked") == false) {
                    break;       
                }
            }
            return true;
        }
    }
    return false;
}

function updateTech(tech)
{
    var percentAdopted = adoptionString(tech);

    if (g_techTree[tech]["unlocked"]) {

        var promoteEnabled =  getVFK(g_techTree, tech, "adopt-percent") < A_HUNDRED_PERCENT;
        var banEnabled = getVFK(g_techTree, tech, "adopt-percent") > ZERO_PERCENT;

        $('#' + tech + '-adoption').css("width", percentAdopted + "%");
        $('#' + tech + '-adoption').html(percentAdopted + "%");
        $('#' + tech + '-promote').prop('disabled', !promoteEnabled);    
        $('#' + tech + '-ban').prop('disabled', !banEnabled);            
    }
}

function promoteBanTech(tech, isPromote)
{
    var brOffset = getVFK(g_techTree, tech, "per-year", "birth-per-thousand");
    var drOffset = getVFK(g_techTree, tech, "per-year", "death-per-thousand");
    var shouldUpdateAdoption = false;

    // Update birthrate
    if (isDefined(brOffset) &&
        ((brOffset < 0 && g_birthrate != BIRTHRATE_MIN) || 
        (brOffset > 0 && g_birthrate != BIRTHRATE_MAX)))
    {
        g_birthrate += brOffset;
        shouldUpdateAdoption = true;
    }

    // Update death rate
    if (isDefined(drOffset) &&
        ((drOffset < 0 && g_deathrate != DEATHRATE_MIN) || 
        (drOffset > 0 && g_deathrate != DEATHRATE_MAX)))
    {
        g_deathrate += drOffset;
        shouldUpdateAdoption = true;
    }

    if (shouldUpdateAdoption) {
        var adoptPercent = getVFK(g_techTree, tech, "adopt-percent");
        if (isPromote) {
            setVFK(g_techTree, adoptPercent + 1, tech, "adopt-percent");
        } else {
            setVFK(g_techTree, adoptPercent - 1, tech, "adopt-percent");
        }
    }

    g_birthrate = g_birthrate.clamp(DEATHRATE_MIN, DEATHRATE_MAX);
    g_deathrate = g_deathrate.clamp(DEATHRATE_MIN, DEATHRATE_MAX);
}

// ----------------------------------------------------------------------------
// Dictionary getter/setter
// ----------------------------------------------------------------------------

// @function        getVFK
//
// @description     Get value from keys.
//                  Retrieve the value of the keys specified from a dictionary.
//
// @note            This is meant to be a variardic function. Intermediate key values will
//                  be checked against 'undefined'.
//
// @return          undefined if value or key doesn't exist.
//

function getVFK(dict)
{
    // Retrieve a property and check for undefined intermediate keys

    var intermediate = dict;
    for (var i = 1; i < arguments.length; i++) {
        var key = arguments[i];
        intermediate = intermediate[key];
        if (typeof intermediate == 'undefined') {
            return undefined;
        }
    }

    return intermediate;
}

// @function    setVFK
//
// @description Set value for keys.
//              Set a value for the keys specified for a dictionary.
//
// @note        This is meant to be a variardic function.
//              Does nothing if key doesn't exist.
//

function setVFK(dict, value)
{
    var intermediate = dict;
    // Loop through all intermediate keys. Starts at arg index 2.
    for (var i = 2; i < arguments.length-1; i++) {
        var key = arguments[i];
        intermediate = intermediate[key];
        if (typeof intermediate == 'undefined') {
            return;
        }
    }

    // Assign value for the last key specified
    var key = arguments[arguments.length-1];
    intermediate[key] = value;
}

// ----------------------------------------------------------------------------
// World events
// ----------------------------------------------------------------------------

function evNewYear()
{
    if (year() % 100 == 0) {

        // update graphs
        addDataToGraphs();

        // remove the first points in each data sets        
        if (year() > -8000) {
            removeDataFromGraphs();
        }
    }

    // @todo: Earth resources should grow back a bit
    
}

function runWorldEvents()
{
    runGenericWorldEvents();
    runNaturalDisasterEvents();
}

function runNaturalDisasterEvents()
{
    for (var natDis in g_worldEvents["natural-disasters"]) {
        if (getVFK(g_worldEvents["natural-disasters"], 
                    natDis, 
                    "conditions", 
                    "year") == year()) {

            logging(getVFK(g_worldEvents["natural-disasters"], natDis, "message"), true, 'warning');

            // Natural disasters kill people!
            g_population -= getVFK(g_worldEvents["natural-disasters"], 
                                    natDis, 
                                    "effects", 
                                    "death");
            if (g_population < 0) {
                g_population = 0;
            }

            // Set condition to a year that has passed to prevent
            // this event to trigger again
            g_worldEvents["natural-disasters"][natDis]["conditions"]["year"] = year() - 1;
        }
    }
}

function runGenericWorldEvents()
{
    for (var ev in g_worldEvents["generic"]) {
        if (getVFK(g_worldEvents["generic"], ev, "conditions", "year") == year()) {
            logging(getVFK(g_worldEvents["generic"], ev, "message"), true, "warning");

            // Set condition to a year that has passed to prevent
            // this event to trigger again
            g_worldEvents["generic"][ev]["conditions"]["year"] = year() - 1;
        }
    }
}

// ----------------------------------------------------------------------------
// Getters
// ----------------------------------------------------------------------------

function year()
{
    return Math.floor(g_year);
}

function population()
{
    return Math.floor(g_population);
}

// ----------------------------------------------------------------------------
// String representations
// ----------------------------------------------------------------------------

function birthrateString() {
    return g_birthrate.toFixed(3).toString().replace('-','') + ' per thousand';
}

function deathrateString() {
    return g_deathrate.toFixed(3).toString().replace('-','') + ' per thousand';
}

function populationString() {
    var pop = population();
    return numberStringUnit(pop);
}

function yearString() {
    var toString = year();
    if (g_year < 1000) {
        toString = -toString + 'BC';
    }

    if (year() < -3500) {
        toString += ' (Prehistoric)';
    } else if (year() < 500) {
        toString += ' (Ancient world)';
    } else if (year() < 1500) {
        toString += ' (Medieval world)';
    } else {
        toString += ' (Modern world)';
    }

    return toString;
}

function adoptionString(tech) {
    var adoption = g_techTree[tech]["adopt-percent"];
    return Math.round(adoption);
}

function gameSpeedString() {
    return "X" + g_gameSpeed;
}

function foodSourceString() {
    return numberStringUnit(g_foodSource);
}

// Returns number string with 'billions/millions/thousands/hundreds'
function numberStringUnit(number)
{
    var string = "";
    
    // billions
    if (Math.floor(number / 1000000000) > 0) 
    {
        string = (number / 1000000000).toFixed(3) + " billions"
    }
    // millions
    else if (Math.floor(number / 1000000) > 0)
    {
        string = (number / 1000000).toFixed(3) + " millions"

    }
    // thousands
    else 
    {
        string = Math.ceil(number);
    }

    return string;
}

// ----------------------------------------------------------------------------
// Logging functions
// ----------------------------------------------------------------------------

function popupAlert(str, level)
{
    $('#alert-area').prepend(' \
        <div class="alert-box secondary round ' + level + '" data-alert>' +
          str +
          '<a href="#" class="close"> &times; </a> \
        </div> \
        ').foundation(
            "alert",
            undefined, 
            {speed: "slow", animation: "slideUp", callback: function() {}}
            );
}

function logging(eMsg, popup, level)
{
    $('#log').prepend('<div>' + eMsg + '</div>' );
    
    popup = typeof popup !== 'undefined' ? popup : false;
    if (popup) {
        popupAlert(eMsg, level);        
    }    
}

// ----------------------------------------------------------------------------
// Button functions
// ----------------------------------------------------------------------------

function bindPromoteBanButonEvents(tech)
{
    var interval;
    var promoteButton = $('#' + tech + '-promote');
    var banButton = $('#' + tech + '-ban');

/* Uncomment to allow press-hold instead
    promoteButton.bind('mousedown',function(e) {
        clearInterval(interval);
        interval = setInterval(function() {
            promoteBanTech(tech, true)
        }, 60); 
    });

    promoteButton.bind('mouseup',function(e) {
        clearInterval(interval);
    });

    banButton.bind('mousedown',function(e) {
        clearInterval(interval);
        interval = setInterval(function() {
            promoteBanTech(tech, false)
        }, 60); 
    });

    banButton.bind('mouseup',function(e) {
        clearInterval(interval);
    });
*/
    promoteButton.bind('mousedown', function(e) {
        promoteBanTech(tech, true);
    });

    banButton.bind('mousedown', function(e) {
        promoteBanTech(tech, false);
    });
}

function bounceButton(button)
{
    button.effect("bounce", {distance: 10}, 1 );
}

function mate()
{
    g_population += MATE_INCREASE;
}

function forwardGame()
{   
    switch(g_gameSpeed)
    {
        case 1:
            g_gameSpeed = 4;
            break;
        case 4:
            g_gameSpeed = 16;
            break;
        case 16:
            g_gameSpeed = 32;
            break;
        case 32:
            g_gameSpeed = 1;
            break;
        default:
            g_gameSpeed = 1;
            break;
    }
}
// ----------------------------------------------------------------------------
// Math functions
// ----------------------------------------------------------------------------

Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};

// ----------------------------------------------------------------------------
// Other helpers
// ----------------------------------------------------------------------------

//
// @function    isDefined
//
// @return      true if the variable is not 'undefined'
function isDefined(variable)
{
    return typeof variable != 'undefined';
}