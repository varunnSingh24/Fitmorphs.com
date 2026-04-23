const recipesData = [
    // --- SALADS ---
    {
        id: "salad-1",
        category: "salads",
        title: "Corn Pomegranate Salad",
        image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=800",
        preppingTime: "15 min",
        servings: 1,
        energy: "220 kcal",
        protein: "2 g",
        carbs: "11.5 g",
        fats: "20 g",
        ingredients: [
            "30g sweet corn",
            "15g pomegranate arils",
            "15g shredded coconut",
            "2 tbsp coriander leaves",
            "10g lemon juice",
            "Salt & pepper to taste",
            "Tempering: 10g oil, mustard seeds, curry leaves, red chilli, hing"
        ],
        instructions: "Boil sweet corn for 3-4 mins. Drain. For tempering, heat oil, add mustard seeds, red chilli, curry leaves, hing. In a bowl, toss corn, pomegranate, coconut, coriander, lemon juice, salt, pepper with the tempering. Chill and serve."
    },
    {
        id: "salad-2",
        category: "salads",
        title: "Cream Salad Without Cream",
        image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800",
        preppingTime: "15 min",
        servings: 1,
        energy: "352 kcal",
        protein: "18 g",
        carbs: "54 g",
        fats: "8 g",
        ingredients: [
            "100g Hung Curd",
            "30g Onions",
            "20g Carrots",
            "20g Lettuce",
            "40g Paneer",
            "20g Cherry Tomatoes",
            "20g Peas",
            "Salt, pepper, chilli powder, chaat masala to taste"
        ],
        instructions: "In a bowl add hung curd, spices, and chaat masala. Mix well. Add finely chopped veggies and paneer. Combine and serve immediately."
    },
    {
        id: "salad-3",
        category: "salads",
        title: "Chicken Shawarma Salad",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800",
        preppingTime: "15 min",
        servings: 1,
        energy: "392 kcal",
        protein: "32 g",
        carbs: "54 g",
        fats: "12 g",
        ingredients: [
            "30g chicken (marinated with yogurt, vinegar, spices)",
            "10-12 Lettuce leaves",
            "1 Onion, 1 Tomato, 1 Cucumber (sliced)",
            "25g Mayonnaise",
            "Salt, pepper, cardamom, allspice powder",
            "Pita bread for serving"
        ],
        instructions: "Marinate chicken and grill. Cut into thin slices. In a bowl, toss veggies with mayo, salt, and pepper. Top with grilled chicken slices. Serve with pita."
    },
    {
        id: "salad-4",
        category: "salads",
        title: "Mandarin Quinoa Salad",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800",
        preppingTime: "15 min",
        servings: 1,
        energy: "252 kcal",
        protein: "7 g",
        carbs: "50 g",
        fats: "20 g",
        ingredients: [
            "30g uncooked quinoa",
            "7.5g dried cranberries",
            "10g sunflower seeds",
            "50g mandarin oranges (keep liquid)",
            "10g honey, 10g olive oil"
        ],
        instructions: "Boil quinoa until water absorbs. Toss with oranges, cranberries, seeds. Whisk orange liquid, honey, oil, salt for dressing. Toss gently. Chill before serving."
    },
    
    // --- SOUPS ---
    {
        id: "soup-1",
        category: "soups",
        title: "Tom Yum Inspired Chicken Soup",
        image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=800",
        preppingTime: "20 min",
        servings: 1,
        energy: "185 kcal",
        protein: "22 g",
        carbs: "12 g",
        fats: "6 g",
        ingredients: [
            "50g chicken breast pieces",
            "Mushrooms, cherry tomatoes",
            "Lemongrass, galangal, kaffir lime leaves",
            "Chilli paste, fish sauce, lime juice"
        ],
        instructions: "Boil aromatics in stock. Add chicken and mushrooms. Simmer until cooked. Stir in chilli paste, fish sauce, and lime juice. Serve hot."
    },
    {
        id: "soup-2",
        category: "soups",
        title: "Classic Tomato Basil Soup",
        image: "https://images.unsplash.com/photo-1548943487-a2e4d43b4850?auto=format&fit=crop&q=80&w=800",
        preppingTime: "20 min",
        servings: 1,
        energy: "120 kcal",
        protein: "4 g",
        carbs: "18 g",
        fats: "4 g",
        ingredients: [
            "150g ripe tomatoes",
            "Garlic, onion, olive oil",
            "Fresh basil leaves",
            "Vegetable broth"
        ],
        instructions: "Roast tomatoes, garlic, onion in olive oil. Blend into a smooth puree. Simmer with vegetable broth. Garnish with fresh basil."
    },

    // --- RICE ---
    {
        id: "rice-1",
        category: "rice",
        title: "Herb Brown Rice Pilaf",
        image: "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&q=80&w=800",
        preppingTime: "25 min",
        servings: 1,
        energy: "210 kcal",
        protein: "6 g",
        carbs: "40 g",
        fats: "3 g",
        ingredients: [
            "40g brown rice",
            "Mixed herbs (parsley, thyme)",
            "Diced carrots, peas",
            "Light vegetable broth"
        ],
        instructions: "Cook brown rice in vegetable broth. Fold in diced cooked carrots and peas. Toss with freshly chopped herbs."
    }
];
