import React, {useState, useEffect} from 'react';
import "../FeatureAnalytics.css";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  ComposedChart, Area 
} from 'recharts';
import { ResponsiveHeatMap } from '@nivo/heatmap';
import {getCorrelation, round} from "../utilities"

// THEME FOR THE HEAT MAP
const theme = {
  // Sets font for everything: axis, tooltips, legends
  fontFamily: 'Poppins, sans-serif', 
  fontSize: 12,
  axis: {
    ticks: {
      text: {
        fontFamily: 'Poppins, sans-serif',
        fill: 'rgb(59, 60, 59)', // A nice slate gray
        fontSize: 11,     // Size of the feature names (meanTxn30d, etc.)
        fontWeight: 400,
      }
    }
  },
  tooltip: {
    container: {
      background: '#ffffff',
      color: '#333333',
      fontSize: 12,
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    },
  },
  legends: {
    text: {
      fontSize: 12,
      fontWeight: 400,
      fill: '#4b5563', // Soft gray
    },
    title: {
      text: {
        fontFamily: 'Poppins, sans-serif',
        fontSize: 12,
        fontWeight: 400,
        fill: '#29292a', // Darker gray for the title
      }
    }
  },
};

const getAllValues = (attribute) => {
  // this function is not really called ever
  return [];
}

// takes an attribute, then gets all values of that attribute from all objects
// using the getAllValues() function, and then does the work
const generateBins = (attribute, N, useAttribute = true, attributeValues = []) => {

  // we can also, provide useAttribute as FALSE and just pass the arr of attr values
  // to be used
  const values = useAttribute ? getAllValues(attribute) : attributeValues;
  //const N = 12;  
  // // N bins are to be generated, taken input, default = 12
  let bins = [];  // has objects with props - rangeStart, rangeEnd, count, density
  // density is bin count / (totalCount * binWidth)
  const valuesMin = Math.min(...values);
  const valuesMax = Math.max(...values);
  // const N = N ? N : values.length;

  const diff = Math.ceil((valuesMax - valuesMin) / N) || 1;  // this diff is "binWidth"

  let info = {
    "attribute": attribute,
    "diff": diff,
    "valuesMin": valuesMin,
    "valuesMax": valuesMax
  }

  if(attribute === "accAge" || attribute === "monthlyAvgTxn") {
    console.table(info);
  }
  // ranges will start from here, in every iteration, we keep on increaseing this
  // by "diff"
  // let rangeStart = valuesMin;
  let L = values.length;

  let binCounts = new Array(N).fill(0);

  values.forEach((val) => {
    // find in which bin the "val" should lie
    let index = Math.floor((val - valuesMin) / diff);

    if(index === N) {
      // for max values, the index becomes exactly N, so we reduce it to fit in thelast bin
      index = N - 1;
    }

    if(index >= 0 && index < N) {
      binCounts[index]++;
    }
  })

  bins = binCounts.map((count, index) => {
    const rangeStart = valuesMin + (index * diff);
    const rangeEnd = rangeStart + diff;

    let rangeStartStr = rangeStart >= 1000 ? `${round(rangeStart/1000, 1)}k` : `${rangeStart}`;
    let rangeEndStr = rangeEnd >= 1000 ? `${round(rangeEnd/1000, 1)}k` : `${rangeEnd}`;
    const rangeStr = rangeStartStr + "-" + rangeEndStr;          

    return {
      range: rangeStr,
      rangeStart,
      rangeEnd,
      count: count,
      density: count / (L * diff)
    }
  })

  // console.log(bins);

  return bins;
}

