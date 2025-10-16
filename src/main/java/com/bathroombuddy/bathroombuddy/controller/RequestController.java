package com.bathroombuddy.bathroombuddy.controller;

import com.bathroombuddy.bathroombuddy.model.Request;
import com.bathroombuddy.bathroombuddy.service.RequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/request")
public class RequestController {
    private final RequestService requestService;

    public RequestController(RequestService requestService) {
        this.requestService = requestService;
    }

    @GetMapping("/")
    public ResponseEntity<List<Request>> getAllRequests() {
        List <Request> requests = this.requestService.getAllRequests();;
        return ResponseEntity.ok(requests);
    }


}
