package com.bathroombuddy.bathroombuddy.service.impl;

import com.bathroombuddy.bathroombuddy.dto.SuppliesDto;
import com.bathroombuddy.bathroombuddy.exceptions.SuppliesNotFoundException;
import com.bathroombuddy.bathroombuddy.model.Supplies;
import com.bathroombuddy.bathroombuddy.repository.SuppliesRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

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
class SuppliesServiceImplTest {

    @Mock
    private SuppliesRepository suppliesRepository;

    @InjectMocks
    private SuppliesServiceImpl suppliesService;

    @Test
    void getAllSupplies_returnsMappedDtos() {
        when(suppliesRepository.findAll()).thenReturn(List.of(
                supplies(1L, "soap", 10, LocalDateTime.now()),
                supplies(2L, "paper", 50, LocalDateTime.now())
        ));

        List<SuppliesDto> result = suppliesService.getAllSupplies();

        assertThat(result).hasSize(2);
        assertThat(result.get(0).getType()).isEqualTo("soap");
        assertThat(result.get(0).getQuantity()).isEqualTo(10);
        assertThat(result.get(1).getType()).isEqualTo("paper");
    }

    @Test
    void getSuppliesById_returnsDto_whenFound() {
        when(suppliesRepository.findById(1L)).thenReturn(
                Optional.of(supplies(1L, "soap", 10, LocalDateTime.now())));

        SuppliesDto result = suppliesService.getSuppliesById(1L);

        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getType()).isEqualTo("soap");
    }

    @Test
    void getSuppliesById_throwsSuppliesNotFoundException_whenMissing() {
        when(suppliesRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> suppliesService.getSuppliesById(99L))
                .isInstanceOf(SuppliesNotFoundException.class)
                .hasMessageContaining("99");
    }

    @Test
    void createSupplies_setsLastReplenishedToNow_whenNull() {
        SuppliesDto input = suppliesDto(null, "soap", 10, null);
        when(suppliesRepository.save(any(Supplies.class))).thenAnswer(inv -> {
            Supplies s = inv.getArgument(0);
            s.setId(7L);
            return s;
        });

        LocalDateTime before = LocalDateTime.now();
        SuppliesDto result = suppliesService.createSupplies(input);
        LocalDateTime after = LocalDateTime.now();

        ArgumentCaptor<Supplies> saved = ArgumentCaptor.forClass(Supplies.class);
        verify(suppliesRepository).save(saved.capture());
        assertThat(saved.getValue().getLastReplenished()).isBetween(before, after);
        assertThat(result.getLastReplenished()).isBetween(before, after);
        assertThat(result.getType()).isEqualTo("soap");
        assertThat(result.getQuantity()).isEqualTo(10);
    }

    @Test
    void createSupplies_keepsLastReplenished_whenProvided() {
        LocalDateTime explicit = LocalDateTime.of(2024, 1, 1, 12, 0);
        SuppliesDto input = suppliesDto(null, "soap", 10, explicit);
        when(suppliesRepository.save(any(Supplies.class))).thenAnswer(inv -> inv.getArgument(0));

        SuppliesDto result = suppliesService.createSupplies(input);

        ArgumentCaptor<Supplies> saved = ArgumentCaptor.forClass(Supplies.class);
        verify(suppliesRepository).save(saved.capture());
        assertThat(saved.getValue().getLastReplenished()).isEqualTo(explicit);
        assertThat(result.getLastReplenished()).isEqualTo(explicit);
    }

    @Test
    void updateSupplies_overwritesLastReplenished_toNow_whenFound() {
        LocalDateTime old = LocalDateTime.of(2020, 1, 1, 0, 0);
        Supplies existing = supplies(1L, "soap", 10, old);
        when(suppliesRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(suppliesRepository.save(any(Supplies.class))).thenAnswer(inv -> inv.getArgument(0));

        LocalDateTime before = LocalDateTime.now();
        SuppliesDto result = suppliesService.updateSupplies(
                suppliesDto(null, "paper", 50, old), 1L);
        LocalDateTime after = LocalDateTime.now();

        assertThat(existing.getType()).isEqualTo("paper");
        assertThat(existing.getQuantity()).isEqualTo(50);
        assertThat(existing.getLastReplenished()).isBetween(before, after);
        assertThat(result.getType()).isEqualTo("paper");
        assertThat(result.getLastReplenished()).isBetween(before, after);
    }

    @Test
    void updateSupplies_throwsSuppliesNotFoundException_whenMissing() {
        when(suppliesRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> suppliesService.updateSupplies(
                suppliesDto(null, "soap", 1, null), 99L))
                .isInstanceOf(SuppliesNotFoundException.class);

        verify(suppliesRepository, never()).save(any());
    }

    @Test
    void deleteSuppliesById_callsDelete_whenFound() {
        Supplies existing = supplies(1L, "soap", 10, LocalDateTime.now());
        when(suppliesRepository.findById(1L)).thenReturn(Optional.of(existing));

        suppliesService.deleteSuppliesById(1L);

        verify(suppliesRepository).delete(existing);
    }

    @Test
    void deleteSuppliesById_throwsSuppliesNotFoundException_whenMissing() {
        when(suppliesRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> suppliesService.deleteSuppliesById(99L))
                .isInstanceOf(SuppliesNotFoundException.class);

        verify(suppliesRepository, never()).delete(any());
    }

    private static Supplies supplies(Long id, String type, long qty, LocalDateTime lastReplenished) {
        Supplies s = new Supplies(type, qty, lastReplenished);
        s.setId(id);
        return s;
    }

    private static SuppliesDto suppliesDto(Long id, String type, long qty, LocalDateTime lastReplenished) {
        SuppliesDto dto = new SuppliesDto();
        dto.setId(id);
        dto.setType(type);
        dto.setQuantity(qty);
        dto.setLastReplenished(lastReplenished);
        return dto;
    }
}
