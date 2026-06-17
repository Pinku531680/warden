// transactions data generation happens here
import { cityToCountry, deviceIds } from "../users/UsersDataGeneration";
import { distanceMatrix } from "../users/UsersDataGeneration";
import { cityCoords } from "../users/UsersDataGeneration";
import { random, randomInRange, round } from "../utilities";

// Generates a synthetic transaction amount (txnAmt) based on the user's spending baseline.

export const generateTxnAmt = (meanTxn30d, stdDevTxn, accType, accAge) => {
  const roll = Math.random();
  let atvDelta = 0;
  let txnAmt = 0;

  // Box-Muller transform to generate standard normal Gaussian noise (Z ~ N(0, 1))
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);

  // Dynamic ATV delta ceiling for each acc type, generate good variations and ranges
  const tierConfig = {
    STUDENT:  { deltaMultiplier: 0.75, commonCeilingSigma: 3.4 },
    STANDARD: { deltaMultiplier: 1.25, commonCeilingSigma: 4.0 },
    PREMIUM:  { deltaMultiplier: 1.75, commonCeilingSigma: 4.5 },
    BUSINESS: { deltaMultiplier: 1.8, commonCeilingSigma: 4.5 }
  };

  // meanTxn30 baselines based on accType, to help identity a naturally high spending user first
  // before generating a txnAmt for him
  const TIER_BASELINES = {
    STUDENT: {min: 5, max: 80 * 1.2},
    STANDARD: {min: 15, max: 300 * 1.2},
    PREMIUM: {min: 190, max: 1050 * 1.2},
    BUSINESS: {min: 350, max: 2800 * 1.2}
  };

  const config = tierConfig[accType];
  const band = TIER_BASELINES[accType];

  // computing profile strength to see where user sits inside the tier's expected limits
  const profileStrength = (meanTxn30d - band.min) / (band.max - band.min);
  const isNaturalHighSpender = profileStrength >= 0.7;

  // we dynamically shift prob. boundaries based on user profileStrength
  let commonBoundary = 0.8;
  let rareBoundary = 0.95;

  if(isNaturalHighSpender) {
    // these will very probably have high val transactions because they almost always do.
    commonBoundary = 0.4;
    rareBoundary = 0.92;  // most transactions will be high value
  }
  else {
    // these are for accounts not deviating much from their tier median, and rarely have
    // high val tranasctions
    commonBoundary = 0.9;   // upto 90% transactions not high value
    rareBoundary = 0.95;  // 5% for extreme anomaly
  }


  // SCENARIO 1: COMMON SPENDING PROFILE (profileStrengh relative probability)
  // Transaction tracks typical historical habits within conventional standard boundaries.
  if (roll < commonBoundary) {
    // atvDelta is bounded tightly around the standard deviation curve
    atvDelta = z * config.deltaMultiplier; 

    txnAmt = meanTxn30d + (atvDelta * stdDevTxn);

    // Define a strict lower floor for baseline purchases (10% of mean or at least $2.00)
    const commonFloor = Math.max(2, meanTxn30d * 0.10);
    // Define an upper ceiling to isolate regular purchases from extreme spikes
    const commonCeiling = meanTxn30d + (config.commonCeilingSigma * stdDevTxn);

    txnAmt = Math.max(commonFloor, Math.min(commonCeiling, txnAmt));
  }
  // SCENARIO 2: RARE SPENDING PROFILE (profileStrengh relative probability)
  // Represents out-of-character large purchases, vacations, or high-end electronics.
  else if (roll >= commonBoundary && roll < rareBoundary) {

    const RARE_SPENDING_RANGE = {
      "STUDENT": [2, 6],
      "STANDARD": [2, 5],
      "PREMIUM": [2, 4],
      "BUSINESS": [1, 3]
    }

    // High spending event where atvDelta shifts significantly outward
    const startSigma = config.commonCeilingSigma;
    
    atvDelta = startSigma * randomInRange(RARE_SPENDING_RANGE[accType][0], RARE_SPENDING_RANGE[accType][1]); // deviations based on accType config, NOT CONST for all
    txnAmt = meanTxn30d + (atvDelta * stdDevTxn);

    // Account age multiplier: older accounts often exhibit higher trust tolerances
    const ageFactor = Math.min(accAge, 120) / 120;
    txnAmt = txnAmt * (1.0 + ageFactor * 0.3);

  }
  // SCENARIO 3: VERY RARE / ANOMALOUS PROFILE (profileStrength relative probability)
  // Severe out-of-bounds variations indicating critical high-risk fraud triggers.
  else {

    // contains upperbounds for first IF statement, and 2nd ELSE statement
    const VERY_RARE_SPENDING_BOUNDS = {
      "STUDENT": [15, 20],
      "STANDARD": [12, 18],
      "PREMIUM": [10, 20],
      "BUSINESS": [9, 18]
    }

    const anomalyRoll = Math.random();

    // for around 75% of these cases, put high values, but not too high, 
    if (anomalyRoll < 0.7) {
      // Massive spending burst (might be rapid balance extraction)
      const startSigma = config.commonCeilingSigma * 2;
      atvDelta = startSigma + randomInRange(7, VERY_RARE_SPENDING_BOUNDS[accType][0]); // more deviations
      txnAmt = meanTxn30d + (atvDelta * stdDevTxn);
    } 
    else {
      // for around 30% of the left over cases, shoot very high values
      const startSigma = config.commonCeilingSigma * 2;
      atvDelta = startSigma + randomInRange(9, VERY_RARE_SPENDING_BOUNDS[accType][1]);
      txnAmt = meanTxn30d + (atvDelta * stdDevTxn);
    }

  }

  // Absolute global protective bounds
  txnAmt = Math.max(1, txnAmt);

  // Hard caps aligned with account tiers to ensure realistic generation limits
  const globalCaps = {
    "STUDENT": 11000, "STANDARD": 29000, "PREMIUM": 32000, "BUSINESS": 37000
  }

  if(txnAmt > globalCaps[accType]) {
    txnAmt = globalCaps[accType];
  }

  return round(txnAmt, 2);
};


