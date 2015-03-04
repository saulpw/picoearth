// ----------------------------------------------------------------------------
// Keep track of basic stats
// ----------------------------------------------------------------------------

var population = 2;
var year = -10000;
var birthrate = 0.01;
var deathrate = 0.01;

// ----------------------------------------------------------------------------
// Tech tree
// ----------------------------------------------------------------------------

var techTree = {
    "lust" : {
        "unlocked": false,
        "update" : updateLustFn,
        "promote" : promoteLustFn,
        "ban" : banLustFn,
        "adoption": 50
        },
    "gathering" : {
        "unlocked": false,
        "update" : updateGatheringFn,
        "promote" : promoteGatheringFn,
        "ban" : banGatheringFn,
        "adoption": 20
        },
    "fire" : {
        "unlocked": false,
        "update" : updateFireFn,
        "promote" : promoteFireFn,
        "ban" : banFireFn,
        "adoption": 20
        },        
    "clothing" : {
        "unlocked": false,
        "update" : updateClothingFn,
        "promote" : promoteClothingFn,
        "ban" : banClothingFn,
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
    computePopulation(incr);
    updateUIStats();
}

function computeYear(incr)
{
    year += incr;
}

function computePopulation(incr)
{
    var newHumans = (birthrate - deathrate) * population * incr;

    if (population + incr > 0) {
        population += newHumans;
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
    var percentAdopted = adoptionString(tech);

    if (shouldUnlock) {
        $('#techTree').append(' \
            <div class="row"> \
                <div class="large-8 columns right"> \
                    <ul class="button-group round"> \
                        <li><button class="tiny" id="' + tech +'-promote"> Promote ' + tech + '</button> \
                        </li> \
                        <li><button class="tiny" id="' + tech +'-ban"> Ban ' + tech + '</button> \
                        </li> \
                    </ul> \
                </div> \
                <div class="large-3 columns"> \
                    <p><span id="' + tech +'-adoption"> ' + percentAdopted + '</span>% adopted</p> \
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

    var promoteEnabled =  techTree[tech]["adoption"] < 100;;
    var banEnabled = techTree[tech]["adoption"] > 0;;

    return [shouldUnlock, promoteEnabled, banEnabled];
}

function promoteLustFn()
{
    if (birthrate < 1000) {
        birthrate += .001;    
    }
    
    techTree["lust"]["adoption"]++;
}

function banLustFn()
{
    if (birthrate > 0) {
        birthrate -= .001;    
    }
    
    techTree["lust"]["adoption"]--;
}

// ------
// Gathering
// ------

function updateGatheringFn(tech)
{
    const popThres = 20;

    var shouldUnlock = false;
    if (techTree[tech]["unlocked"] == false && population > popThres) {
        techTree[tech]["unlocked"] = true;
        shouldUnlock = true;    
    }

    var promoteEnabled =  techTree[tech]["adoption"] < 100;;
    var banEnabled = techTree[tech]["adoption"] > 0;;

    return [shouldUnlock, promoteEnabled, banEnabled];
}

function promoteGatheringFn()
{
    if (deathrate > 0) {
        deathrate -= .001;    
    }
    
    techTree["gathering"]["adoption"]++;
}

function banGatheringFn()
{
    if (deathrate < 1000) {
        deathrate += .001;    
    }
    
    techTree["gathering"]["adoption"]--;
}

// ------
// Fire
// ------

function updateFireFn(tech)
{
    const popThres = 100;

    var shouldUnlock = false;
    if (techTree[tech]["unlocked"] == false && population > popThres) {
        techTree[tech]["unlocked"] = true;
        shouldUnlock = true;
    }

    var promoteEnabled =  techTree[tech]["adoption"] < 100;;
    var banEnabled = techTree[tech]["adoption"] > 0;

    return [shouldUnlock, promoteEnabled, banEnabled];

}

function promoteFireFn()
{
    if (deathrate > 0) {
        deathrate -= .01;    
    }
    
    techTree["fire"]["adoption"]++;
}

function banFireFn()
{
    if (deathrate < 1000) {
        deathrate += .01;    
    }
    
    techTree["fire"]["adoption"]--;
}

// ------
// Clothing
// ------

function updateClothingFn(tech)
{
    const popThres = 500;

    var shouldUnlock = false;
    if (techTree[tech]["unlocked"] == false && population > popThres) {
        techTree[tech]["unlocked"] = true;
        shouldUnlock = true;
    }

    var promoteEnabled = techTree[tech]["adoption"] < 100;
    var banEnabled = techTree[tech]["adoption"] > 0;

    return [shouldUnlock, promoteEnabled, banEnabled];

}

function promoteClothingFn()
{
    if (deathrate > 0) {
        deathrate -= .005;    
    }
    
    techTree["clothing"]["adoption"]++;
}

function banClothingFn()
{
    if (deathrate < 1000) {
        deathrate += .005;    
    }
    
    techTree["clothing"]["adoption"]--;
}

// ----------------------------------------------------------------------------
// String representations
// ----------------------------------------------------------------------------

function birthrateString() {
    return birthrate.toFixed(2) + ' per thousand';
}

function deathrateString() {
    return deathrate.toFixed(2) + ' per thousand';
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

function adoptionString(tech) {
    var adoption = techTree[tech]["adoption"];
    return Math.round(adoption);
}
