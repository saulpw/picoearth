var g_worldEvents = {
    
    "generic": {
        "StoneAge": {
            "message": "Stone Age begins in the year 10000BC.",
            "conditions": {
                "year": -10000
            }
        },
        "BrozeAge": {
            "message": "Broze Age begins in the year 3000BC.",
            "conditions": {
                "year": -3000 // Estimate
            }
        }
    },

    // ---------------------
    "natural-disasters": {
    
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
        }
    }
};