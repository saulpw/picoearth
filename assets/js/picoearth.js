// ----------------------------------------------------------------------------
// Keep track of basic stats
// ----------------------------------------------------------------------------

const DEATHRATE_MAX = BIRTHRATE_MAX = 1000;
const DEATHRATE_MIN = BIRTHRATE_MIN = 0;
const A_HUNDRED_PERCENT = 100;
const ZERO_PERCENT = 0;

var g_population = 2;
var g_year = -10000;
var g_birthrate = 2;
var g_deathrate = 2; // @todo: capture this as infant mortality + lifespan

// ----------------------------------------------------------------------------
// Tech tree
// ----------------------------------------------------------------------------

var g_techTree = {
    "foraging" : {
        "unlocked": false,
        "require": {
            "population": 5,
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
            "population": 10,
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
            "population": 20,
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
            "population": 30,
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
            "population": 50,
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
            "population": 100,
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

// ----------------------------------------------------------------------------
// Game internal states
// ----------------------------------------------------------------------------

var gameUpdateInterval = 10; // ms

// ----------------------------------------------------------------------------
// User interactions
// ----------------------------------------------------------------------------

$('#mate-button').on('click', function () {
    g_population++;
    bounceButton($('#mate-button'));
});

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

}, gameUpdateInterval);

// ----------------------------------------------------------------------------
// Update stats functions
// ----------------------------------------------------------------------------

function updateStats()
{
    // incr amount for every 1ms
    var incr = (1/1000) * gameUpdateInterval;

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
// String representations
// ----------------------------------------------------------------------------

function birthrateString() {
    return g_birthrate.toFixed(2).toString().replace('-','') + ' per thousand';
}

function deathrateString() {
    return g_deathrate.toFixed(2).toString().replace('-','') + ' per thousand';
}

function populationString() {
    // show how many humans we have, using Math.floor() to round down
    return Math.floor(g_population);
}

function yearString() {
    var toString = Math.floor(g_year);
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

// ----------------------------------------------------------------------------
// Logging functions
// ----------------------------------------------------------------------------

function popupAlert(str)
{
    $('#alert-area').prepend(' \
        <div class="alert-box secondary round" data-alert>' +
          str +
          '<a href="#" class="close"> &times; </a> \
        </div> \
        ').foundation(
            "alert",
            undefined, 
            {speed: "slow", animation: "slideUp", callback: function() {}}
            );
}

function logging(eMsg, popup)
{
    $('#log').prepend('<div>' + eMsg + '</div>' );
    
    popup = typeof popup !== 'undefined' ? popup : false;
    if (popup) {
        popupAlert(eMsg);        
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

// ----------------------------------------------------------------------------
// Math functions
// ----------------------------------------------------------------------------

Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};
