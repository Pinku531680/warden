import React from 'react'

function Table({usersData}) {

    const usersProperties = [
        "id", "name", "accType", "lastTxnTime", "lastTxnLat", "lastTxnLon",
        "lastTxnCity", "homeCountry", "monthlyAvgTxn", "stdDevTxn", "flaggedTxn", 
        "accAge", "primaryDeviceId"
    ];

    const propertyWidths = {
        "id": 40,
        "name": 60,
        "accType": 40,
        "lastTxnTime": 75,
        "lastTxnLat": 60,
        "lastTxnLon": 60,
        "lastTxnCity": 60,
        "homeCountry": 40,
        "monthlyAvgTxn": 50,
        "stdDevTxn": 50,
        "flaggedTxn": 50,
        "accAge": 40,
        "primaryDeviceId": 50
    };

    console.log(usersData);

  return (
    <div>
        <table className='styled-table'>
            <thead>
                <tr>
                    {usersProperties.map((prop) => {
                        return (
                            <th>{prop}</th>
                        )
                    })}
                </tr>
            </thead>
            <tbody>
                {Object.entries(usersData).map(([userId, details]) => {

                    return (
                        <tr key={userId}>
                            {Object.values(details).map((val, index) => {
                            return (
                            <td key={index}>{val}</td>
                            )
                        })}
                        </tr>
                    )
                })}
            </tbody>
        </table>
    </div>
  )
}

export default Table