// Hardcoded standard offsets in minutes to avoid external timezone engines
export const cityToUtcOffsetMinutes = {
  // US & Canada 
  "Irvine": -480, "Los Angeles": -480, "Seattle": -480, "Bellevue": -480, "Redmond": -480,
  "Houston": -360, "Arlington": -360, "Plano": -360,
  "Toronto": -300, "Montreal": -300, "Waterloo": -300,

  // Europe & UK
  "London": 0, "Birmingham": 0, "Manchester": 0, "Liverpool": 0, "Glasgow": 0, "Edinburgh": 0,
  "Berlin": 60, "Hamburg": 60, "Bremen": 60, "Cologne": 60, "Munich": 60, "Frankfurt": 60, "Stuttgart": 60,
  "Zurich": 60, "Geneva": 60, "Basel": 60, "Bern": 60, "Lausanne": 60, "Lucerne": 60,

  // Middle East & Asia
  "Dubai": 240, "Sharjah": 240,
  "Ankara": 180, "Bursa": 180, "Istanbul": 180,
  "Kanpur": 330, "Lucknow": 330, "Chennai": 330, "Bangalore": 330, "Vellore": 330, 
  "Hyderabad": 330, "Warangal": 330, "Pune": 330, "Mumbai": 330, "Thane": 330,

  // South America
  "São Paulo": -180, "Salvador": -180, "Rio de Janeiro": -180
};


