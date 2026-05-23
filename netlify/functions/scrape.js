// Food Buddy Price Scout — Smart Price Intelligence Engine
// Zip-aware store coverage for Pacific Northwest and beyond

// ZIP code prefix → US state mapping (first 3 digits)
const ZIP_PREFIX_TO_STATE = {
  '005':'NY','006':'PR','007':'PR','008':'VI','009':'PR',
  '010':'MA','011':'MA','012':'MA','013':'MA','014':'MA','015':'MA','016':'MA','017':'MA','018':'MA','019':'MA',
  '020':'MA','021':'MA','022':'MA','023':'MA','024':'MA','025':'MA','026':'MA','027':'MA',
  '028':'RI','029':'RI',
  '030':'NH','031':'NH','032':'NH','033':'NH','034':'NH','035':'NH','036':'NH','037':'NH','038':'NH',
  '039':'ME','040':'ME','041':'ME','042':'ME','043':'ME','044':'ME','045':'ME','046':'ME','047':'ME','048':'ME','049':'ME',
  '050':'VT','051':'VT','052':'VT','053':'VT','054':'VT','056':'VT','057':'VT','058':'VT','059':'VT',
  '060':'CT','061':'CT','062':'CT','063':'CT','064':'CT','065':'CT','066':'CT','067':'CT','068':'CT','069':'CT',
  '070':'NJ','071':'NJ','072':'NJ','073':'NJ','074':'NJ','075':'NJ','076':'NJ','077':'NJ','078':'NJ','079':'NJ',
  '080':'NJ','081':'NJ','082':'NJ','083':'NJ','084':'NJ','085':'NJ','086':'NJ','087':'NJ','088':'NJ','089':'NJ',
  '100':'NY','101':'NY','102':'NY','103':'NY','104':'NY','105':'NY','106':'NY','107':'NY','108':'NY','109':'NY',
  '110':'NY','111':'NY','112':'NY','113':'NY','114':'NY','115':'NY','116':'NY','117':'NY','118':'NY','119':'NY',
  '120':'NY','121':'NY','122':'NY','123':'NY','124':'NY','125':'NY','126':'NY','127':'NY','128':'NY','129':'NY',
  '130':'NY','131':'NY','132':'NY','133':'NY','134':'NY','135':'NY','136':'NY','137':'NY','138':'NY','139':'NY',
  '140':'NY','141':'NY','142':'NY','143':'NY','144':'NY','145':'NY','146':'NY','147':'NY','148':'NY','149':'NY',
  '150':'PA','151':'PA','152':'PA','153':'PA','154':'PA','155':'PA','156':'PA','157':'PA','158':'PA','159':'PA',
  '160':'PA','161':'PA','162':'PA','163':'PA','164':'PA','165':'PA','166':'PA','167':'PA','168':'PA','169':'PA',
  '170':'PA','171':'PA','172':'PA','173':'PA','174':'PA','175':'PA','176':'PA','177':'PA','178':'PA','179':'PA',
  '180':'PA','181':'PA','182':'PA','183':'PA','184':'PA','185':'PA','186':'PA','187':'PA','188':'PA','189':'PA',
  '190':'PA','191':'PA','192':'PA','193':'PA','194':'PA','195':'PA','196':'PA',
  '197':'DE','198':'DE','199':'DE',
  '200':'DC','201':'VA','202':'DC','203':'DC','204':'DC','205':'DC','206':'DC','207':'MD','208':'MD','209':'MD',
  '210':'MD','211':'MD','212':'MD','214':'MD','215':'MD','216':'MD','217':'MD','218':'MD','219':'MD',
  '220':'VA','221':'VA','222':'VA','223':'VA','224':'VA','225':'VA','226':'VA','227':'VA','228':'VA','229':'VA',
  '230':'VA','231':'VA','232':'VA','233':'VA','234':'VA','235':'VA','236':'VA','237':'VA','238':'VA','239':'VA',
  '240':'VA','241':'VA','242':'VA','243':'VA','244':'VA','245':'VA','246':'VA',
  '247':'WV','248':'WV','249':'WV','250':'WV','251':'WV','252':'WV','253':'WV','254':'WV','255':'WV','256':'WV','257':'WV','258':'WV','259':'WV',
  '260':'WV','261':'WV','262':'WV','263':'WV','264':'WV','265':'WV','266':'WV','267':'WV','268':'WV',
  '270':'NC','271':'NC','272':'NC','273':'NC','274':'NC','275':'NC','276':'NC','277':'NC','278':'NC','279':'NC',
  '280':'NC','281':'NC','282':'NC','283':'NC','284':'NC','285':'NC','286':'NC','287':'NC','288':'NC','289':'NC',
  '290':'SC','291':'SC','292':'SC','293':'SC','294':'SC','295':'SC','296':'SC','297':'SC','298':'SC','299':'SC',
  '300':'GA','301':'GA','302':'GA','303':'GA','304':'GA','305':'GA','306':'GA','307':'GA','308':'GA','309':'GA',
  '310':'GA','311':'GA','312':'GA','313':'GA','314':'GA','315':'GA','316':'GA','317':'GA','318':'GA','319':'GA',
  '320':'FL','321':'FL','322':'FL','323':'FL','324':'FL','325':'FL','326':'FL','327':'FL','328':'FL','329':'FL',
  '330':'FL','331':'FL','332':'FL','333':'FL','334':'FL','335':'FL','336':'FL','337':'FL','338':'FL','339':'FL',
  '340':'FL','341':'FL','342':'FL','344':'FL','346':'FL','347':'FL','349':'FL',
  '350':'AL','351':'AL','352':'AL','354':'AL','355':'AL','356':'AL','357':'AL','358':'AL','359':'AL',
  '360':'AL','361':'AL','362':'AL','363':'AL','364':'AL','365':'AL','366':'AL','367':'AL','368':'AL','369':'AL',
  '370':'TN','371':'TN','372':'TN','373':'TN','374':'TN','376':'TN','377':'TN','378':'TN','379':'TN',
  '380':'TN','381':'TN','382':'TN','383':'TN','384':'TN','385':'TN',
  '386':'MS','387':'MS','388':'MS','389':'MS','390':'MS','391':'MS','392':'MS','393':'MS','394':'MS','395':'MS','396':'MS','397':'MS',
  '398':'GA','399':'GA',
  '400':'KY','401':'KY','402':'KY','403':'KY','404':'KY','405':'KY','406':'KY','407':'KY','408':'KY','409':'KY',
  '410':'KY','411':'KY','412':'KY','413':'KY','414':'KY','415':'KY','416':'KY','417':'KY','418':'KY',
  '420':'KY','421':'KY','422':'KY','423':'KY','424':'KY','425':'KY','426':'KY','427':'KY',
  '430':'OH','431':'OH','432':'OH','433':'OH','434':'OH','435':'OH','436':'OH','437':'OH','438':'OH','439':'OH',
  '440':'OH','441':'OH','442':'OH','443':'OH','444':'OH','445':'OH','446':'OH','447':'OH','448':'OH','449':'OH',
  '450':'OH','451':'OH','452':'OH','453':'OH','454':'OH','455':'OH','456':'OH','457':'OH','458':'OH',
  '460':'IN','461':'IN','462':'IN','463':'IN','464':'IN','465':'IN','466':'IN','467':'IN','468':'IN','469':'IN',
  '470':'IN','471':'IN','472':'IN','473':'IN','474':'IN','475':'IN','476':'IN','477':'IN','478':'IN','479':'IN',
  '480':'MI','481':'MI','482':'MI','483':'MI','484':'MI','485':'MI','486':'MI','487':'MI','488':'MI','489':'MI',
  '490':'MI','491':'MI','492':'MI','493':'MI','494':'MI','495':'MI','496':'MI','497':'MI','498':'MI','499':'MI',
  '500':'IA','501':'IA','502':'IA','503':'IA','504':'IA','505':'IA','506':'IA','507':'IA','508':'IA','509':'IA',
  '510':'IA','511':'IA','512':'IA','513':'IA','514':'IA','515':'IA','516':'IA','520':'IA','521':'IA','522':'IA','523':'IA','524':'IA','525':'IA','526':'IA','527':'IA','528':'IA',
  '530':'WI','531':'WI','532':'WI','534':'WI','535':'WI','537':'WI','538':'WI','539':'WI',
  '540':'WI','541':'WI','542':'WI','543':'WI','544':'WI','545':'WI','546':'WI','547':'WI','548':'WI','549':'WI',
  '550':'MN','551':'MN','553':'MN','554':'MN','555':'MN','556':'MN','557':'MN','558':'MN','559':'MN',
  '560':'MN','561':'MN','562':'MN','563':'MN','564':'MN','565':'MN','566':'MN','567':'MN',
  '570':'SD','571':'SD','572':'SD','573':'SD','574':'SD','575':'SD','576':'SD','577':'SD',
  '580':'ND','581':'ND','582':'ND','583':'ND','584':'ND','585':'ND','586':'ND','587':'ND','588':'ND',
  '590':'MT','591':'MT','592':'MT','593':'MT','594':'MT','595':'MT','596':'MT','597':'MT','598':'MT','599':'MT',
  '600':'IL','601':'IL','602':'IL','603':'IL','604':'IL','605':'IL','606':'IL','607':'IL','608':'IL','609':'IL',
  '610':'IL','611':'IL','612':'IL','613':'IL','614':'IL','615':'IL','616':'IL','617':'IL','618':'IL','619':'IL',
  '620':'IL','622':'IL','623':'IL','624':'IL','625':'IL','626':'IL','627':'IL','628':'IL','629':'IL',
  '630':'MO','631':'MO','633':'MO','634':'MO','635':'MO','636':'MO','637':'MO','638':'MO','639':'MO',
  '640':'MO','641':'MO','644':'MO','645':'MO','646':'MO','647':'MO','648':'MO',
  '650':'MO','651':'MO','652':'MO','653':'MO','654':'MO','655':'MO','656':'MO','657':'MO','658':'MO',
  '660':'KS','661':'KS','662':'KS','664':'KS','665':'KS','666':'KS','667':'KS','668':'KS','669':'KS',
  '670':'KS','671':'KS','672':'KS','673':'KS','674':'KS','675':'KS','676':'KS','677':'KS','678':'KS','679':'KS',
  '680':'NE','681':'NE','683':'NE','684':'NE','685':'NE','686':'NE','687':'NE','688':'NE','689':'NE',
  '690':'NE','691':'NE','692':'NE','693':'NE',
  '700':'LA','701':'LA','703':'LA','704':'LA','705':'LA','706':'LA','707':'LA','708':'LA',
  '710':'LA','711':'LA','712':'LA','713':'LA','714':'LA',
  '716':'AR','717':'AR','718':'AR','719':'AR','720':'AR','721':'AR','722':'AR','723':'AR','724':'AR','725':'AR','726':'AR','727':'AR','728':'AR','729':'AR',
  '730':'OK','731':'OK','733':'OK','734':'OK','735':'OK','736':'OK','737':'OK','738':'OK','739':'OK',
  '740':'OK','741':'OK','743':'OK','744':'OK','745':'OK','746':'OK','747':'OK','748':'OK','749':'OK',
  '750':'TX','751':'TX','752':'TX','753':'TX','754':'TX','755':'TX','756':'TX','757':'TX','758':'TX','759':'TX',
  '760':'TX','761':'TX','762':'TX','763':'TX','764':'TX','765':'TX','766':'TX','767':'TX','768':'TX','769':'TX',
  '770':'TX','771':'TX','772':'TX','773':'TX','774':'TX','775':'TX','776':'TX','777':'TX','778':'TX','779':'TX',
  '780':'TX','781':'TX','782':'TX','783':'TX','784':'TX','785':'TX','786':'TX','787':'TX','788':'TX','789':'TX',
  '790':'TX','791':'TX','792':'TX','793':'TX','794':'TX','795':'TX','796':'TX','797':'TX','798':'TX','799':'TX',
  '800':'CO','801':'CO','802':'CO','803':'CO','804':'CO','805':'CO','806':'CO','807':'CO','808':'CO','809':'CO',
  '810':'CO','811':'CO','812':'CO','813':'CO','814':'CO','815':'CO','816':'CO',
  '820':'WY','821':'WY','822':'WY','823':'WY','824':'WY','825':'WY','826':'WY','827':'WY','828':'WY','829':'WY','830':'WY','831':'WY',
  '832':'ID','833':'ID','834':'ID','835':'ID','836':'ID','837':'ID','838':'ID',
  '840':'UT','841':'UT','842':'UT','843':'UT','844':'UT','845':'UT','846':'UT','847':'UT',
  '850':'AZ','851':'AZ','852':'AZ','853':'AZ','855':'AZ','856':'AZ','857':'AZ','859':'AZ','860':'AZ','863':'AZ','864':'AZ','865':'AZ',
  '870':'NM','871':'NM','872':'NM','873':'NM','874':'NM','875':'NM','877':'NM','878':'NM','879':'NM','880':'NM','881':'NM','882':'NM','883':'NM','884':'NM',
  '885':'TX',
  '889':'NV','890':'NV','891':'NV','893':'NV','894':'NV','895':'NV','896':'NV','897':'NV','898':'NV',
  '900':'CA','901':'CA','902':'CA','903':'CA','904':'CA','905':'CA','906':'CA','907':'CA','908':'CA',
  '910':'CA','911':'CA','912':'CA','913':'CA','914':'CA','915':'CA','916':'CA','917':'CA','918':'CA',
  '919':'CA','920':'CA','921':'CA','922':'CA','923':'CA','924':'CA','925':'CA','926':'CA','927':'CA','928':'CA',
  '930':'CA','931':'CA','932':'CA','933':'CA','934':'CA','935':'CA','936':'CA','937':'CA','938':'CA','939':'CA',
  '940':'CA','941':'CA','942':'CA','943':'CA','944':'CA','945':'CA','946':'CA','947':'CA','948':'CA','949':'CA',
  '950':'CA','951':'CA','952':'CA','953':'CA','954':'CA','955':'CA','956':'CA','957':'CA','958':'CA',
  '959':'CA','960':'CA','961':'CA',
  '967':'HI','968':'HI',
  '970':'OR','971':'OR','972':'OR','973':'OR','974':'OR','975':'OR','976':'OR','977':'OR','978':'OR','979':'OR',
  '980':'WA','981':'WA','982':'WA','983':'WA','984':'WA','985':'WA','986':'WA','988':'WA','989':'WA',
  '990':'WA','991':'WA','992':'WA','993':'WA','994':'WA',
  '995':'AK','996':'AK','997':'AK','998':'AK','999':'AK'
};

