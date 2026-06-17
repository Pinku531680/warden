package org.example.springbootbackend.services;

import org.example.springbootbackend.entity.TransactionEntityTraining;
import org.example.springbootbackend.model.proto.TransactionProtoMsg;
import org.example.springbootbackend.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionTrainingIngestionService {

    private final TransactionRepository transactionRepository;

    public TransactionTrainingIngestionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    @Transactional
    public void saveProtoIngestedChunk(List<TransactionProtoMsg> protoPayload) {
        // this is saved for training in "transactions_training" table

        List<TransactionEntityTraining> entities = protoPayload.stream().map(proto -> {
            TransactionEntityTraining entity = new TransactionEntityTraining();

            // Primary Identity Mapping
            entity.setTxnId(proto.getTxnId());

            // Basic txn features
            entity.setTxnAmt(proto.getTxnAmt());
            entity.setTxnTimeUTC(proto.getTxnTimeUTC());
            entity.setTxnTimeLocalHour(proto.getTxnTimeLocalHour());
            entity.setTxnCountry(proto.getTxnCountry());
            entity.setTxnLat(proto.getTxnLat());
            entity.setTxnLon(proto.getTxnLon());
            entity.setMerchantType(proto.getMerchantType());
            entity.setDeviceId(proto.getDeviceId());


            // Raw Numerical & String Attributes Mapping
            entity.setAccType(proto.getAccType());
            entity.setAccAge(proto.getAccAge());
            entity.setFlaggedTxns(proto.getFlaggedTxns());

            // Engineered Features Mapping
            entity.setGeoCountryMismatch(proto.getGeoCountryMismatch());
            entity.setGeoDistanceKm(proto.getGeoDistanceKm());
            entity.setTimeGapLastTxn(proto.getTimeGapLastTxn());
            entity.setHighTxnVelocity(proto.getHighTxnVelocity());
            entity.setUserAtvDelta(proto.getUserAtvDelta());
            entity.setNewDevice(proto.getIsNewDevice());
            entity.setSpeedKmh(proto.getSpeedKmh());
            entity.setAbnormalTime(proto.getIsAbnormalTime());
            entity.setLocationHop(proto.getLocationHop());

            entity.setFraudScore(proto.getFraudScore());

            return entity;
        }).collect(Collectors.toList());

        // We are saving all these properties that we get from frontend, but for training
        // we definitely don't wnat all these, we focus on engineered values like -
        // geoCountryMismatch, geoDistanceKm, timeGapLastTxn, isAbnormalTime, highTxnVelocity,
        // isNewDevice, speedKmh, fraudScore
        // And then the other user data fields that we actually need are just -
        //  accType, accAge, flaggedTxns
        // And then some txn values like - txnAmt, merchantType
        transactionRepository.saveAll(entities);
    }
}
