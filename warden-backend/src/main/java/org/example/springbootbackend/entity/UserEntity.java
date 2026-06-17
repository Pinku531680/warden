package org.example.springbootbackend.entity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import org.springframework.context.annotation.Primary;


@Entity
@Data
@Table(name = "users_data")
public class UserEntity {

    @Id
    @Column(name = "user_id")
    int userId;
    @Column(name = "name")
    String name;
    @Column(name = "acc_type")
    String accType;   // STUDENT, STANDARD, PREMIUM, BUSINESS
    @Column(name = "acc_age")
    int accAge;  // in months
    @Column(name = "last_txn_lat")
    float lastTxnLat;
    @Column(name = "last_txn_lon")
    float lastTxnLon;
    @Column(name = "last_txn_city")
    String lastTxnCity;
    @Column(name = "last_txn_time")
    long lastTxnTime;
    @Column(name = "home_country")
    String homeCountry;
    @Column(name = "mean_txn_30d")
    int meanTxn30d;  // avg of the all the txn amounts across 30 days
    @Column(name = "std_dev_txn")
    int stdDevTxn;
    @Column(name = "primary_device_id")
    String primaryDeviceId;
    @Column(name = "flagged_txns")
    int flaggedTxns;  // no. of flagged transactions from this account
}