function TransactionsFeatureAnalytics({transactionsData, usersData}) {

  const ACCOUNT_TYPES = ["STUDENT", "STANDARD", "PREMIUM", "BUSINESS"];
  const MERCHANT_TYPES = ["GROCERY", "DIGITAL", "TRAVEL", "LUXURY", "CRYPTO"];

  const getAllAccTypes = () => {

    let accTypeToNum = {
      "STUDENT": 0,
      "STANDARD": 1,
      "PREMIUM": 2,
      "BUSINESS": 3
    }

    // as accTypes are not numbers by default, this function converts each into a number
    let values = [];

    for(const [ID, value] of Object.entries(usersData)) {
      let accType = value["accType"];

      values.push(accTypeToNum[accType]);
    }

    return values;
  }

  // takes some attribute which has many distinct values, ex accType, homeCountry
  // and then returns an object with keys and values as the no. of occurences
  const getCounts = (attribute) => {

    let output = {};

    for(const [key, obj] of Object.entries(usersData)) {

      // if key already in output obj, just increment the count
      // else put key and increment the count
      let value = obj[attribute];

      if(Object.hasOwn(output, value)) {
        output[value]++;
      }
      else {
        output[value] = 1;
      }
    }

    // console.log(output);

    return output;
  }

  // takes some attribute and the runs getCounts() on that
  // then returns an object with not the counts but the proportions
  // of each key among total counts
  const getRatios = (attribute) => {

    let counts = getCounts(attribute);

    const totalCount = Object.entries(counts).reduce((acc, val) => {
      // val[0] is the key string
      // val[1] is the int value
      return acc + val[1];
    }, 0)

    let output = {};

    for(const [key, val] of Object.entries(counts)) {
      // computing the ratio using totalCount and val
      // and putting in output obj
      output[key] = round(val / totalCount, 2);
    }

    return output;
  }

  const getRowCount = () => {

    let rowCount = 0;

    for(const [ID, val] of Object.entries(usersData)) {

      rowCount++;
    }

    return rowCount;
  }

  // computing analytics data, generate bins, grouping, distributions, and all that is needed
  const transactionEntries = Object.values(transactionsData || {});

  const allTxnAmt = [];
  const allCopyPastedCardNos = [];
  const allMerchantType = [];
  const allTxnTime = [];

  // grouping tier maps mainly by accType, and someother if needed
  const txnAmtGroupsByType = {STUDENT: [], STANDARD: [], PREMIUM: [], BUSINESS: []};
  const txnAmtGroupsByMerchantType = {GROCERY: [], DIGITAL: [], TRAVEL: [], LUXURY: [], CRYPTO: []};
  const copyPastedCardNoGroupsByType = {STUDENT: [], STANDARD: [], PREMIUM: [], BUSINESS: []};
  const merchantTypeGroupsByType = {STUDENT: [], STANDARD: [], PREMIUM: [], BUSINESS: []};
  const txnTimeGroupsByType = {STUDENT: [], STANDARD: [], PREMIUM: [], BUSINESS: []};

  for(let k = 0; k < transactionEntries; k++) {

    const {userId, txnAmt, copyPastedCardNo, merchantType, txnTime} = transactionEntries[k];
    
    // this is done only because we are generating data. This value is not generally present when performing
    // a transaction but is present only when transaction obj reaches backend and the user data is fetched
    // from the DB
    const accType = usersData[userId]["accType"];

    // pushing to arr of values for all features
    allTxnAmt.push(txnAmt);
    // allCopyPastedCardNos.push(copyPastedCardNo);  // this is a boolean val
    allMerchantType.push(merchantType);
    allTxnTime.push(txnTime);

    // forming grouping based on accType and other as needed
    txnAmtGroupsByType[accType].push(txnAmt);
    txnAmtGroupsByMerchantType[merchantType].push(txnAmt);  // for bar chart
    copyPastedCardNoGroupsByType[accType].push(copyPastedCardNo);
    merchantTypeGroupsByType[accType].push(merchantType);
    txnTimeGroupsByType[accType].push(txnTime);
  }

  // generating bins for distribution visualization
  const txnAmtDistData = generateBins(null, 18, false, allTxnAmt);
  const txnTimeDistData = generateBins(null, 10, false, allTxnTime);

  // mechantType distribution will be a bar or stacked chart as it has only 5 varieties

  // creating bins obj for required attributes
  const binnedTxnAmtGroupsByType = {};
  const binnedTxnTimeGroupsByType = {};

  ACCOUNT_TYPES.forEach((accType) => {
    binnedTxnAmtGroupsByType[accType] = generateBins(null, 18, false, txnAmtGroupsByType[accType]);
    binnedTxnTimeGroupsByType[accType] = generateBins(null, 18, false, txnTimeGroupsByType[accType]);
  })




 
  // this value decides which accType's accAge distribution will be displayed
  const [selectedAccType, setSelectedAccType] = useState("STUDENT");

  const accountTypes = ["STUDENT", "STANDARD", "PREMIUM", "BUSINESS"];


  // Mock data for AccType vs Merchant Behavior (Stacked Chart)
  const merchantAccData = [
    { name: 'STUDENT', Crypto: 10, Luxury: 5, Electronics: 40, Grocery: 45 },
    { name: 'STANDARD', Crypto: 20, Luxury: 15, Electronics: 35, Grocery: 30 },
    { name: 'PREMIUM', Crypto: 30, Luxury: 45, Electronics: 20, Grocery: 5 },
    { name: 'BUSINESS', Crypto: 50, Luxury: 30, Electronics: 15, Grocery: 5 },
  ];

  // Mock Correlation Matrix Data (Nivo Format)
  const correlationData = [
    { id: "Amount", data: [{x: "Amount", y: 1}, {x: "Fraud", y: 0.4}, {x: "CopyPaste", y: 0.1}] },
    { id: "Fraud", data: [{x: "Amount", y: 0.4}, {x: "Fraud", y: 1}, {x: "CopyPaste", y: 0.8}] },
    { id: "CopyPaste", data: [{x: "Amount", y: 0.1}, {x: "Fraud", y: 0.8}, {x: "CopyPaste", y: 1}] },
  ];


  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [])


  if(loading) {
    return (
      <div className="loading-msg">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="feature-analytics">
      <div className="feature-analytics-header">
        Pre-simulation Feature Analytics
      </div>
    </div>
  )
}

export default TransactionsFeatureAnalytics;