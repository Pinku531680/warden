package org.example.springbootbackend.repository;

import org.example.springbootbackend.model.User;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

@Repository
public class UserRepositoryImpl implements UserRepositoryCustom {

    private final JdbcTemplate jdbcTemplate;

    // Constructor injection for Spring's high-performance JDBC execution client
    public UserRepositoryImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void bulkInsertUsers(List<User> users) {
        if (users == null || users.isEmpty()) {
            System.out.println("Bulk Insert Aborted: Incoming users seeding list is empty.");
            return;
        }

        System.out.printf("Initializing high-speed JDBC Batch update for %d user profiles...\n", users.size());

        // Aligned query matching your custom snake_case SQL columns layout
        // Includes an ON CONFLICT clause to prevent crashes if the same seed script is triggered twice
        String sql = "INSERT INTO users_data (" +
                "user_id, name, acc_type, acc_age, last_txn_lat, last_txn_lon, " +
                "last_txn_city, last_txn_time, home_country, mean_txn_30d, std_dev_txn, primary_device_id, flagged_txns" +
                ") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) " +
                "ON CONFLICT (user_id) DO UPDATE SET " +
                "name = EXCLUDED.name, " +
                "acc_type = EXCLUDED.acc_type, " +
                "acc_age = EXCLUDED.acc_age, " +
                "last_txn_lat = EXCLUDED.last_txn_lat, " +
                "last_txn_lon = EXCLUDED.last_txn_lon, " +
                "last_txn_city = EXCLUDED.last_txn_city, " +
                "last_txn_time = EXCLUDED.last_txn_time, " +
                "home_country = EXCLUDED.home_country, " +
                "mean_txn_30d = EXCLUDED.mean_txn_30d, " +
                "std_dev_txn = EXCLUDED.std_dev_txn, " +
                "primary_device_id = EXCLUDED.primary_device_id, " +
                "flagged_txns = EXCLUDED.flagged_txns";

        // Break the full array list up into optimal pages/batches of 1000 rows
        int batchSize = 1000;
        for (int i = 0; i < users.size(); i += batchSize) {
            List<User> batchList = users.subList(i, Math.min(i + batchSize, users.size()));

            jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
                @Override
                public void setValues(PreparedStatement ps, int index) throws SQLException {
                    User user = batchList.get(index);

                    ps.setInt(1, user.getUserId());
                    ps.setString(2, user.getName());
                    ps.setString(3, user.getAccType());
                    ps.setInt(4, user.getAccAge());
                    ps.setFloat(5, user.getLastTxnLat());
                    ps.setFloat(6, user.getLastTxnLon());
                    ps.setString(7, user.getLastTxnCity());
                    ps.setLong(8, user.getLastTxnTime());
                    ps.setString(9, user.getHomeCountry());
                    ps.setInt(10, user.getMeanTxn30d()); // maps to mean_txn_30d
                    ps.setInt(11, user.getStdDevTxn());
                    ps.setString(12, user.getPrimaryDeviceId());
                    ps.setInt(13, user.getFlaggedTxns());
                }

                @Override
                public int getBatchSize() {
                    return batchList.size();
                }
            });

            System.out.printf(">>Flushed batch partition window up to index: %d rows\n", Math.min(i + batchSize, users.size()));
        }

        System.out.printf("Relational Synchronization Closed: Successfully persisted %d entries to users_data.\n", users.size());
        System.out.println("-".repeat(30));
    }
}
