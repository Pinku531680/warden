package org.example.springbootbackend.model;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;


@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class TransactionRequest {

    @NotBlank(message = "txnId cannot be blank")
    String txnId;

    @NotNull(message = "userId cannot be NULL")
    int userId;

    @NotNull
    @Positive(message= "txnAmt must be positive")
    int txnAmt;

    String txnCountry;
    @NotNull(message = "txnTime cannot be NULL")
    long txnTime;

    @NotNull
    float txnLat;
    @NotNull
    float txnLon;

    boolean copyPastedCardNo; // 0 or 1, false or true
    String merchantType;  // LUXURY, GROCERY, DIGITAL, TRAVEL, CRYPTO
    String deviceId;

    @Override
    public String toString() {

        return String.format("{txnId: %s, userId: %d, \ntxnAmt: %d, txnCountry: %s," +
                        "\ntxnLat: %f, txnLon: %f, copyPastedCardNo: %b, " +
                        "\nmerchantType: %s, deviceId: %s}",
                txnId, userId, txnAmt, txnCountry, txnLat, txnLon, copyPastedCardNo, merchantType, deviceId);
    }

}
