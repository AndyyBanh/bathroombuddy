package com.bathroombuddy.bathroombuddy.controller;

import com.bathroombuddy.bathroombuddy.dto.WashroomDto;
import com.bathroombuddy.bathroombuddy.service.WashroomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/washroom")
public class WashroomController {
    private final WashroomService washroomService;

    @Autowired
    public WashroomController(WashroomService washroomService) {
        this.washroomService = washroomService;
    }

    @GetMapping
    public ResponseEntity<List<WashroomDto>> getAllWashrooms() {
        return  ResponseEntity.ok(this.washroomService.getAllWashrooms());
    }

    @GetMapping("{id}")
    public ResponseEntity<WashroomDto> getWashroomById(@PathVariable Long id) {
        return ResponseEntity.ok(this.washroomService.getWashroomById(id));
    }

    @PostMapping
    public ResponseEntity<WashroomDto> createWashroom(@RequestBody WashroomDto washroomDto) {
        WashroomDto created = this.washroomService.createWashroom(washroomDto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<WashroomDto> updateWashroom(@RequestBody WashroomDto washroomDto, @PathVariable Long id) {
        return ResponseEntity.ok(this.washroomService.updateWashroom(washroomDto, id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteWashroomById(@PathVariable Long id) {
        this.washroomService.deleteWashroomById(id);
        return ResponseEntity.ok("Washroom deleted successfully");
    }
}
