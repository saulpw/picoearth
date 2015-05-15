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
    "Clothing": {
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
    "Shelters": {
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
    "Farming": {
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
    "Fising": {
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
    "Domestication": {
        "unlocked": false,
        "state": 0,
        "require": {
            "population": 1020000,
            "year": -9940,
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
    "Mining": {
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
    "War": {
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
    "Marriage": {
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
    "Commerce": {
        "unlocked": false,
        "state": 0,
        "require": {
            "population": 20000000,
            "year": -2000,
        },
        "per-year": {
            "death-per-thousand": -0.002
        },
        "adopt-percent": 0
    },
    "Leather": {
        "unlocked": false,
        "state": 0,
        "require": {
            "population": 1000000,
            "year": 500,
        },
        "per-year": {
            "birth-per-thousand": 0.002,
            "death-per-thousand": -0.001
        },
        "adopt-percent": 0    
    },
    "Paint": {
        "unlocked": false,
        "state": 0,
        "require": {
            "population": 1000000,
            "year": 800,
        },
        "per-year": {
            "birth-per-thousand": 0.002,
            "death-per-thousand": -0.001
        },
        "adopt-percent": 0    
    },
    "Paper": {
        "unlocked": false,
        "state": 0,
        "require": {
            "population": 1000000,
            "year": 400,
        },
        "per-year": {
            "birth-per-thousand": 0.002,
            "death-per-thousand": -0.001
        },
        "adopt-percent": 0    
    },
    "Pesticides": {
        "unlocked": false,
        "state": 0,
        "require": {
            "population": 1000000,
            "year": 1700,
        },
        "per-year": {
            "birth-per-thousand": 0.002,
            "death-per-thousand": -0.001
        },
        "adopt-percent": 0    
    },
    "Antibiotics": {
        "unlocked": false,
        "state": 0,
        "require": {
            "population": 1000000,
            "year": 1900,
        },
        "per-year": {
            "birth-per-thousand": 0.002,
            "death-per-thousand": -0.001
        },
        "adopt-percent": 0    
    },
    "Bridges": {
        "unlocked": false,
        "state": 0,
        "require": {
            "population": 1000000,
            "year": 200,
        },
        "per-year": {
            "birth-per-thousand": 0.002,
            "death-per-thousand": -0.001
        },
        "adopt-percent": 0    
    },
    "Roads": {
        "unlocked": false,
        "state": 0,
        "require": {
            "population": 1000000,
            "year": 300,
        },
        "per-year": {
            "birth-per-thousand": 0.002,
            "death-per-thousand": -0.001
        },
        "adopt-percent": 0    
    },
    "Shipping": {
        "unlocked": false,
        "state": 0,
        "require": {
            "population": 1000000,
            "year": 1400,
        },
        "per-year": {
            "birth-per-thousand": 0.002,
            "death-per-thousand": -0.001
        },
        "adopt-percent": 0    
    },
    "Electricity": {
        "unlocked": false,
        "state": 0,
        "require": {
            "population": 1000000,
            "year": 1910,
        },
        "per-year": {
            "birth-per-thousand": 0.002,
            "death-per-thousand": -0.001
        },
        "adopt-percent": 0    
    },
    "Urbanization": {
        "unlocked": false,
        "state": 0,
        "require": {
            "population": 1000000,
            "year": 1000,
        },
        "per-year": {
            "birth-per-thousand": 0.002,
            "death-per-thousand": -0.001
        },
        "adopt-percent": 0    
    },
    "Aviation": {
        "unlocked": false,
        "state": 0,
        "require": {
            "population": 1000000,
            "year": 1940,
        },
        "per-year": {
            "birth-per-thousand": 0.002,
            "death-per-thousand": -0.001
        },
        "adopt-percent": 0    
    },
    "Sanitation": {
        "unlocked": false,
        "state": 0,
        "require": {
            "population": 1000000,
            "year": 1800,
        },
        "per-year": {
            "birth-per-thousand": 0.002,
            "death-per-thousand": -0.001
        },
        "adopt-percent": 0    
    },
    "Packaging": {
        "unlocked": false,
        "state": 0,
        "require": {
            "population": 1000000,
            "year": 1800,
        },
        "per-year": {
            "birth-per-thousand": 0.002,
            "death-per-thousand": -0.001
        },
        "adopt-percent": 0    
    },
    "Petroleum": {
        "unlocked": false,
        "state": 0,
        "require": {
            "population": 1000000,
            "year": 1870,
        },
        "per-year": {
            "birth-per-thousand": 0.002,
            "death-per-thousand": -0.001
        },
        "adopt-percent": 0    
    },
    "Tourism": {
        "unlocked": false,
        "state": 0,
        "require": {
            "population": 1000000,
            "year": 1860,
        },
        "per-year": {
            "birth-per-thousand": 0.002,
            "death-per-thousand": -0.001
        },
        "adopt-percent": 0    
    },
    "Malls": {
        "unlocked": false,
        "state": 0,
        "require": {
            "population": 1000000,
            "year": 1920,
        },
        "per-year": {
            "birth-per-thousand": 0.002,
            "death-per-thousand": -0.001
        },
        "adopt-percent": 0    
    },
    "Computers": {
        "unlocked": false,
        "state": 0,
        "require": {
            "population": 1000000,
            "year": 1970,
        },
        "per-year": {
            "birth-per-thousand": 0.002,
            "death-per-thousand": -0.001
        },
        "adopt-percent": 0    
    },
    "NuclearPower": {
        "unlocked": false,
        "state": 0,
        "require": {
            "population": 1000000,
            "year": 1930,
        },
        "per-year": {
            "birth-per-thousand": 0.002,
            "death-per-thousand": -0.001
        },
        "adopt-percent": 0    
    },
    "Space": {
        "unlocked": false,
        "state": 0,
        "require": {
            "population": 1000000,
            "year": 2010,
        },
        "per-year": {
            "birth-per-thousand": 0.002,
            "death-per-thousand": -0.001
        },
        "adopt-percent": 0    
    },
    "Nanotechnology": {
        "unlocked": false,
        "state": 0,
        "require": {
            "population": 1000000,
            "year": 2015,
        },
        "per-year": {
            "birth-per-thousand": 0.002,
            "death-per-thousand": -0.001
        },
        "adopt-percent": 0    
    }
}