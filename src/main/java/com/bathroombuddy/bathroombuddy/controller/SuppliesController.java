package com.bathroombuddy.bathroombuddy.controller;

import com.bathroombuddy.bathroombuddy.dto.SuppliesDto;
import com.bathroombuddy.bathroombuddy.service.SuppliesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/supplies")
public class SuppliesController {
    private final SuppliesService suppliesService;

    @Autowired
    public SuppliesController(SuppliesService suppliesService) {
        this.suppliesService = suppliesService;
    }

    @GetMapping
    public ResponseEntity<List<SuppliesDto>> getAllSupplies() {
        return ResponseEntity.ok(this.suppliesService.getAllSupplies());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SuppliesDto> getSuppliesById(@PathVariable Long id) {
        return ResponseEntity.ok(this.suppliesService.getSuppliesById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSuppliesById(@PathVariable Long id) {
        this.suppliesService.deleteSuppliesById(id);
        return ResponseEntity.ok("Supplies deleted successfully");
    }

    @PostMapping
    public ResponseEntity<SuppliesDto> createSupplies(@RequestBody SuppliesDto suppliesDto) {
        System.out.println("Creating supply: " + suppliesDto.getType());
        SuppliesDto created = this.suppliesService.createSupplies(suppliesDto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SuppliesDto> updateSupplies(@RequestBody SuppliesDto suppliesDto, @PathVariable Long id) {
        return ResponseEntity.ok(this.suppliesService.updateSupplies(suppliesDto, id));
    }

}
