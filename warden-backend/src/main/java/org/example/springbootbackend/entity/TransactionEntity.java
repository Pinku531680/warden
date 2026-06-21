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
@Table(name = "transactions_production") // Isolated table space for live operational audits
@Getter
@Setter
public class TransactionEntity {

    @Id
    @Column(name = "txn_id", length = 36)
    private String txnId;

    @Column(name = "user_id")
    private int userId;

    @Column(name = "txn_amt")
    private int txnAmt;

    @Column(name = "acc_type")
    private String accType;

    @Column(name = "acc_age")
    private int accAge;

    @Column(name = "flagged_txns")
    private int flaggedTxns;

    @Column(name = "merchant_type")
    private String merchantType;

    @Column(name = "txn_lat")
    private float txnLat;

    @Column(name = "txn_lon")
    private float txnLon;

    @Column(name = "txn_time_utc")
    private long txnTimeUTC;

    @Column(name = "txn_time_local_hour")
    private int txnTimeLocalHour;

    @Column(name = "txn_country")
    private String txnCountry;

    @Column(name = "device_id")
    private String deviceId;

    // Real-time calculated feature parameters
    @Column(name = "geo_country_mismatch")
    private boolean geoCountryMismatch;

    @Column(name = "location_hop")
    private String locationHop;

    @Column(name = "geo_distance_km")
    private int geoDistanceKm;

    @Column(name = "time_gap_last_txn")
    private long timeGapLastTxn;

    @Column(name = "is_abnormal_time")
    private boolean isAbnormalTime;

    @Column(name = "high_txn_velocity")
    private boolean highTxnVelocity;

    @Column(name = "user_atv_delta")
    private float userAtvDelta;

    @Column(name = "is_new_device")
    private boolean isNewDevice;

    @Column(name = "speed_kmh")
    private int speedKmh;

    // Live execution state tracking parameters
    @Column(name = "fraud_score")
    private float fraudScore; // Filled down real-time network predictions

    @Column(name = "status", length = 20)
    private String status; // "PENDING", "APPROVED", "REJECTED"

    @Column(name = "client_id", length = 100)
    private String clientId;

    @Column(name = "inserted_at", updatable = false)
    private java.time.LocalDateTime insertedAt;

    /**
     * JPA Lifecycle Hook: Fires automatically right before
     * the row gets written to the PostgreSQL table layout.
     */
    @jakarta.persistence.PrePersist
    protected void onCreateLogStamp() {
        this.insertedAt = java.time.LocalDateTime.now();
    }
}
