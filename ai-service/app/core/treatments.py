from typing import List, Dict, Optional

# Mock Database for Home Remedies
REMEDIES_DB = {
    "cold": [
        {"name": "Ginger Tea", "ingredients": ["Ginger", "Honey", "Lemon"], "instructions": "Boil crushed ginger in water, strain, add honey and lemon."},
        {"name": "Steam Inhalation", "ingredients": ["Eucalyptus Oil", "Hot Water"], "instructions": "Add drops of oil to hot water and inhale steam."},
        {"name": "Turmeric Milk", "ingredients": ["Turmeric", "Milk", "Black Pepper"], "instructions": "Warm milk with turmeric and a pinch of black pepper."}
    ],
    "digestion": [
        {"name": "Cumin Water", "ingredients": ["Cumin seeds", "Water"], "instructions": "Boil cumin seeds in water, let it cool, and drink throughout the day."},
        {"name": "Fennel Seeds", "ingredients": ["Fennel seeds"], "instructions": "Chew a teaspoon of fennel seeds after meals."},
        {"name": "Ginger & Salt", "ingredients": ["Ginger slice", "Rock salt"], "instructions": "Chew a slice of fresh ginger with rock salt before meals."}
    ],
    "headache": [
        {"name": "Ginger Paste", "ingredients": ["Ginger powder", "Water"], "instructions": "Apply ginger paste on the forehead for tension headaches."},
        {"name": "Lavender Oil", "ingredients": ["Lavender essential oil"], "instructions": "Massage temples with diluted lavender oil."}
    ],
    "stress": [
        {"name": "Warm Oil Massage", "ingredients": ["Sesame Oil"], "instructions": "Massage feet with warm oil before bed."},
        {"name": "Brahmi Tea", "ingredients": ["Brahmi leaves", "Water"], "instructions": "Brew fresh or dried Brahmi leaves into a tea."}
    ],
    "skin": [
        {"name": "Aloe Vera Gel", "ingredients": ["Fresh Aloe Vera"], "instructions": "Apply fresh gel to soothe irritation or sunburn."},
        {"name": "Neem Paste", "ingredients": ["Neem leaves", "Turmeric"], "instructions": "Grind neem leaves with turmeric and apply to acne."}
    ]
}

# Mock Database for Detox Programs
DETOX_PROGRAMS = [
    {
        "name": "Kitchari Cleanse (3 Days)",
        "description": "A mono-diet of Kitchari (rice and mung beans) to reset digestion.",
        "duration": "3 Days",
        "steps": [
            "Eat only fresh Kitchari for breakfast, lunch, and dinner.",
            "Drink only warm water or herbal teas.",
            "Avoid snacking, caffeine, and sugar.",
            "Rest as much as possible."
        ]
    },
    {
        "name": "Triphala Detox",
        "description": "Gentle bowel cleansing using Triphala.",
        "duration": "1 Week",
        "steps": [
            "Take 1 tsp of Triphala powder with warm water before bed.",
            "Eat light, vegetarian meals.",
            "Hydrate well throughout the day."
        ]
    },
    {
        "name": "CCF Tea Detox",
        "description": "Cumin, Coriander, and Fennel tea to flush lymphatic system.",
        "duration": "Ongoing / Daily",
        "steps": [
            "Mix equal parts Cumin, Coriander, and Fennel seeds.",
            "Boil 1 tsp of mixture in 1 cup of water.",
            "Strain and sip warm throughout the day."
        ]
    }
]

def get_remedies(ailment: str) -> List[Dict[str, str]]:
    """
    Search for remedies by ailment keyword.
    """
    ailment = ailment.lower()
    results = []
    
    # Direct match
    if ailment in REMEDIES_DB:
        results.extend(REMEDIES_DB[ailment])
    
    # Partial search if no direct match or to add more
    for key, items in REMEDIES_DB.items():
        if key != ailment and (key in ailment or ailment in key):
             results.extend(items)
             
    return results

def get_detox_programs() -> List[Dict]:
    return DETOX_PROGRAMS
