package org.example.springbootbackend.model;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.springbootbackend.entity.UserEntity;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {

    int userId;
    String name;
    String accType;   // STUDENT, STANDARD, PREMIUM, BUSINESS
    int accAge;  // in months
    float lastTxnLat;
    float lastTxnLon;
    String lastTxnCity;
    long lastTxnTime;
    String homeCountry;
    int meanTxn30d;
    int stdDevTxn;
    String primaryDeviceId;
    int flaggedTxns;

    public User(UserEntity userEntity) {
        this.userId = userEntity.getUserId();
        this.name = userEntity.getName();
        this.accType = userEntity.getAccType();
        this.accAge = userEntity.getAccAge();
        this.lastTxnLat = userEntity.getLastTxnLat();
        this.lastTxnLon = userEntity.getLastTxnLon();
        this.lastTxnCity = userEntity.getLastTxnCity();
        this.lastTxnTime = userEntity.getLastTxnTime();
        this.homeCountry = userEntity.getHomeCountry();
        this.meanTxn30d = userEntity.getMeanTxn30d();
        this.stdDevTxn = userEntity.getStdDevTxn();
        this.primaryDeviceId = userEntity.getPrimaryDeviceId();
        this.flaggedTxns = userEntity.getFlaggedTxns();
    }
}
