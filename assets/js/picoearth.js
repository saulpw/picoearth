// ----------------------------------------------------------------------------
// Keep track of basic stats
// ----------------------------------------------------------------------------

const DEATHRATE_MAX = BIRTHRATE_MAX = 1000;
const DEATHRATE_MIN = BIRTHRATE_MIN = 0;
const A_HUNDRED_PERCENT = 100;
const ZERO_PERCENT = 0;
const MATE_INCREASE = 1000;

var g_population = 1000000;
var g_year = -10000;
var g_birthrate = 40.01;
var g_deathrate = 40; // @todo: capture this as infant mortality + lifespan

// ----------------------------------------------------------------------------
// Internal game stats
// ----------------------------------------------------------------------------
var g_gameSpeed = 1;

// ----------------------------------------------------------------------------
// Tech tree
// ----------------------------------------------------------------------------

var g_techTree = {
    "Foraging" : {
        "unlocked": false,
        "require": {
            "population": 1000000,
            "year": -10000,
            "techs": [],
            "events": []
        },
        "promote" : {
            "birthrate": 0,
            "deathrate": -.001
        },
        "ban" : {
            "birthrate": 0,
            "deathrate": .001
        },
        "adoption": 20
        },
    "Fire" : {
        "unlocked": false,
        "require": {
            "population": 1005000,
            "year": -10000,
            "techs": [],
            "events": []
        },
        "promote" : {
            "birthrate": 0,
            "deathrate": -.005
        },
        "ban" : {
            "birthrate": 0,
            "deathrate": .005
        },
        "adoption": 21
        },        
    "Cave-shelters" : {
        "unlocked": false,
        "require": {
            "population": 1015000,
            "year": -9995,
            "techs": [],
            "events": []
        },
        "promote" : {
            "birthrate": 0,
            "deathrate": -.002
        },
        "ban" : {
            "birthrate": 0,
            "deathrate": .002
        },
        "adoption": 32
        },
    "Cave-drawing" : {
        "unlocked": false,
        "require": {
            "population": 1020000,
            "year": -9990,
            "techs": [],
            "events": []
        },
        "promote" : {
            "birthrate": .001,
            "deathrate": -.001
        },
        "ban" : {
            "birthrate": -.001,
            "deathrate": .001
        },
        "adoption": 12
        },
    "Domestication" : {
        "unlocked": false,
        "require": {
            "population": 1030000,
            "year": -9980,
            "techs": [],
            "events": []
        },
        "promote" : {
            "birthrate": 0,
            "deathrate": -.001
        },
        "ban" : {
            "birthrate": 0,
            "deathrate": .001
        },
        "adoption": 4
        },
    "Cooking" : {
        "unlocked": false,
        "require": {
            "population": 1020000,
            "year": -9990,
            "techs": ["Fire"],
            "events": []
        },
        "promote" : {
            "birthrate": .001,
            "deathrate": -.002
        },
        "ban" : {
            "birthrate": -.001,
            "deathrate": .002
        },
        "adoption": 26
        },
    "Clothing" : {
        "unlocked": false,
        "require": {
            "population": 1040000,
            "year": -9890,
            "techs": [],
            "events": []
        },
        "promote" : {
            "birthrate": 0,
            "deathrate": -.002
        },
        "ban" : {
            "birthrate": 0,
            "deathrate": .002
        },
        "adoption": 34
        },
    "Cultivation" : {
        "unlocked": false,
        "require": {
            "population": 1070000,
            "year": -9800,
            "techs": [],
            "events": []
        },
        "promote" : {
            "birthrate": .002,
            "deathrate": -.001
        },
        "ban" : {
            "birthrate": -.001,
            "deathrate": .002
        },
        "adoption": 13
        }                
    };

