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
public class TransactionEntity {

    // this is what gets saved in the DB with status = "PENDING" while transaction is being processed
    // later status changes to "REJECTED" or "APPROVED"

    @Id
    @Column(name = "txnId")
    String txnId;
    @Column(name = "txnAmt")
    int txnAmt;
    @Column(name = "accType")
    String accType;
    @Column(name = "accAge")
    int accAge;
    @Column(name = "flaggedTxns")
    int flaggedTxns;
    @Column(name = "merchantType")
    String merchantType;
    @Column(name = "txnLat")
    float txnLat;
    @Column(name = "txnLon")
    float txnLon;

    @Column(name = "txnTimeUTC")
    long txnTimeUTC;
    @Column(name = "txnTimeLocalHour")
    int txnTimeLocalHour;
    @Column(name = "txnCountry")
    String txnCountry;
    @Column(name = "deviceId")
    String deviceId;



    @Column(name = "geoCountryMismatch")
    boolean geoCountryMismatch;
    @Column(name = "locationHop")
    String locationHop;
    @Column(name = "geoDistanceKm")
    int geoDistanceKm;
    @Column(name = "timeGapLastTxn")
    long timeGapLastTxn;
    @Column(name = "isAbnormalTime")
    boolean isAbnormalTime;
    @Column(name = "highTxnVelocity")
    boolean highTxnVelocity;
    @Column(name = "userAtvDelta")
    float userAtvDelta;
    @Column(name = "isNewDevice")
    boolean isNewDevice;
    @Column(name = "speedKmh")
    int speedKmh;

    @Column(name = "fraudScore")
    float fraudScore;  // from the Python service after prediction, b/w 0 and 1

}