// Generates txnTime, and txnCity as well, after which App.js uses 
// txnCity to just fetch country using the cityToCountry obj
export const generateTxnTime = (txnAmt, accType, meanTxn30d, stdDevTxn, 
  lastTxnLat, lastTxnLon, lastTxnCountry, lastTxnTime) => {
  
  const atvDelta = Math.abs(txnAmt - meanTxn30d) / stdDevTxn;

  const baseOddTimeChance = {
    STUDENT: 0.03,   // students rarely execute high-value txns during early morning hours or midnight
    STANDARD: 0.05,  // standard accounts generally perform transacitons in day, rare at night
    PREMIUM: 0.12,   // premium acc persons have varying day and night transactions
    BUSINESS: 0.16   // business acc having late night and early morning txns is common.
  };

  let oddTimeChance = baseOddTimeChance[accType];

  // RARE high ATV scenario, but not too high
  if(atvDelta > 3 && atvDelta < 7) {
    if (accType === "STUDENT" || accType === "STANDARD") {
      // if a restricted account faces an extreme spending spike, we skew the probability heavily 
      // toward odd night hours or early morning to simulate balance extraction and other frauds
      oddTimeChance = 0.15;
    } else {
      // premium and business accounts have somewhat more natural high spend, 
      oddTimeChance = 0.05;
    }
  }

  // VERY RARE very high ATV scenario
  if(atvDelta > 7) {
    if (accType === "STUDENT" || accType === "STANDARD") {
      // STUDENT and STANDARD accounts rarely cross this ATV generally, there are high chances of 
      // having it as odd time txn
      oddTimeChance = 0.25;
    } else {
      // Premium and business accounts scale up organically to accommodate international trade gates or travel
      oddTimeChance = 0.2;
    }
  }

  // Inline Box-Muller transform to generate standard normal Gaussian noise (Z ~ N(0, 1))
  const gaussianRandom = () => {
    const u1 = Math.random();
    const u2 = Math.random();
    return Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  };

  const roll = Math.random();
  let localHour = 12; // default.
  let sampledHour = 12;  // default

  // information for city selection based on time
  // we use the variable "distanceMatrix" which basicaly holds every city as key
  // and then the value as a large obj with other cities as key and distances of those
  // ciites from the origin city, as values
  // so we can convert that to arr, and basically sort by distance to get nearest to
  // farthest cities.

  // For txns in odd times, most (70%) will be in the same city as "lastTxnCity" and in the "homeCountry"
  // For txns that are in odd times, a good proportion (around 20-40%) will be in some other
  // city, but not very far, just one of the nearests
  // For very few txns in odd times, like (2-15%), the city will be far away, and hence diff country

  // even for transactions in normal times, most transactions will be in the same city as "lastTxnCity" and same country
  // but some, like around (1 - 10%) will be in other cities, and farthest cities and diff countries


  // HOUR GENERATION LOOP
  if (roll < oddTimeChance) {
    // SCENARIO A: ODD / HIGH-RISK NIGHT WAVE (Smooth late-night curve)
    // Centered at 1 AM (Mean = 1.0) with a broad standard deviation around 3 hours
    sampledHour = 1.0 + (gaussianRandom() * 3);
  } 
  else {
    // SCENARIO B: STANDARD WINDOW -> 5 AM to 10 PM
    const normalHours = [
      5, 6, 7, 8, 9, 10,
      11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22
    ];
    
    // For standard daylight transactions, heavily center purchases around peak retail retail hours
    const peakRoll = Math.random();

    // SCENARIO B: STANDARD DAYLIGHT COMMERCE (Overlapping wide hills)
    const daylightRoll = Math.random();

    if (daylightRoll < 0.7) {
      // 1. The core retail plateau, where most transactions happen
      // Centered at around 11 AM - 12 PM  with a wide standard deviation
      // This forms a broad and lazy hill sloping down to evening
      sampledHour = 13 + (gaussianRandom() * 3.7);
    } 
    else if (daylightRoll < 0.95) {
      // 2. The Mid-Morning Business Surge
      // Centered at around 9 AM, but with wide stdDev of 2.5
      // This increases weights of times around 9AM upto evening times, creates a wide hill
      sampledHour =  9 + (gaussianRandom() * 2.5);
    } 
    else {
      // 3. Early morning commuters and spend
      // Centered at 6 AM with a tight deviation of 1, is not much wide
      sampledHour = 6 + (gaussianRandom() * 2);
    }
  }

  localHour = Math.floor(sampledHour);
  localHour = ((localHour % 24) + 24) % 24;

  
  // CHOOSING THE DAY, MINUTES, SECONDS AND CITY VALUE TO CREATE PATTERNS
  
  // Getting nearest and farthest cities from the lastTxnCity, finding lastTxnCity
  // using lastTxnLat, lastTxnLon
  const lastTxnCity = Object.keys(cityCoords).find((c) => {

    if (Math.abs(lastTxnLat - cityCoords[c][0]) < 0.01 &&
      Math.abs(lastTxnLon - cityCoords[c][1]) < 0.01) {
  
        return true;
    }

    return false;
  }) || "Seattle";

  // sorting all cities by distances relative to origin city
  const sortedDestinations = Object.entries(distanceMatrix[lastTxnCity] || {})
    .filter((arr) => arr[0] !== lastTxnCity)
    .sort((a, b) => a[1] - b[1])

  const nearbyCities = sortedDestinations.slice(0, 6).map((entry) => entry[0]);
  const distantCities = sortedDestinations.slice(6,).map((entry) => entry[0]);

  // HERE, ROUTING CITIES BASED ON TEMPORAL RISK CONTEXT 
  let city = lastTxnCity;
  const locationRoll = Math.random();

  if(localHour >= 21 || localHour <= 4) {

    // most of the times, we transactions are still in the same city
    // and in some rare cases differnt cities but close by
    // and then in other very rare cases, they are in farthest cities
    if(locationRoll < 0.55) {
      city = lastTxnCity;
    }
    else if(locationRoll < 0.88 && nearbyCities.length > 0) {
      city = nearbyCities[Math.floor(randomInRange(0, nearbyCities.length))];
    }
    else if(distantCities.length > 0) {
      city = distantCities[Math.floor(randomInRange(0, distantCities.length))];
    }
  }
  else {

    if(locationRoll < 0.7) {
      city = lastTxnCity;
    }
    else if(locationRoll < 0.97 && nearbyCities.length > 0) {
      city = nearbyCities[Math.floor(randomInRange(0, nearbyCities.length))];
    }
    else if(distantCities.length > 0) {
      city = distantCities[Math.floor(randomInRange(0, distantCities.length))];
    }
  }


  // Determine locationHop status
  let locationHopStatus;

  if(city === lastTxnCity) {
    locationHopStatus = "SAME";
  }
  else if (city !== lastTxnCity) {
    // NATIONAL means, the same country as the lastTxnCountry, not homeCountry
    locationHopStatus = cityToCountry[city] === lastTxnCountry ? "NATIONAL" : "CROSSBORDER";
  }


  // Elevate cross-border fraud explicitly if high ATV hits a restricted profile context
  if (atvDelta > 7 && (accType === "STUDENT" || accType === "STANDARD") && Math.random() < 0.40) {
    if (distantCities.length > 0) {
      city = distantCities[Math.floor(randomInRange(0, nearbyCities.length))];
    }
  }

  // Here, dealing with TEMPORAL DELTA MECHANICS => high velocity, impossible travel, or normal
  let timeGapMillis = 0;

  // High velocity triggers: 5% baseline choice, or scaled up via anomalous spending vectors
  const isHighVelocityOrImpossibleTravel = Math.random() < 0.03 || (atvDelta > 7 && Math.random() < 0.1);
  // TWEAK PROBABILTIES A LITTLE BEFORE TRAINING

  let highVelTxn = false;
  let impossibleTravelTxn = false;

  // THIS IS THE MIN UTC time that we can generate from here, THIS IS NOT LOCAL, but UTC
  let absoluteMinUtc = lastTxnTime + timeGapMillis; 
  let finalizedUtcTimestamp;

  // localMinute and localSecond, initially defined as 0
  let localMinute = 0;
  let localSecond = 0;

  // Cyclical target alignment
  const offsetMinutes = cityToUtcOffsetMinutes[city] ?? 0;

  if(isHighVelocityOrImpossibleTravel) {
    const impossibleTravelRoll = Math.random();

    if(impossibleTravelRoll < 0.75 && locationHopStatus != "SAME") {
      // here we simulate very large distance since lastTxn with a very high unrealistic
      // speed, so timeSinceLastTxn is very less, but
      // the distance is in multiple thousands KMs
      // the unrealistic speed is generally >1000 KMH
      // we select the city as one of the farthest ones, and compute the timeGap that shuold be
      // to make the scenario "IMPOSSBILE TRAVEL"
      city = distantCities[Math.floor(randomInRange(0, distantCities.length))];
      let distanceBetween = distanceMatrix[lastTxnCity][city];
      let impossibleTravelSpeed = round(randomInRange(1000, 11000), 2);
      let timeInHours = round(distanceBetween/impossibleTravelSpeed, 2);

      let timeInHoursTemp = round(randomInRange(timeInHours, 1.25 * timeInHours), 2);
      let impossibleTravelSpeedTemp = round(randomInRange(impossibleTravelSpeed/1.25, impossibleTravelSpeed), 2);

      let timeInSeconds = timeInHours * 60 * 60;
      let timeInMillis = timeInSeconds * 1000;

      // console.log("-".repeat(10));
      // console.log("IMPOSSIBLE TRAVEL CASE");
      // console.table({lastTxnCity, city, distanceBetween, 
      //   impossibleTravelSpeed, impossibleTravelSpeedTemp, timeInHours, timeInSeconds});
      // console.log("-".repeat(10));

      timeGapMillis = randomInRange(timeInMillis, timeInMillis * 1.25);  
      
      impossibleTravelTxn = true;
    }
    else {
      // High Vel TXN pattern
      // rapid balance drain, only a few seconds post previous txn
      timeGapMillis = randomInRange(10, 90) * 1000;   // 15 - 90 seconds
      highVelTxn = true;
    }

    // Relying on timeGapMillis completely for highVel pattern
    finalizedUtcTimestamp = lastTxnTime + timeGapMillis;

    const targetLocalClock = new Date(finalizedUtcTimestamp + (offsetMinutes * 60 * 1000));
    localHour = targetLocalClock.getUTCHours();
    localMinute = targetLocalClock.getUTCMinutes();
    localSecond = targetLocalClock.getUTCSeconds();
  }
  else {
    // For other normal cases, we need to preserve the localHour that we generated
    // using many conditions, criteria and probabilities
    localHour = Math.floor(sampledHour);
    localHour = ((localHour % 24) + 24) % 24;
    localMinute = Math.floor(Math.random() * 60);
    localSecond = Math.floor(Math.random() * 60);

    // Getting previous txn's local clock context in new txnCity frame
    const referenceLocalTime = lastTxnTime + (offsetMinutes * 60 * 1000);
    const referenceDateObj = new Date(referenceLocalTime);

    const year = referenceDateObj.getUTCFullYear();
    const month = referenceDateObj.getUTCMonth();
    const date = referenceDateObj.getUTCDate();

    // Roll a clean number of full macro days to pass (0 to 4 days)
    const daysToSkip = Math.random() < 0.35 ? 0 : Math.floor(Math.random() * 4) + 1;

    // Synthesize the localized timestamp directly on that day
    const finalLocalTimestamp = Date.UTC(
      year, month, date + daysToSkip, localHour, localMinute, localSecond);

    // Shift back to true UTC
    finalizedUtcTimestamp = finalLocalTimestamp - (offsetMinutes * 60 * 1000);

    const deltaSeconds = (finalizedUtcTimestamp - lastTxnTime) / 1000;

    // console.log("-".repeat(10));
    // console.log("DELTA SECONDS: ", deltaSeconds);
    // console.log({
    //   lastTxnClock: new Date(lastTxnTime).toISOString(),
    //   currTxnClock: new Date(finalizedUtcTimestamp).toISOString()
    // });

  }

  // Determine locationHop status again, as city might has changed
  
  if(city === lastTxnCity) {
    locationHopStatus = "SAME";
  }
  else if (city !== lastTxnCity) {
    // NATIONAL means, the same country as the lastTxnCountry, not homeCountry
    locationHopStatus = cityToCountry[city] === lastTxnCountry ? "NATIONAL" : "CROSSBORDER";
  }

  // Chronological Guardrail: If the target local hour on the same day has already passed,
  // advance the timeline by exactly one full day. Shifting by 24 hours preserves the clock face.
  // If we don't to this, we have a txnTime that is actually behind "lastTxnTime"
  if (finalizedUtcTimestamp <= lastTxnTime) {
    finalizedUtcTimestamp += 24 * 60 * 60 * 1000;
  }

  const finalTxnDate = new Date(finalizedUtcTimestamp);
  const localTime24hStr = `${String(localHour).padStart(2, '0')}:${String(localMinute).padStart(2, '0')}`;

  // console.log("-".repeat(10));
  // console.log({finalTxnDate, finalizedUtcTimestamp, localHour, highVelTxn});


  return {
    impossibleTravelTxn,
    highVelTxn,
    locationHopStatus,
    txnCity: city,
    utcTimestamp: finalizedUtcTimestamp, // sent to Spring Boot service along with localHour
    localHour: localHour,                 // used for plotting as well as sent to backend
    localTime24hStr: localTime24hStr     
  };
};


