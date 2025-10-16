package com.bathroombuddy.bathroombuddy.service;

import com.bathroombuddy.bathroombuddy.model.Request;
import com.bathroombuddy.bathroombuddy.repository.RequestRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RequestService {
    private final RequestRepository requestRepository;

    public RequestService(RequestRepository requestRepository) {
        this.requestRepository = requestRepository;
    }

    public List<Request> getAllRequests() {
        return this.requestRepository.findAll();
    }

    public Request getRequestById(Long id) {
        return this.requestRepository.findById(id).orElseThrow(() -> new IllegalStateException("Request with id " + id + " not found"));
    }

    public void insertRequest(Request request) {
        this.requestRepository.save(request);
    }
}
