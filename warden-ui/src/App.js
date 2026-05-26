import React, {useState, useEffect, useRef} from "react";
import './App.css';
import UsersDataTable from "./users/UsersDataTable";
import UsersFeatureAnalytics from "./users/UsersFeatureAnalytics";
import ModelInsights from "./ModelInsights";
import { bulkInserUsersData } from "./services/userService";
import { cityCoords, cityToCountry, deviceIds, firstNames, generateAccAge, generateAccType, generateFlaggedTxns, generateMeanTxn30d, generateStdDevTxn, generateUniqueFullNames, lastNames } from "./users/UsersDataGeneration";
import { buildDistanceMatrix, random, refinedNormalRandom, round } from "./utilities";
import TransactionsDataTable from "./transactions/TransactionsDataTable";
import TransactionsFeatureAnalytics from "./transactions/TransactionsFeatureAnalytics";
import { generateTxnAmt, generateTxnTime } from "./transactions/TransactionsDataGeneration";


function App() {

  const [selectedTab, setSelectedTab] = useState("Feature Analytics");  // Data Table, Feature Analytics or Model Insights
  const [mode, setMode] = useState("transactions")  // users or transactions

  const changeTab = (newTab) => {

    // newTab is a string among - Data Table, Feature Analytics, Model Insights

    setSelectedTab(newTab);
  }


  // this will be fetched fresh from DB to generate good data
  const [usersData, setUsersData] = useState({});

  // this the the array of objects of transactions data generated from here
  const [transactionsData, setTransactionsData] = useState({
    "U001": {
      userId: "U001",
      txnAmt: 220,
      txnCountry: "UK",
      txnTime: Date.now(),
      txnLat: cityCoords["Glasgow"][0],
      txnLon: cityCoords["Glasgow"][1],
      copyPastedCardNo: false,
      merchantType: "LUXURY",
      deviceId: deviceIds[Math.floor(Math.random() * deviceIds.length)]
    },
    "U009": {
      userId: "U009",
      txnAmt: 95,
      txnCountry: "US",
      txnTime: Date.now(),
      txnLat: cityCoords["Bellevue"][0],
      txnLon: cityCoords["Bellevue"][1],
      copyPastedCardNo: false,
      merchantType: "GROCERY",
      deviceId: deviceIds[Math.floor(Math.random() * deviceIds.length)]
    },
    "U076": {
      userId: "U076",
      txnAmt: 435,
      txnCountry: "UAE",
      txnTime: Date.now(),
      txnLat: cityCoords["Dubai"][0],
      txnLon: cityCoords["Dubai"][1],
      copyPastedCardNo: false,
      merchantType: "TRAVEL",
      deviceId: deviceIds[Math.floor(Math.random() * deviceIds.length)]
    },
    "U056": {
      userId: "U056",
      txnAmt: 143,
      txnCountry: "India",
      txnTime: Date.now(),
      txnLat: cityCoords["Bangalore"][0],
      txnLon: cityCoords["Bangalore"][1],
      copyPastedCardNo: false,
      merchantType: "LUXURY",
      deviceId: deviceIds[Math.floor(Math.random() * deviceIds.length)]
    },
    "U245": {
      userId: "U245",
      txnAmt: 760,
      txnCountry: "Brazil",
      txnTime: Date.now(),
      txnLat: cityCoords["São Paulo"][0],
      txnLon: cityCoords["São Paulo"][1],
      copyPastedCardNo: true,
      merchantType: "CRYPTO",
      deviceId: deviceIds[Math.floor(Math.random() * deviceIds.length)]
    },
    "U196": {
      userId: "U196",
      txnAmt: 23,
      txnCountry: "Canada",
      txnTime: Date.now(),
      txnLat: cityCoords["Montreal"][0],
      txnLon: cityCoords["Montreal"][1],
      copyPastedCardNo: false,
      merchantType: "DIGITAL",
      deviceId: deviceIds[Math.floor(Math.random() * deviceIds.length)]
    },
    "U155": {
      userId: "U155",
      txnAmt: 150,
      txnCountry: "India",
      txnTime: Date.now(),
      txnLat: cityCoords["Kanpur"][0],
      txnLon: cityCoords["Kanpur"][1],
      copyPastedCardNo: false,
      merchantType: "CRYPTO",
      deviceId: deviceIds[Math.floor(Math.random() * deviceIds.length)]
    },
    "U566": {
      userId: "U566",
      txnAmt: 78,
      txnCountry: "Brazil",
      txnTime: Date.now(),
      txnLat: cityCoords["Salvador"][0],
      txnLon: cityCoords["Salvador"][1],
      copyPastedCardNo: false,
      merchantType: "GROCERY",
      deviceId: deviceIds[Math.floor(Math.random() * deviceIds.length)]
    }
  })

  // these are fullnames generated in generateUsersData function
  let fullNames = [];

  // here will be the used Ids of users whose transaction data has been generated
  // the obj has this form - "userId" : count, where count can be at max 2
  // stating that, for a particular user, we might have 2 transactions in the same simululation
  // the txns might depict high velocity, duplicate transcations, kind of patterns
  let usedUserIds = {};

  // function that utilizes all others in TransactionsDataGenertaion.js 
  // and generates transactions data
  const generateTransactionsData = () => {

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

    const MERCHANT_TYPES = ["GROCERY", "DIGITAL", "TRAVEL", "LUXURY", "CRYPTO"];

    const N = 250;
    // this local obj is updated with transactions genertead, at the end, transactionsData state
    // is updated
    let transactions = {};

    // getting all userIds from usersData obj
    let userIds = Object.keys(usersData);

    for(let k = 0; k < N; k++) {

      const selectedUserId = userIds[k];
      let userObj = usersData[selectedUserId];

      const generatedTxnAmt = generateTxnAmt(userObj.meanTxn30d, userObj.stdDevTxn, userObj.accType, userObj.accAge);
      const generatedTxnTimeObj = generateTxnTime(userObj.lastTxnCity);

      let transactionObj = {
        txnAmt: generatedTxnAmt,
        txnTime: generatedTxnTimeObj.localTime24hStr,
        txnTimeObj: generatedTxnTimeObj,
        txnCountry: cityToCountry[userObj.lastTxnCity],
        txnLat: cityCoords[userObj.lastTxnCity][0],
        txnLon: cityCoords[userObj.lastTxnCity][1],
        copyPastedCardNo: false,
        merchantType: MERCHANT_TYPES[Math.floor(Math.random() * MERCHANT_TYPES.length)],
        deviceId: deviceIds[Math.floor(Math.random() * deviceIds.length)]
      }

      transactions[selectedUserId] = transactionObj;
    }
    
    setTransactionsData(transactions);

    console.log("Transactions data generated");
  }

  // generating the user data here that will be in the DB
  // this function utilizes all the functions in UsersDataGeneration.js
  const generateUsersData = () => {

    const N = 2_000;

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


      const userObj = {
        name: fullNames[k],
        accType: generatedAccType,
        lastTxnTime: Date.now(),
        lastTxnLat: cityCoords[city][0],
        lastTxnLon: cityCoords[city][1],
        lastTxnCity: city,
        homeCountry: cityToCountry[city],
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
    setUsersData(users);


    // good practice to instantly clear the local object after its used
    // matters when the object or arr is really large (hundredss of KB or multiple MBs)
    users = null;
  };

  const insertUsersData = async () => {

    const response = await bulkInserUsersData(usersData);

    console.log(response);
  }

  let dataGenerated = false;

  useEffect(() => {

    if(!dataGenerated) {

      generateUsersData();
      generateTransactionsData();

      dataGenerated = true;
    }

  }, [])

  return (
    <div className="App">
      <div id="page-header">
        <p>Warden</p>
        <button onClick={insertUsersData}>
          Insert Users
        </button>
      </div>
      <div id="data-generation-section">
        <input id="no-of-transactions"
        placeholder="No. of transactions" />
        <input id="fraud-rate"
        placeholder="Fraud rate (%)" />
        <button>Generate data</button>
        <button>Simulate</button>
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
