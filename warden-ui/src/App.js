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
import { generateTransactionsFromDbPool, generateUsersDataBaseline } from "./services/simulationEngine";


function App() {

  const [selectedTab, setSelectedTab] = useState("Data Table");  // Data Table, Feature Analytics or Model Insights
  const [mode, setMode] = useState("transactions")  // users or transactions

  const [dataRowCount, setDataRowCount] = useState(""); // will be converted to INT before use
  let intRowCount = 0;
  const [isGeneratingData, setIsGeneratingData] = useState(false);
  const [isAppLoading, setIsAppLoading] = useState(true);

  // WebSocket Connection States
  const wsRef = useRef(null);
  const [wsConnected, setWsConnected] = useState(false);
  const reconnectTimeoutRef = useRef(null);

  // LIFECYCLE PHASE 1: INITIAL COMPONENT DB SYNCHRONIZATION
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
        }, 500);
      }
    };

    fetchUsersPoolFromDatabase();
  }, []);
  

  useEffect(() => {

    let retryCount = 0;
    let MAX_RETRIES = 3;

    let isCurrentEffect = true;

    const connectWebSocket = () => {

      // if this effect block has been cancelled by an unmount, abort immediately
      if(!isCurrentEffect) return;

      console.log("Attempting Protocol Buffer WebSocket connection");
      const socket = new WebSocket("ws://localhost:8080/ws/transactions-binary-ingest");
      socket.binaryType = "arraybuffer";

      socket.onopen = () => {

        if(!isCurrentEffect) {
          socket.close();
          return;
        }

        console.log("Binary WebSocket connection established");

        setWsConnected(true);
        wsRef.current = socket;
        if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      };

      socket.onclose = (event) => {

        if(!isCurrentEffect) return;

        setWsConnected(false);
        wsRef.current = null;

        if(retryCount < MAX_RETRIES) {
          retryCount++;
          console.log(`Binary WebSocket closed (Code: ${event.code}). Retrying in 2 seconds.`);

          // call connectWebSocket function after 2 seconds, we could also use exponential backoff
          // rather than fixed 2-3 second time
          reconnectTimeoutRef.current = setTimeout(connectWebSocket, 2000);
        }
        else {
          console.log("Max Connection Retries Reached. Not Retrying.")
        }
      };

      socket.onerror = (error) => {
        console.error("WebSocket fault:", error);
        socket.close();
      };
    };

    connectWebSocket();

    return () => {
      isCurrentEffect = false;
      if (wsRef.current) wsRef.current.close();
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
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

  const startSimulation = () => {

    if (isGeneratingData) return;
    if (Object.entries(usersData).length === 0) return;
    if (Object.entries(transactionsData).length === 0) return;

    console.log("Starting simulation");
  }

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
        <button onClick={triggerDatabaseBaselineSeeding}>
          Insert Users
        </button>
        <button onClick={handleStreamDataToBackend}>
          Send TxnData
        </button>
      </div>
      <div id="data-generation-section">
        <input id="no-of-transactions"
        placeholder="Data Row Count" 
        value={dataRowCount} onChange={(e) => setDataRowCount(e.target.value)}
        />
        <button id="generate-data-btn"
        onClick={handleGenerateData}>
          {isGeneratingData ? "Generating..." : "Generate data"}
        </button>
        <button id="simulate-btn" disabled={Object.entries(transactionsData).length === 0}
        onClick={startSimulation}>
          Simulate
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
          <p>Model Insights</p>
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
        <ModelInsights />
      }
    </div>
  );
}

export default App;
