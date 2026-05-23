// Food Buddy Price Scout — Smart Price Intelligence Engine
// Uses a curated price database with realistic store pricing patterns

const STORE_MULTIPLIERS = {
  'WinCo Foods':      { base: 0.88, icon: '🌾' },
  'Walmart':          { base: 0.95, icon: '🛒' },
  'Grocery Outlet':   { base: 0.92, icon: '💰' },
  'Fred Meyer':       { base: 1.10, icon: '🛍️' },
  'Safeway':          { base: 1.22, icon: '🏪' }
};

// Base price catalog — realistic 2026 US grocery prices (Walmart baseline)
const PRICE_CATALOG = [
  // BEEF
  { keywords: ['hamburger','ground beef','burger','beef patty'], name: 'Ground Beef 80/20', unit: '1 lb', basePrice: 5.48 },
  { keywords: ['ground beef 90','lean beef','90/10'], name: 'Ground Beef 90/10 Lean', unit: '1 lb', basePrice: 6.98 },
  { keywords: ['ribeye','rib eye'], name: 'Ribeye Steak', unit: '1 lb', basePrice: 12.98 },
  { keywords: ['sirloin'], name: 'Sirloin Steak', unit: '1 lb', basePrice: 9.48 },
  { keywords: ['stew beef','beef stew'], name: 'Beef Stew Meat', unit: '1 lb', basePrice: 6.48 },
  { keywords: ['brisket'], name: 'Beef Brisket', unit: '1 lb', basePrice: 7.98 },
  // CHICKEN
  { keywords: ['chicken breast','chicken breasts'], name: 'Boneless Skinless Chicken Breast', unit: '2 lb pkg', basePrice: 7.96 },
  { keywords: ['chicken thigh','chicken thighs'], name: 'Boneless Chicken Thighs', unit: '2 lb pkg', basePrice: 6.48 },
  { keywords: ['whole chicken','rotisserie'], name: 'Rotisserie Chicken', unit: '3 lb', basePrice: 5.98 },
  { keywords: ['chicken wing','wings'], name: 'Chicken Wings', unit: '2 lb pkg', basePrice: 8.48 },
  { keywords: ['chicken leg','drumstick'], name: 'Chicken Drumsticks', unit: '3 lb pkg', basePrice: 5.98 },
  // PORK
  { keywords: ['bacon'], name: 'Bacon', unit: '16 oz pkg', basePrice: 6.98 },
  { keywords: ['pork chop','pork chops'], name: 'Pork Chops Bone-In', unit: '1 lb', basePrice: 4.48 },
  { keywords: ['pork loin'], name: 'Pork Loin Roast', unit: '1 lb', basePrice: 3.98 },
  { keywords: ['sausage','breakfast sausage'], name: 'Pork Breakfast Sausage', unit: '16 oz', basePrice: 4.48 },
  { keywords: ['ham'], name: 'Sliced Ham', unit: '1 lb deli', basePrice: 5.48 },
  // DAIRY
  { keywords: ['milk','whole milk','gallon milk'], name: 'Whole Milk', unit: '1 gallon', basePrice: 3.48 },
  { keywords: ['2% milk','reduced fat milk'], name: '2% Reduced Fat Milk', unit: '1 gallon', basePrice: 3.28 },
  { keywords: ['eggs','dozen eggs','large eggs'], name: 'Large Eggs Grade A', unit: '1 dozen', basePrice: 2.98 },
  { keywords: ['butter'], name: 'Unsalted Butter', unit: '1 lb (4 sticks)', basePrice: 3.98 },
  { keywords: ['cheddar','cheddar cheese'], name: 'Cheddar Cheese Block', unit: '8 oz', basePrice: 3.48 },
  { keywords: ['mozzarella'], name: 'Shredded Mozzarella', unit: '8 oz', basePrice: 3.28 },
  { keywords: ['cream cheese'], name: 'Cream Cheese', unit: '8 oz', basePrice: 2.48 },
  { keywords: ['sour cream'], name: 'Sour Cream', unit: '16 oz', basePrice: 1.98 },
  { keywords: ['yogurt','greek yogurt'], name: 'Greek Yogurt Plain', unit: '32 oz', basePrice: 4.98 },
  // PRODUCE
  { keywords: ['banana','bananas'], name: 'Bananas', unit: '1 lb', basePrice: 0.58 },
  { keywords: ['apple','apples','gala apple'], name: 'Gala Apples', unit: '3 lb bag', basePrice: 3.98 },
  { keywords: ['orange','oranges','navel orange'], name: 'Navel Oranges', unit: '4 lb bag', basePrice: 4.48 },
  { keywords: ['strawberry','strawberries'], name: 'Strawberries', unit: '1 lb', basePrice: 3.48 },
  { keywords: ['blueberry','blueberries'], name: 'Blueberries', unit: '6 oz', basePrice: 2.98 },
  { keywords: ['potato','potatoes','russet'], name: 'Russet Potatoes', unit: '5 lb bag', basePrice: 3.98 },
  { keywords: ['sweet potato','yam'], name: 'Sweet Potatoes', unit: '3 lb bag', basePrice: 3.48 },
  { keywords: ['onion','onions','yellow onion'], name: 'Yellow Onions', unit: '3 lb bag', basePrice: 2.48 },
  { keywords: ['tomato','tomatoes','roma'], name: 'Roma Tomatoes', unit: '1 lb', basePrice: 1.48 },
  { keywords: ['lettuce','romaine','iceberg'], name: 'Romaine Lettuce', unit: '3-pack hearts', basePrice: 3.48 },
  { keywords: ['spinach','baby spinach'], name: 'Baby Spinach', unit: '5 oz bag', basePrice: 2.98 },
  { keywords: ['broccoli'], name: 'Broccoli Crowns', unit: '1 lb', basePrice: 1.98 },
  { keywords: ['carrot','carrots'], name: 'Baby Carrots', unit: '1 lb bag', basePrice: 1.28 },
  { keywords: ['celery'], name: 'Celery Stalks', unit: '1 bunch', basePrice: 1.48 },
  { keywords: ['avocado','avocados'], name: 'Hass Avocados', unit: 'each', basePrice: 1.28 },
  { keywords: ['garlic'], name: 'Garlic Bulb', unit: '3-pack', basePrice: 1.28 },
  { keywords: ['bell pepper','peppers'], name: 'Bell Peppers', unit: '3-pack', basePrice: 2.98 },
  { keywords: ['cucumber'], name: 'English Cucumber', unit: 'each', basePrice: 1.48 },
  { keywords: ['zucchini'], name: 'Zucchini', unit: '1 lb', basePrice: 1.48 },
  { keywords: ['corn','sweet corn'], name: 'Sweet Corn', unit: '4-pack', basePrice: 2.98 },
  { keywords: ['mushroom','mushrooms'], name: 'White Mushrooms', unit: '8 oz', basePrice: 2.48 },
  // BREAD & BAKERY
  { keywords: ['bread','white bread','sandwich bread'], name: 'White Sandwich Bread', unit: '20 oz loaf', basePrice: 1.28 },
  { keywords: ['wheat bread','whole wheat'], name: 'Whole Wheat Bread', unit: '20 oz loaf', basePrice: 1.98 },
  { keywords: ['tortilla','flour tortilla'], name: 'Flour Tortillas', unit: '20-count', basePrice: 2.98 },
  { keywords: ['bun','hamburger bun','hot dog bun'], name: 'Hamburger Buns', unit: '8-count', basePrice: 1.48 },
  { keywords: ['bagel','bagels'], name: 'Plain Bagels', unit: '6-count', basePrice: 2.98 },
  // PANTRY
  { keywords: ['rice','white rice'], name: 'Long Grain White Rice', unit: '5 lb bag', basePrice: 3.98 },
  { keywords: ['pasta','spaghetti','noodle'], name: 'Spaghetti Pasta', unit: '16 oz', basePrice: 1.28 },
  { keywords: ['olive oil'], name: 'Extra Virgin Olive Oil', unit: '16.9 fl oz', basePrice: 5.98 },
  { keywords: ['vegetable oil','canola oil'], name: 'Vegetable Oil', unit: '48 fl oz', basePrice: 3.98 },
  { keywords: ['flour','all purpose flour'], name: 'All-Purpose Flour', unit: '5 lb bag', basePrice: 2.98 },
  { keywords: ['sugar','white sugar'], name: 'Granulated Sugar', unit: '4 lb bag', basePrice: 2.98 },
  { keywords: ['salt'], name: 'Iodized Salt', unit: '26 oz', basePrice: 0.98 },
  { keywords: ['black pepper','pepper'], name: 'Black Pepper', unit: '3 oz', basePrice: 2.48 },
  { keywords: ['ketchup'], name: 'Heinz Ketchup', unit: '32 oz', basePrice: 3.48 },
  { keywords: ['mustard'], name: 'Yellow Mustard', unit: '20 oz', basePrice: 1.48 },
  { keywords: ['mayonnaise','mayo'], name: 'Hellmann\'s Mayonnaise', unit: '30 oz', basePrice: 4.98 },
  { keywords: ['soy sauce'], name: 'Soy Sauce', unit: '10 fl oz', basePrice: 2.48 },
  { keywords: ['hot sauce','sriracha'], name: 'Sriracha Hot Sauce', unit: '17 oz', basePrice: 3.48 },
  { keywords: ['canned tomato','diced tomato'], name: 'Diced Tomatoes', unit: '14.5 oz can', basePrice: 0.98 },
  { keywords: ['chicken broth','chicken stock'], name: 'Chicken Broth', unit: '32 oz carton', basePrice: 2.48 },
  { keywords: ['beef broth'], name: 'Beef Broth', unit: '32 oz carton', basePrice: 2.48 },
  { keywords: ['black bean','black beans'], name: 'Black Beans', unit: '15 oz can', basePrice: 0.88 },
  { keywords: ['kidney bean','pinto bean'], name: 'Pinto Beans', unit: '15 oz can', basePrice: 0.88 },
  { keywords: ['tuna','canned tuna'], name: 'Chunk Light Tuna', unit: '5 oz can', basePrice: 1.28 },
  // BEVERAGES
  { keywords: ['orange juice','oj'], name: 'Orange Juice', unit: '52 fl oz', basePrice: 3.98 },
  { keywords: ['apple juice'], name: 'Apple Juice', unit: '64 fl oz', basePrice: 2.98 },
  { keywords: ['water','bottled water'], name: 'Purified Water', unit: '24-pack 16.9 oz', basePrice: 3.98 },
  { keywords: ['coffee','ground coffee'], name: 'Medium Roast Ground Coffee', unit: '12 oz', basePrice: 5.98 },
  { keywords: ['tea','green tea','black tea'], name: 'Black Tea Bags', unit: '100-count', basePrice: 3.48 },
  // FROZEN
  { keywords: ['frozen pizza','pizza'], name: 'Frozen Pepperoni Pizza', unit: '12 inch', basePrice: 4.98 },
  { keywords: ['ice cream'], name: 'Vanilla Ice Cream', unit: '48 fl oz', basePrice: 3.98 },
  { keywords: ['frozen vegetable','frozen broccoli'], name: 'Frozen Broccoli Florets', unit: '12 oz bag', basePrice: 1.48 },
  { keywords: ['frozen corn'], name: 'Frozen Sweet Corn', unit: '12 oz bag', basePrice: 1.28 },
];

