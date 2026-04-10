export const recipes = [
  // INDIAN
  {
    id: 'biryani',
    name: 'Biryani',
    category: 'Non-Veg',
    origin: 'India',
    image: '/images/biryani.jpg',
    procedure: [
      'Marinate 500g meat with yogurt, ginger-garlic paste, spices for 1 hour.',
      'Cook basmati rice until 70% done.',
      'Sauté onions, spices, tomatoes; cook meat until tender.',
      'Layer rice over meat, add saffron milk, fried onions, and mint.',
      'Cook on low heat (dum) for 20-25 minutes.',
      'Serve hot with raita.'
    ]
  },
  {
    id: 'butter',
    name: 'Butter Chicken',
    category: 'Non-Veg',
    origin: 'India',
    image: '/images/butter_chicken.jpg',
    procedure: [
      'Marinate chicken with yogurt and spices; grill or pan-fry.',
      'Prepare gravy with butter, onions, tomatoes, cashews; blend to puree.',
      'Simmer puree with spices and butter.',
      'Add cream and chicken; cook for 5-7 minutes.',
      'Garnish with coriander and serve.'
    ]
  },
  {
    id: 'paneer',
    name: 'Paneer Tikka',
    category: 'Veg',
    origin: 'India',
    image: '/images/paneer_tikka.jpg',
    procedure: [
      'Marinate paneer, bell peppers, and onions in spiced yogurt for 30 mins.',
      'Thread onto skewers.',
      'Grill at 200°C for 10-15 minutes.',
      'Baste with butter midway.',
      'Serve with mint chutney.'
    ]
  },
  {
    id: 'dosa',
    name: 'Masala Dosa',
    category: 'Veg',
    origin: 'India',
    image: '/images/masala_dosa.jpg',
    procedure: [
      'Prepare and ferment rice-dal batter overnight.',
      'Make potato filling with spices, onions, and curry leaves.',
      'Spread batter thinly on a hot pan; cook until golden.',
      'Place filling in center; fold and serve with chutney.'
    ]
  },
  {
    id: 'dal',
    name: 'Dal Makhani',
    category: 'Veg',
    origin: 'India',
    image: '/images/dal_makhani.jpg',
    procedure: [
      'Soak and pressure cook whole black lentils and kidney beans.',
      'Sauté ginger-garlic, onions, and tomato puree with spices.',
      'Combine lentils and base; add cream and simmer.',
      'Garnish and serve.'
    ]
  },

  // ITALIAN
  {
    id: 'pizza',
    name: 'Pizza',
    category: 'Veg',
    origin: 'Italy',
    image: '/images/pizza.jpg',
    procedure: [
      'Make dough and let rise for 1 hour.',
      'Prepare tomato sauce with garlic and herbs.',
      'Roll dough, spread sauce, add cheese and toppings.',
      'Bake at 220°C for 12-15 minutes.',
      'Serve hot.'
    ]
  },
  {
    id: 'pasta',
    name: 'Pasta',
    category: 'Veg',
    origin: 'Italy',
    image: '/images/pasta.jpg',
    procedure: [
      'Boil pasta until al dente.',
      'Sauté garlic in olive oil; add tomato puree and herbs.',
      'Toss pasta in sauce; add parmesan.',
      'Garnish with basil.'
    ]
  },
  {
    id: 'risotto',
    name: 'Risotto',
    category: 'Veg',
    origin: 'Italy',
    image: '/images/risotto.jpg',
    procedure: [
      'Sauté onion and garlic; toast Arborio rice.',
      'Add broth incrementally, stirring until absorbed.',
      'Finish with parmesan and butter.',
      'Serve creamy.'
    ]
  },
  {
    id: 'tiramisu',
    name: 'Tiramisu',
    category: 'Veg',
    origin: 'Italy',
    image: '/images/tiramisu.jpg',
    procedure: [
      'Mix mascarpone, sugar, vanilla, and whipped cream.',
      'Dip ladyfingers in coffee/liqueur.',
      'Layer ladyfingers and cream; chill for 4 hours.',
      'Dust with cocoa powder.'
    ]
  },
  {
    id: 'lasagna',
    name: 'Lasagna',
    category: 'Non-Veg',
    origin: 'Italy',
    image: '/images/lasagna.jpg',
    procedure: [
      'Prepare meat sauce with ground beef and tomatoes.',
      'Mix ricotta, egg, and parmesan.',
      'Layer noodles, meat sauce, and cheese mix.',
      'Bake at 180°C for 40 minutes.'
    ]
  },

  // RUSSIAN
  {
    id: 'borscht',
    name: 'Borscht',
    category: 'Veg',
    origin: 'Russia',
    image: '/images/borscht.jpg',
    procedure: [
      'Boil, peel, and grate beets.',
      'Sauté onions, carrots, and potatoes; add broth and beets.',
      'Simmer with cabbage and vinegar.',
      'Serve with sour cream.'
    ]
  },
  {
    id: 'stroganoff',
    name: 'Beef Stroganoff',
    category: 'Non-Veg',
    origin: 'Russia',
    image: '/images/beef_stroganoff.jpg',
    procedure: [
      'Brown beef strips and set aside.',
      'Sauté onions and mushrooms; add broth and thicken.',
      'Combine beef and sour cream; heat through.',
      'Serve over noodles.'
    ]
  },
  {
    id: 'pelmeni',
    name: 'Pelmeni',
    category: 'Non-Veg',
    origin: 'Russia',
    image: '/images/pelmeni.jpg',
    procedure: [
      'Make dough and roll thin.',
      'Fill with ground meat mixture.',
      'Boil in salted water for 5-7 minutes.',
      'Serve with butter or sour cream.'
    ]
  },
  {
    id: 'olivier',
    name: 'Olivier Salad',
    category: 'Veg',
    origin: 'Russia',
    image: '/images/olivier_salad.jpg',
    procedure: [
      'Boil and dice potatoes, carrots, and eggs.',
      'Mix with peas, pickles, onions, and mayo.',
      'Chill for 1 hour.',
      'Garnish with dill.'
    ]
  },
  {
    id: 'blini',
    name: 'Blini',
    category: 'Veg',
    origin: 'Russia',
    image: '/images/blini.jpg',
    procedure: [
      'Make thin batter with flour, milk, and yeast.',
      'Cook on a pan until golden on both sides.',
      'Serve with jam, honey, or sour cream.'
    ]
  },

  // CHINESE
  {
    id: 'friedrice',
    name: 'Fried Rice',
    category: 'Veg',
    origin: 'China',
    image: '/images/fried_rice.jpg',
    procedure: [
      'Stir-fry veggies and eggs in a wok.',
      'Add cold cooked rice and soy sauce.',
      'Stir-fry until well mixed.',
      'Garnish with green onions.'
    ]
  },
  {
    id: 'dumplings',
    name: 'Dumplings',
    category: 'Veg',
    origin: 'China',
    image: '/images/dumplings.jpg',
    procedure: [
      'Fill dough circles with veggie or meat mixture.',
      'Steam for 10 minutes or pan-fry.',
      'Serve with dipping sauce.'
    ]
  },
  {
    id: 'kungpao',
    name: 'Kung Pao Chicken',
    category: 'Non-Veg',
    origin: 'China',
    image: '/images/kung_pao_chicken.jpg',
    procedure: [
      'Marinate chicken and stir-fry with peanuts and chilies.',
      'Add soy-based sauce and cook until thickened.',
      'Serve with rice.'
    ]
  },
  {
    id: 'springrolls',
    name: 'Spring Rolls',
    category: 'Veg',
    origin: 'China',
    image: '/images/spring_rolls.jpg',
    procedure: [
      'Stir-fry veggie filling; wrap in spring roll wrappers.',
      'Deep fry until golden brown.',
      'Serve with sweet chili sauce.'
    ]
  },
  {
    id: 'hotsour',
    name: 'Hot & Sour Soup',
    category: 'Veg',
    origin: 'China',
    image: '/images/hot_sour_soup.jpg',
    procedure: [
      'Boil veggies in broth with soy sauce.',
      'Thicken with cornstarch; add vinegar and pepper.',
      'Stir in beaten egg.',
      'Garnish with green onions.'
    ]
  },

  // OTHERS
  {
    id: 'sushi',
    name: 'Sushi',
    category: 'Non-Veg',
    origin: 'Japan',
    image: '/images/sushi.jpg',
    procedure: [
      'Season rice with vinegar and sugar.',
      'Roll rice and fish in nori sheets.',
      'Slice into pieces.',
      'Serve with wasabi and soy sauce.'
    ]
  },
  {
    id: 'tacos',
    name: 'Tacos',
    category: 'Non-Veg',
    origin: 'Mexico',
    image: '/images/tacos.jpg',
    procedure: [
      'Cook seasoned meat; prepare toppings.',
      'Warm tortillas.',
      'Fill and serve with lime.'
    ]
  },
  {
    id: 'shawarma',
    name: 'Shawarma',
    category: 'Non-Veg',
    origin: 'Middle East',
    image: '/images/shawarma.jpg',
    procedure: [
      'Marinate and grill spiced chicken.',
      'Slice and wrap in pita with veggies and tahini.',
      'Serve warm.'
    ]
  },
  {
    id: 'paella',
    name: 'Paella',
    category: 'Non-Veg',
    origin: 'Spain',
    image: '/images/paella.jpg',
    procedure: [
      'Cook seafood and chicken; set aside.',
      'Sauté rice with broth and saffron.',
      'Combine everything and simmer until rice is tender.',
      'Garnish with parsley.'
    ]
  },
  {
    id: 'poutine',
    name: 'Poutine',
    category: 'Veg',
    origin: 'Canada',
    image: '/images/poutine.jpg',
    procedure: [
      'Fry potato wedges.',
      'Prepare thick brown gravy.',
      'Top fries with cheese curds and hot gravy.'
    ]
  },
  {
    id: 'moussaka',
    name: 'Moussaka',
    category: 'Non-Veg',
    origin: 'Greece',
    image: '/images/moussaka.jpg',
    procedure: [
      'Fry eggplant slices; cook spiced meat sauce.',
      'Prepare béchamel sauce.',
      'Layer eggplant, meat, and béchamel.',
      'Bake until golden.'
    ]
  }
];

export const categories = ['All', 'Indian', 'Italian', 'Russian', 'Chinese', 'Others'];
export const types = ['All', 'Veg', 'Non-Veg'];