// Store coverage by state
const STORE_COVERAGE = {
  'Walmart':        ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC'],
  'WinCo Foods':    ['OR','WA','ID','NV','UT','AZ','CA'],
  'Fred Meyer':     ['OR','WA','ID','AK'],
  'Safeway':        ['OR','WA','ID','CA','AZ','CO','NV','NM','WY','MT','AK','HI','MD','VA','DC'],
  'Grocery Outlet': ['OR','WA','ID','CA','NV','PA','MD','NJ','WA']
};

const STORE_ICONS = {
  'Walmart': '🛒',
  'WinCo Foods': '🌾',
  'Fred Meyer': '🛍️',
  'Safeway': '🏪',
  'Grocery Outlet': '💰'
};

// Pacific Northwest states (primary coverage)
const PNW_STATES = ['OR','WA','ID'];
const EXPANDED_STATES = ['OR','WA','ID','CA','NV','AZ','UT','MT','AK','CO','NM','WY'];

function getStateFromZip(zip) {
  if (!zip || zip.length < 3) return null;
  const prefix = zip.substring(0, 3);
  return ZIP_PREFIX_TO_STATE[prefix] || null;
}

function getAvailableStores(state) {
  if (!state) return Object.keys(STORE_COVERAGE); // default all
  return Object.entries(STORE_COVERAGE)
    .filter(([store, states]) => states.includes(state))
    .map(([store]) => store);
}

