var g_techTree = {
    "Foraging": {
        "unlocked": false,
        "state": 0,
        "require": {
            "population": 1000000,
            "year": -10000,
        },
        "per-year": {
            "death-per-thousand": -0.001,
            "food-source": -0.00005
        },
        "adopt-percent": 0
    },
    "Fire": {
        "unlocked": false,
        "state": 0,
        "require": {
            "population": 1005000,
            "year": -10000,
        },
        "per-year": {
            "death-per-thousand": -0.005
        },
        "adopt-percent": 0
    },
    "Cave-shelters": {
        "unlocked": false,
        "state": 0,
        "require": {
            "population": 1015000,
            "year": -9995,
        },
        "per-year": {
            "death-per-thousand": -0.002
        },
        "adopt-percent": 0
    },
    "Cave-drawing": {
        "unlocked": false,
        "state": 0,
        "require": {
            "population": 1020000,
            "year": -9990,
        },
        "per-year": {
            "birth-per-thousand": 0.001,
            "death-per-thousand": -0.001
        },
        "adopt-percent": 0
    },
    "Domestication": {
        "unlocked": false,
        "state": 0,
        "require": {
            "population": 1030000,
            "year": -9980,
        },
        "per-year": {
            "death-per-thousand": -0.001,
            "food-source": .00001
        },
        "adopt-percent": 0    
    },
    "Cooking": {
        "unlocked": false,
        "state": 0,
        "require": {
            "population": 1020000,
            "year": -9990,
            "techs": [
                "Fire"
            ]
        },
        "per-year": {
            "birth-per-thousand": 0.001,
            "death-per-thousand": -0.002
        },
        "adopt-percent": 0
    },
    "Clothing": {
        "unlocked": false,
        "state": 0,
        "require": {
            "population": 1040000,
            "year": -9890,
        },
        "per-year": {
            "death-per-thousand": -0.002
        },
        "adopt-percent": 0
    },
    "Farming": {
        "unlocked": false,
        "state": 0,
        "require": {
            "population": 1070000,
            "year": -9800,
        },
        "per-year": {
            "birth-per-thousand": 0.002,
            "death-per-thousand": -0.001,
            "food-source": .00001
        },
        "adopt-percent": 0
    },
    "Writing": {
        "unlocked": false,
        "state": 0,
        "require": {
            "population": 1000000,
            "year": -3200,
        },
        "per-year": {
            "birth-per-thousand": 0.002,
            "death-per-thousand": -0.001
        },
        "adopt-percent": 0    
    },
    "Stone-tools": {
        "unlocked": false,
        "state": 0,
        "require": {
            "population": 20000000,
            "year": -9990,
        },
        "per-year": {
            "death-per-thousand": -0.002
        },
        "adopt-percent": 0
    }
}