// generates merchantType considering many cases and scenarios
export const generateMerchantType = (
  txnAmt, accType, meanTxn30d, stdDevTxn, localHour, flaggedTxns
) => {

  // Calculate structural spending deviation
  const atvDelta = (txnAmt - meanTxn30d) / (stdDevTxn || 1.0);
  const isOddTime = localHour >= 23 || localHour <= 4;

  // Initial base routing distributions [GROCERY, DIGITAL, TRAVEL, LUXURY, CRYPTO]
  let weights = [0.20, 0.20, 0.20, 0.20, 0.20];


  // BEHAVIORAL LAYER: PROFILE TIER BASELINES
  if (accType === "STUDENT") {
    // Students spend heavily on daily essentials and digital goods and subscriptions
    weights = [0.55, 0.38, 0.05, 0.015, 0.005];
  } else if (accType === "STANDARD") {
    // similar to Students but a little more chances of crypto and travel
    weights = [0.45, 0.35, 0.12, 0.06, 0.02];
  } else if (accType === "PREMIUM") {
    // High-net-worth accounts show fluid distributions across luxury channels
    weights = [0.15, 0.20, 0.30, 0.25, 0.10];
  } else if (accType === "BUSINESS") {
    // Corporate accounts skew heavily toward operational infra and travel
    weights = [0.05, 0.30, 0.35, 0.15, 0.15];
  }


  // 1: ATV DELTA & TEMPORAL SKEW DISTORTIONS

  // ULTRA high spend, more than 15 times away from STD DEV
  if (atvDelta > 15) {
    if (accType === "STUDENT" || accType === "STANDARD") {
      if (isOddTime || flaggedTxns > 3) {
        // HIGH-RISK CRITICAL: Out-of-character late-night whale spend on a restrictive account profile.
        // Force an account takeover liquidation event: Skew straight to Crypto and Luxury cashouts.
        weights = [0, 0.1, 0.30, 0.20, 0.40];
      } 
      else {
        // High spend during standard daytime: Organic large purchases (electronics, travel tickets)
        weights = [0, 0.20, 0.30, 0.25, 0.25];
      }
    } 
    else {
      if(isOddTime) {
        // mostly CRYPTO, TRAVEL realted ones in oddtimes and this high amount
        // or maybe fraud, DIGITAL goods, and LUXURY
        weights = [0, 0.1, 0.2, 0.3, 0.4]
      }
      else {
        // day times, mostly genuine and spend on LUXURY, CRYPTO, DIGITAL, TRAVEL
        weights = [0, 0.1, 0.3, 0.3, 0.3];
      }
    }
  }

  // very high spend, more than 7 times away from STD DEV
  if (atvDelta > 7 && atvDelta < 15) {
    if (accType === "STUDENT" || accType === "STANDARD") {
      if (isOddTime || flaggedTxns > 3) {
        // HIGH-RISK CRITICAL: Out-of-character late-night whale spend on a restrictive account profile.
        // Force an account takeover liquidation event: Skew straight to Crypto and Luxury cashouts.
        weights = [0, 0.1, 0.30, 0.40, 0.2];
      } 
      else {
        // High spend during standard daytime: Organic large purchases (electronics, travel tickets)
        weights = [0, 0.20, 0.30, 0.30, 0.20];
      }
    } 
    else {
      // PREMIUM & BUSINESS high deviations naturally map to high-end travel accommodations and assets
      weights = [0.05, 0.20, 0.25, 0.30, 0.20];
    }
  }

  // High spend, but not crossing limits
  if (atvDelta > 3 && atvDelta < 7) {
    if (accType === "STUDENT" || accType === "STANDARD") {
      if (isOddTime || flaggedTxns > 2) {
        // HIGH-RISK CRITICAL: Out-of-character late-night whale spend on a restrictive account profile.
        // Force an account takeover liquidation event: Skew straight to Crypto and Luxury cashouts.
        weights = [0.05, 0.30, 0.25, 0.25, 0.15];
      } 
      else {
        // High spend during standard daytime: Organic large purchases (electronics, travel tickets)
        weights = [0.25, 0.25, 0.20, 0.20, 0.1];
      }
    } 
    else {
      // PREMIUM & BUSINESS high deviations naturally map to high-end travel accommodations and assets
      weights = [0.1, 0.20, 0.30, 0.30, 0.1];
    }
  }

 
  // 2: CHRONOLOGICAL ODD HOUR RESTRICTIONS
  if (isOddTime && atvDelta <= 3) {
    // Late night routine spending shifts away from physical retail (Grocery/Luxury) 
    // and targets continuous streaming, cloud hosts, or midnight travel arrangements.
    weights[0] *= 0.20; // Suppress Grocery
    weights[3] *= 0.30; // Suppress Luxury
    weights[1] *= 2.00; // Boost Digital
    weights[2] *= 1.50; // Boost Travel
    weights[4] *= 1.25   // Boost Crypto
  }

  // EXECUTE WEIGHTED RANDOM ROUTING
  // Normalize elements to ensure array sums cleanly to 1.0
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const normalizedWeights = weights.map(w => w / totalWeight);

  const roll = Math.random();
  let cumulativeWeight = 0;
  const categories = ["GROCERY", "DIGITAL", "TRAVEL", "LUXURY", "CRYPTO"];

  for (let i = 0; i < categories.length; i++) {
    cumulativeWeight += normalizedWeights[i];
    if (roll < cumulativeWeight) {
      return categories[i];
    }
  }

  return "DIGITAL"; // Default
};



