import React, {useState, useEffect, useMemo} from 'react';
import "../FeatureAnalytics.css";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  ComposedChart, Area 
} from 'recharts';
import { ResponsiveHeatMap } from '@nivo/heatmap';
import {computeHaversineDistance, getCorrelation, round} from "../utilities"

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

  bins = binCounts.map((count, index) => { 'm,k'
    const rangeStart = valuesMin + (index * diff);
    const rangeEnd = rangeStart + diff;

    let rangeStartStr = rangeStart >= 1000 ? `${round(rangeStart/1000, 1)}` : `${round(rangeStart, 0)}`;
    let rangeEndStr = rangeEnd >= 1000 ? `${round(rangeEnd/1000, 1)}k` : `${round(rangeEnd, 0)}`;
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
  const LOCATION_HOP_TYPES = ["CROSSBORDER", "NATIONAL", "SAME"];
  const TXN_TIME_TYPES = ["NORMAL", 'ABNORMAL'];

  const accountTypes = ["STUDENT", "STANDARD", "PREMIUM", "BUSINESS"];
  const locationHopTypes = ["CROSSBORDER", "NATIONAL", "SAME"];
  const merchantTypes = ["GROCERY", "DIGITAL", "TRAVEL", "LUXURY", "CRYPTO"];

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


  // using useMemo on all the computing and grouping stuff
  const analytics = useMemo(() => {
    // computing analytics data, generate bins, grouping, distributions, and all that is needed
    //const transactionEntries = Object.entries(transactionsData);
    let transactionEntries = Object.entries(transactionsData).map(([userId, data]) => {
        return {userId, ...data};
    })

    const allTxnAmt = [];
    const allMerchantType = [];
    const allTxnTime = [];
    // stores only int localHour, not hr:min string, so it can be used for distribution plot
    const allTxnTimeLocalHour = []; 

    const allTxnTimeGap = [];
    const allAtvDelta = [];
    const allFraudScore = [];
    const allUserAtvDelta = [];
    const allSpeedKmh = [];
    const allTimeGapLastTxn = [];
    const allGeoDistanceKm = [];
    const allAccAge = [];

    // grouping tier maps mainly by accType, and someother if needed
    const txnAmtGroupsByType = {STUDENT: [], STANDARD: [], PREMIUM: [], BUSINESS: []};
    const txnAmtGroupsByMerchantType = {GROCERY: [], DIGITAL: [], TRAVEL: [], LUXURY: [], CRYPTO: []};
    const txnAmtGroupsByLocationHop = {CROSSBORDER: [], NATIONAL: [], SAME: []};
    const locationHopByAccType = {STUDENT: [], STANDARD: [], PREMIUM: [], BUSINESS: []};
    const geoDistanceKmGroupsByType = {STUDENT: [], STANDARD: [], PREMIUM: [], BUSINESS: []};
    const txnAmtGroupsByTimeType = {NORMAL: [], ABNORMAL: []};
    const userAtvDeltaGroupsByType = {STUDENT: [], STANDARD: [], PREMIUM: [], BUSINESS: []};

    const merchantTypeGroupsByType = {STUDENT: [], STANDARD: [], PREMIUM: [], BUSINESS: []};
    const txnTimeGroupsByType = {STUDENT: [], STANDARD: [], PREMIUM: [], BUSINESS: []};

    let highestMeanTxnUsers = [];
    let highestStdDevTxnUsers = [];
    let highestTxnValues = [];


    for(let k = 0; k < transactionEntries.length; k++) {

      const {userId, txnAmt, copyPastedCardNo, merchantType, 
        txnTime, txnTimeObj, txnTimeUTC, txnTimeLocalHour, locationHop, txnLat, txnLon,
        userAtvDelta, highTxnVelocity, speedKmh, geoDistanceKm, fraudScore,
        timeGapLastTxn, accAge} = transactionEntries[k];
      
      // this is done only because we are generating data. This value is not generally present when performing
      // a transaction but is present only when transaction obj reaches backend and the user data is fetched
      // from the DB
      const userObj = usersData[userId];

      if(!userObj) break;

      const accType = usersData[userId]["accType"];

      highestMeanTxnUsers.push({userId: userId, val: userObj.meanTxn30d});
      highestStdDevTxnUsers.push({userId: userId, val: userObj.stdDevTxn});
      highestTxnValues.push({userId: userId, val: txnAmt});

      // pushing to arr of values for all features
      allTxnAmt.push(txnAmt);
      // allCopyPastedCardNos.push(copyPastedCardNo);  // this is a boolean val
      allMerchantType.push(merchantType);
      allTxnTime.push(txnTime);
      allTxnTimeLocalHour.push(txnTimeLocalHour);
      allFraudScore.push(fraudScore);
      allUserAtvDelta.push(userAtvDelta);
      allSpeedKmh.push(speedKmh);
      allTimeGapLastTxn.push(timeGapLastTxn);
      allGeoDistanceKm.push(geoDistanceKm);
      allAccAge.push(accAge);


      // forming grouping based on accType and other as needed
      txnAmtGroupsByType[accType].push(txnAmt);
      txnAmtGroupsByMerchantType[merchantType].push(txnAmt);
      txnAmtGroupsByLocationHop[locationHop].push(txnAmt);

      merchantTypeGroupsByType[accType].push(merchantType);
      txnTimeGroupsByType[accType].push(txnTime);

      userAtvDeltaGroupsByType[accType].push(userAtvDelta);
      locationHopByAccType[accType].push(locationHop);
      geoDistanceKmGroupsByType[accType].push(geoDistanceKm);

      if(txnTimeLocalHour >= 23 || txnTimeLocalHour <= 4) {
        txnAmtGroupsByTimeType.ABNORMAL.push(txnAmt);
      }
      else {
        txnAmtGroupsByTimeType.NORMAL.push(txnAmt);
      }
    }

    // const totalEntries = transactionEntries.length;
    // console.log("Impossible Travel/High Vel TXNS: ", {
    //   totalImpossibleTravelTxns, totalImpossibleTravelGenerated, 
    //   totalHighVelTxns, totalHighVelTxnsGenerated,
    //   impossibleTravelPerc: round(100*(totalImpossibleTravelTxns / totalEntries), 2),
    //   highVelPerc: round(100*(totalHighVelTxns / totalEntries), 2)
    // });

    // generating bins for distribution visualization
    const txnAmtDistData = generateBins(null, 20, false, allTxnAmt);
    // const txnTimeDistData = generateBins(null, 10, false, allTxnTime);
    const txnTimeLocalHourDistData = generateBins(null, 24, false, allTxnTimeLocalHour);

    const txnTimeGapDistData = generateBins(null, 24, false, allTxnTimeGap);

    // mechantType distribution will be a bar or stacked chart as it has only 5 varieties

    // creating bins obj for required attributes
    const binnedTxnAmtGroupsByType = {};
    const binnedTxnTimeGroupsByType = {};
    const binnedGeoDistanceKmGroupsByType = {};

    const binnedTxnAmtGroupsByLocationHop = {};
    const binnedTxnAmtGroupsByMerchantType = {};
    const binnedTxnAmtGroupsByTimeType = {};
    const binnedUserAtvDeltaGroupsByType = {};

    // this contains location hops record for each accType
    // the ints are basically in percent, so all sum up to exactly 100
    // this if for Stacked Chart
    const locationHopByAccTypeData = [];
    
    Object.entries(locationHopByAccType).forEach(([accType, locationHopArr]) => {
      // for each accType and its all locationHop types arr, we put a obj record in locationHopByAccTypeData
      // the record has name, and locationHopTypes keys with percentages they are present in the arr
      let percentages = {CROSSBORDER: 0, NATIONAL: 0, SAME: 0};  // these are counts initially
      const N = locationHopArr.length;

      for(let hopType of locationHopArr) {
        percentages[hopType]++;
      }

      // making percentages from count here
      locationHopTypes.forEach((hopType) => {

        let percentage = (percentages[hopType] / N) * 100;
        percentages[hopType] = round(percentage, 2);
      })

      percentages["name"] = accType;

      locationHopByAccTypeData.push(percentages);
    })


    TXN_TIME_TYPES.forEach((txnTimeType) => {
      binnedTxnAmtGroupsByTimeType[txnTimeType] = generateBins(null, 20, false, txnAmtGroupsByTimeType[txnTimeType]);
    })

    ACCOUNT_TYPES.forEach((accType) => {
      binnedTxnAmtGroupsByType[accType] = generateBins(null, 20, false, txnAmtGroupsByType[accType]);
      binnedTxnTimeGroupsByType[accType] = generateBins(null, 18, false, txnTimeGroupsByType[accType]);
      binnedGeoDistanceKmGroupsByType[accType] = generateBins(null, 20, false, geoDistanceKmGroupsByType[accType]);
      binnedUserAtvDeltaGroupsByType[accType] = generateBins(null, 20, false, userAtvDeltaGroupsByType[accType]);
    })

    LOCATION_HOP_TYPES.forEach((locationHopType) => {
      binnedTxnAmtGroupsByLocationHop[locationHopType] = generateBins(null, 18, false, txnAmtGroupsByLocationHop[locationHopType]);
    })

    MERCHANT_TYPES.forEach((merchantType) => {
      binnedTxnAmtGroupsByMerchantType[merchantType] = generateBins(null, 20, false, txnAmtGroupsByMerchantType[merchantType]);
    })


    const matrixFeatures = ["txnAmt", "accAge", "geoDistanceKm", "timeGapLastTxn", "speedKmh", "userAtvDelta", "fraudScore"];
    
    const getValuesByAttribute = {
      "txnAmt": allTxnAmt,
      "accAge": allAccAge,
      "geoDistanceKm": allGeoDistanceKm,
      "timeGapLastTxn": allTimeGapLastTxn,
      "speedKmh": allSpeedKmh,
      "userAtvDelta": allUserAtvDelta,
      "fraudScore": allFraudScore
    };

    const matrixData = matrixFeatures.map((featureA) => ({
      id: featureA,
      data: matrixFeatures.map((featureB) => {
        const arrA = getValuesByAttribute[featureA];
        const arrB = getValuesByAttribute[featureB];

        return {
          x: featureB,
          y: parseFloat(getCorrelation(arrA, arrB).toFixed(2))
        };
      })
    }));


    return {
      allTxnAmt,
      allTxnTime,
      allMerchantType,
      txnAmtDistData,
      txnTimeLocalHourDistData,
      txnTimeGapDistData,
      binnedTxnAmtGroupsByType,
      binnedTxnAmtGroupsByMerchantType,
      binnedTxnAmtGroupsByLocationHop,
      binnedTxnTimeGroupsByType,
      binnedGeoDistanceKmGroupsByType,
      binnedTxnAmtGroupsByTimeType,
      binnedUserAtvDeltaGroupsByType,
      locationHopByAccTypeData,
      matrixData
    }

  }, [usersData, transactionsData])

  
  // using all the content returned from analytics useMemo after computation
  const {
    allTxnAmt,
    allTxnTime,
    allMerchantType,
    txnAmtDistData,
    txnTimeLocalHourDistData,
    txnTimeGapDistData,
    binnedTxnAmtGroupsByType,
    binnedTxnAmtGroupsByMerchantType,
    binnedTxnAmtGroupsByLocationHop,
    binnedTxnTimeGroupsByType,
    binnedGeoDistanceKmGroupsByType,
    binnedTxnAmtGroupsByTimeType,
    binnedUserAtvDeltaGroupsByType,
    locationHopByAccTypeData,
    matrixData
  } = analytics;
 
  // this value decides which accType's accAge distribution will be displayed
  const [selectedAccType, setSelectedAccType] = useState("STUDENT");
  const [selectedAccTypeTxnAmt, setSelectedAccTypeTxnAmt] = useState("STANDARD");
  const [selectedAccTypeGeoDistanceKm, setSelectedAccTypeGeoDistanceKm] = useState("STANDARD");
  const [selectedMerchantTypeTxnAmt, setSelectedMerchantTypeTxnAmt] = useState("GROCERY");
  const [selectedLocationHopTypeTxnAmt, setSelectedLocationHopTypeTxnAmt] = useState("CROSSBORDER");
  const [selectedTxnTimeType, setSelectedTxnTimeType] = useState("NORMAL");
  const [selectedAccTypeUserAtvDelta, setSelectedAccTypeUserAtvDelta] = useState("STANDARD");


  // // Mock data for AccType vs Merchant Behavior (Stacked Chart)
  // const merchantAccData = [
  //   { name: 'STUDENT', Crypto: 10, Luxury: 5, Electronics: 40, Grocery: 45 },
  //   { name: 'STANDARD', Crypto: 20, Luxury: 15, Electronics: 35, Grocery: 30 },
  //   { name: 'PREMIUM', Crypto: 30, Luxury: 45, Electronics: 20, Grocery: 5 },
  //   { name: 'BUSINESS', Crypto: 50, Luxury: 30, Electronics: 15, Grocery: 5 },
  // ];

  // // Mock Correlation Matrix Data (Nivo Format)
  // const correlationData = [
  //   { id: "Amount", data: [{x: "Amount", y: 1}, {x: "Fraud", y: 0.4}, {x: "CopyPaste", y: 0.1}] },
  //   { id: "Fraud", data: [{x: "Amount", y: 0.4}, {x: "Fraud", y: 1}, {x: "CopyPaste", y: 0.8}] },
  //   { id: "CopyPaste", data: [{x: "Amount", y: 0.1}, {x: "Fraud", y: 0.8}, {x: "CopyPaste", y: 1}] },
  // ];


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

      <div className="analytics-section">
        {/* 1. txnAmt distribution */}
        <div className="analytics-plot">
          <p>txnAmt Distribution & Density</p>
          <ResponsiveContainer width="100%" height="80%">
            <ComposedChart data={txnAmtDistData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="range" 
                interval={0}
                tick={{fontSize: 12}}
                angle={-55}
                textAnchor="end"
                height={70}
              />

              {/* left Y-asix for histogram bars */}
              <YAxis yAxisId="left"
              scale="sqrt" domain={[0, "auto"]}
              allowDataOverflow={true}
              tickFormatter={(val) => Math.round(val)}
              orientation="left" stroke="rgb(49, 213, 49)" 
              tick={{fontSize: 13}}
              label={{value: 'Txn Count', angle: -90, position: 'insideLeft', fontSize: 14}}/>
              {/* right Y-axis for density line (0 to 1) */}
              <YAxis yAxisId="right" 
              scale="sqrt"
              domain={[0, "auto"]}
              orientation="right" stroke="rgb(126, 222, 96)" 
              tick={{fontSize: 11}}
              label={{value: 'Density', angle: 90, position: 'insideRight', fontSize: 14}}/>

              <Tooltip />
              <Legend labelStyle={{fontSize: 14, fontFamily: "Poppins, sans-serif"}}/>
              <Bar 
              radius={[3, 3, 0, 0]}
              opacity={1}
              yAxisId="left"
              dataKey="count" 
              fill="rgb(49, 213, 49)" 
              name="Txn Count"
              barSize={15} 
              />
              <Area 
                yAxisId="right"
                type="monotone" 
                dataKey="density" 
                scale="sqrt"
                stroke="rgb(126, 222, 96)" 
                fillOpacity={0.3} 
                fill="rgb(126, 222, 96)" 
                name="KDE (Density)" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* 2. txnAmt by accType distribution */}
        <div className="analytics-plot">
          <div className="analytics-plot-header">
            <p>txnAmt by accType</p>
            <div className="options">
              {accountTypes.map((accType) => {
                return (
                  <div 
                    className={selectedAccTypeTxnAmt === accType ? "selected-option" : "option"} 
                    key={accType}
                    onClick={() => setSelectedAccTypeTxnAmt(accType)}
                    >
                    {accType.slice(0, 1).toUpperCase() + accType.slice(1, ).toLowerCase()}
                  </div>
                )
              })}
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height="80%">
            <ComposedChart data={binnedTxnAmtGroupsByType[selectedAccTypeTxnAmt]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="range" 
                interval={0}
                tick={{fontSize: 11}}
                angle={-45}
                textAnchor="end"
                height={70}
              />

              {/* left Y-asix for histogram bars */}
              <YAxis yAxisId="left"
              orientation="left" stroke="rgb(49, 213, 49)" 
              tick={{fontSize: 13}}
              scale="sqrt"
              domain={[0, "auto"]}
              label={{value: 'Count', angle: -90, position: 'insideLeft', fontSize: 14}}/>
              {/* right Y-axis for density line (0 to 1) */}
              <YAxis yAxisId="right" orientation="right" stroke="rgb(126, 222, 96)" 
              tick={{fontSize: 13}}
              scale="sqrt"
              domain={[0, "auto"]}
              label={{value: "Density", angle: 90, position: 'insideRight', fontSize: 14}}/>

              <Tooltip />
              <Legend labelStyle={{fontSize: 14, fontFamily: "Poppins, sans-serif"}}/>
              <Bar 
              radius={[3, 3, 0, 0]}
              yAxisId="left"
              dataKey="count" 
              fill="rgb(49, 213, 49)" 
              name="Count"
              barSize={15}
              />
              <Area 
                yAxisId="right"
                type="monotone" 
                dataKey="density" 
                stroke="rgb(126, 222, 96)" 
                fillOpacity={0.3} 
                fill="rgb(126, 222, 96)" 
                name="KDE (Density)" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        
        {/* 3. txnAmt by merchantType distribution */}
        <div className="analytics-plot">
          <div className="analytics-plot-header">
            <p>txnAmt by merchantType</p>
            <div className="options">
              {merchantTypes.map((merchantType) => {
                return (
                  <div 
                    className={selectedMerchantTypeTxnAmt === merchantType ? "selected-option" : "option"} 
                    key={merchantType}
                    onClick={() => setSelectedMerchantTypeTxnAmt(merchantType)}
                    >
                    {merchantType.slice(0, 1).toUpperCase() + merchantType.slice(1, ).toLowerCase()}
                  </div>
                )
              })}
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height="80%">
            <ComposedChart data={binnedTxnAmtGroupsByMerchantType[selectedMerchantTypeTxnAmt]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="range" 
                interval={0}
                tick={{fontSize: 11}}
                angle={-55}
                textAnchor="end"
                height={60}
              />

              {/* left Y-asix for histogram bars */}
              <YAxis yAxisId="left"
              orientation="left" stroke="rgb(49, 213, 49)" 
              tick={{fontSize: 13}}
              scale="sqrt"
              domain={[0, "auto"]}
              label={{value: 'Count', angle: -90, position: 'insideLeft', fontSize: 14}}/>
              {/* right Y-axis for density line (0 to 1) */}
              <YAxis yAxisId="right" orientation="right" stroke="rgb(126, 222, 96)" 
              tick={{fontSize: 13}}
              scale="sqrt"
              domain={[0, "auto"]}
              label={{value: "Density", angle: 90, position: 'insideRight', fontSize: 14}}/>

              <Tooltip />
              <Legend labelStyle={{fontSize: 14, fontFamily: "Poppins, sans-serif"}}/>
              <Bar 
              radius={[3, 3, 0, 0]}
              yAxisId="left"
              dataKey="count" 
              fill="rgb(49, 213, 49)" 
              name="Count"
              barSize={15}
              />
              <Area 
                yAxisId="right"
                type="monotone" 
                dataKey="density" 
                stroke="rgb(126, 222, 96)" 
                fillOpacity={0.3} 
                fill="rgb(126, 222, 96)" 
                name="KDE (Density)" />
            </ComposedChart>
          </ResponsiveContainer>
        </div> 

        
        {/* 4. txnTimeLocalHour distribution */}
        <div className="analytics-plot">
          <p>txnTime Local hour Distribution & Density</p>
          <ResponsiveContainer width="100%" height="80%">
            <ComposedChart data={txnTimeLocalHourDistData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="range" 
                interval={0}
                tick={{fontSize: 12}}
                angle={-55}
                textAnchor="end"
                height={60}
              />

              {/* left Y-asix for histogram bars */}
              <YAxis yAxisId="left"
              // scale="sqrt" domain={[0, "auto"]}
              allowDataOverflow={true}
              tickFormatter={(val) => Math.round(val)}
              orientation="left" stroke="rgb(49, 213, 49)" 
              tick={{fontSize: 13}}
              label={{value: 'Txn Count', angle: -90, position: 'insideLeft', fontSize: 14}}/>
              {/* right Y-axis for density line (0 to 1) */}
              <YAxis yAxisId="right" 
              // scale="sqrt" domain={[0, "auto"]}
              orientation="right" stroke="rgb(126, 222, 96)" 
              tick={{fontSize: 11}}
              label={{value: 'Density', angle: 90, position: 'insideRight', fontSize: 14}}/>

              <Tooltip />
              <Legend labelStyle={{fontSize: 14, fontFamily: "Poppins, sans-serif"}}/>
              <Bar 
              radius={[3, 3, 0, 0]}
              opacity={1}
              yAxisId="left"
              dataKey="count" 
              fill="rgb(49, 213, 49)" 
              name="Txn Count"
              barSize={13} 
              />
              <Area 
                yAxisId="right"
                type="monotone" 
                dataKey="density" 
                scale="sqrt"
                stroke="rgb(126, 222, 96)" 
                fillOpacity={0.3} 
                fill="rgb(126, 222, 96)" 
                name="KDE (Density)" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* 5 locationHop by accType stacked chart comparision */}
        <div className="analytics-plot">
          <p>Location Hop vs Account Type Comparision</p>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={locationHopByAccTypeData} barSize={55}>
              <XAxis dataKey="name" tick={{fontSize: 13}} />
              <YAxis tick={{fontSize: 14}}
              label={{ value: '% of Volume', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend labelStyle={{fontSize: 14, fontFamily: "Poppins, sans-serif"}} />

              {/* 255, 118, 193*/}
              <Bar dataKey="CROSSBORDER" stackId="a" fill="rgb(254, 92, 92)" />
              <Bar dataKey="NATIONAL" stackId="a" fill="rgb(99, 112, 255)" />
              <Bar radius={[3, 3, 0, 0]} dataKey="SAME" stackId="a" fill="rgb(49, 213, 49)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 5. geoDistanceKm by accType distribution */}
        <div className="analytics-plot">
          <div className="analytics-plot-header">
            <p>geoDistanceKm by accType</p>
            <div className="options">
              {accountTypes.map((accType) => {
                return (
                  <div 
                    className={selectedAccTypeGeoDistanceKm === accType ? "selected-option" : "option"} 
                    key={accType}
                    onClick={() => setSelectedAccTypeGeoDistanceKm(accType)}
                    >
                    {accType.slice(0, 1).toUpperCase() + accType.slice(1, ).toLowerCase()}
                  </div>
                )
              })}
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height="80%">
            <ComposedChart data={binnedGeoDistanceKmGroupsByType[selectedAccTypeGeoDistanceKm]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="range" 
                interval={0}
                tick={{fontSize: 11}}
                angle={-45}
                textAnchor="end"
                height={70}
              />

              {/* left Y-asix for histogram bars */}
              <YAxis yAxisId="left"
              orientation="left" stroke="rgb(49, 213, 49)" 
              tick={{fontSize: 13}}
              scale="sqrt"
              domain={[0, "auto"]}
              label={{value: 'Count', angle: -90, position: 'insideLeft', fontSize: 14}}/>
              {/* right Y-axis for density line (0 to 1) */}
              <YAxis yAxisId="right" orientation="right" stroke="rgb(126, 222, 96)" 
              tick={{fontSize: 13}}
              scale="sqrt"
              domain={[0, "auto"]}
              label={{value: "Density", angle: 90, position: 'insideRight', fontSize: 14}}/>

              <Tooltip />
              <Legend labelStyle={{fontSize: 14, fontFamily: "Poppins, sans-serif"}}/>
              <Bar 
              radius={[3, 3, 0, 0]}
              yAxisId="left"
              dataKey="count" 
              fill="rgb(49, 213, 49)" 
              name="Count"
              barSize={17}
              />
              <Area 
                yAxisId="right"
                type="monotone" 
                dataKey="density" 
                stroke="rgb(126, 222, 96)" 
                fillOpacity={0.3} 
                fill="rgb(126, 222, 96)" 
                name="KDE (Density)" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* 6. txnAmt by txnTime type */}
        <div className="analytics-plot">
          <div className="analytics-plot-header">
            <p>txnAmt by txnTime Type</p>
            <div className="options">
              {TXN_TIME_TYPES.map((txnTimeType) => {
                return (
                  <div 
                    className={selectedTxnTimeType === txnTimeType ? "selected-option" : "option"} 
                    key={txnTimeType}
                    onClick={() => setSelectedTxnTimeType(txnTimeType)}
                    >
                    {txnTimeType.slice(0, 1).toUpperCase() + txnTimeType.slice(1, ).toLowerCase()
                    + " time"}
                  </div>
                )
              })}
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height="80%">
            <ComposedChart data={binnedTxnAmtGroupsByTimeType[selectedTxnTimeType]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="range" 
                interval={0}
                tick={{fontSize: 11}}
                angle={-45}
                textAnchor="end"
                height={65}
              />

              {/* left Y-asix for histogram bars */}
              <YAxis yAxisId="left"
              orientation="left" stroke="rgb(49, 213, 49)" 
              tick={{fontSize: 13}}
              scale="sqrt"
              domain={[0, "auto"]}
              label={{value: 'Count', angle: -90, position: 'insideLeft', fontSize: 14}}/>
              {/* right Y-axis for density line (0 to 1) */}
              <YAxis yAxisId="right" orientation="right" stroke="rgb(126, 222, 96)" 
              tick={{fontSize: 13}}
              scale="sqrt"
              domain={[0, "auto"]}
              label={{value: "Density", angle: 90, position: 'insideRight', fontSize: 14}}/>

              <Tooltip />
              <Legend labelStyle={{fontSize: 14, fontFamily: "Poppins, sans-serif"}}/>
              <Bar 
              radius={[3, 3, 0, 0]}
              yAxisId="left"
              dataKey="count" 
              fill="rgb(49, 213, 49)" 
              name="Count"
              barSize={17}
              />
              <Area 
                yAxisId="right"
                type="monotone" 
                dataKey="density" 
                stroke="rgb(126, 222, 96)" 
                fillOpacity={0.3} 
                fill="rgb(126, 222, 96)" 
                name="KDE (Density)" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* 7. userAtvDelta by accType */}
        <div className="analytics-plot">
          <div className="analytics-plot-header">
            <p>userAtvDelta by accType</p>
            <div className="options">
              {ACCOUNT_TYPES.map((accType) => {
                return (
                  <div 
                    className={selectedAccTypeUserAtvDelta === accType ? "selected-option" : "option"} 
                    key={accType}
                    onClick={() => setSelectedAccTypeUserAtvDelta(accType)}
                    >
                    {accType.slice(0, 1).toUpperCase() + accType.slice(1, ).toLowerCase()}
                  </div>
                )
              })}
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height="80%">
            <ComposedChart data={binnedUserAtvDeltaGroupsByType[selectedAccTypeUserAtvDelta]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="range" 
                interval={0}
                tick={{fontSize: 11}}
                angle={-45}
                textAnchor="end"
                height={65}
              />

              {/* left Y-asix for histogram bars */}
              <YAxis yAxisId="left"
              orientation="left" stroke="rgb(49, 213, 49)" 
              tick={{fontSize: 13}}
              scale="sqrt"
              domain={[0, "auto"]}
              label={{value: 'Count', angle: -90, position: 'insideLeft', fontSize: 14}}/>
              {/* right Y-axis for density line (0 to 1) */}
              <YAxis yAxisId="right" orientation="right" stroke="rgb(126, 222, 96)" 
              tick={{fontSize: 13}}
              scale="sqrt"
              domain={[0, "auto"]}
              label={{value: "Density", angle: 90, position: 'insideRight', fontSize: 14}}/>

              <Tooltip />
              <Legend labelStyle={{fontSize: 14, fontFamily: "Poppins, sans-serif"}}/>
              <Bar 
              radius={[3, 3, 0, 0]}
              yAxisId="left"
              dataKey="count" 
              fill="rgb(49, 213, 49)" 
              name="Count"
              barSize={17}
              />
              <Area 
                yAxisId="right"
                type="monotone" 
                dataKey="density" 
                stroke="rgb(126, 222, 96)" 
                fillOpacity={0.3} 
                fill="rgb(126, 222, 96)" 
                name="KDE (Density)" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="analytics-plot heat-map">
          <p>Transaction Behavioral Correlation Matrix</p>
          <div className="heat-map-wrapper">
            <ResponsiveHeatMap
              theme={theme}
              data={matrixData}
              margin={{ top: 45, right: 40, bottom: 45, left: 110 }}
              valueFormat=">-.2f"
              axisTop={{ tickSize: 5, tickPadding: 5, tickRotation: -20 }}
              axisLeft={{ tickSize: 5, tickPadding: 5, tickRotation: 0 }}
              colors={{
                type: 'sequential',
                colors: [
                  'rgb(186, 254, 165)', // Weak background correlation floor color
                  'rgb(49, 213, 49)'    // High target parameter affinity color
                ],
              }}
              divergeAt={0.5} 
              emptyColor="#f1f5f9"
              labelTextColor={{
                from: 'color',
                modifiers: [['darker', 3]],
              }}
              legends={[
                {
                  anchor: 'bottom',
                  translateX: 0,
                  translateY: 28,
                  length: 300,
                  thickness: 5,
                  direction: 'row',
                  title: 'Correlation Coefficient (Pearson r)',
                  titleOffset: 4
                }
              ]}
              borderWidth={1}
              borderColor={{ from: 'color', modifiers: [['darker', 0.4]] }}
            />
          </div>
        </div>
          
      </div>
    </div>
  )
}

export default TransactionsFeatureAnalytics;