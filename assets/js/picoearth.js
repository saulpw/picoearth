const DEATHRATE_MAX = BIRTHRATE_MAX = 1000;
const DEATHRATE_MIN = BIRTHRATE_MIN = 0;
const DEATHRATE_BASE = 40;
const BIRTHRATE_BASE = 40;
const A_HUNDRED_PERCENT = 100;
const ZERO_PERCENT = 0;
const ZERO = 0;
const MATE_INCREASE = 10;
const START_YEAR = -10000;

// Enum for danger level
var DANGER_LEVEL = {
    DEAD: 0,
    NEAR_DESTROYED: 1,
    THREATENED: 2,
    SAFE: 3
};

// Enum for health level
var HEALTH_LEVEL = {
    EXCELLENT: 0,
    GETTING_BY: 1,
    SICK: 2,
    DYING: 3
};

// Enum for inspiration level
var INSPIRATION_LEVEL = {
    PUMPED_UP: 0,
    BORED: 1,
    EXHAUSTED: 2,
    LOST_SOUL: 3
};

// Enum for happiness level
var HAPPINESS_LEVEL = {
    CHEERFUL: 0,
    INDIFFERENT: 1,
    SAD: 2,
    DEVASTATED: 3
};

// ----------------------------------------------------------------------------
// Keep track of basic stats
// ----------------------------------------------------------------------------

// Human stats
var g_humanDanger = DANGER_LEVEL.SAFE;
var g_population = 100;
var g_birthrate = DEATHRATE_BASE;
var g_deathrate = BIRTHRATE_BASE; // @todo: capture this as infant mortality + lifespan
var g_health = HEALTH_LEVEL.GETTING_BY;
var g_inspiration = INSPIRATION_LEVEL.PUMPED_UP;
var g_happiness = HAPPINESS_LEVEL.INDIFFERENT;
var g_animosity = 0;
var g_knowledge = 0;

// Human resources
var g_workingPercent = A_HUNDRED_PERCENT;
var g_food = g_population * 10;
var g_wood = 0;
var g_tools = 0;
var g_clothes = g_population * 10;
var g_houses = g_population * 10;

// Earth stats
var g_earthDanger = DANGER_LEVEL.SAFE;
var g_year = START_YEAR;
var g_water = 10000;
var g_plants = 10000;
var g_trees = 10000;
var g_animals = 10000;

// ----------------------------------------------------------------------------
// Internal game stats
// ----------------------------------------------------------------------------

var g_gameSpeed = 1;
var g_graphs = [];
var g_log = "";
var g_alertQueue = [];

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
$('.reset-game').on('click', resetGame);

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

// ---
// Alert
// ---
$(document).on('close.fndtn.alert', function(event) {
    
    g_alertQueue.pop();

    // Display the next alert in queue
    if (g_alertQueue.length > 0) {
        var str = g_alertQueue.pop();
        popupAlert(str);
    }
});

// ----------------------------------------------------------------------------
// Initialization
// ----------------------------------------------------------------------------

$(document).ready( function () {
    initGame();
});

function initGame()
{
    // loadGame();

    updateWorkingPercent();

    // Load tech tree
    for (var tech in g_techTree) {
        previewTech(tech);

        if (getVFK(g_techTree, tech, "unlocked")) {
            unlockTech(tech);
        }
    }

    // Load graphs
    addGraph("Population", ["1000BC", 0], 10, dataPopulationGraphFn);
    updateGraphs(); 

    // Load log
    $('#log').text(g_log);
}

function dataPopulationGraphFn()
{
    // @todo    not adding yearString() for x value here 
    //          because the graph got cluttered up
    return ["", population()];
}

// ----------------------------------------------------------------------------
// Game functions
// ----------------------------------------------------------------------------

function checkGameOver() {
    if (population() == 0) {
        return true;
    }

    return false;
}

var g_shownGameOver = false;
function showGameOver() {
    
    if (g_shownGameOver == false) {
        $('#modal-gameover').foundation('reveal', 'open');
        g_shownGameOver = true;
    }
}

function saveGame()
{
    var gameState = {
        population: g_population,
        year: g_year,
        food: g_food,
        birthrate: g_birthrate,
        deathrate: g_deathrate,
        techtree: g_techTree,
        log: g_log
    };

    localStorage.setItem("save",JSON.stringify(gameState));
}

