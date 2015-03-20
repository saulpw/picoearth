// ----------------------------------------------------------------------------
// Keep track of basic stats
// ----------------------------------------------------------------------------

const DEATHRATE_MAX = BIRTHRATE_MAX = 1000;
const DEATHRATE_MIN = BIRTHRATE_MIN = 0;
const A_HUNDRED_PERCENT = 100;
const ZERO_PERCENT = 0;
const MATE_INCREASE = 1000;

var g_population = 1000;
var g_year = -10000;
var g_birthrate = 40;
var g_deathrate = 40; // @todo: capture this as infant mortality + lifespan

// ----------------------------------------------------------------------------
// Internal game stats
// ----------------------------------------------------------------------------
var g_gameSpeed = 1;

// ----------------------------------------------------------------------------
// Tech tree
// ----------------------------------------------------------------------------

var g_techTree = {
    "foraging" : {
        "unlocked": false,
        "require": {
            "population": 5000,
            "year": -10000,
            "techs": [],
            "events": []
        },
        "promote" : {
            "birthrate": 0,
            "deathrate": -.01
        },
        "ban" : {
            "birthrate": 0,
            "deathrate": .01
        },
        "adoption": 20
        },
    "shelters" : {
        "unlocked": false,
        "require": {
            "population": 10000,
            "year": -10000,
            "techs": [],
            "events": []
        },
        "promote" : {
            "birthrate": 0,
            "deathrate": -.02
        },
        "ban" : {
            "birthrate": 0,
            "deathrate": .02
        },
        "adoption": 20
        },
    "fire" : {
        "unlocked": false,
        "require": {
            "population": 20000,
            "year": -10000,
            "techs": [],
            "events": []
        },
        "promote" : {
            "birthrate": 0,
            "deathrate": -.05
        },
        "ban" : {
            "birthrate": 0,
            "deathrate": .05
        },
        "adoption": 20
        },        
    "cooking" : {
        "unlocked": false,
        "require": {
            "population": 30000,
            "year": -10000,
            "techs": [],
            "events": []
        },
        "promote" : {
            "birthrate": 0,
            "deathrate": -.05
        },
        "ban" : {
            "birthrate": 0,
            "deathrate": .05
        },
        "adoption": 20
        },
    "clothing" : {
        "unlocked": false,
        "require": {
            "population": 50000,
            "year": -10000,
            "techs": [],
            "events": []
        },
        "promote" : {
            "birthrate": 0,
            "deathrate": -.06
        },
        "ban" : {
            "birthrate": 0,
            "deathrate": .06
        },
        "adoption": 20
        },
    "farming" : {
        "unlocked": false,
        "require": {
            "population": 100000,
            "year": -10000,
            "techs": [],
            "events": []
        },
        "promote" : {
            "birthrate": 1,
            "deathrate": -.05
        },
        "ban" : {
            "birthrate": -1,
            "deathrate": .05
        },
        "adoption": 20
        }                
    };

var g_naturalDisasters = {
    
    /*
    - Ischemic heart disease
    - Cerebrovascular disease
    - Lower respiratory infections
    - Chronic obstructive pulmonary disease
    - Cancers
    - Road traffic accidents
    - Malaria
    - Tuberculosis
    - Measles
    - Influenza
    - Cholera
    - Diarrhea
    - AIDS
    - Flood
    - Volcanic eruption
    - Hurricane
    - Forest fire
    - Tsunami
    - Plague
    - Famine
    - Drought
    - Heat stroke
    */

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
    },
    "test": {
        "message": "test event",
        "conditions": {
            "year": -9999
        },
        "effects": {
            "death": 1
        }
    }
};

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
    logging("Humans are born in " + yearString() + ".", true);
});

// ----------------------------------------------------------------------------
// Run UI update code every x ms
// ----------------------------------------------------------------------------

window.setInterval(function () {

    updateStats();
    updateTechTree();
    checkForWorldEvents();

}, gameUpdateInterval);

// ----------------------------------------------------------------------------
// Update stats functions
// ----------------------------------------------------------------------------

function updateStats()
{
    // incr amount for every *gameSpeed* in ms
    var incr = (g_gameSpeed/1000) * gameUpdateInterval;

    computeYear(incr);
    computePopulation(incr);
    updateUIStats();
}

function computeYear(incr)
{
    g_year += incr;
}

function computePopulation(incr)
{
    var newHumans = ((g_birthrate - g_deathrate) / 1000) * g_population * incr;

    if (g_population + incr > 0) {
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

    $('#tech-tree').append(' \
        <div class="row tech-row"> \
            <div class="large-8 columns right tech-row"> \
                <ul class="button-group round"> \
                    <li><button class="tiny tech-button success" id="' + tech +'-promote"> Pro ' + tech + '</button> \
                    </li> \
                    <li><button class="tiny tech-button alert" id="' + tech +'-ban"> Ban ' + tech + '</button> \
                    </li> \
                </ul> \
            </div> \
            <div class="large-4 columns tech-row"> \
                <div class="percent-adoption progress"><span id="' + tech +'-adoption" class="meter" style="width:' + percentAdopted + '%;padding-left:10px">' + percentAdopted + '%</span></div> \
            </div> \
        </div> \
        ');

    // Log event
    var eventMessage = tech + ' is unlocked at year ' + yearString() + '.';
    logging(eventMessage, true);

    // Add promote/ban buttons
    addTechButtons(tech);
}

function shouldUnlockTech(tech)
{
    const popThres = g_techTree[tech]["require"]["population"];
    const yearThres = g_techTree[tech]["require"]["year"];
    const techThres = g_techTree[tech]["require"]["techs"];
    const eventThres = g_techTree[tech]["require"]["events"];

    if (g_techTree[tech]["unlocked"] == false) {

        if (g_population >= popThres && g_year >= yearThres) {
            g_techTree[tech]["unlocked"] = true;
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
        var banEnabled = g_techTree[tech]["adoption"] > ZERO_PERCENT;;

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

function year()
{
    return Math.floor(g_year);
}

function checkForWorldEvents()
{
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
}

function naturalGrowthRate(year)
{

// Based on the estimation table here https://www.census.gov/population/international/data/worldpop/table_history.php
// the polynomial trendline is:
// Population growth estimation = 2.7x^2 - 60x + 300
//
// We're going to generate a natural growth rate using this estimation.
//
    return 2.7 * pow(year + 10000, 2) - 60 * year + 300
}

// ----------------------------------------------------------------------------
// String representations
// ----------------------------------------------------------------------------

function birthrateString() {
    return g_birthrate.toFixed(2).toString().replace('-','') + ' per thousand';
}

function deathrateString() {
    return g_deathrate.toFixed(2).toString().replace('-','') + ' per thousand';
}

function populationString() {
    var pop = Math.floor(g_population)
    var string = "";
    
    // billions
    if (Math.floor(pop / 1000000000) > 0) 
    {
        string = Math.floor(pop / 1000000000) + " billions"
    }
    // millions
    else if (Math.floor(pop / 1000000) > 0)
    {
        string = Math.floor(pop / 1000000) + " millions"

    }
    // thousands
    else if (Math.floor(pop / 1000) > 0)
    {
        string = Math.floor(pop / 1000) + " thousands"

    }
    // hundreds
    else if (Math.floor(pop / 100) > 0)
    {
        string = Math.floor(pop / 100) + " hundreds"

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
    } else {
        toString += 'AD'
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
