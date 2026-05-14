package com.bathroombuddy.bathroombuddy.service;

import com.bathroombuddy.bathroombuddy.dto.RequestDto;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface RequestService {
    List<RequestDto> getAllRequests(String status, Pageable pageable);
    RequestDto getRequestById(Long id);
    void deleteRequest(Long id);
    RequestDto createRequest(RequestDto requestDto);
    RequestDto updateRequest(RequestDto requestDto, Long id);
}
