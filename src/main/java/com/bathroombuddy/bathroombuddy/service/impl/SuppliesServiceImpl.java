package com.bathroombuddy.bathroombuddy.service.impl;

import com.bathroombuddy.bathroombuddy.dto.SuppliesDto;
import com.bathroombuddy.bathroombuddy.exceptions.SuppliesNotFoundException;
import com.bathroombuddy.bathroombuddy.model.Supplies;
import com.bathroombuddy.bathroombuddy.repository.SuppliesRepository;
import com.bathroombuddy.bathroombuddy.service.SuppliesService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SuppliesServiceImpl implements SuppliesService {

    private final SuppliesRepository suppliesRepository;
    private static final Logger logger = LoggerFactory.getLogger(SuppliesServiceImpl.class);
    @Autowired
    public SuppliesServiceImpl(SuppliesRepository suppliesRepository) {
        this.suppliesRepository = suppliesRepository;
    }

    private SuppliesDto mapToDto(Supplies supplies) {
        SuppliesDto suppliesDto = new SuppliesDto();
        suppliesDto.setId(supplies.getId());
        suppliesDto.setType(supplies.getType());
        suppliesDto.setQuantity(supplies.getQuantity());
        suppliesDto.setLastReplenished(supplies.getLastReplenished());
        return suppliesDto;
    }


    @Override
    @Cacheable(value = "supplies", key = "'all'")
    public List<SuppliesDto> getAllSupplies() {
        logger.info(">>>> fetching all supplies");
        return this.suppliesRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public SuppliesDto getSuppliesById(Long id) {
        Supplies supply = this.suppliesRepository.findById(id).orElseThrow(() -> new SuppliesNotFoundException("Supplies with associated id " + id + " not found"));
        return mapToDto(supply);
    }

    @Override
    @CacheEvict(value = "supplies", allEntries = true)
    public void deleteSuppliesById(Long id) {
        logger.info(">>>> deleting supplies with associated id " + id);
        Supplies supply = this.suppliesRepository.findById(id).orElseThrow(() -> new SuppliesNotFoundException("Supplies with associated id " + id + " not found"));
        this.suppliesRepository.delete(supply);
    }

    @Override
    @CacheEvict(value = "supplies", allEntries = true)
    public SuppliesDto createSupplies(SuppliesDto suppliesDto) {
        logger.info(">>>> creating supplies");
        Supplies supply = new Supplies();
        supply.setType(suppliesDto.getType());
        supply.setQuantity(suppliesDto.getQuantity());
        supply.setLastReplenished(suppliesDto.getLastReplenished() != null ? suppliesDto.getLastReplenished() : LocalDateTime.now());

        Supplies newSupply = this.suppliesRepository.save(supply);

        SuppliesDto supplyResponse = new SuppliesDto();
        supplyResponse.setId(newSupply.getId());
        supplyResponse.setType(newSupply.getType());
        supplyResponse.setQuantity(newSupply.getQuantity());
        supplyResponse.setLastReplenished(newSupply.getLastReplenished());
        return supplyResponse;

    }

    @Override
    @CacheEvict(value = "supplies", allEntries = true)
    public SuppliesDto updateSupplies(SuppliesDto suppliesDto, Long id) {
        logger.info(">>>> updating supplies with associated id " + id);
        Supplies supply = this.suppliesRepository.findById(id).orElseThrow(() -> new SuppliesNotFoundException("Supplies with associated id " + id + " not found"));

        supply.setType(suppliesDto.getType());
        supply.setQuantity(suppliesDto.getQuantity());
        supply.setLastReplenished(LocalDateTime.now());
        Supplies updatedSupply = this.suppliesRepository.save(supply);
        return mapToDto(updatedSupply);
    }
}