var g_naturalDisasters = {
    
    // ---
    // Natural disasters
    // ---
    "CentralChinaFlood": {
        "message": "A series of flood occurs in China, killing 1000000, in the year 1931.",
        "conditions": {
            "year": 1931
        },
        "effects": {
            "death": 1000000
        }        
    },
    "YellowRiverFlood": {
        "message": "A devastating flood overflows on the Yellow River, China, killing 900000, in the year 1931.",
        "conditions": {
            "year": 1887
        },
        "effects": {
            "death": 900000
        }        
    },
    "ShaanxiEarthquake": {
        "message": "A catastrophic earth hits Shaanxi, during Minh dynasty, killing 830000, in the year 1556.",
        "conditions": {
            "year": 1556
        },
        "effects": {
            "death": 830000
        }        
    },
    "TangshanEarthquake": {
        "message": "An earthquake hits Tangshan, China, killing 242000, in the year 1976.",
        "conditions": {
            "year": 1976
        },
        "effects": {
            "death": 242000
        }
    },
    "BholaCyclone": {
        "message": "A devastating tropical cyclone that struck East Pakistan, killing 500,000, in the year 1970.",
        "conditions": {
            "year": 1970
        },
        "effects": {
            "death": 500000
        }
    },
    "IndiaCyclone": {
        "message": "A tropical cyclone has struck India, killing 300000, in the year 1839.",
        "conditions": {
            "year": 1839
        },
        "effects": {
            "death": 300000
        }        
    },
    "CalcuttaCyclone": {
        "message": "A tropical cyclone has struck Calcutta, killing 300000, in the year 1737.",
        "conditions": {
            "year": 1737
        },
        "effects": {
            "death": 300000
        }
    },
    "HaiyuanEarthquake":
    {
        "message": "A 7.8 magnitude hit Haiyuan county, China, killing 73,000 people, in the year 1920.",
        "conditions": {
            "year": 1920
        },
        "effects": {
            "death": 73000
        }
    },
    "IndianOceanEarthquake": {
        "message": "An earthquake has struck Indian Ocean, killing 280,000, in the year 2004.",
        "conditions": {
            "year": 2004
        },
        "effects": {
            "death": 280000
        }        
    },
    "AntiochEarthquake": {
        "message": "An earthquake has struck Antioch in the Byzantine Empire, killing ~250,000 people, in the year 526.",
        "conditions": {
            "year": 526
        },
        "effects": {
            "death": 250000
        }        
    }
};

var g_genericWorldEvents = {
    "GameBegin": {
        "message": "The humans are born in the year 10000BC.",
        "conditions": {
            "year": -10000
        },
    }
}

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
// Run UI update code every x ms
// ----------------------------------------------------------------------------

