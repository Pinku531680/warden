import React, {useState, useEffect, useRef, useMemo} from 'react';
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

function UsersFeatureAnalytics({usersData}) {

  const ACCOUNT_TYPES = ["STUDENT", "STANDARD", "PREMIUM", "BUSINESS"];


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


  // we put the entire grouping, creating bins, and related below code inside useMemo
  const analytics = useMemo(() => {

    // generating abd groupings bins in this section
    const userEntries = Object.values(usersData || {});

    const allMeanTxn30d = [];
    const allAccAge = [];
    const allStdDevTxn = [];
    const allFlaggedTxns = [];
    const allAccTypes = [];
    const allLocalHour = [];

    // initialize grouped tier maps
    const ageGroupsByType = { STUDENT: [], STANDARD: [], PREMIUM: [], BUSINESS: [] };
    const meanTxnGroupsByType = { STUDENT: [], STANDARD: [], PREMIUM: [], BUSINESS: [] };
    const stdDevTxnGroupsByType = { STUDENT: [], STANDARD: [], PREMIUM: [], BUSINESS: [] };
    const flaggedTxnsGroupsByType = { STUDENT: [], STANDARD: [], PREMIUM: [], BUSINESS: [] };

    for(let k = 0; k < userEntries.length; k++) {
      
      const {accType, accAge, meanTxn30d, stdDevTxn, flaggedTxns, lastTxnTimeLocalHour} = userEntries[k];

      // forming arr of values for all features
      allMeanTxn30d.push(meanTxn30d);
      allAccAge.push(accAge);
      allStdDevTxn.push(stdDevTxn);
      allFlaggedTxns.push(flaggedTxns);
      allAccTypes.push(accType);
      allLocalHour.push(lastTxnTimeLocalHour);

      // forming grouping for all necessary features based on accType
      ageGroupsByType[accType].push(accAge);
      meanTxnGroupsByType[accType].push(meanTxn30d);
      stdDevTxnGroupsByType[accType].push(stdDevTxn);
      flaggedTxnsGroupsByType[accType].push(flaggedTxns);
    }


    // map to be used in place ofthe function getValues(attr)
    const getValuesByAttribute = {
      "meanTxn30d": allMeanTxn30d,
      "accAge": allAccAge,
      "stdDevTxn": allStdDevTxn,
      "flaggedTxns": allFlaggedTxns,
      "accTypes": allAccTypes
    }

    // generating bins for meanTxn30d, accAge, stdDevTxn, flaggedTxns
    const meanTxnAmtDistData = generateBins(null, 18, false, allMeanTxn30d);
    const accAgeDistData = generateBins(null, 20, false, allAccAge);
    const stdDevTxnDistData = generateBins(null, 18, false, allStdDevTxn);
    const flaggedTxnsDistData = generateBins(null, 10, false, allFlaggedTxns);
    const lastTxnTimeLocalHourDistData = generateBins(null, 24, false, allLocalHour);


    // creating bins objects for all required attributes
    const binnedAgeGroupsDataByType = {};
    const binnedTxnGroupsDataByType = {};
    const binnedStdDevGroupsDataByType = {};
    const binnedFlaggedTxnsGroupsByType = {};


    // generating specific distributions for each feature based on accType
    ACCOUNT_TYPES.forEach((type) => {
      binnedAgeGroupsDataByType[type] = generateBins(null, 18, false, ageGroupsByType[type]);
      binnedTxnGroupsDataByType[type] = generateBins(null, 18, false, meanTxnGroupsByType[type]);
      binnedStdDevGroupsDataByType[type] = generateBins(null, 18, false, stdDevTxnGroupsByType[type]);
      binnedFlaggedTxnsGroupsByType[type] = generateBins(null, 10, false, flaggedTxnsGroupsByType[type]);
    })

    // generating matrix for heatmaps
    const matrixFeatures = ["accAge", "meanTxn30d", "accType", "flaggedTxns", "stdDevTxn"];

    // the matrix is generated such that, we compute correlation coeffiecients for each feature A
    // against each feature B of the "matrxiFeatures" arr
    const matrixData = matrixFeatures.map((featureA) => ({
      id: featureA,
      data: matrixFeatures.map((featureB) => {
        const arrA = featureA === "accType" ? getAllAccTypes() : getValuesByAttribute[featureA];
        const arrB = featureB === "accType" ? getAllAccTypes() : getValuesByAttribute[featureB];

        return {
          x: featureB,
          y: parseFloat(getCorrelation(arrA, arrB).toFixed(2))
        }
      })
    }))

    // console.log("MATRIX DATA");
    // console.log(matrixData);

    return {
      meanTxnAmtDistData,
      accAgeDistData,
      stdDevTxnDistData,
      flaggedTxnsDistData,
      lastTxnTimeLocalHourDistData,
      binnedAgeGroupsDataByType,
      binnedTxnGroupsDataByType,
      binnedStdDevGroupsDataByType,
      binnedFlaggedTxnsGroupsByType,
      matrixData
    };

  }, [usersData])

  // using all the content returned from analytics useMemo after computation
  const {
    meanTxnAmtDistData,
    accAgeDistData,
    stdDevTxnDistData,
    flaggedTxnsDistData,
    lastTxnTimeLocalHourDistData,
    binnedAgeGroupsDataByType,
    binnedTxnGroupsDataByType,
    binnedStdDevGroupsDataByType,
    binnedFlaggedTxnsGroupsByType,
    matrixData
  } = analytics;

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

      {/* <div className="stats">
        <p>Row Count: {getRowCount()}</p>
      </div> */}

      <div className="analytics-section">

        {/* 1. meanTxn30d distribution and density */}
        <div className="analytics-plot">
          <p>meanTxn30d Distribution & Density</p>
          <ResponsiveContainer width="100%" height="80%">
            <ComposedChart data={meanTxnAmtDistData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="range" 
                interval={0}
                tick={{fontSize: 12}}
                angle={-45}
                textAnchor="end"
                height={60}
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

        {/* 2 . meanTxn30d by accType distribution */}
        <div className="analytics-plot">
          <div className="analytics-plot-header">
            <p>meanTxn30d by accType</p>
            <div className="options">
              {accountTypes.map((accType) => {
                return (
                  <div 
                    className={selectedAccType === accType ? "selected-option" : "option"} 
                    key={accType}
                    onClick={() => setSelectedAccType(accType)}
                    >
                    {accType.slice(0, 1).toUpperCase() + accType.slice(1, ).toLowerCase()}
                  </div>
                )
              })}
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height="80%">
            <ComposedChart data={binnedTxnGroupsDataByType[selectedAccType]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="range" 
                interval={0}
                tick={{fontSize: 11}}
                angle={-45}
                textAnchor="end"
                height={60}
              />

              {/* left Y-asix for histogram bars */}
              <YAxis yAxisId="left"
              orientation="left" stroke="rgb(49, 213, 49)" 
              tick={{fontSize: 13}}
              label={{value: 'Count', angle: -90, position: 'insideLeft', fontSize: 14}}/>
              {/* right Y-axis for density line (0 to 1) */}
              <YAxis yAxisId="right" orientation="right" stroke="rgb(126, 222, 96)" 
              tick={{fontSize: 13}}
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

        {/* 3. Account Age DISTRIBUTION */}
        <div className="analytics-plot">
          <p>accAge Distribution & Density</p>
          <ResponsiveContainer width="100%" height="80%">
            <ComposedChart data={accAgeDistData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="range" 
                interval={0}
                tick={{fontSize: 11}}
                angle={-45}
                textAnchor="end"
                height={60}
              />

              {/* left Y-asix for histogram bars */}
              <YAxis yAxisId="left" 
              scale="sqrt"
              domain={[0, "auto"]}
              orientation="left" stroke="rgb(49, 213, 49)" 
              tick={{fontSize: 13}}
              label={{value: 'Count', angle: -90, position: 'insideLeft', fontSize: 14}}/>
              {/* right Y-axis for density line (0 to 1) */}
              <YAxis yAxisId="right" 
              scale="sqrt"
              domain={[0, "auto"]}
              orientation="right" stroke="rgb(126, 222, 96)" 
              tick={{fontSize: 13}}
              label={{value: 'Density', angle: 90, position: 'insideRight', fontSize: 14}}/>

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
        
        {/* 4. accAge by accType */}
        <div className="analytics-plot">
          <div className="analytics-plot-header">
            <p>accAge by accType</p>
            <div className="options">
              {accountTypes.map((accType) => {
                return (
                  <div 
                    className={selectedAccType === accType ? "selected-option" : "option"} 
                    key={accType}
                    onClick={() => setSelectedAccType(accType)}
                    >
                    {accType.slice(0, 1).toUpperCase() + accType.slice(1, ).toLowerCase()}
                  </div>
                )
              })}
            </div>
          </div>
          {/* <p style={{"color": "rgb(49, 49, 49)"}}>
            {JSON.stringify(getRatios("accType"))}
          </p> */}
          <ResponsiveContainer width="100%" height="80%">
            <ComposedChart data={binnedAgeGroupsDataByType[selectedAccType]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="range" 
                interval={0}
                tick={{fontSize: 11}}
                angle={-45}
                textAnchor="end"
                height={60}
              />

              {/* left Y-asix for histogram bars */}
              <YAxis yAxisId="left" orientation="left" stroke="rgb(49, 213, 49)" 
              tick={{fontSize: 13}}
              label={{value: 'Count', angle: -90, position: 'insideLeft', fontSize: 14}}/>
              {/* right Y-axis for density line (0 to 1) */}
              <YAxis yAxisId="right" orientation="right" stroke="rgb(126, 222, 96)" 
              tick={{fontSize: 13}}
              label={{value: 'Density', angle: 90, position: 'insideRight', fontSize: 14}}/>

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
        
        {/* 5. stdDevTxn Distribution */}
        <div className="analytics-plot">
          <p>stdDevTxn Distribution & Density</p>
          <ResponsiveContainer width="100%" height="80%">
            <ComposedChart data={stdDevTxnDistData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="range" 
                interval={0}
                tick={{fontSize: 12}}
                angle={-45}
                textAnchor="end"
                height={60}
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

        {/* 6. stdDevTxn by accType */}
        <div className="analytics-plot">
          <div className="analytics-plot-header">
            <p>stdDevTxn by accType</p>
            <div className="options">
              {accountTypes.map((accType) => {
                return (
                  <div 
                    className={selectedAccType === accType ? "selected-option" : "option"} 
                    key={accType}
                    onClick={() => setSelectedAccType(accType)}
                    >
                    {accType.slice(0, 1).toUpperCase() + accType.slice(1, ).toLowerCase()}
                  </div>
                )
              })}
            </div>
          </div>
          {/* <p style={{"color": "rgb(49, 49, 49)"}}>
            {JSON.stringify(getRatios("accType"))}
          </p> */}
          <ResponsiveContainer width="100%" height="80%">
            <ComposedChart data={binnedStdDevGroupsDataByType[selectedAccType]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="range" 
                interval={0}
                tick={{fontSize: 11}}
                angle={-45}
                textAnchor="end"
                height={60}
              />

              {/* left Y-asix for histogram bars */}
              <YAxis yAxisId="left" orientation="left" stroke="rgb(49, 213, 49)" 
              tick={{fontSize: 13}}
              label={{value: 'Count', angle: -90, position: 'insideLeft', fontSize: 14}}/>
              {/* right Y-axis for density line (0 to 1) */}
              <YAxis yAxisId="right" orientation="right" stroke="rgb(126, 222, 96)" 
              tick={{fontSize: 13}}
              label={{value: 'Density', angle: 90, position: 'insideRight', fontSize: 14}}/>

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

        {/* 7. flaggedTxns distribution*/}
        <div className="analytics-plot">
          <p>flaggedTxns Distribution & Density</p>
          <ResponsiveContainer width="100%" height="80%">
            <ComposedChart data={flaggedTxnsDistData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="range" 
                interval={0}
                tick={{fontSize: 12}}
                angle={-45}
                textAnchor="end"
                height={60}
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
              barSize={25} 
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

        {/* 8. flaggedTxns by accType */}
        <div className="analytics-plot">
          <div className="analytics-plot-header">
            <p>flaggedTxns by accType</p>
            <div className="options">
              {accountTypes.map((accType) => {
                return (
                  <div 
                    className={selectedAccType === accType ? "selected-option" : "option"} 
                    key={accType}
                    onClick={() => setSelectedAccType(accType)}
                    >
                    {accType.slice(0, 1).toUpperCase() + accType.slice(1, ).toLowerCase()}
                  </div>
                )
              })}
            </div>
          </div>
          {/* <p style={{"color": "rgb(49, 49, 49)"}}>
            {JSON.stringify(getRatios("accType"))}
          </p> */}
          <ResponsiveContainer width="100%" height="80%">
            <ComposedChart data={binnedFlaggedTxnsGroupsByType[selectedAccType]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="range" 
                interval={0}
                tick={{fontSize: 11}}
                angle={-45}
                textAnchor="end"
                height={60}
              />

              {/* left Y-asix for histogram bars */}
              <YAxis yAxisId="left" orientation="left" stroke="rgb(49, 213, 49)" 
              tick={{fontSize: 13}}
              scale="sqrt" domain={[0, "auto"]}
              label={{value: 'Count', angle: -90, position: 'insideLeft', fontSize: 14}}/>
              {/* right Y-axis for density line (0 to 1) */}
              <YAxis yAxisId="right" orientation="right" stroke="rgb(126, 222, 96)" 
              tick={{fontSize: 13}}
              scale="sqrt" domain={[0, "auto"]}
              label={{value: 'Density', angle: 90, position: 'insideRight', fontSize: 14}}/>

              <Tooltip />
              <Legend labelStyle={{fontSize: 14, fontFamily: "Poppins, sans-serif"}}/>
              <Bar 
              radius={[3, 3, 0, 0]}
              yAxisId="left"
              dataKey="count" 
              fill="rgb(49, 213, 49)" 
              name="Count"
              barSize={25}
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

        {/* 4. lastTxnTimeLocalHour distribution */}
        <div className="analytics-plot">
          <p>lastTxnTime Local hour Distribution & Density</p>
          <ResponsiveContainer width="100%" height="80%">
            <ComposedChart data={lastTxnTimeLocalHourDistData}>
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

        {/* 9 ACCTYPE vs MERCHANT (Stacked Comparison) */}
        <div className="analytics-plot">
          <p>Merchant Type by Account Tier</p>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={merchantAccData} barSize={55}>
              <XAxis dataKey="name" tick={{fontSize: 13}} />
              <YAxis tick={{fontSize: 14}}
              label={{ value: '% of Volume', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend labelStyle={{fontSize: 14, fontFamily: "Poppins, sans-serif"}} />

              {/* 255, 118, 193*/}
              <Bar dataKey="Crypto" stackId="a" fill="rgb(252, 99, 99)" />
              <Bar dataKey="Electronics" stackId="a" fill="rgb(76, 187, 252)" />
              <Bar dataKey="Luxury" stackId="a" fill="rgb(242, 174, 26)" />
              <Bar radius={[3, 3, 0, 0]} dataKey="Grocery" stackId="a" fill="rgb(49, 213, 49)" />
            </BarChart>
          </ResponsiveContainer>
        </div>


        {/* Correlation Map here*/}
        <div className="analytics-plot heat-map">
          <p>Feature Correlation Matrix</p>
          <div className="heat-map-wrapper">
            <ResponsiveHeatMap
              theme={theme}
              data={matrixData}
              margin={{ top: 45, right: 40, bottom: 45, left: 85 }}
              valueFormat=">-.2f"
              axisTop={{ tickSize: 5, tickPadding: 5, tickRotation: -25 }}
              axisLeft={{tickSize: 5, tickPadding: 5, tickRotation: 0}}
              // Using a Diverging color scheme: Red (Positive), Blue (Negative)
              colors={{
                type: 'sequential', // Best for distinct correlation steps
                colors: [
                  'rgb(186, 254, 165)', // light green blue ish
                  'rgb(49, 213, 49)', // dark green ish
                  // '#f8fafc', // Neutral (White/Grey)
                  // '#4ade80', // Light Green
                  // '#1f8b48'  // Dark Green
                ],
              }}
              
              // If your math results are 0 to 1, use 0.5. 
              // If your math results are -1 to 1, use 0.
              divergeAt={0.5} 
              
              emptyColor="#f1f5f9"
              
              // Style the cell labels to be white on dark backgrounds for readability
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
                  title: 'Correlation Coefficient',
                  titleOffset: 4
                }
              ]}
              borderWidth={1}
              borderColor={{ from: 'color', modifiers: [['darker', 0.4]] }}
              annotations={[]}
            />
          </div>
        </div>

      </div>

    </div>
  )
}

export default UsersFeatureAnalytics