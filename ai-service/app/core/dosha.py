from typing import List, Dict, Any

DOSHA_QUESTIONS = [
    {
        "id": 1,
        "text": "How would you describe your body frame?",
        "options": [
            {"text": "Thin, bony, small joints", "dosha": "vata", "weight": 10},
            {"text": "Medium build, moderate muscle", "dosha": "pitta", "weight": 10},
            {"text": "Large build, thick, heavy", "dosha": "kapha", "weight": 10},
        ]
    },
    {
        "id": 2,
        "text": "How is your skin typically?",
        "options": [
            {"text": "Dry, rough, cool to touch", "dosha": "vata", "weight": 10},
            {"text": "Warm, oily, sensitive, prone to redness", "dosha": "pitta", "weight": 10},
            {"text": "Thick, cool, oily, smooth", "dosha": "kapha", "weight": 10},
        ]
    },
    {
        "id": 3,
        "text": "How is your appetite?",
        "options": [
            {"text": "Variable, sometimes hungry, sometimes not", "dosha": "vata", "weight": 10},
            {"text": "Strong, sharp, irritable if meal missed", "dosha": "pitta", "weight": 10},
            {"text": "Steady, but can skip meals easily", "dosha": "kapha", "weight": 10},
        ]
    },
    {
        "id": 4,
        "text": "How is your sleep pattern?",
        "options": [
            {"text": "Light, interrupted, trouble falling asleep", "dosha": "vata", "weight": 10},
            {"text": "Moderate, but can wake up easily", "dosha": "pitta", "weight": 10},
            {"text": "Deep, heavy, hard to wake up", "dosha": "kapha", "weight": 10},
        ]
    },
    {
        "id": 5,
        "text": "How do you react to stress?",
        "options": [
            {"text": "Anxious, fearful, worried", "dosha": "vata", "weight": 10},
            {"text": "Angry, frustrated, critical", "dosha": "pitta", "weight": 10},
            {"text": "Withdrawn, calm, stubborn", "dosha": "kapha", "weight": 10},
        ]
    }
]

def calculate_dosha(answers: List[Dict[str, str]]) -> Dict[str, Any]:
    scores = {"vata": 0, "pitta": 0, "kapha": 0}
    
    for answer in answers:
        dosha = answer.get("dosha")
        weight = answer.get("weight", 10)
        if dosha in scores:
            scores[dosha] += weight
            
    total = sum(scores.values())
    if total == 0:
        return {"primary": "unknown", "scores": scores}
        
    sorted_scores = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    primary = sorted_scores[0][0]
    secondary = sorted_scores[1][0] if sorted_scores[1][1] > (total * 0.3) else None
    
    return {
        "primary": primary,
        "secondary": secondary,
        "scores": scores,
        "explanation": f"Your primary Dosha is {primary.capitalize()}." + 
                       (f" You also have strong {secondary.capitalize()} traits." if secondary else "")
    }