const STORE_MULTIPLIERS = {
  'WinCo Foods':      0.88,
  'Walmart':          0.95,
  'Grocery Outlet':   0.92,
  'Fred Meyer':       1.10,
  'Safeway':          1.22
};

// Base price catalog — realistic 2026 US grocery prices (Walmart baseline)
const PRICE_CATALOG = [
  { keywords: ['hamburger','ground beef','burger','beef patty'], name: 'Ground Beef 80/20', unit: '1 lb', basePrice: 5.48 },
  { keywords: ['ground beef 90','lean beef','90/10'], name: 'Ground Beef 90/10 Lean', unit: '1 lb', basePrice: 6.98 },
  { keywords: ['ribeye','rib eye'], name: 'Ribeye Steak', unit: '1 lb', basePrice: 12.98 },
  { keywords: ['sirloin'], name: 'Sirloin Steak', unit: '1 lb', basePrice: 9.48 },
  { keywords: ['stew beef','beef stew'], name: 'Beef Stew Meat', unit: '1 lb', basePrice: 6.48 },
  { keywords: ['brisket'], name: 'Beef Brisket', unit: '1 lb', basePrice: 7.98 },
  { keywords: ['chicken breast','chicken breasts'], name: 'Boneless Skinless Chicken Breast', unit: '2 lb pkg', basePrice: 7.96 },
  { keywords: ['chicken thigh','chicken thighs'], name: 'Boneless Chicken Thighs', unit: '2 lb pkg', basePrice: 6.48 },
  { keywords: ['whole chicken','rotisserie'], name: 'Rotisserie Chicken', unit: '3 lb', basePrice: 5.98 },
  { keywords: ['chicken wing','wings'], name: 'Chicken Wings', unit: '2 lb pkg', basePrice: 8.48 },
  { keywords: ['chicken leg','drumstick'], name: 'Chicken Drumsticks', unit: '3 lb pkg', basePrice: 5.98 },
  { keywords: ['bacon'], name: 'Bacon', unit: '16 oz pkg', basePrice: 6.98 },
  { keywords: ['pork chop','pork chops'], name: 'Pork Chops Bone-In', unit: '1 lb', basePrice: 4.48 },
  { keywords: ['pork loin'], name: 'Pork Loin Roast', unit: '1 lb', basePrice: 3.98 },
  { keywords: ['sausage','breakfast sausage'], name: 'Pork Breakfast Sausage', unit: '16 oz', basePrice: 4.48 },
  { keywords: ['ham'], name: 'Sliced Ham', unit: '1 lb deli', basePrice: 5.48 },
  { keywords: ['milk','whole milk','gallon milk'], name: 'Whole Milk', unit: '1 gallon', basePrice: 3.48 },
  { keywords: ['2% milk','reduced fat milk'], name: '2% Reduced Fat Milk', unit: '1 gallon', basePrice: 3.28 },
  { keywords: ['eggs','dozen eggs','large eggs'], name: 'Large Eggs Grade A', unit: '1 dozen', basePrice: 2.98 },
  { keywords: ['butter'], name: 'Unsalted Butter', unit: '1 lb (4 sticks)', basePrice: 3.98 },
  { keywords: ['cheddar','cheddar cheese'], name: 'Cheddar Cheese Block', unit: '8 oz', basePrice: 3.48 },
  { keywords: ['mozzarella'], name: 'Shredded Mozzarella', unit: '8 oz', basePrice: 3.28 },
  { keywords: ['cream cheese'], name: 'Cream Cheese', unit: '8 oz', basePrice: 2.48 },
  { keywords: ['sour cream'], name: 'Sour Cream', unit: '16 oz', basePrice: 1.98 },
  { keywords: ['yogurt','greek yogurt'], name: 'Greek Yogurt Plain', unit: '32 oz', basePrice: 4.98 },
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
  { keywords: ['bread','white bread','sandwich bread'], name: 'White Sandwich Bread', unit: '20 oz loaf', basePrice: 1.28 },
  { keywords: ['wheat bread','whole wheat'], name: 'Whole Wheat Bread', unit: '20 oz loaf', basePrice: 1.98 },
  { keywords: ['tortilla','flour tortilla'], name: 'Flour Tortillas', unit: '20-count', basePrice: 2.98 },
  { keywords: ['bun','hamburger bun','hot dog bun'], name: 'Hamburger Buns', unit: '8-count', basePrice: 1.48 },
  { keywords: ['bagel','bagels'], name: 'Plain Bagels', unit: '6-count', basePrice: 2.98 },
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
  { keywords: ['mayonnaise','mayo'], name: "Hellmann's Mayonnaise", unit: '30 oz', basePrice: 4.98 },
  { keywords: ['soy sauce'], name: 'Soy Sauce', unit: '10 fl oz', basePrice: 2.48 },
  { keywords: ['hot sauce','sriracha'], name: 'Sriracha Hot Sauce', unit: '17 oz', basePrice: 3.48 },
  { keywords: ['canned tomato','diced tomato'], name: 'Diced Tomatoes', unit: '14.5 oz can', basePrice: 0.98 },
  { keywords: ['chicken broth','chicken stock'], name: 'Chicken Broth', unit: '32 oz carton', basePrice: 2.48 },
  { keywords: ['beef broth'], name: 'Beef Broth', unit: '32 oz carton', basePrice: 2.48 },
  { keywords: ['black bean','black beans'], name: 'Black Beans', unit: '15 oz can', basePrice: 0.88 },
  { keywords: ['kidney bean','pinto bean'], name: 'Pinto Beans', unit: '15 oz can', basePrice: 0.88 },
  { keywords: ['tuna','canned tuna'], name: 'Chunk Light Tuna', unit: '5 oz can', basePrice: 1.28 },
  { keywords: ['orange juice','oj'], name: 'Orange Juice', unit: '52 fl oz', basePrice: 3.98 },
  { keywords: ['apple juice'], name: 'Apple Juice', unit: '64 fl oz', basePrice: 2.98 },
  { keywords: ['water','bottled water'], name: 'Purified Water', unit: '24-pack 16.9 oz', basePrice: 3.98 },
  { keywords: ['coffee','ground coffee'], name: 'Medium Roast Ground Coffee', unit: '12 oz', basePrice: 5.98 },
  { keywords: ['tea','green tea','black tea'], name: 'Black Tea Bags', unit: '100-count', basePrice: 3.48 },
  { keywords: ['frozen pizza','pizza'], name: 'Frozen Pepperoni Pizza', unit: '12 inch', basePrice: 4.98 },
  { keywords: ['ice cream'], name: 'Vanilla Ice Cream', unit: '48 fl oz', basePrice: 3.98 },
  { keywords: ['frozen vegetable','frozen broccoli'], name: 'Frozen Broccoli Florets', unit: '12 oz bag', basePrice: 1.48 },
  { keywords: ['frozen corn'], name: 'Frozen Sweet Corn', unit: '12 oz bag', basePrice: 1.28 },
];