export const generateDeviceId = (
  primaryDeviceId, txnAmt, localHour, meanTxn30d, stdDevTxn, accType, merchantType, flaggedTxns
) => {
  const atvDelta = Math.abs(txnAmt - meanTxn30d) / (stdDevTxn || 1.0);
  const isOddTime = localHour >= 23 || localHour <= 4;

  // 1. Organic Baseline Chance (User occasionally transacts from a secondary phone, tablet, or laptop)
  let switchDeviceChance = 0.02; // 2% base chance

  // 2. Behavioral Weighting: Historical flags multiply the profile risk profile
  if (flaggedTxns > 0) {
    switchDeviceChance += flaggedTxns * 0.06; // Accumulates risk rapidly for unstable accounts
  }

  // 3. Behavioral Weighting: Spending anomalies link to terminal changes
  if (atvDelta > 4.0) {
    switchDeviceChance += 0.12;
  }

  // 4. Behavioral Weighting: Late-night liquidity events (Account Takeover Liquidation Signature)
  if (isOddTime && (merchantType === "CRYPTO" || merchantType === "LUXURY")) {
    switchDeviceChance += 0.25;
  }

  // 5. Critical Edge Case: Severe spending spike on restricted profiles pushes probability high
  if (atvDelta > 9.0 && (accType === "STUDENT" || accType === "STANDARD")) {
    switchDeviceChance += 0.25;
    // high ATV delta, for STUDENT and STANDARD accounts
    // is a strong signal of account takeover or compromised session
  }

  // Keep max programmatic ceiling safe so it remains a semi-stochastic simulation feature
  switchDeviceChance = Math.min(0.85, switchDeviceChance);


  // DEVICE SELECTION ROUTING
  if (Math.random() < switchDeviceChance) {
    // Filter the imported deviceIds list to exclude the user's primary trusted device
    const foreignDevices = deviceIds.filter(id => id !== primaryDeviceId);
    
    // Pick a random rogue device ID to simulate a malicious or unverified session
    return foreignDevices[Math.floor(Math.random() * foreignDevices.length)];
  }

  // Default
  return primaryDeviceId;
};



