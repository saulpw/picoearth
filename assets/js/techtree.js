var g_techTree = {
    "Foraging": {
        "unlocked": false,
        "require": {
            "population": 1000000,
            "year": -10000,
        },
        "per-year": {
            "death-per-thousand": -0.001,
            "food-source": -0.00005
        },
        "adopt-percent": 20
    },
    "Fire": {
        "unlocked": false,
        "require": {
            "population": 1005000,
            "year": -10000,
        },
        "per-year": {
            "death-per-thousand": -0.005
        },
        "adopt-percent": 20
    },
    "Cave-shelters": {
        "unlocked": false,
        "require": {
            "population": 1015000,
            "year": -9995,
        },
        "per-year": {
            "death-per-thousand": -0.002
        },
        "adopt-percent": 20
    },
    "Cave-drawing": {
        "unlocked": false,
        "require": {
            "population": 1020000,
            "year": -9990,
        },
        "per-year": {
            "birth-per-thousand": 0.001,
            "death-per-thousand": -0.001
        },
        "adopt-percent": 20
    },
    "Domestication": {
        "unlocked": false,
        "require": {
            "population": 1030000,
            "year": -9980,
        },
        "per-year": {
            "death-per-thousand": -0.001,
            "food-source": .00001
        },
        "adopt-percent": 20    
    },
    "Cooking": {
        "unlocked": false,
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
        "adopt-percent": 20
    },
    "Clothing": {
        "unlocked": false,
        "require": {
            "population": 1040000,
            "year": -9890,
        },
        "per-year": {
            "death-per-thousand": -0.002
        },
        "adopt-percent": 20
    },
    "Farming": {
        "unlocked": false,
        "require": {
            "population": 1070000,
            "year": -9800,
        },
        "per-year": {
            "birth-per-thousand": 0.002,
            "death-per-thousand": -0.001,
            "food-source": .00001
        },
        "adopt-percent": 20
    },
    "Writing": {
        "unlocked": false,
        "require": {
            "population": 1000000,
            "year": -3200,
        },
        "per-year": {
            "birth-per-thousand": 0.002,
            "death-per-thousand": -0.001
        },
        "adopt-percent": 20    
    },
    "Stone-tools": {
        "unlocked": false,
        "require": {
            "population": 20000000,
            "year": -9990,
        },
        "per-year": {
            "death-per-thousand": -0.002
        },
        "adopt-percent": 20
    }
}