var g_techTree = {
    "Foraging": {
        "unlocked": false,
        "require": {
            "population": 1000000,
            "year": -10000,
        },
        "per-year": {
            "death-per-thousand": -0.001,
            "food-source": -0.00001
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
        "adopt-percent": 21
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
        "adopt-percent": 32
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
        "adopt-percent": 12
    },
    "Domestication": {
        "unlocked": false,
        "require": {
            "population": 1030000,
            "year": -9980,
        },
        "per-year": {
            "death-per-thousand": -0.001,
            "food-source": .00005
        },
        "adopt-percent": 4
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
        "adopt-percent": 26
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
        "adopt-percent": 34
    },
    "Cultivation": {
        "unlocked": false,
        "require": {
            "population": 1070000,
            "year": -9800,
        },
        "per-year": {
            "birth-per-thousand": 0.002,
            "death-per-thousand": -0.001,
            "food-source": .00005
        },
        "adopt-percent": 13
    },
    "Writing": {
        "unlocked": false,
        "require": {
            "population": 0,
            "year": -3200,
        },
        "per-year": {
            "birth-per-thousand": 0.002,
            "death-per-thousand": -0.001
        },
        "adopt-percent": 2
    },
    "Stone tools": {
        "unlocked": false,
        "require": {
            "population": 2000000,
            "year": -9990,
        },
        "per-year": {
            "death-per-thousand": -0.002
        },
        "adopt-percent": 23
    }
}