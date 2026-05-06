import { buildDistanceMatrix, random, refinedNormalRandom, round } from "../utilities";

// users data generation happens here..

// all these variblaes are used in generating users data that is in the DB

export const cityCoords = {
    "Irvine": [33.68, -117.82],
    "Los Angeles": [34.05, -118.24],
    "Seattle": [47.60, -122.33],
    "Bellevue": [47.61, -122.20],
    "Redmond": [47.67, -122.12],
    "Houston": [29.76, -95.36],
    "Arlington": [32.73, -97.10],
    "Plano": [33.01, -96.69],

    "Toronto": [43.65, -79.38],
    "Montreal": [45.50, -73.56],
    "Waterloo": [43.46, -80.52],

    "Dubai": [25.20, 55.27],
    "Sharjah": [25.34, 55.42],

    "Kanpur": [26.44, 80.33],
    "Lucknow": [26.84, 80.94],
    "Chennai": [13.08, 80.27],
    "Bangalore": [12.97, 77.59],
    "Vellore": [12.91, 79.13],
    "Hyderabad": [17.38, 78.48],
    "Warangal": [17.96, 79.59],
    "Pune": [18.52, 73.85],
    "Mumbai": [19.07, 72.87],
    "Thane": [19.21, 72.97],

    "Ankara": [39.93, 32.86],
    "Bursa": [40.18, 29.06],
    "Istanbul": [41.01, 28.98],

    "São Paulo": [-23.55, -46.63],
    "Salvador": [-12.97, -38.50],
    "Rio de Janeiro": [-22.91, -43.17],

    "Berlin": [52.52, 13.40],
    "Hamburg": [53.55, 9.99],
    "Bremen": [53.07, 8.80],
    "Munich": [48.14, 11.58],
    "Cologne": [50.94, 6.96],
    "Frankfurt": [50.11, 8.68],
    "Stuttgart": [48.78, 9.18],

    // cities are very close in countries like Switzerland, while they are 
    // farther in countries like India or US
    "Zurich": [47.37, 8.54],
    "Geneva": [46.20, 6.14],
    "Basel": [47.56, 7.59],
    "Bern": [46.95, 7.45],
    "Lausanne": [46.52, 6.63],
    "Lucerne": [47.05, 8.31],

    "London": [51.51, -0.13],
    "Birmingham": [52.48, -1.89],
    "Manchester": [53.48, -2.24],
    "Liverpool": [53.41, -2.99],
    "Glasgow": [55.86, -4.26],
    "Edinburgh": [55.95, -3.19]
  };

export const cityToCountry = {
"Chennai": "India",
"Bangalore": "India",
"Kanpur": "India",
"Lucknow": "India",
"Vellore": "India",
"Hyderabad": "India",
"Warangal": "India",
"Pune": "India",
"Mumbai": "India",
"Thane": "India",

"Irvine": "US",
"Los Angeles": "US",
"Seattle": "US",
"Bellevue": "US",
"Redmond": "US",
"Houston": "US",
"Arlington": "US",
"Plano": "US",

"Toronto": "Canada",
"Montreal": "Canada",
"Waterloo": "Canada",

"Dubai": "UAE",
"Sharjah": "UAE",

"London": "UK",
"Birmingham": "UK",
"Manchester": "UK",
"Liverpool": "UK",
"Glasgow": "UK",
"Edinburgh": "UK",

"Zurich": "Switzerland",
"Geneva": "Switzerland",
"Basel": "Switzerland",
"Bern": "Switzerland",
"Lausanne": "Switzerland",
"Lucerne": "Switzerland",

"Berlin": "Germany",
"Hamburg": "Germany",
"Bremen": "Germany",
"Cologne": "Germany",
"Munich": "Germany",
"Frankfurt": "Germany",
"Stuttgart": "Germany",

"São Paulo": "Brazil",
"Salvador": "Brazil",
"Rio de Janeiro": "Brazil",

"Ankara": "Turkey",
"Bursa": "Turkey",
"Istanbul": "Turkey"
}


export const distanceMatrix = buildDistanceMatrix(cityCoords);

//console.log(distanceMatrix);

//console.log(Object.keys(cityCoords))

