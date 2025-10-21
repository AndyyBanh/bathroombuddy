package com.bathroombuddy.bathroombuddy.service;

import com.bathroombuddy.bathroombuddy.dto.RequestDto;

import java.util.List;

public interface RequestService {
    List<RequestDto> getAllRequests();
    RequestDto getRequestById(Long id);
    void deleteRequest(Long id);
    RequestDto createRequest(RequestDto requestDto);
    RequestDto updateRequest(RequestDto requestDto, Long id);
}