// FUNCTION TO ALL ALL THE FEATURES, THE GENERATED ONES, AND THE ENGINEERED ONES
// TO COMPUTE FRAUD SCORE of each txnObj
// Considers many parameters and conditions when increasing or decreasing fraud score
export const calculateFraudScore = (txn, user) => {
  // Extract primitive structures to avoid repeated deep-object property lookups
  const {
    txnAmt, merchantType, locationHop,
    geoDistanceKm, timeGapLastTxn, speedKmh,
    highTxnVelocity, isAbnormalTime, userAtvDelta,
    isNewDevice, geoCountryMismatch
  } = txn;

  const { accType, flaggedTxns, accAge } = user;

  // Establish account maturity stability tracking metrics
  const ageFactor = round(Math.min(accAge, 120) / 120, 2);
  const trustedUser = ageFactor >= 0.6 && flaggedTxns === 0; 

  // Track raw risk weight points (accumulates non-linearly across structural gates)
  let riskPoints = 0.0;

  // VECTOR 1: CRITICAL SPATIOTEMPORAL IMPOSSIBLE TRAVEL SPEED
  if (locationHop !== "SAME" && speedKmh > 100) {
    // Light base friction for crossing urban jurisdictions via ground transit
    riskPoints += 0.5;

    if (speedKmh > 900) {
      // Speed exceeds standard commercial jet liners (Multi-location card skimming)
      riskPoints += 5.0;
      if (isNewDevice) riskPoints += 2.5;
      if (geoCountryMismatch) riskPoints += 2.0;
    } 
    else if (speedKmh > 250) {
      // High speed transit indicator (Suspicious if time gap since last txn is under a few hours)
      riskPoints += trustedUser ? 1.0 : 2.0;
      if (isNewDevice || isAbnormalTime) riskPoints += 2.0;
    }

    // High speed and high spending volatility together form a dangerous vector
    if (userAtvDelta >= 5.0) {
      riskPoints += 2.5;
    }
  }

  // VECTOR 2: HIGH-VELOCITY EXPLOITS & SEQUENTIAL DRAINS
  if (highTxnVelocity) {
    // Rapid succession transactions (Time gap <= 90 seconds)
    riskPoints += trustedUser ? 1.0 : 1.5;

    if (timeGapLastTxn <= 30) {
      riskPoints += 1.0; // Extreme velocity surge
    }

    if (isNewDevice) {
      // Automated rapid balance extractions on an unverified rogue terminal
      riskPoints += 4.5;
      if (merchantType === "CRYPTO" || merchantType === "LUXURY") riskPoints += 3.5;
      
      if (accType === "STUDENT" || accType === "STANDARD") {
        riskPoints += 2.0; // High risk profile mismatch
      }
    }

    if (userAtvDelta > 3.0 && userAtvDelta < 9.0) {
      riskPoints += 2.0;
    }

    if (userAtvDelta >= 9.0) {
      // Rapid succession transaction paired with a massive purchase is an immediate fraud signal
      riskPoints += 5.0;
    }
  }

  // VECTOR 3: GEOGRAPHIC & NATIONAL CROSS-BORDER MISMATCHES
  if (geoCountryMismatch) {
    // Mitigated base friction for legitimate cross-border travel/e-commerce
    riskPoints += 0.6;

    if (isNewDevice) {
      riskPoints += 2.5; // High friction: international execution from a new device
    }

    if (geoDistanceKm > 5000 && userAtvDelta > 5.0) {
      if (accType === "STUDENT" || accType === "STANDARD") {
        riskPoints += 2.5;
      } else {
        riskPoints += 0.5; // Normal corporate/luxury travel profiles
      }
    }

    // Apply minor, safe adjustments for student/standard location shifts
    if (accType === "STUDENT" && !trustedUser) {
      riskPoints += 1.2;
    }
    if (accType === "STANDARD" && !trustedUser) {
      riskPoints += 0.5;
    }
  }

  // VECTOR 4: FINANCIAL EXTRACTION & ATV DEVIATION VOLATILITY
  if (userAtvDelta > 3.0) {
    if (ageFactor < 0.6) {
      riskPoints += 1.2;
    }

    if (userAtvDelta > 9.0) {
      riskPoints += ageFactor < 0.6 ? 3.0 : 1.5;
      
      if (accType === "STUDENT") riskPoints += 3.0; 
      if (isAbnormalTime) riskPoints += trustedUser ? 1.0 : 2.5; 
    }
  }

  // VECTOR 5: LATE-NIGHT HIGH-LIQUIDATION TARGETS
  if (isAbnormalTime) {
    // Midnight spending carries a tiny base friction, significantly reduced for trusted profiles
    riskPoints += trustedUser ? 0.1 : 0.6;

    if (isNewDevice) {
      // Late night session takeover window + untrusted terminal device
      riskPoints += 2.5;
      
      if (merchantType === "CRYPTO" || merchantType === "LUXURY") {
        // Coordinated account takeover cash-out signature
        riskPoints += 4.0; 
      }
      if (userAtvDelta > 4.0) {
        riskPoints += 2.0; // High spending spike inside a compromised window
      }
    } else {
      // If using their primary recognized device at night, only flag high-risk liquidation categories
      if ((merchantType === "CRYPTO" || merchantType === "LUXURY") && userAtvDelta > 6.0) {
        riskPoints += 2.0;
      }
    }
  }

  // HISTORICAL REPUTATION MULTIPLIER
  if (flaggedTxns > 0) {
    riskPoints += flaggedTxns * 0.5;
  }

  // COUNTER WEIGHTS: RISK MITIGATION OFFSETS
  // If core indicators check out completely safe, apply active point deductions
  if (!isNewDevice) {
    riskPoints -= 1.0; // Significant discount for using their trusted physical hardware
  }
  if (userAtvDelta <= 2) {
    riskPoints -= 0.8; // Reward staying within historical budget constraints
  }
  if (trustedUser) {
    riskPoints -= 1.2; // Reward perfect historical tenure records
  }

  // Bind the accumulated points so deductions never drag them below absolute zero
  riskPoints = Math.max(0.0, riskPoints);

  // SIGMOID PROBABILISTIC ACTIVATION LAYER WITH JITTER NOISE
  // Establish an activation threshold gateway. If points are negligible, bypass the curve
  if (riskPoints > 0.65) {
    const stochasticNoise = (Math.random() + Math.random() - 1.0) * 0.05;
    riskPoints = Math.max(0.1, riskPoints + stochasticNoise);

    // Logistic Sigmoid Function: f(x) = 1 / (1 + e^(-k * x))
    const score = 1.0 / (1.0 + Math.exp(-0.45 * riskPoints));
    
    return parseFloat(score.toFixed(2));
  }

  // Safe routine purchases drop cleanly into background noise (0.00 to 0.04)
  const organicNoise = Math.random() * 0.0385; 
  return parseFloat(organicNoise.toFixed(2));
};