export const deviceIds = [
"iPhone15Pro", "SamsungS24Ultra", "Pixel8Pro", "MacbookProM3", "iPadPro12.9",
"SurfaceLaptop6", "DellXPS15", "RazerBlade16", "GalaxyZFold5", "SonyXperia1V",

"iPhone13", "SamsungA54", "Pixel7A", "NothingPhone2", "OnePlus11R",
"MotoGStylus", "XiaomiRedmiNote12", "OppoReno10", "VivoV27", "HuaweiP40Lite",

"SamsungA03", "MotoE13", "NokiaG21", "RedmiA2", "TecnoSpark10",
"InfinixHot30", "RealmeC53", "VivoY02", "LenovoTabM8", "GalaxyTabA7Lite",

"iPhone8", "SamsungS10", "Pixel4XL", "iPhone6S", "Nexus5X",
"GalaxyNote9", "HTC-OneM8", "LGG6", "MotorolaRazr2019", "SonyXperiaZ5",

"ThinkPadX1Carbon", "AcerAspire5", "AsusROGStrix", "MacbookAirM2", "HPPavilion15"
];

export const firstNames = [
"Alan", "Ada", "Isaac", "Albert", "Marie", "Nikola", "Socrates", "Plato", "Aristotle", "Immanuel", 
"Friedrich", "Simone", "Hannah", "Marcus", "Baruch", "René", "Jean-Paul", "Fyodor", "Leo", "Virginia", 
"George", "Emily", "Franz", "James", "Gabriel", "Toni", "Grace", "Donald", "Dennis", "Ken", 
"Margaret", "Barbara", "Claude", "Tim", "Linus", "John", "Edsger", "Vint", "Alonzo", "Shafi", 
"Richard", "Leslie", "Guido", "Carl", "Leonhard", "Emmy", "Srinivasa", "Bernhard", "Henri", "Katherine", 
"Euclid", "Pythagoras", "Sophie", "Bjarne", "Anders", "Niklaus", "Kurt", "Benoit", "Louis", "James", 
"Rachel", "Rosalind", "Stephen", "Galileo", "Johannes", "Max", "Michael", "Enrico", "Erwin", "Werner", 
"Lise", "Thomas", "Hedy", "Wernher", "Isambard", "Guglielmo", "Robert", "Linus", "Dmitri", "Gregor", 
"Alexander", "Carl", "Edwin", "Jane", "Chien-Shiung", "Subrahmanyan", "Ernest", "Antoine", "Sigmund", "Jean", 
"Lev", "Viktor", "Abraham", "Karen", "Erik", "Alfred", "Anna", "Max", "Émile", "Adam", 
"Milton", "Karl", "Claude", "Edward", "Frantz", "Leonardo", "Michelangelo", "Rabindranath", "Frederick", "Sojourner", 
"Florence", "Clara", "Benjamin", "Albrecht", "Katsushika", "Artemisia", "Frida", "Georgia", "Zaha", "Antoni",
"Averroes", "Avicenna", "Hypatia", "Epicurus", "Zeno", "Epictetus", "Seneca", "Mencius", "Adi", "Gilles",
"William", "Fyodor", "Marcel", "Italo", "Yukio", "Haruki", "Miguel", "Sophocles", "Euripides", "Virgil",
"B.F.", "William", "Noam", "Bertrand", "Ludwig", "Karl", "Thomas", "Sun", "Mary", "Ralph",
"Henry", "Walt", "Langston", "Maya", "Chinua", "Oscar", "Charlotte", "Sylvia", "Jorge", "Ernest",
"Victor", "Dante", "Homer", "Rachel", "Niels", "Gottfried", "Blaise", "Archimedes", "Arthur"
];