window.setInterval(function () {

    checkForWorldEvents();
    updateStats();
    updateTechTree();

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

    if (g_population + newHumans > 0) {
        g_population += newHumans;
    }
}

function updateUIStats() {
    $('#game-speed-label').text(gameSpeedString());
    $('#population').text(populationString());
    $('#year').text(yearString());
    $('#birthrate').text(birthrateString());
    $('#deathrate').text(deathrateString());
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

function addTech(tech)
{
    var percentAdopted = adoptionString(tech);
    var tooltipString = 'Promote: ' + g_techTree[tech]["promote"]["birthrate"] + ' birthrate, ' + g_techTree[tech]["promote"]["deathrate"] + ' deathrate, Ban: ' + g_techTree[tech]["ban"]["birthrate"] + ' birthrate, ' + g_techTree[tech]["ban"]["deathrate"];

    $('#tech-tree').append(' \
        <div class="row tech-row"> \
            <div class="large-8 columns right tech-row"> \
                <ul class="button-group round"> \
                    <li><button class="tiny tech-button success" id="' + tech +'-promote"> + ' + tech + '</button> \
                    </li> \
                    <li><button class="tiny tech-button alert" id="' + tech +'-ban"> - ' + tech + '</button> \
                    </li> \
                </ul> \
            </div> \
            <div class="large-4 columns tech-row"> \
                <div data-tooltip aria-haspopup="true" title="' + tooltipString + '" class="has-tip tip-left percent-adoption progress"><span id="' + tech +'-adoption" class="meter" style="width:' + percentAdopted + '%;padding-left:10px">' + percentAdopted + '%</span></div> \
            </div> \
        </div> \
        ');

    // Log event
    var eventMessage = tech + ' is unlocked at year ' + yearString() + '.';
    logging(eventMessage, true);

    // Add promote/ban buttons
    addTechButtons(tech);

    // First promote
    promoteBanTech(tech, true);
}

function shouldUnlockTech(tech)
{
    const popThres = g_techTree[tech]["require"]["population"];
    const yearThres = g_techTree[tech]["require"]["year"];
    const techThres = g_techTree[tech]["require"]["techs"];
    const eventThres = g_techTree[tech]["require"]["events"];

    if (g_techTree[tech]["unlocked"] == false) {

        if (g_population >= popThres && g_year >= yearThres) {

            // Check for required techs
            g_techTree[tech]["unlocked"] = true;        

            for (var requiredTech in eventThres) {
                if (g_techTree[requiredTech]["unlocked"] == false) {
                    g_techTree[tech]["unlocked"] = false; 
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

        var promoteEnabled =  g_techTree[tech]["adoption"] < A_HUNDRED_PERCENT;
        var banEnabled = g_techTree[tech]["adoption"] > ZERO_PERCENT;

        $('#' + tech + '-adoption').css("width", percentAdopted + "%");
        $('#' + tech + '-adoption').html(percentAdopted + "%");
        $('#' + tech + '-promote').prop('disabled', !promoteEnabled);    
        $('#' + tech + '-ban').prop('disabled', !banEnabled);            
    }
}

function promoteBanTech(tech, isPromote)
{
    if (isPromote) {
        if (g_techTree[tech]["adoption"] < A_HUNDRED_PERCENT) {

            var brOffset = g_techTree[tech]["promote"]["birthrate"];
            var drOffset = g_techTree[tech]["promote"]["deathrate"];
            var shouldUpdateAdoption = false;
            
            if ((brOffset < 0 && g_birthrate != BIRTHRATE_MIN) || 
                brOffset > 0 && g_birthrate != BIRTHRATE_MAX)
            {
                g_birthrate += brOffset;
                shouldUpdateAdoption = true;
            }
            
            if ((drOffset < 0 && g_deathrate != DEATHRATE_MIN) || 
                drOffset > 0 && g_deathrate != DEATHRATE_MAX)
            {
                g_deathrate += drOffset;
                shouldUpdateAdoption = true;
            }

            if (shouldUpdateAdoption) {
                g_techTree[tech]["adoption"]++;
            }
        }
    } else {
        if (g_techTree[tech]["adoption"] > ZERO_PERCENT) {

            var brOffset = g_techTree[tech]["ban"]["birthrate"];
            var drOffset = g_techTree[tech]["ban"]["deathrate"];
            var shouldUpdateAdoption = false;

            if ((brOffset < 0 && g_birthrate != BIRTHRATE_MIN) || 
                brOffset > 0 && g_birthrate != BIRTHRATE_MAX)
            {
                g_birthrate += brOffset;
                shouldUpdateAdoption = true;
            }
            if ((drOffset < 0 && g_deathrate != DEATHRATE_MIN) || 
                drOffset > 0 && g_deathrate != DEATHRATE_MAX)
            {
                g_deathrate += drOffset;
                shouldUpdateAdoption = true;
            }

            if (shouldUpdateAdoption) {
                g_techTree[tech]["adoption"]--;
            }
        }
    }
    g_birthrate = g_birthrate.clamp(DEATHRATE_MIN, DEATHRATE_MAX);
    g_deathrate = g_deathrate.clamp(DEATHRATE_MIN, DEATHRATE_MAX);
}

// ----------------------------------------------------------------------------
// World events
// ----------------------------------------------------------------------------

function checkForWorldEvents()
{
    // Generic world events
    for (var ev in g_genericWorldEvents) {
        if (g_genericWorldEvents[ev]["conditions"]["year"] == year()) {
            logging(g_genericWorldEvents[ev]["message"], true, "warning");

            // Set condition to a year that has passed to prevent
            // this event to trigger again
            g_genericWorldEvents[ev]["conditions"]["year"] = year() - 1;
        }
    }

    // Natural disasters
    for (var natDis in g_naturalDisasters) {
        if (g_naturalDisasters[natDis]["conditions"]["year"] == year()) {
            logging(g_naturalDisasters[natDis]["message"], true, 'warning');
            g_population -= g_naturalDisasters[natDis]["effects"]["death"];
            if (g_population < 0) {
                g_population = 0;
            }

            // Set condition to a year that has passed to prevent
            // this event to trigger again
            g_naturalDisasters[natDis]["conditions"]["year"] = year() - 1;
        }
    }

    // Generic events
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
    var string = "";
    
    // billions
    if (Math.floor(pop / 1000000000) > 0) 
    {
        string = (pop / 1000000000).toFixed(3) + " billions"
    }
    // millions
    else if (Math.floor(pop / 1000000) > 0)
    {
        string = (pop / 1000000).toFixed(3) + " millions"

    }
    // thousands
    else if (Math.floor(pop / 1000) > 0)
    {
        string = (pop / 1000).toFixed(3) + " thousands"

    }
    // hundreds
    else if (Math.floor(pop / 100) > 0)
    {
        string = (pop / 100).toFixed(3) + " hundreds"

    }
    else
    {
        string = pop;
    }

    return string;
}

function yearString() {
    var toString = year();
    if (g_year < 1000) {
        toString = -toString + 'BC';
    }
    return toString;
}

function adoptionString(tech) {
    var adoption = g_techTree[tech]["adoption"];
    return Math.round(adoption);
}

function gameSpeedString() {
    return "X" + g_gameSpeed;
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

function addTechButtons(tech)
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
