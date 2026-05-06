package org.example.springbootbackend.entity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import org.springframework.context.annotation.Primary;


@Entity
@Data
@Table(name = "users")
public class UserEntity {

    @Id
    @Column(name = "userId")
    int userId;
    @Column(name = "name")
    String name;
    @Column(name = "accType")
    String accType;   // STUDENT, STANDARD, PREMIUM, BUSINESS
    @Column(name = "accAge")
    int accAge;  // in months
    @Column(name = "lastTxnLat")
    float lastTxnLat;
    @Column(name = "lastTxnLon")
    float lastTxnLon;
    @Column(name = "lastTxnCity")
    String lastTxnCity;
    @Column(name = "homeCountry")
    String homeCountry;
    @Column(name = "meanTxn30d")
    int meanTxn30d;  // avg of the all the txn amounts across 30 days
    @Column(name = "stdDevTxn")
    int stdDevTxn;
    @Column(name = "primaryDeviceId")
    String primaryDeviceId;
    @Column(name = "flaggedTxns")
    int flaggedTxns;  // no. of flagged transactions from this account
}
