import React, {useState, useEffect} from 'react';
import "../DataTable.css";


function TransactionsDataTable({transactionsData}) {

    //console.log(transactionObjects);
    const [rowData, setRowData] = useState([]);
    
    // rowData = [];

    //console.log(rowData);

    const transactionsProperties = [
      "userId", "txnAmt", "txnCountry", "lastTxnCountry", "geoCountryMismatch", "txnTime", "txnLat", "txnLon",
      "merchantType", "deviceId", "txnTimeUTC", "locationHop", 
      "geoDistanceKm", "timeGapLatTxn", "speedKmh", "userAtvDelta",
      "isNewDevice",
      "fraudScore"
    ]

    const [loading, setLoading] = useState(true);

    setTimeout(() => {
        setLoading(false);
    }, 100)

    useEffect(() => {

        let transactionsObj = (!transactionsData || Object.entries(transactionsData)?.length < 1) ? [] :  Object.entries(transactionsData).map(([userId, data]) => {
            return {userId, ...data};
        })

        console.log(transactionsObj);

        setRowData(transactionsObj);

    }, [transactionsData])

    if(!rowData || rowData.length === 0) {
        return (
            <div className="no-data-generated">
                <p>No data generated!</p>
            </div>
        )
    }

    if(loading) {
        return(
            <div className="loading-msg">
                <div className="loading-spinner"></div>
            </div>
        )
    }

    return (
        <div className="data-table">
            <table>
                <thead id="table-header">
                    <tr>
                        {transactionsProperties.map((prop) => {
                            return (
                                <th key={prop}>{prop}</th>
                            )
                        })}
                    </tr>  
                </thead>
                <tbody id="table-body">
                    {rowData?.map((txnDataObj) => {

                        return (
                            <tr key={txnDataObj.userId}>
                                <td>{txnDataObj.userId}</td>
                                <td>{txnDataObj.txnAmt}</td>
                                <td>{txnDataObj.txnCountry}</td>
                                <td>{txnDataObj.lastTxnCountry}</td>
                                <td>{txnDataObj.geoCountryMismatch === true ? "True" : "False"}</td>
                                <td>{txnDataObj.txnTime}</td>
                                <td>{txnDataObj.txnLat}</td>
                                <td>{txnDataObj.txnLon}</td>
                                <td>{txnDataObj.merchantType}</td>
                                <td>{txnDataObj.deviceId}</td>
                                <td>{String(txnDataObj.txnTimeUTC)}</td>
                                <td>{txnDataObj.locationHop}</td>
                                <td>{txnDataObj.geoDistanceKm}</td>
                                <td>{txnDataObj.timeGapLastTxn}</td>
                                <td>{txnDataObj.speedKmh}</td>
                                <td>{txnDataObj.userAtvDelta}</td>
                                <td>{txnDataObj.isNewDevice === true ? "True" : "False"}</td>
                                <td>{txnDataObj.fraudScore}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default TransactionsDataTable;