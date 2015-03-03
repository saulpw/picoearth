// ----------------------------------------------------------------------------
// Keep track of basic stats
// ----------------------------------------------------------------------------

var population = 2;
var year = -10000;
var birthrate = 0;
var deathrate = 0;

// ----------------------------------------------------------------------------
// Tech tree
// ----------------------------------------------------------------------------

var techTree = {
    "lust" : {
        "unlocked": false,
        "update" : updateLustFn,
        "promote" : promoteLustFn,
        "ban" : banLustFn,
        "adoption": 0
        },
    "clothing" : {
        "unlocked": false,
        "update" : updateClothingFn,
        "promote" : promoteClothingFn,
        "ban" : banClothingFn,
        "adoption": 0
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
    population++;
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
    computePopulation(incr * (birthrate - deathrate) );
    updateUIStats();
}

function computeYear(incr)
{
    year += incr;
}

function computePopulation(incr)
{
    if (population + incr > 0) {
        population += incr;
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
    for (var tech in techTree) {
        var update = techTree[tech]["update"](tech);
        updateUITechTree(tech, update[0], update[1], update[2]);
    }
}

function updateUITechTree(tech, shouldUnlock, promoteEnabled, banEnabled)
{
    var percentAdopted = techTree[tech]["adoption"];

    if (shouldUnlock) {
        $('#techTree').append(' \
            <div class="row"> \
                <div class="large-8 columns"> \
                    <ul class="button-group round"> \
                        <li><button id="' + tech +'-promote"> Promote ' + tech + '</button> \
                        </li> \
                        <li><button id="' + tech +'-ban"> Ban ' + tech + '</button> \
                        </li> \
                    </ul> \
                </div> \
                <div class="large-1 columns"> \
                    <p><span id="' + tech +'-adoption"> ' + percentAdopted + '</span>%</p> \
                </div> \
            </div> \
            ');

        $('#log').prepend('<div>' + tech + ' is unlocked at year ' + yearString() + '.</div>' );
    
        $('#' + tech + '-promote').on('click', techTree[tech]["promote"]);    
        $('#' + tech + '-ban').on('click', techTree[tech]["ban"]);    
    }

    $('#' + tech + '-adoption').text(percentAdopted.toFixed(1));
    $('#' + tech + '-promote').prop('disabled', !promoteEnabled);    
    $('#' + tech + '-ban').prop('disabled', !banEnabled);    

}

// ------
// Lust
// ------

function updateLustFn(tech)
{
    const popThres = 10;

    var shouldUnlock = false;
    if (techTree[tech]["unlocked"] == false && population > popThres) {
        techTree[tech]["unlocked"] = true;
        shouldUnlock = true;    
    }

    var promoteEnabled =  population > popThres;
    var banEnabled = population > popThres && birthrate > 0;

    return [shouldUnlock, promoteEnabled, banEnabled];
}

function promoteLustFn()
{
    if (birthrate < 1000) {
        birthrate++;    
    }
    
    techTree["lust"]["adoption"] = birthrate / 1000 * 100;
}

function banLustFn()
{
    if (birthrate > 0) {
        birthrate--;    
    }
    
    techTree["lust"]["adoption"] = birthrate / 1000 * 100;
}

// ------
// Clothing
// ------

function updateClothingFn(tech)
{
    const popThres = 100;

    var shouldUnlock = false;
    if (techTree[tech]["unlocked"] == false && population > popThres) {
        techTree[tech]["unlocked"] = true;
        shouldUnlock = true;
    }

    var promoteEnabled =  population > popThres;
    var banEnabled = population > popThres && birthrate > 0;

    return [shouldUnlock, promoteEnabled, banEnabled];

}

function promoteClothingFn()
{
    if (birthrate < 1000) {
        birthrate++;    
    }
    
    techTree["clothing"]["adoption"] = birthrate / 1000 * 100;
}

function banClothingFn()
{
    if (birthrate > 0) {
        birthrate--;    
    }
    
    techTree["clothing"]["adoption"] = birthrate / 1000 * 100;
}


// ----------------------------------------------------------------------------
// String representations
// ----------------------------------------------------------------------------

function birthrateString() {
    return Math.ceil(birthrate) + ' per thousand';
}

function deathrateString() {
    return Math.ceil(deathrate) + ' per thousand';
}

function populationString() {
    // show how many humans we have, using Math.floor() to round down
    return Math.floor(population);
}

function yearString() {
    var toString = Math.floor(year);
    if (year < 1000) {
        toString = -toString + 'BC';
    } else {
        toString += 'AD'
    }
    return toString;
}
