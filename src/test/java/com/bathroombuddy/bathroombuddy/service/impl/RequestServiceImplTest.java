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
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RequestServiceImplTest {

    @Mock
    private RequestRepository requestRepository;
    @Mock
    private SuppliesRepository suppliesRepository;
    @Mock
    private WashroomRepository washroomRepository;

    @InjectMocks
    private RequestServiceImpl requestService;

    @Test
    void getAllRequests_withoutStatus_callsFindAll() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Request> page = new PageImpl<>(List.of(request(1L, "PENDING", supplies(10L), washroom(20L))));
        when(requestRepository.findAll(pageable)).thenReturn(page);

        List<RequestDto> result = requestService.getAllRequests(null, pageable);

        verify(requestRepository).findAll(pageable);
        verify(requestRepository, never()).findByStatus(any(), any());
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getStatus()).isEqualTo("PENDING");
        assertThat(result.get(0).getSuppliesId()).isEqualTo(10L);
        assertThat(result.get(0).getWashroomId()).isEqualTo(20L);
    }

    @Test
    void getAllRequests_withBlankStatus_callsFindAll() {
        Pageable pageable = PageRequest.of(0, 10);
        when(requestRepository.findAll(pageable)).thenReturn(new PageImpl<>(List.of()));

        requestService.getAllRequests("  ", pageable);

        verify(requestRepository).findAll(pageable);
        verify(requestRepository, never()).findByStatus(any(), any());
    }

    @Test
    void getAllRequests_withStatus_callsFindByStatus() {
        Pageable pageable = PageRequest.of(0, 10);
        when(requestRepository.findByStatus("PENDING", pageable))
                .thenReturn(new PageImpl<>(List.of(request(1L, "PENDING", supplies(10L), washroom(20L)))));

        List<RequestDto> result = requestService.getAllRequests("PENDING", pageable);

        verify(requestRepository).findByStatus("PENDING", pageable);
        verify(requestRepository, never()).findAll(any(Pageable.class));
        assertThat(result).hasSize(1);
    }

    @Test
    void getRequestById_returnsDto_whenFound() {
        Request entity = request(1L, "PENDING", supplies(10L), washroom(20L));
        when(requestRepository.findById(1L)).thenReturn(Optional.of(entity));

        RequestDto result = requestService.getRequestById(1L);

        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getStatus()).isEqualTo("PENDING");
        assertThat(result.getSuppliesId()).isEqualTo(10L);
        assertThat(result.getWashroomId()).isEqualTo(20L);
    }

    @Test
    void getRequestById_throwsRequestNotFoundException_whenMissing() {
        when(requestRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> requestService.getRequestById(99L))
                .isInstanceOf(RequestNotFoundException.class)
                .hasMessageContaining("99");
    }

    @Test
    void createRequest_savesAndReturnsDto_whenSuppliesAndWashroomExist() {
        RequestDto input = requestDto(null, "PENDING", 10L, 20L);
        Supplies foundSupplies = supplies(10L);
        Washroom foundWashroom = washroom(20L);
        when(suppliesRepository.findById(10L)).thenReturn(Optional.of(foundSupplies));
        when(washroomRepository.findById(20L)).thenReturn(Optional.of(foundWashroom));
        when(requestRepository.save(any(Request.class))).thenAnswer(inv -> inv.getArgument(0));

        RequestDto result = requestService.createRequest(input);

        ArgumentCaptor<Request> saved = ArgumentCaptor.forClass(Request.class);
        verify(requestRepository).save(saved.capture());
        assertThat(saved.getValue().getSupplies()).isSameAs(foundSupplies);
        assertThat(saved.getValue().getWashroom()).isSameAs(foundWashroom);
        assertThat(saved.getValue().getStatus()).isEqualTo("PENDING");
        assertThat(result.getSuppliesId()).isEqualTo(10L);
        assertThat(result.getWashroomId()).isEqualTo(20L);
    }

    @Test
    void createRequest_throwsSuppliesNotFoundException_whenSuppliesMissing() {
        RequestDto input = requestDto(null, "PENDING", 10L, 20L);
        when(suppliesRepository.findById(10L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> requestService.createRequest(input))
                .isInstanceOf(SuppliesNotFoundException.class)
                .hasMessageContaining("10");

        verify(requestRepository, never()).save(any());
    }

    @Test
    void createRequest_throwsWashroomNotFoundException_whenWashroomMissing() {
        RequestDto input = requestDto(null, "PENDING", 10L, 20L);
        when(suppliesRepository.findById(10L)).thenReturn(Optional.of(supplies(10L)));
        when(washroomRepository.findById(20L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> requestService.createRequest(input))
                .isInstanceOf(WashroomNotFoundException.class)
                .hasMessageContaining("20");

        verify(requestRepository, never()).save(any());
    }

    @Test
    void updateRequest_updatesStatusAndAssociations_whenAllExist() {
        Request existing = request(1L, "PENDING", supplies(10L), washroom(20L));
        Supplies newSupplies = supplies(11L);
        Washroom newWashroom = washroom(21L);
        when(requestRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(suppliesRepository.findById(11L)).thenReturn(Optional.of(newSupplies));
        when(washroomRepository.findById(21L)).thenReturn(Optional.of(newWashroom));
        when(requestRepository.save(any(Request.class))).thenAnswer(inv -> inv.getArgument(0));

        RequestDto result = requestService.updateRequest(
                requestDto(null, "COMPLETED", 11L, 21L), 1L);

        assertThat(existing.getStatus()).isEqualTo("COMPLETED");
        assertThat(existing.getSupplies()).isSameAs(newSupplies);
        assertThat(existing.getWashroom()).isSameAs(newWashroom);
        assertThat(result.getStatus()).isEqualTo("COMPLETED");
        assertThat(result.getSuppliesId()).isEqualTo(11L);
        assertThat(result.getWashroomId()).isEqualTo(21L);
    }

    @Test
    void updateRequest_throwsRequestNotFoundException_whenRequestMissing() {
        when(requestRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> requestService.updateRequest(
                requestDto(null, "COMPLETED", 10L, 20L), 99L))
                .isInstanceOf(RequestNotFoundException.class);

        verify(requestRepository, never()).save(any());
    }

    @Test
    void updateRequest_throwsSuppliesNotFoundException_whenSuppliesMissing() {
        Request existing = request(1L, "PENDING", supplies(10L), washroom(20L));
        when(requestRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(suppliesRepository.findById(11L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> requestService.updateRequest(
                requestDto(null, "COMPLETED", 11L, 21L), 1L))
                .isInstanceOf(SuppliesNotFoundException.class);

        verify(requestRepository, never()).save(any());
    }

    @Test
    void deleteRequest_callsDelete_whenFound() {
        Request existing = request(1L, "PENDING", supplies(10L), washroom(20L));
        when(requestRepository.findById(1L)).thenReturn(Optional.of(existing));

        requestService.deleteRequest(1L);

        verify(requestRepository).delete(existing);
    }

    @Test
    void deleteRequest_throwsRequestNotFoundException_whenMissing() {
        when(requestRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> requestService.deleteRequest(99L))
                .isInstanceOf(RequestNotFoundException.class);

        verify(requestRepository, never()).delete(any(Request.class));
    }

    private static Request request(Long id, String status, Supplies supplies, Washroom washroom) {
        return new Request(id, supplies, washroom, status, LocalDateTime.now());
    }

    private static Supplies supplies(Long id) {
        Supplies s = new Supplies("soap", 10, LocalDateTime.now());
        s.setId(id);
        return s;
    }

    private static Washroom washroom(Long id) {
        Washroom w = new Washroom("Lobby", "1");
        w.setId(id);
        return w;
    }

    private static RequestDto requestDto(Long id, String status, Long suppliesId, Long washroomId) {
        return new RequestDto(id, status, null, suppliesId, washroomId);
    }
}
