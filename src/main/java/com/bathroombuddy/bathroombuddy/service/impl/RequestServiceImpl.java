package com.bathroombuddy.bathroombuddy.service.impl;

import com.bathroombuddy.bathroombuddy.dto.RequestDto;
import com.bathroombuddy.bathroombuddy.exceptions.RequestNotFoundException;
import com.bathroombuddy.bathroombuddy.exceptions.SuppliesNotFoundException;
import com.bathroombuddy.bathroombuddy.exceptions.WashroomNotFoundException;
import com.bathroombuddy.bathroombuddy.model.Request;
import com.bathroombuddy.bathroombuddy.model.Supplies;
import com.bathroombuddy.bathroombuddy.model.Washroom;
import com.bathroombuddy.bathroombuddy.repository.RequestRepository;
import com.bathroombuddy.bathroombuddy.repository.SuppliesRepository;
import com.bathroombuddy.bathroombuddy.repository.WashroomRepository;
import com.bathroombuddy.bathroombuddy.service.RequestService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RequestServiceImpl implements RequestService {
    private final RequestRepository requestRepository;
    private final SuppliesRepository suppliesRepository;
    private final WashroomRepository washroomRepository;

    public RequestServiceImpl(RequestRepository requestRepository, SuppliesRepository suppliesRepository, WashroomRepository washroomRepository) {
        this.requestRepository = requestRepository;
        this.suppliesRepository = suppliesRepository;
        this.washroomRepository = washroomRepository;
    }

    @Override
    public List<RequestDto> getAllRequests(String status, Pageable pageable) {
        Page<Request> page = (status == null || status.isBlank())
                ? this.requestRepository.findAll(pageable)
                : this.requestRepository.findByStatus(status, pageable);
        return page.getContent().stream().map(this::mapToDTo).collect(Collectors.toList());
    }

    @Override
    public RequestDto getRequestById(Long id) {
        Request request = this.requestRepository.findById(id).orElseThrow(() -> new RequestNotFoundException("Request with associated id " + id + " not found"));
        return mapToDTo(request);
    }


    @Override
    public RequestDto createRequest(RequestDto requestDto) {
        Request request = mapToEntity(requestDto);

        Supplies supplies = this.suppliesRepository.findById(requestDto.getSuppliesId()).orElseThrow(() -> new SuppliesNotFoundException("Supplies with associated id " + requestDto.getSuppliesId() + " not found"));
        Washroom washroom = this.washroomRepository.findById(requestDto.getWashroomId()).orElseThrow(() -> new WashroomNotFoundException("Washroom with associated id " + requestDto.getWashroomId() + " not found"));

        request.setSupplies(supplies);
        request.setWashroom(washroom);
        this.requestRepository.save(request);
        return mapToDTo(request);
    }

    @Override
    public RequestDto updateRequest(RequestDto requestDto, Long id) {
        Request request = this.requestRepository.findById(id).orElseThrow(() -> new RequestNotFoundException("Request with associated id " + id + " not found"));

        Supplies supplies = this.suppliesRepository.findById(requestDto.getSuppliesId()).orElseThrow(() -> new SuppliesNotFoundException("Supplies with associated id " + id + " not found"));
        Washroom washroom = this.washroomRepository.findById(requestDto.getWashroomId()).orElseThrow(() -> new WashroomNotFoundException("Washroom with associated id " + id + " not found"));

        request.setStatus(requestDto.getStatus());
        request.setSupplies(supplies);
        request.setWashroom(washroom);
        this.requestRepository.save(request);

        return mapToDTo(request);
    }

    @Override
    public void deleteRequest(Long id) {
        Request request = this.requestRepository.findById(id).orElseThrow(() -> new RequestNotFoundException("Request with associated id " + id + " not found"));
        this.requestRepository.delete(request);
    }

    // Mapping methods
    private RequestDto mapToDTo(Request request) {
        RequestDto requestDto = new RequestDto();
        requestDto.setId(request.getId());
        requestDto.setStatus(request.getStatus());
        requestDto.setCreatedAt(request.getCreatedAt());
        if (request.getWashroom() != null) {
            requestDto.setWashroomId(request.getWashroom().getId());
        }
        if (request.getSupplies() != null) {
            requestDto.setSuppliesId(request.getSupplies().getId());
        }
        return requestDto;
    }

    private Request mapToEntity(RequestDto requestDto) {
        Request request = new Request();
        request.setStatus(requestDto.getStatus());

        return request;
    }
}




