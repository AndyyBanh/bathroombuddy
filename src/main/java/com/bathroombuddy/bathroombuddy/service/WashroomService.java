package com.bathroombuddy.bathroombuddy.service;

import com.bathroombuddy.bathroombuddy.dto.WashroomDto;

import java.util.List;

public interface WashroomService {
    List<WashroomDto> getAllWashrooms();
    WashroomDto getWashroomById(Long id);
    WashroomDto createWashroom(WashroomDto washroomDto);
    WashroomDto updateWashroom(WashroomDto washroomDto, Long id);
    void deleteWashroomById(Long id);

}
