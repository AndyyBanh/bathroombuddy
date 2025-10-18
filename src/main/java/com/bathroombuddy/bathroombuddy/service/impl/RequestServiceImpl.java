package com.bathroombuddy.bathroombuddy.service.impl;

import com.bathroombuddy.bathroombuddy.dto.RequestDto;
import com.bathroombuddy.bathroombuddy.model.Request;
import com.bathroombuddy.bathroombuddy.repository.RequestRepository;
import com.bathroombuddy.bathroombuddy.service.RequestService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RequestServiceImpl implements RequestService {
    private final RequestRepository requestRepository;

    public RequestServiceImpl(RequestRepository requestRepository) {
        this.requestRepository = requestRepository;
    }

    @Override
    public List<RequestDto> getAllRequests() {
        return this.requestRepository.findAll().stream().map(this::mapToDTo).collect(Collectors.toList());
    }

    @Override
    public RequestDto getRequestById(Long id) {
        Request request = this.requestRepository.findById(id).orElseThrow(() -> new IllegalStateException("Request with id " + id + " not found"));
        return mapToDTo(request);
    }

    // create when washroom and supplies are created
//    @Override
//    public RequestDto createRequest() {
//
//    }

    @Override
    public void deleteRequest(Long id) {
        Request request = this.requestRepository.findById(id).orElseThrow(() -> new IllegalStateException("Request with id " + id + " not found"));
        this.requestRepository.delete(request);
    }




    // Mapping method
    private RequestDto mapToDTo(Request request) {
        RequestDto dto = new RequestDto();
        dto.setId(request.getId());
        dto.setType(request.getType().getType());
        dto.setWashroom(request.getLocation().getName());
        dto.setStatus(request.getStatus());
        dto.setCreatedAt(request.getCreatedAt());
        return dto;
    }
}




