import React, {useState, useEffect, useRef} from "react";
import './App.css';
import UsersDataTable from "./users/UsersDataTable";
import UsersFeatureAnalytics from "./users/UsersFeatureAnalytics";
import ModelInsights from "./ModelInsights";
import { cityCoords, cityToCountry, deviceIds, firstNames, generateAccAge, generateAccType, generateFlaggedTxns, generateLastTxnCityAndHomeCountry, generateLastTxnTime, generateMeanTxn30d, generateStdDevTxn, generateUniqueFullNames, lastNames } from "./users/UsersDataGeneration";
import { buildDistanceMatrix, computeHaversineDistance, isStrictInteger, random, refinedNormalRandom, round } from "./utilities";
import TransactionsDataTable from "./transactions/TransactionsDataTable";
import TransactionsFeatureAnalytics from "./transactions/TransactionsFeatureAnalytics";
import { calculateFraudScore, generateDeviceId, generateMerchantType, generateTxnAmt, generateTxnTime } from "./transactions/TransactionsDataGeneration";
import {org} from "./proto/compiled";
import {generateTransactionsFromDbPool, generateUsersDataBaseline} from "./services/simulationEngine";


function App() {


  const [selectedTab, setSelectedTab] = useState("Data Table");  // Data Table, Feature Analytics or Model Insights
  const [mode, setMode] = useState("transactions")  // users or transactions

  const [dataRowCount, setDataRowCount] = useState(""); // will be converted to INT before use
  let intRowCount = 0;
  const [isGeneratingData, setIsGeneratingData] = useState(false);
  const [isAppLoading, setIsAppLoading] = useState(true);

  // Separate WebSocket connections channels for simulation and training
  // Channel A: Training Bulk Ingestion Sockets
  const wsRef = useRef(null);
  const [wsConnected, setWsConnected] = useState(false);
  const reconnectTimeoutRef = useRef(null);

  // Channel B: Live Simulation Socket
  const liveWsRef = useRef(null);
  const [liveWsConnected, setLiveWsConnected] = useState(false);
  const liveReconnectTimeoutRef = useRef(null);


  // INITIAL COMPONENT DB SYNCHRONIZATION
  useEffect(() => {
    const fetchUsersPoolFromDatabase = async () => {

      try {
        console.log("Fetching operational user baseline from Spring Boot");
        const response = await fetch("http://localhost:8080/api/v1/get-users");
        const rawList = await response.json();
        
        // Convert the flat Array response from Postgres into our fast key-indexed Object structure
        const usersObjMatrix = {};
        rawList.forEach((user) => {
          usersObjMatrix[user.userId] = user;
        });

        console.log("FETCHED USERS DATA");
        console.log(rawList.slice(0, 1000));

        setUsersData(usersObjMatrix);
        console.log(`Loaded ${rawList.length} users successfully from Postgres.`);
      } catch (err) {
        console.error("Database connection failure on initial startup fetch:", err);
      } finally {
        // Enforce a 4-second loading window for synchronization stabilization
        setTimeout(() => {
          setIsAppLoading(false);
          console.log("set isAppLoading to FALSE");
        }, 2000);
      }
    };

    fetchUsersPoolFromDatabase();
  }, []);


  // Live Simulation Logs
  const [rawLogs, setRawLogs] = useState([]);
  const [approvedTxnLogs, setApprovedTxnLogs] = useState([]);
  const [rejectedTxnLogs, setRejectedTxnLogs] = useState([]);
  const [duplicateTxnLogs, setDuplicateTxnLogs] = useState([]);  // DUPLICATE or RETRY 
  const [cacheMissLogs, setCacheMissLogs] = useState([]);  // Redis Cache Miss for userId logs
  const [watchDogLogs, setWatchDogLogs] = useState([]);  // logs when watchdog service runs


  // NEW STATE & REF MANAGERS FOR SIMULATION TELEMETRY
  const [totalFraudGenerated, setTotalFraudGenerated] = useState(0);
  const [averageLatency, setAverageLatency] = useState(0);
  
  const expectedTxnTotalRef = useRef(0);
  const hasLoggedSummaryRef = useRef(false);
  const [processedTxnTotal, setProcessedTxnToal] = useState(0);
  
  // High-performance hashmap tracking in-flight packet timings and completion statuses
  const flightRegistryRef = useRef({});
  const watchdogIntervalRef = useRef(null);

  // IN-MEMORY UI RENDERING QUEUE REFERENCES
  const uiRenderQueueRef = useRef([]);
  const isProcessingQueueRef = useRef(false);

  const [isSimulationRunning, setIsSimulationRunning] = useState(false);

  // Real-time data emission status of frontend
  // initially IDLE, can be ACTIVE or THROTTLED when managing backpressure
  const [emissionStatus, setEmissionStatus] = useState("IDLE");

  // for maintaining avg txn processing tim
  const [settledTxnCount, setSettledTxnCount] = useState(0);

  const simulationStartTimeRef = useRef(null);
  const [systemThroughput, setSystemThroughput] = useState(0);


  // CENTRALIZED REAL-TIME TELEMETRY LOG ROUTER
  const appendSimulationLog = (type, logItem) => {
    // 1. Unconditionally push to raw array logs state
    setRawLogs((prev) => [...prev, { ...logItem, appTimestamp: Date.now() }]);

    console.log("LOG RECEIVED");

    // 2. Route payload to designated individual state buckets
    switch (type) {
      case "APPROVED_TXN":
        setApprovedTxnLogs((prev) => [...prev, logItem]);
        break;
      case "REJECTED_TXN":
        setRejectedTxnLogs((prev) => [...prev, logItem]);
        break;
      case "DUPLICATE_TXN":
        setDuplicateTxnLogs((prev) => [...prev, logItem]);
        break;
      case "REDIS_CACHE_MISS":
        setCacheMissLogs((prev) => [...prev, logItem]);
        break;
      case "WATCHDOG_RUNNING":
        // If simulation ends, ignore watchdog running messages
        if(hasLoggedSummaryRef.current === true) return;
        setWatchDogLogs((prev) => [...prev, logItem]);
        break;
      default:
        console.log("Intercepted unrecognized logging envelope parameter:", logItem);
    }
  };

  // AUTOMATED SIMULATION COMPLETION LIFECYCLE EVALUATOR
  useEffect(() => {
    const expectedCount = expectedTxnTotalRef.current;
    if (expectedCount === 0 || hasLoggedSummaryRef.current) return;

    // Collect all unique txnIds that reached a final terminal status definition
    const uniqueResolvedIds = new Set([
      ...approvedTxnLogs.map(log => log.txnId),
      ...rejectedTxnLogs.map(log => log.txnId),
      ...duplicateTxnLogs.map(log => log.txnId)
    ].filter(Boolean));

    // update current processed txns count
    setProcessedTxnToal(uniqueResolvedIds.size);

    // When unique resolved matches what we generated and emitted, execute completion printouts
    if (uniqueResolvedIds.size >= expectedCount) {
      hasLoggedSummaryRef.current = true; // Block subsequent redundant logs from out-of-order stragglers

      // Stop the watchdog daemon since all transactions have been successfully resolved
      if (watchdogIntervalRef.current) {
        clearInterval(watchdogIntervalRef.current);
        watchdogIntervalRef.current = null;
      }

      console.log("-".repeat(20));
      console.log(
        "%c[Warden Simulation Engine] Pass Completed! Compiling Final Analytics Matrix Summary:", 
        "color: #10b981; font-weight: bold; font-size: 14px;"
      );
      console.log("Total Emitted Target Transactions :", expectedCount);
      console.log("Total Approved Transactions Logs  :", approvedTxnLogs);
      console.log("Total Rejected Transactions Logs  :", rejectedTxnLogs);
      console.log("Total Duplicate Transactions Logs :", duplicateTxnLogs);
      console.log("Total Redis Cache Misses Logs     :", cacheMissLogs);
      console.log("Full Comprehensive Combined StreamLogs :", rawLogs);
      console.log("-".repeat(20));

      alert("Simulation Complete!")
    }
  }, [approvedTxnLogs, rejectedTxnLogs, duplicateTxnLogs, cacheMissLogs, rawLogs, watchDogLogs, totalFraudGenerated, averageLatency]);
  

  // NETWORKING INFRASTRUCTURE (WITH INDEPENDENT RETRY CONTROLLERS)
  useEffect(() => {
    let trainingRetryCount = 0;
    let liveRetryCount = 0;
    const MAX_RETRIES = 3;
    let isCurrentEffect = true;

    // --- CHANNEL A RUNTIME PIPELINE ---
    const connectTrainingWebSocket = () => {
      if (!isCurrentEffect) return;

      console.log("Attempting Training Bulk Ingestion Protocol Buffer WebSocket connection");
      const socket = new WebSocket("ws://localhost:8080/ws/transactions-binary-ingest");
      socket.binaryType = "arraybuffer";

      socket.onopen = () => {
        if (!isCurrentEffect) {
          socket.close();
          return;
        }
        console.log("Training Bulk Ingestion Binary WebSocket connection established");
        setWsConnected(true);
        wsRef.current = socket;
        if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      };

      socket.onclose = (event) => {
        if (!isCurrentEffect) return;
        setWsConnected(false);
        wsRef.current = null;

        if (trainingRetryCount < MAX_RETRIES) {
          trainingRetryCount++;
          console.log(`Training WebSocket closed (Code: ${event.code}). Retrying (${trainingRetryCount}/${MAX_RETRIES}) in 2 seconds.`);
          reconnectTimeoutRef.current = setTimeout(connectTrainingWebSocket, 2000);
        } else {
          console.warn("Max Training Connection Retries Reached. Automatic reconnect disabled.");
        }
      };

      socket.onerror = (error) => {
        console.error("Training WebSocket fault intercept:", error);
        socket.close();
      };
    };

    // Background engine to drain the queue smoothly
    const triggerVisualQueueDrain = () => {
      if (isProcessingQueueRef.current) return;
      isProcessingQueueRef.current = true;

      const processNextVisualLog = () => {
        if (!isCurrentEffect || uiRenderQueueRef.current.length === 0) {
          isProcessingQueueRef.current = false;
          return;
        }

        // Dequeue oldest log line item
        const nextLog = uiRenderQueueRef.current.shift();
        appendSimulationLog(nextLog.type, nextLog);

        // STAGGER DELAY TIMING: 80ms
        setTimeout(processNextVisualLog, 90);
      };

      processNextVisualLog();
    };

    // --- CHANNEL B RUNTIME PIPELINE ---
    const connectLiveWebSocket = () => {
      if (!isCurrentEffect) return;

      console.log("Attempting Live Production Simulation WebSocket connection");
      const socket = new WebSocket("ws://localhost:8080/ws/live-simulation-ingest");
      socket.binaryType = "arraybuffer";

      socket.onopen = () => {
        if (!isCurrentEffect) {
          socket.close();
          return;
        }
        console.log("Live Production Simulation Binary WebSocket connection established");
        setLiveWsConnected(true);
        liveWsRef.current = socket;
        if (liveReconnectTimeoutRef.current) clearTimeout(liveReconnectTimeoutRef.current);
      };

      socket.onmessage = (event) => {
        try {
          // Parse the incoming text frame
          const messageData = JSON.parse(event.data);
          
          if (messageData.type) {
            //console.log("[Warden Core Analytics] Real-time transaction verdict received from ML service:");

            messageData.arrivalHeaderTime = new Date().toTimeString().slice(0, 8); // Format: "HH:MM:SS"

            // SIMULATION ENDED CONDITION: FILTER GLOBAL BACKGROUND PULSES
            if (messageData.type === "WATCHDOG_RUNNING") {
              const isSimulationInactive = expectedTxnTotalRef.current === 0 || hasLoggedSummaryRef.current === true;
              
              if (isSimulationInactive) {
                // Drop the background pulse silently since no active simulation is rendering
                console.log("------ IGNORED 'WATCHDOG_RUNNING' LOG -------");
                return;   
              }
            }

            // HANDLE DATABASE PERSISTENCE ACKNOWLEDGEMENTS
            if (messageData.type === "TXN_ACK") {
              if (flightRegistryRef.current[messageData.txnId]) {
                // Securely mark the item as backed up in PostgreSQL
                flightRegistryRef.current[messageData.txnId].acknowledged = true;
              }
              //appendSimulationLog("TXN_ACK", messageData);
              console.log(`TXN_ACK recevied for: ${messageData.txnId}`);
              return; // Halt message execution path early
            }

            // --- Normal Latency Tracking for Terminal Verdicts ---
            if (messageData.txnId && flightRegistryRef.current[messageData.txnId]) {
              const trackingNode = flightRegistryRef.current[messageData.txnId];
              
              if (!trackingNode.processed) {
                trackingNode.processed = true;
                const roundTripDurationMs = performance.now() - trackingNode.emittedAt;
                
                // Calculate total elapsed seconds since simulation start
                const totalElapsedSeconds = (performance.now() - simulationStartTimeRef.current) / 1000;
                
                setSettledTxnCount((prevCount) => {
                  const nextCount = prevCount + 1;
                  
                  if (totalElapsedSeconds > 0) {
                    // Throughput Formula: Total Items Settled / Total Elapsed Runtime Seconds
                    setSystemThroughput(nextCount / totalElapsedSeconds);
                  }

                  // Standard Cumulative Average for individual RTT
                  setAverageLatency((prevAvg) => {
                    if (prevAvg === 0) return roundTripDurationMs;
                    return prevAvg + ((roundTripDurationMs - prevAvg) / nextCount);
                  });
                  
                  return nextCount;
                });

                // // Update the counter and compute a clean, simple cumulative mathematical average
                // setSettledTxnCount((prevCount) => {
                //   const nextCount = prevCount + 1;
                //   setAverageLatency((prevAvg) => {
                //     if (prevAvg === 0) return roundTripDurationMs;
                //     // Simple Cumulative Average Formula: (Prior Total + Current Value) / Next Total Count
                //     return prevAvg + ((roundTripDurationMs - prevAvg) / nextCount);
                //   });
                //   return nextCount;
                // });

                // setAverageLatency((prevAvg) => {
                //   if (prevAvg === 0) return roundTripDurationMs;
                //   return (prevAvg * 0.9) + (roundTripDurationMs * 0.1);
                // });
              }
            }

            //appendSimulationLog(messageData.type, messageData);
            // Push payload down to our safe buffer queue and trigger trickle drain passes
            uiRenderQueueRef.current.push(messageData);
            triggerVisualQueueDrain();
          }
        } catch (fault) {
          // Catches any alternative log updates flowing across text frames smoothly
          console.error("Failure intercepting real-time streaming event metadata:", fault);
        }
      };

      socket.onclose = (event) => {
        if (!isCurrentEffect) return;
        setLiveWsConnected(false);
        liveWsRef.current = null;

        if (liveRetryCount < MAX_RETRIES) {
          liveRetryCount++;
          console.log(`Live Simulation WebSocket closed (Code: ${event.code}). Retrying (${liveRetryCount}/${MAX_RETRIES}) in 2 seconds.`);
          liveReconnectTimeoutRef.current = setTimeout(connectLiveWebSocket, 2000);
        } else {
          console.warn("Max Live Simulation Connection Retries Reached. Automatic reconnect disabled.");
        }
      };

      socket.onerror = (error) => {
        console.error("Live Simulation WebSocket fault intercept:", error);
        socket.close();
      };
    };

    // Spark both separate background connection flows simultaneously
    //connectTrainingWebSocket();
    connectLiveWebSocket();

    // Clean teardown lifecycle loop mapping to shield against state leakages on hot-reloads
    return () => {
      isCurrentEffect = false;
      //if (wsRef.current) wsRef.current.close();
      if (liveWsRef.current) liveWsRef.current.close();
      //if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (liveReconnectTimeoutRef.current) clearTimeout(liveReconnectTimeoutRef.current);
      if (watchdogIntervalRef.current) clearInterval(watchdogIntervalRef.current);
    };
  }, []);


  const changeTab = (newTab) => {
    // newTab is a string among - Data Table, Feature Analytics, Model Insights
    setSelectedTab(newTab);
  }

  // this will be fetched fresh from DB to generate good data
  const [usersData, setUsersData] = useState({});

  // this the the array of objects of transactions data generated from here
  const [transactionsData, setTransactionsData] = useState({});
  // these are fullnames generated in generateUsersData function
  let fullNames = [];

  // here will be the used Ids of users whose transaction data has been generated
  // the obj has this form - "userId" : count, where count can be at max 2
  // stating that, for a particular user, we might have 2 transactions in the same simululation
  // the txns might depict high velocity, duplicate transcations, kind of patterns
  let usedUserIds = {};

  // function that utilizes all others in TransactionsDataGenertaion.js 
  // and generates transactions data
  const generateTransactionsData = (usersData, rowCount) => {
    // using usersData, rowCount as param

    if (!Number.isInteger(rowCount)) return;
    if (Object.entries(usersData).length < 1) return;

    // this fucntion runs after generateUsersData has finished, so useres data is there
    // user names  are there, and we can traverse on that

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

    const N = rowCount;
    // this local obj is updated with transactions genertead, at the end, transactionsData state
    // is updated
    let transactions = {};

    // getting all userIds from usersData obj
    let userIds = Object.keys(usersData);

    for(let k = 0; k < N; k++) {

      const selectedUserId = userIds[k];
      let userObj = usersData[selectedUserId];

      if(!userObj) continue;

      const generatedTxnAmt = generateTxnAmt(userObj.meanTxn30d, userObj.stdDevTxn, userObj.accType, userObj.accAge);

      const lastTxnCountry = cityToCountry[userObj.lastTxnCity];

      // generateTxnTime function actually generates time, localHour, and txnCity as well
      // because all those are very tightly related

      const generatedTxnTimeObj = generateTxnTime(generatedTxnAmt, userObj.accType, userObj.meanTxn30d, 
        userObj.stdDevTxn, userObj.lastTxnLat, userObj.lastTxnLon, lastTxnCountry,
        userObj.lastTxnTime);

      const txnCity = generatedTxnTimeObj.txnCity || userObj.lastTxnCity;
      const txnCountry = cityToCountry[txnCity] || userObj.homeCountry;
      const locationHopStatus = generatedTxnTimeObj.locationHopStatus || null;

      const generatedMerchantType = generateMerchantType(
        generatedTxnAmt, userObj.accType, userObj.meanTxn30d, userObj.stdDevTxn,
        generatedTxnTimeObj.localHour, userObj.flaggedTxns
      );

      const generatedDeviceId = generateDeviceId(
        userObj.primaryDeviceId, generatedTxnAmt, generatedTxnTimeObj.localHour,
        userObj.meanTxn30d, userObj.stdDevTxn, userObj.accType, 
        generatedMerchantType, userObj.flaggedTxns
      );

      // THESE BELOW FEATURES ARE GENERATED FOR TRAINING PURPOSES ONLY
      // for simulation, these are feature engineered in Spring Boot service using
      // users Data from Postgres
      const geoDistanceKm = round(computeHaversineDistance(
        userObj.lastTxnLat,
        userObj.lastTxnLon,
        cityCoords[txnCity][0],
        cityCoords[txnCity][1]
      ), 2);

      // Compute temporal deltas or time gaps in seconds and hours,
      const timeGapSeconds = Math.abs(userObj.lastTxnTime - generatedTxnTimeObj.utcTimestamp) / 1000;
      const timeGapHours = round(timeGapSeconds / 3600, 2);

      // Computing speed in KMH
      const speedKmh = timeGapHours > 0 ? round(geoDistanceKm / timeGapHours, 2) : 0;

      // High velocity txn classification
      const highTxnVelocity = timeGapSeconds <= 90;  // under 1.5 mins from previous txn

      // User ATV Delta
      let userAtvDelta = Math.abs(generatedTxnAmt - userObj.meanTxn30d) / (userObj.stdDevTxn || 1);
      userAtvDelta = round(userAtvDelta, 2);

      let transactionObj = {
        txnId: crypto.randomUUID(),
        txnAmt: generatedTxnAmt,
        txnTime: generatedTxnTimeObj.localTime24hStr,
        txnTimeUTC: generatedTxnTimeObj.utcTimestamp,
        txnTimeLocalHour: generatedTxnTimeObj.localHour,
        txnTimeObj: generatedTxnTimeObj,
        txnCountry: txnCountry,
        txnLat: txnCity ? cityCoords[txnCity][0] : null,
        txnLon: txnCity ? cityCoords[txnCity][1] : null,
        merchantType: generatedMerchantType,
        deviceId: generatedDeviceId,

        // ON THE FLY ENGINEERED FEATURES, ONLY USED FOR TRAINING PURPOSE
        // COMPUTED IN SPRING BOOT SERVICE WHILE SIMULATION
        geoDistanceKm: geoDistanceKm,
        timeGapLastTxn: round(timeGapSeconds, 2),
        speedKmh: speedKmh,
        highTxnVelocity: highTxnVelocity,
        isAbnormalTime: generatedTxnTimeObj.localHour >= 23 || generatedTxnTimeObj.localHour <= 4,
        userAtvDelta: userAtvDelta,
        isNewDevice: generatedDeviceId !== userObj.primaryDeviceId,
        geoCountryMismatch: txnCountry === lastTxnCountry ? false : true,
        locationHop: generatedTxnTimeObj.locationHopStatus,

        // User properties as it is
        flaggedTxns: userObj.flaggedTxns,
        accType: userObj.accType,
        accAge: userObj.accAge,
        lastTxnCountry: lastTxnCountry
      }

      transactionObj.fraudScore = calculateFraudScore(transactionObj, userObj);

      transactions[selectedUserId] = transactionObj;
    }
    
    //setTransactionsData(transactions);

    return transactions;
  }

  // generating the user data here that will be in the DB
  // this function utilizes all the functions in UsersDataGeneration.js
  const generateUsersData = (rowCount) => {

    const N = Math.floor(rowCount * 1.25);

    // generate full names first
    fullNames = generateUniqueFullNames(N);

    // id, name, accType, lastTxnTime, lastTxnLat, lastTxnLon, lastTxnCity, homeCountry, accaccAge,
    // monthlyAvgTxn, stdDevTxn, primaryDeviceId
    let users = {};
    // const accTypes = ["STUDENT", "STANDARD", "PREMIUM", "BUSINESS"];
    const cities = Object.keys(cityCoords);  // arr of all city names

    const startTime = new Date("2026-01-01T00:00:00Z").getTime();
    const now = Date.now();  // try time in past here as well

    // taking input parameter N and generating N objects with these properties
    for(let k = 0; k < N; k++) {

      // calling generate functions for various fields here
      const generatedAccAge = generateAccAge();
      const generatedAccType = generateAccType(generatedAccAge);

      const city = cities[Math.floor(Math.random() * cities.length)];

      // this function relies on accAge, accType that is generated for the user
      // older accounts tend to have more stable monthlyavg and stdDev
      // newer accounts, might have it not stable, very high or very low
      // also monthlyAvg depens a lot on accType, for business and preimum acccounts
      // its almost always high, and very low for student accounts
      const generatedMeanTxn30d = generateMeanTxn30d(generatedAccType, generatedAccAge);

      const generatedStdDevTxn = generateStdDevTxn(generatedAccType, generatedMeanTxn30d);

      const generatedFlaggedTxns = generateFlaggedTxns(generatedAccType, generatedAccAge);

      const generatedLastTxnCityAndHomeCountry = generateLastTxnCityAndHomeCountry();
      const generatedLastTxnTime = generateLastTxnTime(generatedLastTxnCityAndHomeCountry.lastTxnCity, 
        generatedAccType
      );

      const lastTxnCity = generatedLastTxnCityAndHomeCountry?.lastTxnCity || null;
      const homeCountry = generatedLastTxnCityAndHomeCountry?.homeCountry || null;

      const userObj = {
        name: fullNames[k],
        accType: generatedAccType,
        lastTxnTimeLocalHour: generatedLastTxnTime.localHour,
        lastTxnTime: generatedLastTxnTime.utcTimestamp,  // this is UTC Timestamp
        lastTxnLat: lastTxnCity ? cityCoords[lastTxnCity][0] : null,
        lastTxnLon: lastTxnCity ? cityCoords[lastTxnCity][1] : null,
        lastTxnCity: lastTxnCity,
        homeCountry: homeCountry,
        meanTxn30d: generatedMeanTxn30d,
        stdDevTxn: generatedStdDevTxn,
        flaggedTxns: generatedFlaggedTxns,
        //accAge: Math.floor(Math.random() * 48),
        accAge: generatedAccAge,
        primaryDeviceId: deviceIds[Math.floor(Math.random() * deviceIds.length)]
      }

      // userObj[id] = `U${k}`
      const ID = `U${k}`;

      // putting these in local users obj, with ID as key and rest of the obj
      // as the value
      users[ID] = userObj
    }

    // after all users are generated and objects are put to users object
    // we update the usersData state with this local users object
    //setUsersData(users);

    //setIsGeneratingData(false);

    // immediately return users obj to be used by generateTransactionsData function
    return users;
  };

  const handleGenerateData = () => {
    if (!isStrictInteger(dataRowCount)) {
      alert("Invalid Row Count!");
      return;
    }
    setIsGeneratingData(true);
    
    setTimeout(() => {
      // Use locally stored usersData that were fetched from DB
      const freshTransactions = generateTransactionsFromDbPool(usersData, Number(dataRowCount));
      setTransactionsData(freshTransactions);
      setIsGeneratingData(false);

      setDataRowCount("");
    }, 1000);
  };

  const [chaosInjected, setChaosInjected] = useState(0);

  // Batch retry watchdog
  const launchFrontendRetryWatchdog = () => {
    if (watchdogIntervalRef.current) clearInterval(watchdogIntervalRef.current);

    watchdogIntervalRef.current = setInterval(() => {
      const now = performance.now();
      const EnvelopeProtoClass = org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto;
      
      const flightKeys = Object.keys(flightRegistryRef.current);
      if (flightKeys.length === 0) return;

      // 1. Gather ALL currently expired transactions into a local collection pool
      const expiredTxnNodes = [];
      const chaosInjectedNodes = []; // for simulating duplication/idempotency/retry

      for (let i = 0; i < flightKeys.length; i++) {
        const txnId = flightKeys[i];
        const flightNode = flightRegistryRef.current[txnId];
        
        if (flightNode) {

          if (!flightNode.acknowledged && (now - flightNode.emittedAt) > 10000) {
            expiredTxnNodes.push(flightNode);
          }

          // CHAOS INJECTION PATH: Artificial duplication simulator
          // Target transactions that are safely in the DB but still awaiting ML inference
          else if (flightNode.acknowledged && !flightNode.processed) {
            // Roll a 2.5% chance per sweep to clone this transaction node for the demo
            // Cap it at 2 transactions per sweep to avoid flooding the system
            if (Math.random() < 0.002 && chaosInjectedNodes.length < 2) {
              chaosInjectedNodes.push(flightNode);
              setChaosInjected((prevValue) => prevValue + 1);
            }
          }
        }
      }

      // Combine both real timeouts and artificial duplicate injections into the transmission pool
      const totalNodesToRetry = [...expiredTxnNodes, ...chaosInjectedNodes];
      if (totalNodesToRetry.length === 0) return;

      if (chaosInjectedNodes.length > 0) {
        console.warn(`🌀 [Chaos Engine] Selecting ${chaosInjectedNodes.length} acknowledged transactions to resend and test idempotency tracking.`);
      }

      console.warn(`[Watchdog Daemon] Detected ${expiredTxnNodes.length} stale transactions. Batching retries to preserve backend performance...`);

      // 2. Re-transmit expired entries in structured chunks of 40 to leverage bulk operations
      const retryBatchSize = 5;
      for (let i = 0; i < expiredTxnNodes.length; i += retryBatchSize) {
        const chunkSlice = expiredTxnNodes.slice(i, i + retryBatchSize);
        
        // Update timestamps and log arrays immediately before shipping
        chunkSlice.forEach(node => {
          //appendSimulationLog("WATCHDOG_RUNNING", { txnId: node.rawTxn.txnId, type: "WATCHDOG_RUNNING" });
          node.emittedAt = performance.now(); // Reset baseline age clock
        });

        const retryPayload = {
          chunkSize: chunkSlice.length,
          isLastChunk: false,
          payload: chunkSlice.map(node => ({
            userId: Number(node.rawTxn.userId),
            txnId: node.rawTxn.txnId,
            txnAmt: Math.floor(node.rawTxn.txnAmt),
            txnTimeUTC: node.rawTxn.txnTimeUTC,
            txnTimeLocalHour: node.rawTxn.txnTimeLocalHour,
            txnLat: parseFloat(node.rawTxn.txnLat),
            txnLon: parseFloat(node.rawTxn.txnLon),
            txnCountry: node.rawTxn.txnCountry,
            merchantType: node.rawTxn.merchantType,
            deviceId: node.rawTxn.deviceId
          }))
        };

        try {
          const protoMessage = EnvelopeProtoClass.create(retryPayload);
          const binaryBuffer = EnvelopeProtoClass.encode(protoMessage).finish();
          
          // Send the grouped batch as a single network packet
          liveWsRef.current.send(binaryBuffer);
        } catch (err) {
          console.error("Watchdog batch retry serialization failure:", err);
        }
      }
    }, 5000); 
  };

  const startSimulation = () => {
    if (isSimulationRunning) return;
    if (isGeneratingData) return;
    if (Object.keys(usersData).length === 0) return;
    
    const transactionList = Object.values(transactionsData);
    if (transactionList.length === 0) {
      alert("No transaction data found to simulate.");
      return;
    }

    if (!liveWsRef.current || liveWsRef.current.readyState !== WebSocket.OPEN) {
      alert("Live Simulation Socket connection is offline.");
      return;
    }

    setSelectedTab("Model Insights");

    // RESET FLUSH ALL ARRAYS AND SET TARGET FLAGS FOR NEW SIMULATION RUN
    setRawLogs([]);
    setApprovedTxnLogs([]);
    setRejectedTxnLogs([]);
    setDuplicateTxnLogs([]);
    setCacheMissLogs([]);
    setWatchDogLogs([]);
    hasLoggedSummaryRef.current = false;

    // Purge in-memory processing queues completely
    uiRenderQueueRef.current = [];
    isProcessingQueueRef.current = false;

    // Clear and reset the tracking registry hashmap
    flightRegistryRef.current = {};
    hasLoggedSummaryRef.current = false;
    expectedTxnTotalRef.current = transactionList.length;

    // Calculate baseline synthetic fraud generated within this batch
    const initialFraudCount = transactionList.filter(txn => txn.fraudScore >= 0.8).length;
    setTotalFraudGenerated(initialFraudCount);

    console.log(`Streaming ${transactionList.length} visible transactions to Live Production pipeline...`);
    
    //setIsGeneratingData(true);
    setIsSimulationRunning(true);  // change simulation running state
    setEmissionStatus("ACTIVE");  // set emission status on start to ACTIVE
    setSettledTxnCount(0);
    simulationStartTimeRef.current = performance.now();
    setSystemThroughput(0);
    // Boot up our frontend retry loop daemon
    launchFrontendRetryWatchdog();

    const chunkSize = 10;
    let currentIdx = 0;
    const EnvelopeProtoClass = org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto;

    const dispatchNextSimulationChunk = () => {
      if (currentIdx >= transactionList.length) {
        //setIsGeneratingData(false);
        setIsSimulationRunning(false);
        setEmissionStatus("IDLE"); // reset pipeline status to IDLE when data emission over
        console.log("Live production simulation stream sequence completed.");
        return;
      }
   
      // CLOSED-LOOP REACTIVE BACKPRESSURE THROTTLE
      // Dynamically calculate how many items are currently processing in the backend pipeline
      const currentlyInFlight = Object.values(flightRegistryRef.current).filter(
        (node) => !node.processed
      ).length;

      // Allow up to 3x of chunk size to pipeline concurrently
      // This keeps the pipeline full but prevents queue runaways
      const MAX_ALLOWABLE_IN_FLIGHT = chunkSize * 3;

      if (currentlyInFlight > MAX_ALLOWABLE_IN_FLIGHT) {
        console.warn(`[Backpressure Throttle] Downstream pipeline saturated (${currentlyInFlight} txns in flight). Holding emission...`);
        
        setEmissionStatus("THROTTLED"); // signal that backpressure has paused emission
        // Pause and check the queue depth again in 1000ms instead of dumping data blindly
        setTimeout(dispatchNextSimulationChunk, 1000);
        return;
      }

      // If it passes the throttle gate, ensure status is marked ACTIVE
      setEmissionStatus("ACTIVE");

      const chunkSlice = transactionList.slice(currentIdx, currentIdx + chunkSize);
      const currentTimeStampMarker = performance.now();

      // Register the chunk's keys inside our flight container registry map
      chunkSlice.forEach((txn) => {
        flightRegistryRef.current[txn.txnId] = {
          emittedAt: currentTimeStampMarker,
          processed: false,
          acknowledged: false,
          rawTxn: txn
        };
      });
      
      const envelopePayload = {
        chunkSize: chunkSlice.length,
        isLastChunk: (currentIdx + chunkSize) >= transactionList.length,
        // MAP ONLY REQ RAW PARAMETERS FROM VISIBLE DATA STATE
        payload: chunkSlice.map(txn => ({
          userId: Number(txn.userId),
          txnId: txn.txnId,
          txnAmt: Math.floor(txn.txnAmt),
          txnTimeUTC: txn.txnTimeUTC,
          txnTimeLocalHour: txn.txnTimeLocalHour,
          txnLat: parseFloat(txn.txnLat),
          txnLon: parseFloat(txn.txnLon),
          txnCountry: txn.txnCountry,
          merchantType: txn.merchantType,
          deviceId: txn.deviceId
        }))
      };

      try {
        const runtimeMessage = EnvelopeProtoClass.create(envelopePayload);
        const binaryBuffer = EnvelopeProtoClass.encode(runtimeMessage).finish();
        
        liveWsRef.current.send(binaryBuffer);
        
        currentIdx += chunkSize;

        // 2000ms, 2s delay between firing 2 chunks, preventing backpressure on backend service
        setTimeout(dispatchNextSimulationChunk, 2000);

        console.log(`Sending ProtoBuf Objs in chunks of size: ${chunkSize}`);
      } catch (fault) {
        console.error("Protobuf Packaging Crash during simulation emit:", fault);
        //setIsGeneratingData(false);
        setIsSimulationRunning(false);
        setEmissionStatus("IDLE");  // put default state on Error
      }
    };

    dispatchNextSimulationChunk();

    // ALL DATA SENT
  };

  // function to seed 8k-10k base users 
  const triggerDatabaseBaselineSeeding = async () => {
    const totalSeedTargets = 8000;
    const simulatedSeedingPool = generateUsersDataBaseline(totalSeedTargets);
    const flatSeedArray = Object.values(simulatedSeedingPool);

    try {
      console.log(`Seeding ${totalSeedTargets} users data to spring boot service...`);
      const response = await fetch("http://localhost:8080/api/v1/add-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(flatSeedArray)
      });

      const data = await response.json();
      alert(`Database seeded successfully: ${data.message}`);
      //window.location.reload(); // Refresh to populate main state
    } catch (err) {
      console.error("Seeding crashed:", err);
    }
  };

  // PROTOBUF STREAM DISPATCH
  // THIS IS FOR TRAINING THE MODEL
  const streamProtoTransactionsInChunks = (data) => {

    const chunkSize = 50

    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.error("Aborting execution: Channel is offline.");
      return;
    }

    const transactionList = Object.values(data);
    const totalRecords = transactionList.length;
    let index = 0;

    const EnvelopeMessageClass = org.example.springbootbackend.model.TransactionChunkEnvelopeProto;
    console.log(`Streaming ${totalRecords} records over Protocol Buffers...`);

    const sendNextProtoChunk = () => {
      if (index >= totalRecords) {
        console.log("Ingestion streaming finished.");
        return;
      }

      const chunkSlice = transactionList.slice(index, index + chunkSize);

      console.log("Sending chunk of size: ", chunkSlice.length);
      
      const envelopePayload = {
        chunkSize: chunkSlice.length,
        isLastChunk: (index + chunkSize) >= totalRecords,
        payload: chunkSlice.map((txn, offset) => {
          const numericUserId = txn.userId ? txn.userId.replace(/[^0-9]/g, "") : "0";
          return {
            txnId: txn.txnId, 
            //userId: txn.userId,  // NOT NEEDED FOR TRAINING
            accType: txn.accType,
            accAge: txn.accAge,
            flaggedTxns: txn.flaggedTxns,
            merchantType: txn.merchantType,
            txnAmt: Math.floor(txn.txnAmt),
            txnTimeUTC: txn.txnTimeUTC,
            txnTimeLocalHour: txn.txnTimeLocalHour,
            txnCountry: txn.txnCountry,
            txnLat: txn.txnLat,
            txnLon: txn.txnLon,
            deviceId: txn.deviceId,
            geoDistanceKm: Math.floor(txn.geoDistanceKm),
            timeGapLastTxn: Math.floor(txn.timeGapLastTxn),
            speedKmh: Math.floor(txn.speedKmh),
            highTxnVelocity: txn.highTxnVelocity,
            isAbnormalTime: txn.isAbnormalTime,
            userAtvDelta: parseFloat(txn.userAtvDelta),
            isNewDevice: txn.isNewDevice,
            geoCountryMismatch: txn.geoCountryMismatch,
            locationHop: txn.locationHop,
            fraudScore: parseFloat(txn.fraudScore)
          };
        })
      };

      try {
        const runtimeMessage = EnvelopeMessageClass.create(envelopePayload);
        const serializedBuffer = EnvelopeMessageClass.encode(runtimeMessage).finish();

        wsRef.current.send(serializedBuffer);
        index += chunkSize;
        setTimeout(sendNextProtoChunk, 100);
      } catch (fault) {
        console.error("Protobuf error:", fault);
        return;
      }
    };

    sendNextProtoChunk();
  };

  // MANUAL BUTTON TRIGGER: FLUSH DATA TO PROTOBUF PIPELINE
  const handleStreamDataToBackend = () => {

    //console.log("transactionList: ", Object.values(transactionsData));

    // Guard 1: Verify the physical WebSocket channel is active and open
    if (!wsConnected || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.error("Transmission Blocked: WebSocket connection is currently offline.");
      alert("Cannot send data: Backend connection is offline.");
      return;
    }

    // Guard 2: Verify there is actually generated data inside state to transmit
    const totalRecords = Object.keys(transactionsData).length;
    if (totalRecords === 0) {
      console.warn("Transmission Aborted: No transaction data found to stream.");
      alert("Transaction dataset is empty.");
      return;
    }

    console.log(`Manual Trigger Fired: Handing off ${totalRecords} records to the Protobuf Streaming engine.`);
    
    // Launch the streaming process with a high-throughput chunk window size of 300
    streamProtoTransactionsInChunks(transactionsData);
  };

  if (isAppLoading) {
    return(
      <div className="loading-page">
        <div id="page-header">
          <p>Warden</p>
        </div>
        <div className="loading-msg">
          <div className="loading-spinner"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="App">
      <div id="page-header">
        <p>Warden</p>
        {/* <button onClick={() => {
          console.log("Approved Logs Array:", approvedTxnLogs);
          console.log("Rejected Logs Array:", rejectedTxnLogs);
          console.log("Duplicate Logs Array:", duplicateTxnLogs);
          console.log("Cache Miss Logs Array:", cacheMissLogs);
        }}>
          Log Results
        </button>
        <button onClick={triggerDatabaseBaselineSeeding}>
          Insert Users
        </button>
        <button onClick={handleStreamDataToBackend}>
          Send TxnData
        </button> */}
      </div>
      <div id="data-generation-section">
        <input id="no-of-transactions"
        placeholder="Data Row Count" 
        value={dataRowCount} onChange={(e) => setDataRowCount(e.target.value)}
        />
        <button id="generate-data-btn"
        onClick={handleGenerateData}
        disabled={isSimulationRunning}>
          {isGeneratingData ? "Generating..." : "Generate data"}
        </button>
        <button id="simulate-btn" 
        disabled={Object.entries(transactionsData).length === 0 || !liveWsConnected}
        onClick={startSimulation}>
          {isSimulationRunning ? "Simulation Active..." : "Simulate"}
        </button>
      </div>

      <div id="tab-menu">
        <div className={selectedTab === "Data Table" ? "tab-option-selected" : "tab-option"}
        onClick={() => changeTab("Data Table")}>
          <span className="material-symbols-outlined">table</span>
          <p>Data Table</p>
        </div>
        <div className={selectedTab === "Feature Analytics" ? "tab-option-selected" : "tab-option"}
        onClick={() => changeTab("Feature Analytics")}>
          <span className="material-symbols-outlined">analytics</span>
          <p>Feature Analytics</p>
        </div>
        <div className={selectedTab === "Model Insights" ? "tab-option-selected" : "tab-option"}
        onClick={() => changeTab("Model Insights")}>
          <span className="material-symbols-outlined">table_chart_view</span>
          {/* <p>Model Insights</p> */}
          {/* Renaming tab to 'Observability'*/}
          <p>Observability</p>
        </div>
      </div>
      {
        (selectedTab === "Data Table" && mode === "users") && 
        <UsersDataTable usersData={usersData} />
      }
      {
        (selectedTab === "Data Table" && mode === "transactions") &&
        <TransactionsDataTable transactionsData={transactionsData} />
      }
      {
        (selectedTab === "Feature Analytics" && mode === "users") && 
        <UsersFeatureAnalytics usersData={usersData} />
      }
      {
        (selectedTab === "Feature Analytics" && mode === "transactions") &&
        <TransactionsFeatureAnalytics transactionsData={transactionsData} usersData={usersData} />
      }
      {
        selectedTab === "Model Insights" &&
        <ModelInsights rawLogs={rawLogs} approvedTxnLogs={approvedTxnLogs} rejectedTxnLogs={rejectedTxnLogs}
        duplicateTxnLogs={duplicateTxnLogs} cacheMissLogs={cacheMissLogs}
        watchDogLogs={watchDogLogs} processedTxnTotal={processedTxnTotal}
        emissionStatus={emissionStatus} averageLatency={averageLatency} />
      }
    </div>
  );
}

export default App;
