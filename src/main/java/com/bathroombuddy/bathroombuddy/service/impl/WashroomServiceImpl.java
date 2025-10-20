package com.bathroombuddy.bathroombuddy.service.impl;

import com.bathroombuddy.bathroombuddy.dto.WashroomDto;
import com.bathroombuddy.bathroombuddy.model.Washroom;
import com.bathroombuddy.bathroombuddy.repository.WashroomRepository;
import com.bathroombuddy.bathroombuddy.service.WashroomService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WashroomServiceImpl implements WashroomService {
    private final WashroomRepository washroomRepository;

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
    public List<WashroomDto> getAllWashrooms() {
        return this.washroomRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public WashroomDto getWashroomById(Long id) {
        Washroom washroom = this.washroomRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Washroom not found"));
        return mapToDto(washroom);
    }

    @Override
    public WashroomDto createWashroom(WashroomDto washroomDto) {
        Washroom washroom = new Washroom(washroomDto.getName(), washroomDto.getFloor());
        this.washroomRepository.save(washroom);
        return mapToDto(washroom);
    }

    @Override
    public WashroomDto updateWashroom(WashroomDto washroomDto, Long id) {
        Washroom washroom = this.washroomRepository.findById(id).orElseThrow(() -> new IllegalStateException("Washroom with id " + id + " not found"));
        washroom.setName(washroomDto.getName());
        washroom.setFloor(washroomDto.getFloor());
        this.washroomRepository.save(washroom);
        return mapToDto(washroom);
    }

    @Override
    public void deleteWashroomById(Long id) {
        Washroom washroom = this.washroomRepository.findById(id).orElseThrow(() -> new IllegalStateException("Washroom with id " + id + " not found"));
        this.washroomRepository.delete(washroom);
    }


}
