from typing import List, Dict

def get_dinacharya(dosha: str) -> Dict[str, List[Dict[str, str]]]:
    """
    Returns a daily routine (Dinacharya) based on the dominant Dosha.
    """
    dosha = dosha.lower()
    
    common_morning = [
        {"time": "Before Sunrise (Brahma Muhurta)", "activity": "Wake up", "description": "Wake up approx. 90 mins before sunrise for optimal energy."},
        {"time": "Morning", "activity": "Elimination & Cleansing", "description": "Evacuate bowels, brush teeth, scrape tongue, wash face with cool water."},
        {"time": "Morning", "activity": "Hydration", "description": "Drink a glass of warm water (Usha Pana) to flush toxins."}
    ]

    routine = {
        "morning": list(common_morning),
        "midday": [],
        "evening": []
    }

    if "vata" in dosha:
        routine["morning"].extend([
            {"time": "06:00 AM - 07:00 AM", "activity": "Abhyanga (Self-Massage)", "description": "Massage with warm sesame oil to ground Vata."},
            {"time": "07:00 AM - 07:30 AM", "activity": "Gentle Yoga", "description": "Slow, grounding poses like Sun Salutations, Tree Pose, Warrior."},
            {"time": "08:00 AM", "activity": "Breakfast", "description": "Warm, cooked oatmeal or porridge with cinnamon/ghee."}
        ])
        routine["midday"].extend([
            {"time": "12:30 PM", "activity": "Lunch", "description": "Largest meal of the day. Warm soups, grains, cooked vegetables."},
            {"time": "02:00 PM", "activity": "Rest", "description": "Short 15-min rest (not sleep) on left side to aid digestion."}
        ])
        routine["evening"].extend([
            {"time": "06:00 PM", "activity": "Dinner", "description": "Light, warm meal. Kitchari or soup."},
            {"time": "09:30 PM", "activity": "Bedtime", "description": "Early sleep is crucial for Vata. Avoid screens."}
        ])
        
    elif "pitta" in dosha:
        routine["morning"].extend([
            {"time": "06:00 AM - 06:30 AM", "activity": "Exercise", "description": "Moderate exercise like swimming or brisk walking. Avoid overheating."},
            {"time": "07:00 AM", "activity": "Meditation", "description": "Cooling breathwork (Sheetali Pranayama) and meditation."},
            {"time": "08:00 AM", "activity": "Breakfast", "description": "Fresh fruit, toast with almond butter, or room temp smoothie."}
        ])
        routine["midday"].extend([
            {"time": "12:00 PM", "activity": "Lunch", "description": "Substantial meal. Salads, grains, beans. Avoid spicy/fried foods."},
        ])
        routine["evening"].extend([
            {"time": "05:30 PM", "activity": "Recreation", "description": "Spend time in nature, moonlight walks, or pleasant company."},
            {"time": "07:00 PM", "activity": "Dinner", "description": "Moderate meal. Vegetable stir-fry or grain bowl."},
            {"time": "10:00 PM", "activity": "Bedtime", "description": "Sleep before the Pitta time (10 PM - 2 AM) kicks in."}
        ])

    elif "kapha" in dosha:
        routine["morning"].extend([
            {"time": "05:30 AM - 06:30 AM", "activity": "Vigorous Exercise", "description": "Cardio, running, or strong Yoga to stimulate metabolism."},
            {"time": "06:45 AM", "activity": "Dry Brushing (Garshana)", "description": "Stimulate lymphatic system before shower."},
            {"time": "08:00 AM", "activity": "Breakfast", "description": "Light or skip if not hungry. Warm tea with ginger/honey."}
        ])
        routine["midday"].extend([
            {"time": "12:30 PM", "activity": "Lunch", "description": "Main meal. Spicy, bitter, astringent foods. Light grains like quinoa/millets."},
        ])
        routine["evening"].extend([
            {"time": "06:00 PM", "activity": "Dinner", "description": "Very light. Soup or steamed vegetables. Avoid dairy/heavy carbs."},
            {"time": "10:00 PM", "activity": "Bedtime", "description": "Avoid day sleeping. Stick to a schedule."}
        ])
    
    else:
        # Default Tridoshic / General
        routine["morning"].append({"time": "06:00 AM", "activity": "Yoga/Exercise", "description": "General stretching and movement."})
        routine["midday"].append({"time": "12:00 PM", "activity": "Lunch", "description": "Balanced meal with all 6 tastes."})
        routine["evening"].append({"time": "10:00 PM", "activity": "Bedtime", "description": "Consistency is key for health."})

    return routine

def get_seasonal_tips(season: str) -> List[str]:
    # Simplified seasonal logic
    season = season.lower()
    if "winter" in season:
        return ["Eat warm, oily, cooked foods.", "Perform daily oil massage.", "Cover head and ears.", "Use warming spices like ginger, cinnamon, cloves."]
    elif "summer" in season:
        return ["Eat cooling, sweet, bitter foods.", "Avoid direct midday sun.", "Stay hydrated with coconut water.", "Use sandalwood or jasmine scents."]
    elif "spring" in season:
        return ["Focus on detoxifying.", "Eat light, dry, warm foods.", "Exercise more vigorously.", "Avoid heavy dairy and sweets."]
    elif "autumn" in season or "fall" in season:
        return ["Grounding practices are essential.", "Warm, moist foods.", "Protect from wind.", "Stick to a routine."]
    else:
        return ["Eat according to your hunger.", "Favor fresh, seasonal produce.", "Maintain regular sleep hours."]