function loadGame()
{
    var gameState = JSON.parse(localStorage.getItem("save"));

    if (isDefined(gameState)) {
        if (isDefined(gameState.population)) {
            g_population = gameState.population;
            g_prevPopulation = gameState.population;
        }

        if (isDefined(gameState.year)) {
            g_year = gameState.year;
        }

        if (isDefined(gameState.food)) {
            g_food = gameState.food;
        }

        if (isDefined(gameState.birthrate)) {
            g_birthrate = gameState.birthrate;
        }

        if (isDefined(gameState.deathrate)) {
            g_deathrate = gameState.deathrate;
        }

        if (isDefined(gameState.techtree)) {
            g_techTree = gameState.techtree;
        }        

        if (isDefined(gameState.log)) {
            g_log = gameState.log;
        }
    }

}

function resetGame()
{
    localStorage.removeItem("save");
    location.reload(true);
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
// Human stats
// ----------------------------------------------------------------------------

function updateStats()
{
    // incr amount for every *gameSpeed* in ms
    var incr = (g_gameSpeed/1000) * gameUpdateInterval;

    updateYear(incr);
    updateBirthDeathRate(incr);
    updatePopulation(incr);
    updateTechGains(incr);
    consumeResources(incr);
    updateWorkingPercent();
    updateHealth();
    updateInspiration();
    updateHappiness();
    updateAnimosity(incr);
    updateTechCosts(incr);
    regenerateEarth(incr);
    updateStatTexts();
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

// Human stats

function updateWorkingPercent()
{
    g_workingPercent = 0;
    var workers = 0;
    for (var tech in g_techTree) {
        workers += g_techTree[tech]["workers"];
    }

    if (workers < population()) {
        g_workingPercent = Math.round(workers * A_HUNDRED_PERCENT / population());
    } else if (workers >= g_population) {
        // Cap percentage
        g_workingPercent = A_HUNDRED_PERCENT;
    }

    if (population() == 0) {
        // No humans left to be workers
        g_workingPercent = ZERO_PERCENT;
    }

    var idlePercent = A_HUNDRED_PERCENT - g_workingPercent;

    $('#worker-meter').css("width", g_workingPercent + "%");
    $('#worker-percent').html(g_workingPercent + '% working');
    $('#idle-percent').html(idlePercent + '% idle');
}

function updatePopulation(incr)
{
    var newHumans = ((g_birthrate - g_deathrate) / 1000) * g_population * incr;

    // Make sure population doesn't go negative
    if (g_population + newHumans > 0) {
        g_population += newHumans;
    }

    // Kill off workers if there were a lot of deaths
    // round newHumans
    newHumans = Math.round(newHumans);
    if (newHumans < 0) {

        // Counts all unlocked tech with workers
        var unlockedTechWithWorkers = 0;
        for (var tech in g_techTree) {
            if (g_techTree[tech]["unlocked"] && g_techTree[tech]["workers"] > 0) {
                unlockedTechWithWorkers++;
            }
        }

        // Divide evenly the dead workers among tech and substract from the workers per tech
        // @note: this is only an estimation, since we probably have rounding errors here
        var deadWorkersPerTech = Math.floor(newHumans / unlockedTechWithWorkers);
        for (var tech in g_techTree) {
            var workers = techWorkers(tech);
            if (workers - deadWorkersPerTech > 0 && population() != 0) {
                workers -= deadWorkersPerTech;
            } else {

                // population = 0 will fall here
                workers = 0;
            }
            setVFK(g_techTree, workers - deadWorkersPerTech, tech, "workers");
        }
    }
}

// BR is a function of inspiration, health, and happiness
function updateBirthDeathRate(incr)
{
    switch (g_health) {
        case HEALTH_LEVEL.EXCELLENT:
            g_birthrate += .05 * incr;
            g_deathrate -= .01 * incr;
            break;

        case HEALTH_LEVEL.GETTING_BY:
            g_birthrate += .01 * incr;
            break;

        case HEALTH_LEVEL.SICK:
            g_deathrate += .01 * incr;
            break;

        case HEALTH_LEVEL.DYING:
            g_birthrate += .01 * incr;
            g_deathrate += .05 * incr;
            break;
    }
    switch (g_inspiration) {
        case INSPIRATION_LEVEL.EXHAUSTED:
            g_birthrate -= .03 * incr;
            break;

        case INSPIRATION_LEVEL.PUMPED_UP:
            g_birthrate += .02 * incr;
            g_deathrate -= .01 * incr;
            break;

        case INSPIRATION_LEVEL.BORED:
            g_birthrate -= .01 * incr;
            g_deathrate += .01 * incr;
            break;

        case INSPIRATION_LEVEL.LOST_SOUL:
            g_deathrate += .03 * incr;
            break;
    }

    switch (g_happiness) {
        case HAPPINESS_LEVEL.CHEERFUL:
            g_birthrate += .05 * incr;
            break;

        case HAPPINESS_LEVEL.INDIFFERENT:
            g_birthrate += .01 * incr;
            break;

        case HAPPINESS_LEVEL.SAD:
            g_birthrate -= .01 * incr;
            break;

        case HAPPINESS_LEVEL.DEVASTATED:
            g_deathrate += .05 * incr;
            break;
    }

}

// Health is a function of resources
function updateHealth()
{
    // Person per food
    var persons_food = population() / g_food;

    // Person per clothe
    var persons_clothe = population() / g_clothes;

    // Person per house
    var persons_house = population() / g_houses;

    const LEVEL_DYING = 20;
    const LEVEL_SICK = 10;
    const LEVEL_GETTING_BY = 5;

    // Reset label .active
    $('#health .label').removeClass('active');

    if (persons_food > LEVEL_DYING || g_food <= 0 ||
        persons_clothe > LEVEL_DYING || g_clothes <= 0 ||
        persons_house > LEVEL_DYING || g_houses <= 0) {
        
        g_health = HEALTH_LEVEL.DYING;
        $('#health .lvl-label-black').addClass('active');
        return;

    } else if (persons_food > LEVEL_SICK || 
        persons_clothe > LEVEL_SICK || 
        persons_house > LEVEL_SICK ) {
        
        g_health = HEALTH_LEVEL.SICK;

        $('#health .lvl-label-red').addClass('active');
        return;

    } else if (persons_food > LEVEL_GETTING_BY || 
        persons_clothe > LEVEL_GETTING_BY || 
        persons_house > LEVEL_GETTING_BY ) {
        
        g_health = HEALTH_LEVEL.GETTING_BY;

        $('#health .lvl-label-yellow').addClass('active');
        return;

    } else {
        
        g_health = HEALTH_LEVEL.EXCELLENT;

        $('#health .lvl-label-green').addClass('active');
        return;
    }
}

// Happiness is a function of BR - DR
function updateHappiness()
{
    // Reset label .active
    $('#happiness .label').removeClass('active');

    var births = g_birthrate - g_deathrate;
    if (births > 3) {
        g_happiness = HAPPINESS_LEVEL.CHEERFUL;
        $('#happiness .lvl-label-green').addClass('active');
    } else if (births > -2) {
        g_happiness = HAPPINESS_LEVEL.INDIFFERENT;
        $('#happiness .lvl-label-yellow').addClass('active');
    } else if (births > -5) {
        g_happiness = HAPPINESS_LEVEL.SAD;
        $('#happiness .lvl-label-red').addClass('active');
    } else {
        g_happiness = HAPPINESS_LEVEL.DEVASTATED;
        $('#happiness .lvl-label-black').addClass('active');
    }
}

// Inspiration is a function of g_workingPercent
function updateInspiration()
{
    // Reset label .active
    $('#inspiration .label').removeClass('active');

    if (g_workingPercent > 90) {
        g_inspiration = INSPIRATION_LEVEL.EXHAUSTED;
        $('#inspiration .lvl-label-red').addClass('active');
    } else if (g_workingPercent > 70) {
        g_inspiration = INSPIRATION_LEVEL.PUMPED_UP;
        $('#inspiration .lvl-label-green').addClass('active');
    } else if (g_workingPercent > 30) {
        g_inspiration = INSPIRATION_LEVEL.BORED;
        $('#inspiration .lvl-label-yellow').addClass('active');
    } else {
        g_inspiration = INSPIRATION_LEVEL.LOST_SOUL;
        $('#inspiration .lvl-label-black').addClass('active');
    }
}

// Knowledge is number of techs unlocked
function updateKnowledge()
{
    var techTotal = Object.keys(g_techTree).length;
    g_knowledge = 0;
    for (var tech in g_techTree) {
        if (getVFK(g_techTree, tech, "unlocked")) {
            g_knowledge++;
        }
    }

    g_knowledge = g_knowledge / techTotal * A_HUNDRED_PERCENT;

    $('#knowledge-meter').animate({"width": g_knowledge + "%"});
}

// Is a function of happiness, health, and inspiration
function updateAnimosity(incr)
{
    g_animosity += (g_health + g_happiness + g_inspiration - 6) * incr;
    if (g_animosity > A_HUNDRED_PERCENT ) {
        g_animosity = A_HUNDRED_PERCENT;
    }

    $('#animosity-meter').css("width", g_animosity + "%");
}

// @todo
function startWar()
{

}

// Only consume food, clothes, and houses
function consumeResources(incr)
{
    // Food
    var consumed = population() * incr * .1;
    var death = 0;
    if (g_food - consumed > 0) {
        g_food -= consumed;
    } else {
        death = population() - g_food;
        population() -= death;
        g_food = 0;
    }

    // Clothes
    consumed = population() * incr * .01;
    death = 0;
    if (g_clothes - consumed > 0) {
        g_clothes -= consumed;
    } else {
        death = population() - g_clothes;
        population() -= death;
        g_clothes = 0;
    }

    // Houses
    consumed = population() * incr * .001;
    death = 0;
    if (g_houses - consumed > 0) {
        g_houses -= consumed;
    } else {
        death = population() - g_houses;
        population() -= death;
        g_houses = 0;
    }
}

function updateTechGains(incr)
{
    for (var tech in g_techTree) {
        
        if (techReady(tech)) {
    
            var workers = getVFK(g_techTree, tech, "workers");

            // Food
            var food = techGain(tech, "food");
            if (isDefined(food)) {
                g_food += (food * workers) * incr;
            }

            // Wood
            var wood = techGain(tech, "wood");
            if (isDefined(wood)) {
                g_wood += (wood * workers) * incr;
            }

            // Tool
            var tools = techGain(tech, "tools");
            if (isDefined(tools)) {
                g_tools += (tools * workers) * incr;
            }

            // Clothes
            var clothes = techGain(tech, "clothes");
            if (isDefined(clothes)) {
                g_clothes += (clothes * workers) * incr;
            }

            // Houses
            var houses = techGain(tech, "houses");
            if (isDefined(houses)) {
                g_houses += (houses * workers) * incr;
            }

            // Water
            var water = techGain(tech, "water");
            if (isDefined(water)) {
                g_water += (water * workers) * incr;
            }

            // Trees
            var trees = techGain(tech, "trees");
            if (isDefined(trees)) {
                g_trees += (trees * workers) * incr;
            }

            // Plants
            var plants = techGain(tech, "plants");
            if (isDefined(plants)) {
                g_plants += (plants * workers) * incr;
            }

            // Animals
            var animals = techGain(tech, "animals");
            if (isDefined(animals)) {
                g_animals += (animals * workers) * incr;
            }
        }
    }
}

function updateTechCosts(incr)
{
    for (var tech in g_techTree) {
        
        if (techReady(tech)) {
    
            var workers = getVFK(g_techTree, tech, "workers");

            // food
            var food = techCost(tech, "food");
            if (isDefined(food)) {
                g_food -= (food * workers) * incr;
                g_food = g_food < 0 ? 0 : g_food;
            }

            // wood
            var wood = techCost(tech, "wood");
            if (isDefined(wood)) {
                g_wood -= (wood * workers) * incr;
                g_wood = g_wood < 0 ? 0 : g_wood;
            }

            // tools
            var tools = techCost(tech, "tools");
            if (isDefined(tools)) {
                g_tools -= (tools * workers) * incr;
                g_tools = g_tools < 0 ? 0 : g_tools;
            }
            
            // clothes
            var clothes = techCost(tech, "clothes");
            if (isDefined(clothes)) {
                g_clothes -= (clothes * workers) * incr;
                g_clothes = g_clothes < 0 ? 0 : g_clothes;
            }

            // houses
            var houses = techCost(tech, "houses");
            if (isDefined(houses)) {
                g_houses -= (houses * workers) * incr;
                g_houses = g_houses < 0 ? 0 : g_houses;
            }

            // water
            var water = techCost(tech, "water");
            if (isDefined(water)) {
                g_water -= (water * workers) * incr;
                g_water = g_water < 0 ? 0 : g_water;
            }

            // plants
            var plants = techCost(tech, "plants");
            if (isDefined(plants)) {
                g_plants -= (plants * workers) * incr;
                g_plants = g_plants < 0 ? 0 : g_plants;
            }

            // trees
            var trees = techCost(tech, "trees");
            if (isDefined(trees)) {
                g_trees -= (trees * workers) * incr;
                g_trees = g_trees < 0 ? 0 : g_trees;
            }
            
            // animals
            var animals = techCost(tech, "animals");
            if (isDefined(animals)) {
                g_animals -= (animals * workers) * incr;
                g_animals = g_animals < 0 ? 0 : g_animals;
            }
        }
    }
}

// Nature stats

function regenerateEarth(incr)
{
    // water
    g_water += 0.1 * incr;

    // plants
    g_plants += 0.1 * incr;

    // trees
    g_trees += 0.1 * incr;

    // animals
    g_animals += 0.1 * incr;
}

// Display text

function updateStatTexts() {
    // Game 
    $('#game-speed-label').text(gameSpeedString());

    // Human
    $('#human-danger-level').text(dangerString(g_humanDanger));
    $('#population').text(populationString());
    $('#birthrate').text(birthrateString());
    $('#deathrate').text(deathrateString());

    // Resources
    $('#food').text(foodString());
    $('#wood').text(woodString());
    $('#tools').text(toolsString());
    $('#clothes').text(clothesString());
    $('#houses').text(housesString());

    // Earth
    $('#earth-danger-level').text(dangerString(g_earthDanger));
    $('#year').text(yearString());
    $('#plants').text(plantsString());
    $('#water').text(waterString());
    $('#trees').text(treesString());
    $('#animals').text(animalsString());
}

var g_prevPopulation = g_population;
var g_prevBR = g_birthrate;
var g_prevDR = g_deathrate;
var g_preFS = g_food;

function updateStatRateTexts()
{
    var rate = population() - g_prevPopulation;
    rate = addPlusMinusToNumberString(rate) + rate.toFixed(0);
    $('#population-rate').text(rate);
    g_prevPopulation = population();

    rate = g_birthrate - g_prevBR;
    rate = addPlusMinusToNumberString(rate) + rate.toFixed(0);
    $('#birthrate-rate').text(rate);
    g_prevBR = g_birthrate;

    rate = g_deathrate - g_prevDR;
    rate = addPlusMinusToNumberString(rate) + rate.toFixed(0);
    $('#deathrate-rate').text(rate);
    g_prevDR = g_deathrate;

    rate = g_food - g_preFS;
    rate = addPlusMinusToNumberString(rate) + rate.toFixed(0);
    $('#foodsource-rate').text(rate);
    g_preFS = g_food;
}

// ----------------------------------------------------------------------------
// Update tech tree
// ----------------------------------------------------------------------------

function updateTechTree()
{
    for (var tech in g_techTree) {

        // Preview
        previewTech(tech);

        // Unlock
        if (shouldUnlockTech(tech)) {
            unlockTech(tech);

            // Log event
            var eventMessage = getVFK(g_techTree, tech, "title") + ' is unlocked in year ' + yearString() + '.';
            logging(eventMessage, true);

        }

        // Ready tech
        readyTech(tech);

    }

    // Gain knowledge for each tech unlocked
    updateKnowledge();
}

function previewTech(tech) 
{
    const yearThres = getVFK(g_techTree, tech, "preview", "year");
    if (year() >= yearThres) {

        // Check if tech has been previewed
        var previewed = getVFK(g_techTree, tech, "previewed");
        if (isDefined(previewed)) {
            return;
        } else {
            setVFK(g_techTree, true, tech, "previewed");
        }

        var pop = getVFK(g_techTree, tech, "require", "population");
        var requireString = 'Unlock when population is over ' + pop;

        var rTechs = getVFK(g_techTree, tech, "require", "techs");
        if (isDefined(rTechs)) {
            requireString += ". Requires: "
            for (var i in rTechs) {
                requireString += rTechs[i] + " ";
            }
        }

        $('#ancient-age').append(' \
            <div class="row" id="' + tech + '-row"> \
                <div class="push-2 large-8 columns"> \
                    <div class="tech-name-preview panel"><span data-tooltip aria-haspopup="true" class="has-tip" title="' + requireString + '">???</span></div> \
                </div> \
            </div> \
            ');
    }
}

function unlockTech(tech)
{
    var workers = techWorkers(tech);
    var techTitle = getVFK(g_techTree, tech, "title");
    var tooltipString = buildTechTooltip(tech);

    $('#' + tech + '-row').html(' \
        <div class="push-2 large-8 columns"> \
            <div class="tech-name panel"> \
                <span>' + techTitle + '</span> \
                <span id="' + tech + '-workers" class="round label right">' + workers + ' workers \
                </span> \
                <div class="tech-cost-gain">' + tooltipString + '</div> \
            </div> \
            <ul class="button-group tech-button-group"> \
                <li><button class="tiny tech-button success" id="' + tech +'-promote">Work!</button> \
                </li> \
                <li><button class="tiny tech-button alert" id="' + tech +'-ban">Stop</button> \
                </li> \
            </ul> \
        </div> \
        ');

    // bind promote/ban buttons events
    bindPromoteBanButonEvents(tech);
}

function buildTechTooltip(tech)
{
    var str = "Each worker ";

    // Display gain

    var gain = techGain(tech, "food");
    if (isDefined(gain)) {
        str += " +" + gain + " food, ";
    }

    gain = techGain(tech, "wood");
    if (isDefined(gain)) {
        str += " +" + gain + " wood, ";
    }

    gain = techGain(tech, "tools");
    if (isDefined(gain)) {
        str += " +" + gain + " tools, ";
    }

    gain = techGain(tech, "clothes");
    if (isDefined(gain)) {
        str += " +" + gain + " clothes, ";
    }

    gain = techGain(tech, "houses");
    if (isDefined(gain)) {
        str += " +" + gain + " houses, ";
    }

    gain = techGain(tech, "water");
    if (isDefined(gain)) {
        str += " +" + gain + " water, ";
    }

    gain = techGain(tech, "trees");
    if (isDefined(gain)) {
        str += " +" + gain + " trees, ";
    }

    gain = techGain(tech, "plants");
    if (isDefined(gain)) {
        str += " +" + gain + " plants, ";
    }

    gain = techGain(tech, "animals");
    if (isDefined(gain)) {
        str += " +" + gain + " animals, ";
    }

    // Display cost

    var cost = techCost(tech, "water");
    if (isDefined(cost)) {
        str += " -" + cost + " water, ";
    }

    cost = techCost(tech, "plants");
    if (isDefined(cost)) {
        str += " -" + cost + " plants, ";
    }

    cost = techCost(tech, "trees");
    if (isDefined(cost)) {
        str += " -" + cost + " trees, ";
    }

    cost = techCost(tech, "animals");
    if (isDefined(cost)) {
        str += " -" + cost + " animals, ";
    }

    cost = techCost(tech, "food");
    if (isDefined(cost)) {
        str += " -" + cost + " food, ";
    }

    cost = techCost(tech, "wood");
    if (isDefined(cost)) {
        str += " -" + cost + " wood, ";
    }

    cost = techCost(tech, "tools");
    if (isDefined(cost)) {
        str += " -" + cost + " tools, ";
    }

    cost = techCost(tech, "clothes");
    if (isDefined(cost)) {
        str += " -" + cost + " clothes, ";
    }

    cost = techCost(tech, "houses");
    if (isDefined(cost)) {
        str += " -" + cost + " houses, ";
    }

    str += " per year";

    return str
}

function shouldUnlockTech(tech)
{
    const popThres = getVFK(g_techTree, tech, "require", "population");
    const techThres = getVFK(g_techTree, tech, "require", "techs");
    var previewed = getVFK(g_techTree, tech, "previewed");
    var unlocked = getVFK(g_techTree, tech, "unlocked");
    
    // Check if tech has been unlocked or previewed
    if (!isDefined(previewed) || unlocked) {
        return false;
    }

    // Check if population
    if (population() >= popThres) {

        // Check if required techs are all unlocked
        if (isDefined(techThres)) {
            for (var i in techThres) {
                if (getVFK(g_techTree, techThres[i], "unlocked") == false) {
                    return false;       
                }
            }
        }

        // Mark this as unlocked now so we don't do it twice
        g_techTree[tech]["unlocked"] = true;        

        return true;
    }

    return false;
}

function readyTech(tech)
{
    // Water
    var cost = techCost(tech, "water");
    if (isDefined(cost)) {
        var isEnable = g_water >= cost;
        enableTech(tech, isEnable);
        
        // Only need to have one condition not satisfied to disable the tech
        if (isEnable == false) {
            return;
        }
    }

    // Plants
    cost = techCost(tech, "plants");
    if (isDefined(cost)) {
        var isEnable = g_plants >= cost;
        enableTech(tech, isEnable);

        if (isEnable == false) {
            return;
        }
    }

    // Trees
    cost = techCost(tech, "trees");
    if (isDefined(cost)) {
        var isEnable = g_trees >= cost;
        enableTech(tech, isEnable);

        if (isEnable == false) {
            return;
        }
    }

    // Animals
    cost = techCost(tech, "animals");
    if (isDefined(cost)) {
        var isEnable = g_animals >= cost;
        enableTech(tech, isEnable);

        if (isEnable == false) {
            return;
        }
    }
}

// Promote/Ban tech

function promoteTech(tech)
{
    if (techReady(tech)) {
        adopt(tech, true);    
    }
}

function banTech(tech)
{
    adopt(tech, false);    
}

function adopt(tech, isPromote)
{
    var workers = techWorkers(tech);
    
    // Adoption shares the same worker pool
    if (isPromote) {
        if (g_workingPercent < A_HUNDRED_PERCENT) {
            workers++;
        } else {
            logging("Maximized workers, can't add more", true);
        }
    } else {
        // Ban
        if (workers > 0) {
            workers--;
        }
    }

    setVFK(g_techTree, workers, tech, "workers");
 
    $('#' + tech + '-workers').html(workers +  ' workers');
}

// ----------------------------------------------------------------------------
// Dictionary getter/setter
// ----------------------------------------------------------------------------

function techGain(tech, type)
{
    return getVFK(g_techTree, tech, "gain", type);
}   

function techCost(tech, type)
{
    return getVFK(g_techTree, tech, "cost", type);
}

function techReady(tech)
{
    return getVFK(g_techTree, tech, "unlocked") && getVFK(g_techTree, tech, "enabled");
}

function techWorkers(tech) 
{
    return Math.round(getVFK(g_techTree, tech, "workers"));
}

function enableTech(tech, isEnable)
{
    setVFK(g_techTree, isEnable, tech, "enabled");
}

//
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
    updateGraphs();    
    updateStatRateTexts();
  
    saveGame();
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

            logging(getVFK(g_worldEvents["natural-disasters"], natDis, "message"), true);

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
            logging(getVFK(g_worldEvents["generic"], ev, "message"), true);

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
    return g_birthrate.toFixed(0).toString().replace('-','') + ' per thousand';
}

function deathrateString() {
    return g_deathrate.toFixed(0).toString().replace('-','') + ' per thousand';
}

function populationString() {
    var pop = population();
    return numberStringUnit(pop);
}

function yearString(number) {
    
    var y;
    
    if (isDefined(number)) {
        y = number;
    } else {
        y = year();
    }

    var toString = y;
    if (y < 0) {
        toString = -toString + 'BC';
    }

    return toString;
}

function gameSpeedString() {
    return "X" + g_gameSpeed;
}

function dangerString(level) {
    switch (level) {
        case DANGER_LEVEL.THREATENED:
            return "Threatened";
        case DANGER_LEVEL.SAFE:
            return "Safe";
        case DANGER_LEVEL.NEAR_DESTROYED:
            return "Near destroyed";
        case DANGER_LEVEL.DEAD:
            return "Dead";
    }
}

function healthString(hp) {
    switch (hp) {
        case HEALTH_LEVEL.EXCELLENT:
            return "Excellent";

        case HEALTH_LEVEL.GETTING_BY:
            return "Okay";

        case HEALTH_LEVEL.SICK:
            return "Sick";

        case HEALTH_LEVEL.DYING:
            return "Dying";
    }
}

function inspirationString(insp) {
    switch (insp) {
        case INSPIRATION_LEVEL.EXHAUSTED:
            return "Exhausted";

        case INSPIRATION_LEVEL.PUMPED_UP:
            return "Pumped";

        case INSPIRATION_LEVEL.BORED:
            return "Bored";

        case INSPIRATION_LEVEL.LOST_SOUL:
            return "Lost soul";
    }
}

function happinessString(hap) {
    switch (hap) {
        case HAPPINESS_LEVEL.CHEERFUL:
            return "Cheerful";

        case HAPPINESS_LEVEL.INDIFFERENT:
            return "Indifferent";

        case HAPPINESS_LEVEL.SAD:
            return "Sad";

        case HAPPINESS_LEVEL.DEVASTATED:
            return "Devastated";
    }
}

function knowledgeString(kn) {
    return g_knowledge;
}

function animosityString() {
    return g_animosity;
}

function foodString() {
    return numberStringUnit(g_food);
}

function woodString() {
    return numberStringUnit(g_wood);
}

function toolsString() {
    return numberStringUnit(g_tools);
}

function clothesString() {
    return numberStringUnit(g_clothes);   
}

function housesString() {
    return numberStringUnit(g_houses);
}

function waterString() {
    return numberStringUnit(g_water);
}

function plantsString() {
    return numberStringUnit(g_plants);
}

function treesString() {
    return numberStringUnit(g_trees);
}

function animalsString() {
    return numberStringUnit(g_animals);
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
    else 
    {
        string = Math.floor(number);
    }

    return string;
}

function addPlusMinusToNumberString(number)
{
    if (number >= 0) {
        return "+";
    } else {
        return "";
    }
}

// ----------------------------------------------------------------------------
// Logging functions
// ----------------------------------------------------------------------------

function logging(eMsg, popup, level)
{
    g_log = eMsg + '\n' + g_log;
    $('#log').text(g_log);

    
    popup = isDefined(popup) ? popup : false;
    if (popup) {
        popupAlert(eMsg);        
    }    
}

function popupAlert(str)
{
    g_alertQueue.push(str);    

    $('#alert-area').html(' \
        <div class="alert-box alert-tech-unlocked round" data-alert>' +
          str +
          '<a href="#" class="close">&times;</a> \
        </div> \
        ').foundation(
            "alert",
            undefined, 
            {speed: "slow", animation: "slideUp", callback: function() {}}
            );
}

// ----------------------------------------------------------------------------
// Button functions
// ----------------------------------------------------------------------------

function bindPromoteBanButonEvents(tech)
{
    var promoteButton = $('#' + tech + '-promote');
    var banButton = $('#' + tech + '-ban');

    promoteButton.bind('mousedown', function(e) {
        promoteTech(tech);
    });

    banButton.bind('mousedown', function(e) {
        banTech(tech);
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
            g_gameSpeed = 100;
            break;
        case 100:
            g_gameSpeed = 1;
        default:
            g_gameSpeed = 1;
            break;
    }
}

// ----------------------------------------------------------------------------
// Graph functions
// ----------------------------------------------------------------------------

//
// @function        addGraph
//
// @description     Add a new graph to the game.
//                  The graph will be displayed under the #graph-area div.
//
// @param name      Supply the name of the graph.
// @param initXY    Supply an array that contains the first x (any type) and y (number only).
//                  For example, ["1000BC", 123]
// @param yearGap   The number of year between gaps for each update. This will start counting from 10000BC.
// @param dataFn    Supply a data funtion. This function must return an array
//                  containing the new x (any type) and y (number only) for each time updateGraphs()
//                  is called. 
//

function addGraph(name, initXY, yearGap, dataFn)
{
    $('#graph-area').append('<canvas width="400" height="200" id="graph-' + name + '">');
    var ctx = $('#graph-' + name).get(0).getContext("2d");
    var data = {
        labels: [],
        datasets: [
            {
                label: name,
                fillColor: "rgba(154,185,227,1)",
                strokeColor: "rgba(154,185,227,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: []
            }
        ]
    };
    
    var chart = new Chart(ctx).Line(data, {
        showTooltips: false,        
        scaleShowGridLines: false,
        pointDot : false,
        bezierCurve : false,
        datasetStroke: true,
        datasetFill: false,
        scaleFontSize: 8,
        animation: false,
        scaleShowHorizontalLines: false,
        scaleShowVerticalLines: false,
    });

    // Initial data for all charts
    chart.addData([initXY[1]], initXY[0]);

    function addDataFn(ch) {
        var xy = dataFn();
        var x = xy[0];
        var y = xy[1];
        ch.addData([y], x);
    }

    var graph = {
        "chart": chart,
        "yearGap": yearGap,
        "add-data-fn": addDataFn
    };


    g_graphs.push(graph);
}

function updateGraphs() 
{
    for (var i = 0; i < g_graphs.length; i++) {
        var graph = g_graphs[i];
        var yearGap = graph["yearGap"];
        
        if (year() % yearGap != 0) {
            continue;
        }
        var chart = graph["chart"];

        // call custom add function
        graph["add-data-fn"](chart);
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
//

function isDefined(variable)
{
    return variable != null && typeof variable != 'undefined';
}
