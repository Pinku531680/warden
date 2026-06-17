package org.example.springbootbackend.entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity
@Data
@Table(name = "transactions_training")
@Getter
@Setter
public class TransactionEntityTraining {

    // this is what gets saved in the DB with status = "PENDING" while transaction is being processed
    // later status changes to "REJECTED" or "APPROVED"
    @Id
    @Column(name = "txn_id")
    String txnId;
    @Column(name = "txn_amt")
    int txnAmt;
    @Column(name = "acc_type")
    String accType;
    @Column(name = "acc_age")
    int accAge;
    @Column(name = "flagged_txns")
    int flaggedTxns;
    @Column(name = "merchant_type")
    String merchantType;
    @Column(name = "txn_lat")
    float txnLat;
    @Column(name = "txn_lon")
    float txnLon;

    @Column(name = "txn_time_utc")
    long txnTimeUTC;
    @Column(name = "txn_time_local_hour")
    int txnTimeLocalHour;
    @Column(name = "txn_country")
    String txnCountry;
    @Column(name = "device_id")
    String deviceId;



    @Column(name = "geo_country_mismatch")
    boolean geoCountryMismatch;
    @Column(name = "location_hop")
    String locationHop;
    @Column(name = "geo_distance_km")
    int geoDistanceKm;
    @Column(name = "time_gap_last_txn")
    long timeGapLastTxn;
    @Column(name = "is_abnormal_time")
    boolean isAbnormalTime;
    @Column(name = "high_txn_velocity")
    boolean highTxnVelocity;
    @Column(name = "user_atv_delta")
    float userAtvDelta;
    @Column(name = "is_new_device")
    boolean isNewDevice;
    @Column(name = "speed_kmh")
    int speedKmh;

    @Column(name = "fraud_score")
    float fraudScore;  // from the Python service after prediction, b/w 0 and 1

}
