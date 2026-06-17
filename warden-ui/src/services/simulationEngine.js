import { cityCoords, cityToCountry, deviceIds, generateAccAge, generateAccType, generateFlaggedTxns, generateLastTxnCityAndHomeCountry, generateLastTxnTime, generateMeanTxn30d, generateStdDevTxn, generateUniqueFullNames } from "../users/UsersDataGeneration";
import { computeHaversineDistance, round } from "../utilities";
import { calculateFraudScore, generateDeviceId, generateMerchantType, generateTxnAmt, generateTxnTime } from "../transactions/TransactionsDataGeneration";

/**
 * FIXED SEED GENERATOR: Generates clean, database-aligned user profiles.
 */
export const generateUsersDataBaseline = (rowCount) => {
    const N = Math.floor(rowCount);
    const fullNames = generateUniqueFullNames(N);
    let users = {};
    const cities = Object.keys(cityCoords);

    for (let k = 0; k < N; k++) {
        const generatedAccAge = generateAccAge();
        const generatedAccType = generateAccType(generatedAccAge);
        const city = cities[Math.floor(Math.random() * cities.length)];
        const generatedMeanTxn30d = generateMeanTxn30d(generatedAccType, generatedAccAge);
        const generatedStdDevTxn = generateStdDevTxn(generatedAccType, generatedMeanTxn30d);
        const generatedFlaggedTxns = generateFlaggedTxns(generatedAccType, generatedAccAge);
        const generatedLastTxnCityAndHomeCountry = generateLastTxnCityAndHomeCountry();
        const generatedLastTxnTime = generateLastTxnTime(generatedLastTxnCityAndHomeCountry.lastTxnCity, generatedAccType);

        const lastTxnCity = generatedLastTxnCityAndHomeCountry?.lastTxnCity || null;
        const homeCountry = generatedLastTxnCityAndHomeCountry?.homeCountry || null;

        console.log("generatedLastTxnTime: ", generatedLastTxnTime);

        // Aligned keys exactly with UserEntity column definitions
        users[k] = {
            userId: k, // Pure integer for Jackson mapping safety
            name: fullNames[k],
            accType: generatedAccType,
            accAge: generatedAccAge,
            lastTxnLat: lastTxnCity ? cityCoords[lastTxnCity][0] : null,
            lastTxnLon: lastTxnCity ? cityCoords[lastTxnCity][1] : null,
            lastTxnCity: lastTxnCity,
            homeCountry: homeCountry,
            meanTxn30d: Math.floor(generatedMeanTxn30d),
            stdDevTxn: Math.floor(generatedStdDevTxn),
            primaryDeviceId: deviceIds[Math.floor(Math.random() * deviceIds.length)],
            flaggedTxns: generatedFlaggedTxns,
            lastTxnTime: generatedLastTxnTime.utcTimestamp
        };
    }
    return users;
};

/**
 * ENGINE HANDOFF: Generates synthetic real-time transactions using database records.
 */
