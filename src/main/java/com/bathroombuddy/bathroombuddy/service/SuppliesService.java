package com.bathroombuddy.bathroombuddy.service;

import com.bathroombuddy.bathroombuddy.dto.SuppliesDto;

import java.util.List;

public interface SuppliesService {
    List<SuppliesDto> getAllSupplies();
    SuppliesDto getSuppliesById(Long id);
    void deleteSuppliesById(Long id);
    SuppliesDto createSupplies(SuppliesDto suppliesDto);
    SuppliesDto updateSupplies(SuppliesDto suppliesDto, Long id);
}
