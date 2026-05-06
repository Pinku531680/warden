package org.example.springbootbackend.model;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.springbootbackend.entity.TransactionEntity;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponse {

    // this TransactionResponse is the model that is sent back to the frontend
    // after the Python service has predicted and pushed the results to MQ
    // the frontend requires almost all the fields as in the TransactionEntity as we have analytics there
    // the structure here is almost similar to TransactionEntity

    private String txnId;
    private int txnAmt;
    private String accType;  // STUDENT, STANDARD, PREMIUM, BUSINESS
    private int accAge;
    private int flaggedTxns;
    private String merchantType;  // GROCERY, DIGITAL, LUXURY, TRAVEL or CRYPTO

    // this is called behaviour_was_pasted in Python service, the name here is simple because this is sent
    // to the frontend for visualization and analytics
    private boolean copyPastedCardNo;
    private boolean geoCountryMismatch;  // if txnCountry != lastTxnCountry
    private int geoDistanceKm;  // computed as geodesic distance b/w (txnLat, txnLon) and (lastTxnLat, lastTxnLon)
    private long timeGapLastTxn;
    private boolean isAbnormalTime;  // basically we get the local time of country using txnCountry and then
    // compute actual time there, and see if it is in the range 11 PM - 3 AM

    private boolean highTxnVelocity;  // called is_high_velocity in Python service
    private float userAtvDelta;  // computed using meanTxn30d and stdDevTxn
    private boolean isNewDevice;
    private int speedKmh;  // computed using the (currTxnTime - lastTxnTime) / geoDistanceKm

    private float fraudScore;  // value from the Python service, b/w 0 and 1
}