export const generateTransactionsFromDbPool = (dbUsersPool, targetRowCount) => {
    if (!dbUsersPool || Object.keys(dbUsersPool).length === 0) return {};

    // "U566": {
    //   userId: "U566",
    //   txnAmt: 78,
    //   txnCountry: "Brazil",
    //   txnTime: Date.now(),
    //   txnLat: cityCoords["Salvador"][0],
    //   txnLon: cityCoords["Salvador"][1],
    //   copyPastedCardNo: false,
    //   merchantType: "GROCERY",
    //   deviceId: deviceIds[Math.floor(Math.random() * deviceIds.length)]
    // }
    
    let transactions = {};
    const userIds = Object.keys(dbUsersPool);
    const totalAvailableUsers = userIds.length;

    // Bound the transactions to loop within the subset of users we pulled from Postgres
    const iterations = Math.min(targetRowCount, totalAvailableUsers);

    for (let k = 0; k < iterations; k++) {
        const selectedId = userIds[k];
        const userObj = dbUsersPool[selectedId];

        const generatedTxnAmt = generateTxnAmt(userObj.meanTxn30d, userObj.stdDevTxn, userObj.accType, userObj.accAge);
        const lastTxnCountry = cityToCountry[userObj.lastTxnCity];

        const generatedTxnTimeObj = generateTxnTime(
        generatedTxnAmt, userObj.accType, userObj.meanTxn30d, 
        userObj.stdDevTxn, userObj.lastTxnLat, userObj.lastTxnLon, 
        lastTxnCountry, userObj.lastTxnTime
        );

        const txnCity = generatedTxnTimeObj.txnCity || userObj.lastTxnCity;
        const txnCountry = cityToCountry[txnCity] || userObj.homeCountry;

        const generatedMerchantType = generateMerchantType(
        generatedTxnAmt, userObj.accType, userObj.meanTxn30d, userObj.stdDevTxn,
        generatedTxnTimeObj.localHour, userObj.flaggedTxns
        );

        const generatedDeviceId = generateDeviceId(
        userObj.primaryDeviceId, generatedTxnAmt, generatedTxnTimeObj.localHour,
        userObj.meanTxn30d, userObj.stdDevTxn, userObj.accType, 
        generatedMerchantType, userObj.flaggedTxns
        );

        const geoDistanceKm = round(computeHaversineDistance(
        userObj.lastTxnLat, userObj.lastTxnLon,
        cityCoords[txnCity][0], cityCoords[txnCity][1]
        ), 2);

        const timeGapSeconds = Math.abs(userObj.lastTxnTime - generatedTxnTimeObj.utcTimestamp) / 1000;
        const timeGapHours = round(timeGapSeconds / 3600, 2);
        const speedKmh = timeGapHours > 0 ? round(geoDistanceKm / timeGapHours, 2) : 0;
        const highTxnVelocity = timeGapSeconds <= 90;
        let userAtvDelta = round(Math.abs(generatedTxnAmt - userObj.meanTxn30d) / (userObj.stdDevTxn || 1), 2);

        let transactionObj = {
            txnId: crypto.randomUUID(),
            userId: userObj.userId, 
            txnAmt: generatedTxnAmt,
            txnTime: generatedTxnTimeObj.localTime24hStr,
            txnTimeUTC: generatedTxnTimeObj.utcTimestamp,
            txnTimeLocalHour: generatedTxnTimeObj.localHour,
            txnCountry: txnCountry,
            txnLat: cityCoords[txnCity] ? cityCoords[txnCity][0] : null,
            txnLon: cityCoords[txnCity] ? cityCoords[txnCity][1] : null,
            merchantType: generatedMerchantType,
            deviceId: generatedDeviceId,

            // JUST USED FOR ANALYTICS HERE, 
            // BUT ACTUALLY FEATURE ENGINEERED IN THE SPRING BOOT SERVICE
            // WHEN SIMULATING
            geoDistanceKm: geoDistanceKm,
            timeGapLastTxn: round(timeGapSeconds, 2),
            speedKmh: speedKmh,
            highTxnVelocity: highTxnVelocity,
            isAbnormalTime: generatedTxnTimeObj.localHour >= 23 || generatedTxnTimeObj.localHour <= 4,
            userAtvDelta: userAtvDelta,
            isNewDevice: generatedDeviceId !== userObj.primaryDeviceId,
            geoCountryMismatch: txnCountry !== lastTxnCountry,
            locationHop: generatedTxnTimeObj.locationHopStatus,
            flaggedTxns: userObj.flaggedTxns,
            accType: userObj.accType,
            accAge: userObj.accAge,
            lastTxnCountry: lastTxnCountry
        };

        transactionObj.fraudScore = calculateFraudScore(transactionObj, userObj);
        transactions[userObj.userId] = transactionObj;
    }

    return transactions;
};