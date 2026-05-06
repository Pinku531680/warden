package org.example.springbootbackend.entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "transactions")
public class TransactionEntity {

    // this is what gets saved in the DB with status = "PENDING" while transaction is being processed
    // later status changes to "REJECTED" or "APPROVED"

    @Id
    @Column(name = "txnId")
    long txnId;
    @Column(name = "userId")
    int userId;
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
    @Column(name = "copyPastedCardNo")
    boolean copyPastedCardNo;
    @Column(name = "geoCountryMismatch")
    boolean geoCountryMismatch;
    @Column(name = "geoDistanceKm")
    int geoDistanceKm;
    @Column(name = "timeGapLastTxn")
    long timeGapLastTxn;
    @Column(name = "isAbnormalTime")
    boolean isAbrormalTime;
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
