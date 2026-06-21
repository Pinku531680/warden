package org.example.springbootbackend.utilities;

import org.example.springbootbackend.entity.TransactionEntity;
import org.example.springbootbackend.entity.UserEntity;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class FeatureEngineeringEngine {

    // Earth's mean radius in kilometers for Haversine evaluations
    private static final double EARTH_RADIUS_KM = 6371.0;

    // Internal City-to-Country cross reference matrix for geometric validation
    private static final Map<String, String> CITY_TO_COUNTRY_MAP = new HashMap<>();

    static {
        // --- India ---
        CITY_TO_COUNTRY_MAP.put("Chennai", "India");
        CITY_TO_COUNTRY_MAP.put("Bangalore", "India");
        CITY_TO_COUNTRY_MAP.put("Kanpur", "India");
        CITY_TO_COUNTRY_MAP.put("Lucknow", "India");
        CITY_TO_COUNTRY_MAP.put("Vellore", "India");
        CITY_TO_COUNTRY_MAP.put("Hyderabad", "India");
        CITY_TO_COUNTRY_MAP.put("Warangal", "India");
        CITY_TO_COUNTRY_MAP.put("Pune", "India");
        CITY_TO_COUNTRY_MAP.put("Mumbai", "India");
        CITY_TO_COUNTRY_MAP.put("Thane", "India");

        // --- United States ---
        CITY_TO_COUNTRY_MAP.put("Irvine", "US");
        CITY_TO_COUNTRY_MAP.put("Los Angeles", "US");
        CITY_TO_COUNTRY_MAP.put("Seattle", "US");
        CITY_TO_COUNTRY_MAP.put("Bellevue", "US");
        CITY_TO_COUNTRY_MAP.put("Redmond", "US");
        CITY_TO_COUNTRY_MAP.put("Houston", "US");
        CITY_TO_COUNTRY_MAP.put("Arlington", "US");
        CITY_TO_COUNTRY_MAP.put("Plano", "US");

        // --- Canada ---
        CITY_TO_COUNTRY_MAP.put("Toronto", "Canada");
        CITY_TO_COUNTRY_MAP.put("Montreal", "Canada");
        CITY_TO_COUNTRY_MAP.put("Waterloo", "Canada");

        // --- UAE ---
        CITY_TO_COUNTRY_MAP.put("Dubai", "UAE");
        CITY_TO_COUNTRY_MAP.put("Sharjah", "UAE");

        // --- United Kingdom ---
        CITY_TO_COUNTRY_MAP.put("London", "UK");
        CITY_TO_COUNTRY_MAP.put("Birmingham", "UK");
        CITY_TO_COUNTRY_MAP.put("Manchester", "UK");
        CITY_TO_COUNTRY_MAP.put("Liverpool", "UK");
        CITY_TO_COUNTRY_MAP.put("Glasgow", "UK");
        CITY_TO_COUNTRY_MAP.put("Edinburgh", "UK");

        // --- Switzerland ---
        CITY_TO_COUNTRY_MAP.put("Zurich", "Switzerland");
        CITY_TO_COUNTRY_MAP.put("Geneva", "Switzerland");
        CITY_TO_COUNTRY_MAP.put("Basel", "Switzerland");
        CITY_TO_COUNTRY_MAP.put("Bern", "Switzerland");
        CITY_TO_COUNTRY_MAP.put("Lausanne", "Switzerland");
        CITY_TO_COUNTRY_MAP.put("Lucerne", "Switzerland");

        // --- Germany ---
        CITY_TO_COUNTRY_MAP.put("Berlin", "Germany");
        CITY_TO_COUNTRY_MAP.put("Hamburg", "Germany");
        CITY_TO_COUNTRY_MAP.put("Bremen", "Germany");
        CITY_TO_COUNTRY_MAP.put("Cologne", "Germany");
        CITY_TO_COUNTRY_MAP.put("Munich", "Germany");
        CITY_TO_COUNTRY_MAP.put("Frankfurt", "Germany");
        CITY_TO_COUNTRY_MAP.put("Stuttgart", "Germany");

        // --- Brazil ---
        CITY_TO_COUNTRY_MAP.put("São Paulo", "Brazil");
        CITY_TO_COUNTRY_MAP.put("Salvador", "Brazil");
        CITY_TO_COUNTRY_MAP.put("Rio de Janeiro", "Brazil");

        // --- Turkey ---
        CITY_TO_COUNTRY_MAP.put("Ankara", "Turkey");
        CITY_TO_COUNTRY_MAP.put("Bursa", "Turkey");
        CITY_TO_COUNTRY_MAP.put("Istanbul", "Turkey");
    }

    public void enrichWithEngineeredFeatures(TransactionEntity txn, UserEntity user) {
        // 1. CALCULATE HAVERSINE DISTANCE OVER SPATIAL SPHERES
        int distanceKm = computeHaversineDistance(
                user.getLastTxnLat(), user.getLastTxnLon(),
                txn.getTxnLat(), txn.getTxnLon()
        );
        txn.setGeoDistanceKm(distanceKm);

        // 2. COMPUTE TEMPORAL TIME DELTAS (IN SECONDS)
        long timeGapSeconds = Math.abs(txn.getTxnTimeUTC() - user.getLastTxnTime()) / 1000;
        txn.setTimeGapLastTxn(timeGapSeconds);

        // 3. COMPUTE GEOGRAPHIC VELOCITY CORRELATION (SPEED IN KM/H)
        double timeGapHours = timeGapSeconds / 3600.0;
        int speedKmh = 0;
        if (timeGapHours > 0.0) {
            speedKmh = (int) Math.round(distanceKm / timeGapHours);
        }
        txn.setSpeedKmh(speedKmh);

        // 4. FRAUD VECTOR: CRITICAL VELOCITY ATTAINMENT CHECK (<= 90 Seconds)
        txn.setHighTxnVelocity(timeGapSeconds <= 90);

        // 5. FRAUD VECTOR: DEVICE FINGERPRINT MUTATION VERIFICATION
        txn.setNewDevice(!txn.getDeviceId().equals(user.getPrimaryDeviceId()));

        // 6. FRAUD VECTOR: ABNORMAL OPERATING WINDOW CAPTURE (23:00 -> 04:00 Local)
        int hour = txn.getTxnTimeLocalHour();
        txn.setAbnormalTime(hour >= 23 || hour <= 4);

        // 7. FRAUD VECTOR: HISTORICAL VALUE VARIATION SPREAD (ATV DELTA)
        float averageAmount = user.getMeanTxn30d();
        float deviationSpread = user.getStdDevTxn();
        float atvDelta = 0.0f;
        if (deviationSpread > 0.0f) {
            atvDelta = Math.abs(txn.getTxnAmt() - averageAmount) / deviationSpread;
        }
        // Round to 2 decimal points precision bounds
        txn.setUserAtvDelta(Math.round(atvDelta * 100.0f) / 100.0f);

        // 8. RESOLVE CROSS-BORDER GEOGRAPHIC BOUNDARIES MISMATCH
        String lastKnownCountry = CITY_TO_COUNTRY_MAP.getOrDefault(user.getLastTxnCity(), user.getHomeCountry());
        boolean countryMismatch = !txn.getTxnCountry().equalsIgnoreCase(lastKnownCountry);
        txn.setGeoCountryMismatch(countryMismatch);

        // 9. MAP TRANSACTION LOCATION HOP DYNAMICS CATEGORIES
        if (countryMismatch) {
            txn.setLocationHop("CROSSBORDER");
        } else if (distanceKm > 150) {
            txn.setLocationHop("NATIONAL");
        } else {
            txn.setLocationHop("SAME");
        }
    }

    private int computeHaversineDistance(float lat1, float lon1, float lat2, float lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double rLat1 = Math.toRadians(lat1);
        double rLat2 = Math.toRadians(lat2);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(rLat1) * Math.cos(rLat2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return (int) Math.round(EARTH_RADIUS_KM * c);
    }
}
