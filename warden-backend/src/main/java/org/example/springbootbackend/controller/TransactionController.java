package org.example.springbootbackend.controller;

import org.example.springbootbackend.model.TransactionRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(value = "*")
@RestController
@RequestMapping("/api/v1")
public class TransactionController {

    @GetMapping("/txn-testing")
    public ResponseEntity<?> testing() {
        System.out.println("Testing Route Hit!");

        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Route working!");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/process-txn")
    public ResponseEntity<?> processTxn(@RequestBody TransactionRequest txnReq) {

        // we get the TransactionRequest object here
        // and form a TransactionEntity object by feature engineering the required features
        // and the TransactionEntity has all the attributes required for inference in Python ML service
        // and also saving in postgres database;

        System.out.println(txnReq.toString());

        Map<String,String> response = new HashMap<>();
        response.put("statusCode", "200");
        response.put("status", "success");
        response.put("message", "txnObj received");

        return ResponseEntity.ok(response);
    }
}