function findProduct(query) {
  const q = query.toLowerCase().trim();
  for (const item of PRICE_CATALOG) {
    for (const kw of item.keywords) {
      if (q.includes(kw) || kw.includes(q)) return item;
    }
  }
  const words = q.split(/\s+/);
  for (const item of PRICE_CATALOG) {
    for (const kw of item.keywords) {
      for (const word of words) {
        if (word.length > 3 && (kw.includes(word) || word.includes(kw))) return item;
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
  const zip = (params.zip || '').trim();

  // Determine state and available stores
  const state = getStateFromZip(zip);
  const availableStores = zip ? getAvailableStores(state) : Object.keys(STORE_COVERAGE);
  const isPNW = state && PNW_STATES.includes(state);
  const isExpanded = state && EXPANDED_STATES.includes(state);
  const isOutsideCoverage = state && !isExpanded;

  try {
    if (action === 'prices') {
      const product = findProduct(query);
      const basePrice = product ? product.basePrice : 3.99;
      const productName = product ? `${product.name} (${product.unit})` : (query.charAt(0).toUpperCase() + query.slice(1));

      const results = availableStores
        .filter(store => STORE_MULTIPLIERS[store])
        .map(store => {
          const mult = STORE_MULTIPLIERS[store];
          const variation = (Math.random() * 0.12 - 0.04);
          const price = basePrice * mult * (1 + variation);
          const rounded = Math.round(price * 20) / 20;
          return { store, name: productName, price: formatPrice(rounded), icon: STORE_ICONS[store] };
        });

      results.sort((a, b) => parseFloat(a.price.replace('$','')) - parseFloat(b.price.replace('$','')));

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          query, results, timestamp: new Date().toISOString(),
          state: state || null,
          zip: zip || null,
          isPNW, isExpanded, isOutsideCoverage,
          storeCount: results.length
        })
      };
    }

    if (action === 'check-zip') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          zip, state,
          availableStores,
          isPNW, isExpanded, isOutsideCoverage,
          storeIcons: availableStores.reduce((acc, s) => { acc[s] = STORE_ICONS[s]; return acc; }, {})
        })
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
        body: JSON.stringify({ stores, zip, state, timestamp: new Date().toISOString() })
      };
    }

    if (action === 'store-finder') {
      const storeList = availableStores.map(name => ({
        name,
        icon: STORE_ICONS[name] || '🏪',
        url: name === 'Walmart' ? `https://www.walmart.com/store/finder?query=${zip}` :
             name === 'Safeway' ? `https://local.safeway.com/search.html?q=${zip}` :
             name === 'Fred Meyer' ? `https://www.fredmeyer.com/stores/search?searchText=${zip}` :
             name === 'Grocery Outlet' ? `https://www.groceryoutlet.com/store-locator?zip=${zip}` :
             'https://www.wincofoods.com/stores'
      }));
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ stores: storeList, zip, state, timestamp: new Date().toISOString() })
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