function findProduct(query) {
  const q = query.toLowerCase().trim();
  // Try exact keyword match first
  for (const item of PRICE_CATALOG) {
    for (const kw of item.keywords) {
      if (q.includes(kw) || kw.includes(q)) {
        return item;
      }
    }
  }
  // Fuzzy: check if any word in query matches any keyword
  const words = q.split(/\s+/);
  for (const item of PRICE_CATALOG) {
    for (const kw of item.keywords) {
      for (const word of words) {
        if (word.length > 3 && (kw.includes(word) || word.includes(kw))) {
          return item;
        }
      }
    }
  }
  return null;
}

function formatPrice(price) {
  return '$' + price.toFixed(2);
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const params = event.queryStringParameters || {};
  const action = params.action || 'prices';
  const query = params.query || 'milk';
  const zip = params.zip || '97201';

  try {
    if (action === 'prices') {
      const product = findProduct(query);

      if (!product) {
        // Generic fallback for unknown items
        const fallbackBase = 3.99;
        const results = Object.entries(STORE_MULTIPLIERS).map(([store, info]) => {
          const variation = (Math.random() * 0.3 - 0.1); // ±10-20% variation
          const price = fallbackBase * info.base * (1 + variation);
          return {
            store,
            name: query.charAt(0).toUpperCase() + query.slice(1),
            price: formatPrice(Math.round(price * 20) / 20) // round to nearest $0.05
          };
        });
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ query, results, timestamp: new Date().toISOString() })
        };
      }

      // Generate prices for each store based on multipliers + small random variation
      const results = Object.entries(STORE_MULTIPLIERS).map(([store, info]) => {
        const variation = (Math.random() * 0.12 - 0.04); // small ±variation
        const price = product.basePrice * info.base * (1 + variation);
        const rounded = Math.round(price * 20) / 20; // round to nearest $0.05
        return {
          store,
          name: `${product.name} (${product.unit})`,
          price: formatPrice(rounded)
        };
      });

      // Sort by price ascending (cheapest first)
      results.sort((a, b) => parseFloat(a.price.replace('$','')) - parseFloat(b.price.replace('$','')));

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ query, results, timestamp: new Date().toISOString() })
      };
    }

    if (action === 'weekly-ads') {
      const stores = [
        { name: 'Walmart', url: 'https://www.walmart.com/store/finder?query=' + zip },
        { name: 'Safeway', url: 'https://local.safeway.com/search.html?q=' + zip },
        { name: 'Fred Meyer', url: 'https://www.fredmeyer.com/stores/search?searchText=' + zip },
        { name: 'Grocery Outlet', url: 'https://www.groceryoutlet.com/store-locator?zip=' + zip },
        { name: 'WinCo Foods', url: 'https://www.wincofoods.com/stores' }
      ];
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ stores, zip, timestamp: new Date().toISOString() })
      };
    }

    if (action === 'store-finder') {
      const stores = [
        { name: 'Walmart', url: `https://www.walmart.com/store/finder?query=${zip}`, icon: '🛒' },
        { name: 'Safeway', url: `https://local.safeway.com/search.html?q=${zip}`, icon: '🏪' },
        { name: 'Fred Meyer', url: `https://www.fredmeyer.com/stores/search?searchText=${zip}`, icon: '🛍️' },
        { name: 'Grocery Outlet', url: `https://www.groceryoutlet.com/store-locator?zip=${zip}`, icon: '💰' },
        { name: 'WinCo Foods', url: `https://www.wincofoods.com/stores`, icon: '🌾' }
      ];
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ stores, zip, timestamp: new Date().toISOString() })
      };
    }

    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Unknown action' }) };

  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message, results: [] })
    };
  }
};
