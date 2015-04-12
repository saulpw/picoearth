var g_techTree = {
    "Foraging": {
        "unlocked": false,
        "require": {
            "population": 1000000,
            "year": -10000,
            "techs": [],
            "events": []
        },
        "promote": {
            "birthrate": 0,
            "deathrate": -0.001
        },
        "ban": {
            "birthrate": 0,
            "deathrate": 0.001
        },
        "per-year": {
            "food-source": -0.001
        },
        "adoption": 20
    },
    "Fire": {
        "unlocked": false,
        "require": {
            "population": 1005000,
            "year": -10000,
            "techs": [],
            "events": []
        },
        "promote": {
            "birthrate": 0,
            "deathrate": -0.005
        },
        "ban": {
            "birthrate": 0,
            "deathrate": 0.005
        },
        "adoption": 21
    },
    "Cave-shelters": {
        "unlocked": false,
        "require": {
            "population": 1015000,
            "year": -9995,
            "techs": [],
            "events": []
        },
        "promote": {
            "birthrate": 0,
            "deathrate": -0.002
        },
        "ban": {
            "birthrate": 0,
            "deathrate": 0.002
        },
        "adoption": 32
    },
    "Cave-drawing": {
        "unlocked": false,
        "require": {
            "population": 1020000,
            "year": -9990,
            "techs": [],
            "events": []
        },
        "promote": {
            "birthrate": 0.001,
            "deathrate": -0.001
        },
        "ban": {
            "birthrate": -0.001,
            "deathrate": 0.001
        },
        "adoption": 12
    },
    "Domestication": {
        "unlocked": false,
        "require": {
            "population": 1030000,
            "year": -9980,
            "techs": [],
            "events": []
        },
        "promote": {
            "birthrate": 0,
            "deathrate": -0.001
        },
        "ban": {
            "birthrate": 0,
            "deathrate": 0.001
        },
        "adoption": 4
    },
    "Cooking": {
        "unlocked": false,
        "require": {
            "population": 1020000,
            "year": -9990,
            "techs": [
                "Fire"
            ],
            "events": []
        },
        "promote": {
            "birthrate": 0.001,
            "deathrate": -0.002
        },
        "ban": {
            "birthrate": -0.001,
            "deathrate": 0.002
        },
        "adoption": 26
    },
    "Clothing": {
        "unlocked": false,
        "require": {
            "population": 1040000,
            "year": -9890,
            "techs": [],
            "events": []
        },
        "promote": {
            "birthrate": 0,
            "deathrate": -0.002
        },
        "ban": {
            "birthrate": 0,
            "deathrate": 0.002
        },
        "adoption": 34
    },
    "Cultivation": {
        "unlocked": false,
        "require": {
            "population": 1070000,
            "year": -9800,
            "techs": [],
            "events": []
        },
        "promote": {
            "birthrate": 0.002,
            "deathrate": -0.001
        },
        "ban": {
            "birthrate": -0.001,
            "deathrate": 0.002
        },
        "adoption": 13
    },
    "Writing": {
        "unlocked": false,
        "require": {
            "population": 0,
            "year": -3200,
            "techs": [],
            "events": []
        },
        "promote": {
            "birthrate": 0.002,
            "deathrate": -0.001
        },
        "ban": {
            "birthrate": -0.002,
            "deathrate": 0.001
        },
        "adoption": 2
    },
    "Stone tools": {
        "unlocked": false,
        "require": {
            "population": 2000000,
            "year": -9990,
            "techs": [],
            "events": []
        },
        "promote": {
            "birthrate": 0,
            "deathrate": -0.002
        },
        "ban": {
            "birthrate": 0,
            "deathrate": 0.002
        },
        "adoption": 23
    }
}