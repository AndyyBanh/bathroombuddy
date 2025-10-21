package com.bathroombuddy.bathroombuddy.controller;

import com.bathroombuddy.bathroombuddy.dto.RequestDto;
import com.bathroombuddy.bathroombuddy.model.Request;
import com.bathroombuddy.bathroombuddy.service.RequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/request")
public class RequestController {
    private final RequestService requestService;

    @Autowired
    public RequestController(RequestService requestService) {
        this.requestService = requestService;
    }

    @GetMapping
    public ResponseEntity<List<RequestDto>> getAllRequests() {
        return ResponseEntity.ok(this.requestService.getAllRequests());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RequestDto> getRequestById(@PathVariable Long id) {
        return ResponseEntity.ok(this.requestService.getRequestById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRequest(@PathVariable Long id) {
        this.requestService.deleteRequest(id);
        return new ResponseEntity<>("Request deleted",HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<RequestDto> createRequest(@RequestBody RequestDto requestDto) {
        RequestDto created = this.requestService.createRequest(requestDto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RequestDto> updateRequest(@RequestBody RequestDto requestDto, @PathVariable Long id) {
        return ResponseEntity.ok(this.requestService.updateRequest(requestDto, id));

    }


}