export const lastNames = [
"Turing", "Lovelace", "Newton", "Einstein", "Curie", "Tesla", "Darwin", "Feynman", "Pasteur", "Maxwell", 
"Bohr", "Hawking", "Galilei", "Kepler", "Planck", "Faraday", "Fermi", "Schrödinger", "Heisenberg", "Meitner", 
"Edison", "Archimedes", "Lamarr", "Kant", "Nietzsche", "Beauvoir", "Arendt", "Aurelius", "Spinoza", "Descartes", 
"Sartre", "Camus", "Confucius", "Laozi", "Hobbes", "Locke", "Hume", "Rousseau", "Hegel", "Mill", 
"Schopenhauer", "Kierkegaard", "Foucault", "Chomsky", "Russell", "Wittgenstein", "Popper", "Aquinas", "Averroes", "Avicenna", 
"Hypatia", "Epicurus", "Shakespeare", "Dostoevsky", "Tolstoy", "Woolf", "Orwell", "Dickinson", "Kafka", "Joyce", 
"Márquez", "Shelley", "Morrison", "Homer", "Alighieri", "Goethe", "Hugo", "Dickens", "Twain", "Hemingway", 
"Borges", "Plath", "Austen", "Brontë", "Wilde", "Knuth", "Ritchie", "Thompson", "Hamilton", "Liskov", 
"Shannon", "Berners-Lee", "Torvalds", "Neumann", "Dijkstra", "McCarthy", "Cerf", "Church", "Goldwasser", "Hamming", 
"Lamport", "Rossum", "Gauss", "Euler", "Noether", "Ramanujan", "Riemann", "Poincaré", "Johnson", "Germain", 
"Mandelbrot", "Nash", "Leibniz", "Pascal", "Carson", "Franklin", "Goodall", "McClintock", "Wu", "Chandrasekhar", 
"Rutherford", "Kelvin", "Lavoisier", "Fleming", "Hubble", "Sagan", "Braun", "Brunel", "Marconi", "Oppenheimer", 
"Pauling", "Mendeleev", "Mendel", "Freud", "Jung", "Piaget", "Skinner", "James", "Vygotsky", "Frankl", 
"Maslow", "Horney", "Erikson", "Adler", "Dewey", "Weber", "Durkheim", "Smith", "Keynes", "Friedman", 
"Marx", "Hayek", "Mead", "Boas", "Lévi-Strauss", "Said", "Fanon", "da Vinci", "Tagore", "Du Bois", 
"Douglass", "Truth", "Nightingale", "Barton", "Humboldt", "Dürer", "Hokusai", "Gentileschi", "Kahlo", "O'Keeffe", 
"Wright", "Hadid", "Gaudí", "Khaldun", "Khayyam", "Al-Khwarizmi", "Stroustrup", "Gosling", "Wirth"
];

export const generateUniqueFullNames = (N) => {

    // this fuction uses 2 arrys, firstNames and lastNames 
    // and generates a Set of unique combinations of "firstName + lastName"
    // give some N which is the number of full names to be generated
    // the count of names to be generated
    let fullNames = new Set();

    while(fullNames.size < N) {

      const fId = Math.floor(Math.random() * firstNames.length);
      const lId = Math.floor(Math.random() * lastNames.length);

      const fullName = `${firstNames[fId]} ${lastNames[lId]}`;
      fullNames.add(fullName);
    }

    let totalCombinations = firstNames.length * lastNames.length;

    console.log(`firstNames.length: ${firstNames.length}, lastNames.length: ${lastNames.length}`);
    console.log(`% of combinations used: ${((N / totalCombinations)*100).toFixed(2)}`)

    return Array.from(fullNames);
}


export const AGE_BIN_CONFIG = [
    {
      maxAge: 12,
      weights: {STUDENT: 30, STANDARD: 50, PREMIUM: 3, BUSINESS: 17},
    },
    {
      maxAge: 48,
      weights: {STUDENT: 25, STANDARD: 55, PREMIUM: 2, BUSINESS: 18},
    },
    {
      maxAge: 72,
      weights: {STUDENT: 3, STANDARD: 18, PREMIUM: 35, BUSINESS: 45}
    },
    {
      maxAge: 108,
      weights: {STUDENT: 0, STANDARD: 5, PREMIUM: 60, BUSINESS: 35}
    },
    {
      maxAge: 120,
      weights: {STUDENT: 0, STANDARD: 0, PREMIUM: 80, BUSINESS: 20}
    }
];

export const generateAccType = (accAge) => {

    // we aim for these percentages
    // Business accounts ~ 10%
    // Premimum accounts ~ 15%
    // Student accounts ~ 20%
    // Standard accounts ~ 55%
    const weights = {
      STUDENT: 0.2,
      STANDARD: 0.55,
      PREMIUM: 0.15,
      BUSINESS: 0.1
    };

    // using binned weighted mapping, to categorize the accAge ranges into
    // 5 intervals -> 0-12, 12-48, 48-72, 72-108, 108-120
    // uses the AGE_BIN_CONFIG arr
    const targetBin = AGE_BIN_CONFIG.find((bin => accAge <= bin.maxAge)) || 
                      AGE_BIN_CONFIG[AGE_BIN_CONFIG.length - 1];

    const binWeights = targetBin.weights;

    // increasing count of the bin where this accAge appears
    if(targetBin["count"]) {
      targetBin["count"]++;
    }
    else {
      targetBin["count"] = 1;
    }

    // some weights might be reduced at this stage, we need to normalize
    // again so that they sum to 1 and we can run the random method
    const totalWeight = Object.values(binWeights).reduce((acc, val) => acc + val, 0);
    let r = round(Math.random() * totalWeight, 0);

    for(const [type, weight] of Object.entries(binWeights)) {

      if(r < weight) {
        return type;
      }

      r -= weight;
    }

    return "STANDARD";
}

