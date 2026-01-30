from typing import List, Dict, Optional
from pydantic import BaseModel

class Herb(BaseModel):
    name: str
    sanskrit_name: str
    dosha_effect: str  # e.g., "Pacifies Vata", "Tridoshic"
    benefits: List[str]
    dosage: str
    contraindications: List[str]
    image_url: Optional[str] = None

# Mock Database
HERB_DATABASE = [
    {
        "name": "Ashwagandha",
        "sanskrit_name": "Withania somnifera",
        "dosha_effect": "Pacifies Vata and Kapha",
        "benefits": ["Reduces stress", "Improves sleep", "Boosts immunity", "Enhances stamina"],
        "dosage": "1-2 tsp root powder with warm milk at night",
        "contraindications": ["Pregnancy (high doses)", "Hyperthyroidism"],
        "image_url": "https://example.com/ashwagandha.jpg"
    },
    {
        "name": "Triphala",
        "sanskrit_name": "Three Fruits (Amalaki, Bibhitaki, Haritaki)",
        "dosha_effect": "Tridoshic (Balances all three)",
        "benefits": ["Digestive health", "Detoxification", "Eye health", "Antioxidant"],
        "dosage": "1 tsp with warm water before bed",
        "contraindications": ["Diarrhea", "Pregnancy"],
        "image_url": "https://example.com/triphala.jpg"
    },
    {
        "name": "Brahmi",
        "sanskrit_name": "Bacopa monnieri",
        "dosha_effect": "Pacifies Pitta and Kapha",
        "benefits": ["Memory enhancement", "Focus", "Reduces anxiety", "Hair growth"],
        "dosage": "1-2 tablets or tsp with ghee/honey",
        "contraindications": ["Slow heart rate", "Ulcers"],
        "image_url": "https://example.com/brahmi.jpg"
    },
    {
        "name": "Turmeric (Curcumin)",
        "sanskrit_name": "Curcuma longa",
        "dosha_effect": "Pacifies Kapha and Vata, Aggravates Pitta (in excess)",
        "benefits": ["Anti-inflammatory", "Joint pain relief", "Skin health", "Immunity"],
        "dosage": "1 tsp with warm milk (Golden Milk) or in cooking",
        "contraindications": ["Gallstones", "Blood thinners"],
        "image_url": "https://example.com/turmeric.jpg"
    },
    {
        "name": "Tulsi",
        "sanskrit_name": "Ocimum sanctum",
        "dosha_effect": "Pacifies Vata and Kapha",
        "benefits": ["Respiratory health", "Stress relief", "Fever reduction", "Oral health"],
        "dosage": "Tea made from 5-6 fresh leaves",
        "contraindications": ["Low blood sugar (hypoglycemia)", "Trying to conceive"],
        "image_url": "https://example.com/tulsi.jpg"
    },
    {
        "name": "Shatavari",
        "sanskrit_name": "Asparagus racemosus",
        "dosha_effect": "Pacifies Vata and Pitta",
        "benefits": ["Female reproductive health", "Hormonal balance", "Cooling effect", "Strength"],
        "dosage": "1-2 tsp with warm milk",
        "contraindications": ["High Kapha congestion", "Estrogen-sensitive conditions"],
        "image_url": "https://example.com/shatavari.jpg"
    },
    {
        "name": "Guduchi (Giloy)",
        "sanskrit_name": "Tinospora cordifolia",
        "dosha_effect": "Tridoshic",
        "benefits": ["Immunity booster", "Fever management", "Liver health", "Anti-aging"],
        "dosage": "1 tablet or tsp of powder with warm water",
        "contraindications": ["Autoimmune diseases (stimulates immune system)", "Pregnancy"],
        "image_url": "https://example.com/guduchi.jpg"
    }
]

def get_herb_recommendations(dosha: Optional[str] = None, symptom: Optional[str] = None) -> List[dict]:
    """
    Simple recommendation engine filtering by Dosha or Symptom text match.
    """
    results = []
    
    # Normalize inputs
    dosha_lower = dosha.lower() if dosha else ""
    symptom_lower = symptom.lower() if symptom else ""

    for herb in HERB_DATABASE:
        score = 0
        
        # Dosha Matching
        if dosha_lower:
            if "tridoshic" in herb["dosha_effect"].lower():
                score += 2
            elif dosha_lower in herb["dosha_effect"].lower():
                score += 3
            # Penalty for aggravating? Maybe later.

        # Symptom Matching (Simple keyword search in benefits)
        if symptom_lower:
            for benefit in herb["benefits"]:
                if symptom_lower in benefit.lower() or benefit.lower() in symptom_lower:
                    score += 5
        
        # Basic Logic: If searching by symptom, prioritize symptom match.
        # If searching by dosha only, show dosha matches.
        
        if symptom_lower and score >= 5:
            results.append(herb)
        elif not symptom_lower and dosha_lower and score >= 2:
            results.append(herb)
        elif not symptom_lower and not dosha_lower:
            # Return all if no filter (maybe limit)
            results.append(herb)

    return results
