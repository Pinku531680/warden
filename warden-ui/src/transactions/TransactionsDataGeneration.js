// transactions data generation happens here


// Generates a synthetic transaction amount (txnAmt) based on the user's spending baseline.

export const generateTxnAmt = (meanTxn30d, stdDevTxn, accType, accAge) => {
  const roll = Math.random();
  let atvDelta = 0;
  let txnAmt = 0;

  // Box-Muller transform to generate standard normal Gaussian noise (Z ~ N(0, 1))
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);

  // SCENARIO 1: COMMON SPENDING PROFILE (~90% probability)
  // Transaction tracks typical historical habits within conventional standard boundaries.
  if (roll < 0.90) {
    // atvDelta is bounded tightly around the standard deviation curve
    atvDelta = z * 1.0; 

    txnAmt = meanTxn30d + (atvDelta * stdDevTxn);

    // Define a strict lower floor for baseline purchases (e.g., 10% of mean or at least $2.00)
    const commonFloor = Math.max(2.00, meanTxn30d * 0.10);
    // Define an upper ceiling to isolate regular purchases from extreme spikes
    const commonCeiling = meanTxn30d + (1.96 * stdDevTxn);

    txnAmt = Math.max(commonFloor, Math.min(commonCeiling, txnAmt));
  }
  // SCENARIO 2: RARE SPENDING PROFILE (~7% probability)
  // Represents out-of-character large purchases, vacations, or high-end electronics.
  else if (roll >= 0.90 && roll < 0.97) {
    // High spending event where atvDelta shifts significantly outward
    atvDelta = 2.5 + Math.random() * 3.0; // 2.5x to 5.5x standard deviations away
    txnAmt = meanTxn30d + (atvDelta * stdDevTxn);

    // Account age multiplier: older accounts often exhibit higher trust tolerances
    const ageFactor = Math.min(accAge, 120) / 120;
    txnAmt = txnAmt * (1.0 + ageFactor * 0.20);

    // 12% probability inside this rare pool to capture typical card authorization checks (exactly $1.00)
    if (Math.random() < 0.12) {
      txnAmt = 1.00;
    }
  }
  // SCENARIO 3: VERY RARE / ANOMALOUS PROFILE (~3% probability)
  // Severe out-of-bounds variations indicating critical high-risk fraud triggers.
  else {
    const anomalyRoll = Math.random();

    if (anomalyRoll < 0.60) {
      // Massive spending burst (Whale behavior / rapid balance extraction)
      atvDelta = 6.0 + Math.random() * 8.0; // Extreme shift: 6x to 14x standard deviations
      txnAmt = meanTxn30d + (atvDelta * stdDevTxn);
    } 
    else if (anomalyRoll >= 0.60 && anomalyRoll < 0.85) {
      // High-value clean round-number thresholds typical of organized retail fraud bypasses
      const roundThresholds = {
          STUDENT: [200, 650, 910],
          STANDARD: [850, 2100, 3900],
          PREMIUM: [3800, 5200, 10400],
          BUSINESS: [7500, 28000, 51000]
      };
      const options = roundThresholds[accType] || [1000, 4000];
      const baseAmount = options[Math.floor(Math.random() * options.length)];
      
      // 50% chance to strip 1 cent making it an appealing electronic price threshold (e.g., $999.99)
      txnAmt = Math.random() < 0.5 ? baseAmount - 0.01 : baseAmount;
    } 
    else {
      // Micro-transaction account probing (fraudsters validating card validity with cents)
      txnAmt = 0.01 + Math.random() * 0.98; // Generates between $0.01 and $0.99
    }
  }

  // Absolute global protective bounds
  txnAmt = Math.max(0.01, txnAmt);

  // Hard caps aligned with account tiers to ensure realistic generation limits
  if (accType === "STUDENT") {
    txnAmt = Math.min(8000, txnAmt); 
  } 
  else if (accType === "STANDARD") {
    txnAmt = Math.min(18000, txnAmt);
  } 
  else if (accType === "PREMIUM") {
    txnAmt = Math.min(45000, txnAmt);
  }
  else if(accType === "BUSINESS") {
    txnAmt = Math.min(65000, txnAmt);
  }

  return parseFloat(txnAmt.toFixed(2)); // round(txnAmt, 2)
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


export const generateTxnTime = (city) => {
  const roll = Math.random();
  let localHour = 12; // default fallback

  // SCENARIO A: ABNORMAL HIGH-RISK NIGHT WINDOW (~8% chance)
  // Targets the classic fraud window: 11:00 PM (23) to 4:59 AM (4)
  if (roll < 0.08) {
    const nightHours = [23, 0, 1, 2, 3, 4];
    localHour = nightHours[Math.floor(Math.random() * nightHours.length)];
  } 
  // SCENARIO B: TRANSACTION HOURS (~92% chance)
  // Targets standard commerce hours: 5:00 AM (5) to 10:59 PM (22)
  else {
    const dayHours = [
      5, 6, 7, 8, 9, 10, 11, // Morning
      12, 13, 14, 15, 16, 17, // Afternoon (Peak velocity)
      18, 19, 20, 21, 22      // Evening
    ];
    // Slightly skew towards afternoon/evening commerce via simple random weighting
    const innerRoll = Math.random();
    if (innerRoll < 0.60) {
      localHour = 11 + Math.floor(Math.random() * 9); // 11 AM to 8 PM peak
    } else {
      localHour = dayHours[Math.floor(Math.random() * dayHours.length)];
    }
  }

  const localMinute = Math.floor(Math.random() * 60);
  const localSecond = Math.floor(Math.random() * 60);


  // CONSTRUCT REAL UTC TIMESTAMP AFTER JAN 1, 2026
  // Spread transactions randomly across a 90-day simulation window from the anchor date
  const anchorDate = new Date("2026-01-01T00:00:00Z");
  const randomDaysOffset = Math.floor(Math.random() * 90);
  anchorDate.setDate(anchorDate.getDate() + randomDaysOffset);

  // Apply the target city's UTC offset to compute the true underlying UTC string
  const offsetMinutes = cityToUtcOffsetMinutes[city] ?? 0;
  
  // Set the local parameters directly into our date object builder
  const txnDate = new Date(Date.UTC(
    anchorDate.getUTCFullYear(),
    anchorDate.getUTCMonth(),
    anchorDate.getUTCDate(),
    localHour,
    localMinute,
    localSecond
  ));

  // Shift back by the offset to align the true absolute UTC timestamp string correctly
  txnDate.setMinutes(txnDate.getMinutes() - offsetMinutes);

  // Format local hour/minute strings for scannable frontend analytics mapping
  const localTime24hStr = `${String(localHour).padStart(2, '0')}:${String(localMinute).padStart(2, '0')}`;

  return {
    city,
    utcTimestamp: txnDate.toISOString(), // Sent to your Database / Spring Boot service
    localHour: localHour,                 // Used directly by your linear binning analyzer
    localTime24hStr: localTime24hStr     // Optional human-readable debug string
  };
};