export const generateAccAge = () => {

    // considers accType for generating acc ages

    const MEAN = 18;
    const STD_DEV = 12;

    let output = refinedNormalRandom(MEAN, STD_DEV);

    let a = random(1);


    if(a >= 0 && a < 0.17) {

      output = random(1) > 0.15 ? 
              (random(1) > 0.4 ? Math.floor(40 + random(25)) : Math.floor(60 + random(55)))
              : 
              Math.floor(12 + random(10));
    }
    else if(a >= 0.17 && a < 0.30) {

      // for ~13% chances, we explicitly put more values earlier
      // around 0 - 18 months bracket, this is the peak and then

      output = random(1) > 0.3 ? Math.floor(10 + random(24)) : 
                Math.floor(MEAN + 12 + random(18));
    }
    else if(a >= 0.30 && a < 0.5) {
      // for 20% chances, we deviate a little from mean
      // but only for those that are closer to mean
      if(Math.abs(output - MEAN) <= 10) {

        output = random(1) > 0.25 ? Math.floor(MEAN + random(12)) :
                  Math.floor(MEAN - random(18));
      }
    }


    return output;
    //return normalRandom(26, 70);
}


export const AVG_TXN_AMOUNTS = {
    STUDENT: {range: [5, 80], volatility: 0.5},
    STANDARD: {range: [15, 300], volatility: 0.6},
    PREMIUM: {range: [190, 1050], volatility: 0.5},
    BUSINESS: {range: [350, 2800], volatility: 0.8}
}

export const generateMeanTxn30d = (accType, accAge) => {

    // console.log("ACC TYPE: ", accType);
    // console.log("ACC AGE: ", accAge);

    // uses accType and accAge to generate good values
    // the graph of monthlyAvgTxn is more like a Log-Normal distribution curve
    // with long tail but not very long tail, so simple normal distribution would not work
    // as accAge increases, monthlyAvgTxn becomes more stable and large
    // but 120 is the upperbound for accAge
    const {range, volatility} = AVG_TXN_AMOUNTS[accType];

    const [min, max] = range;

    const ageProgress = Math.pow(Math.min(accAge, 120) / 120, 0.5);

    // performing linear interpolation based on age
    const baseSpending = min + (max - min) * ageProgress;

    // adding controlled gaussian noise
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);

    let finalAmount = baseSpending + (baseSpending * volatility * z * 0.5);

    // make sure to never go above global ceiling and absolute floor
    finalAmount = Math.max(min * 0.8, finalAmount);
    finalAmount = Math.min(max * 1.2, finalAmount);

    return parseFloat(finalAmount.toFixed(0));
}


export const VOLATILITY_PROFILES = {

    // CV range -> [min, max]
    // 0.1 -> 10% of mean, 0.9 -> 90% of mean
    STUDENT: [0.1, 0.35],
    STANDARD: [0.2, 0.55],
    PREMIUM: [0.3, 0.75],
    BUSINESS: [0.25, 0.9]
};

export const generateStdDevTxn = (accType, meanTxn30d) => {

    // stdDev of transactions vary by accounts
    // business accounts can have more stdDev, but not Student accounts
    // we rely on the vavriable VOLATILIY_PROFILES
    const [minCV, maxCV] = VOLATILITY_PROFILES[accType];

    // picking a number in the range -> minCV, maxCV
    const userVolatilitySignature = minCV + Math.random() * (maxCV - minCV);

    let stdDev = meanTxn30d * userVolatilitySignature;

    const noise = 0.95 + Math.random() * 0.1  // explicit +- 5% wobble
    
    stdDev = stdDev * noise;

    return round(stdDev, 0);
}

export const generateFlaggedTxns = (accType, accAge) => {

    // takes accType and age, and generates flaggedTxns on that account
    // that have happened till date

    // diffrent account types has different risk profiles
    const riskMultipliers = {
      STUDENT: 0.05,
      STANDARD: 0.10,
      PREMIUM: 0.18,
      BUSINESS: 0.25
    };

    // adjusting chance by accAge
    const ageFactor = accAge / 120;  // 0 to 1
    const chanceOfHavingFlag = riskMultipliers[accType] + (ageFactor * 0.12);

    if(Math.random() > chanceOfHavingFlag) {
      return 0;
    }

    // now we use dynamic decay rate for various account types
    const persistenceMap = {
      STUDENT: 0.90,
      STANDARD: 0.80,
      PREMIUM: 0.65,
      BUSINESS: 0.60
    };

    let count = 1;
    const maxFlags = 10;

    let decayRate = persistenceMap[accType] - (ageFactor * 0.1);
    decayRate = Math.min(0.4, decayRate);

    while(Math.random() > decayRate && count < maxFlags) {
      count++;
    }

    return count;
}

