import React, {useState, useEffect} from 'react';
import "../DataTable.css";


function UsersDataTable({usersData}) {

    //console.log(transactionObjects);

    let rowData = Object.entries(usersData).map(([id, data]) => {
        return {id, ...data};
    })
    
    // rowData = [];

    //console.log(rowData);

    const usersProperties = [
        "id", "name", "accType", "lastTxnTime", "lastTxnLat", "lastTxnLon",
        "lastTxnCity", "homeCountry", "meanTxn30d", "stdDevTxn", "flaggedTxns", 
        "accAge", "primaryDeviceId"
    ];

    const handleClick = () => {

        // Object.keys(usersData).forEach((userId) => {

        //     console.log(usersData[userId])
        // });

        console.log(Object.entries(usersData));
    }

    const [loading, setLoading] = useState(true);

    setTimeout(() => {
        setLoading(false);
    }, 1500)

    if(rowData.length == 0) {
        return (
            <div className="no-data-generated">
                <p>No data geneated!</p>
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
                        {usersProperties.map((prop) => {
                            return (
                                <th key={prop}>{prop}</th>
                            )
                        })}
                    </tr>  
                </thead>
                <tbody id="table-body">
                    {rowData?.map((userDataObj) => {

                        return (
                            <tr key={userDataObj.id}>
                                <td>{userDataObj.id}</td>
                                <td>{userDataObj.name}</td>
                                <td>{userDataObj.accType}</td>
                                <td>{userDataObj.lastTxnTime}</td>
                                <td>
                                    {userDataObj.lastTxnLat}
                                </td>
                                <td>{userDataObj.lastTxnLon}</td>
                                <td>{userDataObj.lastTxnCity}</td>
                                <td>{userDataObj.homeCountry}</td>
                                <td>{userDataObj.meanTxn30d}</td>
                                <td>{userDataObj.stdDevTxn}</td>
                                <td>{userDataObj.flaggedTxns}</td>
                                <td>{userDataObj.accAge}</td>
                                <td>{userDataObj.primaryDeviceId}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default UsersDataTable