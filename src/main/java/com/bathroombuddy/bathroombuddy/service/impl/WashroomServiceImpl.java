package com.bathroombuddy.bathroombuddy.service.impl;

import com.bathroombuddy.bathroombuddy.dto.WashroomDto;
import com.bathroombuddy.bathroombuddy.exceptions.WashroomNotFoundException;
import com.bathroombuddy.bathroombuddy.model.Washroom;
import com.bathroombuddy.bathroombuddy.repository.WashroomRepository;
import com.bathroombuddy.bathroombuddy.service.WashroomService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WashroomServiceImpl implements WashroomService {
    private final WashroomRepository washroomRepository;
    private static final Logger logger = LoggerFactory.getLogger(WashroomServiceImpl.class);
    public WashroomServiceImpl(WashroomRepository washroomRepository) {
        this.washroomRepository = washroomRepository;
    }

    private WashroomDto mapToDto(Washroom washroom) {
        WashroomDto washroomDto = new WashroomDto();
        washroomDto.setId(washroom.getId());
        washroomDto.setName(washroom.getName());
        washroomDto.setFloor(washroom.getFloor());
        return washroomDto;
    }

    @Override
    @Cacheable(value = "washroom", key = "'all'")
    public List<WashroomDto> getAllWashrooms() {
        logger.info(">>>> getting all washrooms making DB request");
        return this.washroomRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public WashroomDto getWashroomById(Long id) {
        Washroom washroom = this.washroomRepository.findById(id).orElseThrow(() -> new WashroomNotFoundException("Washroom with associated id " + id + " not found"));
        return mapToDto(washroom);
    }

    @Override
    @CacheEvict(value = "washroom", allEntries = true)
    public WashroomDto createWashroom(WashroomDto washroomDto) {
        Washroom washroom = new Washroom(washroomDto.getName(), washroomDto.getFloor());
        this.washroomRepository.save(washroom);
        return mapToDto(washroom);
    }

    @Override
    @CacheEvict(value = "washroom", allEntries = true)
    public WashroomDto updateWashroom(WashroomDto washroomDto, Long id) {
        logger.info(">>>> updating washroom with associated id " + id);
        Washroom washroom = this.washroomRepository.findById(id).orElseThrow(() -> new WashroomNotFoundException("Washroom with associated id " + id + " not found"));
        washroom.setName(washroomDto.getName());
        washroom.setFloor(washroomDto.getFloor());
        this.washroomRepository.save(washroom);
        return mapToDto(washroom);
    }

    @Override
    @CacheEvict(value = "washroom", allEntries = true)
    public void deleteWashroomById(Long id) {
        Washroom washroom = this.washroomRepository.findById(id).orElseThrow(() -> new WashroomNotFoundException("Washroom with associated id " + id + " not found"));
        this.washroomRepository.delete(washroom);
    }
}
