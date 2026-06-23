package com.bathroombuddy.bathroombuddy.service.impl;

import com.bathroombuddy.bathroombuddy.dto.WashroomDto;
import com.bathroombuddy.bathroombuddy.exceptions.WashroomNotFoundException;
import com.bathroombuddy.bathroombuddy.model.Washroom;
import com.bathroombuddy.bathroombuddy.repository.WashroomRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class WashroomServiceImplTest {

    @Mock
    private WashroomRepository washroomRepository;

    @InjectMocks
    private WashroomServiceImpl washroomService;

    @Test
    void getAllWashrooms_returnsMappedDtos() {
        when(washroomRepository.findAll()).thenReturn(List.of(
                washroom(1L, "Lobby", "1"),
                washroom(2L, "Mezz", "2")
        ));

        List<WashroomDto> result = washroomService.getAllWashrooms();

        assertThat(result).hasSize(2);
        assertThat(result.get(0).getName()).isEqualTo("Lobby");
        assertThat(result.get(0).getFloor()).isEqualTo("1");
        assertThat(result.get(1).getName()).isEqualTo("Mezz");
    }

    @Test
    void getWashroomById_returnsDto_whenFound() {
        when(washroomRepository.findById(1L)).thenReturn(Optional.of(washroom(1L, "Lobby", "1")));

        WashroomDto result = washroomService.getWashroomById(1L);

        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getName()).isEqualTo("Lobby");
    }

    @Test
    void getWashroomById_throwsWashroomNotFoundException_whenMissing() {
        when(washroomRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> washroomService.getWashroomById(99L))
                .isInstanceOf(WashroomNotFoundException.class)
                .hasMessageContaining("99");
    }

    @Test
    void createWashroom_savesAndReturnsDto() {
        WashroomDto input = washroomDto(null, "Lobby", "1");
        when(washroomRepository.save(any(Washroom.class))).thenAnswer(inv -> {
            Washroom w = inv.getArgument(0);
            w.setId(7L);
            return w;
        });

        WashroomDto result = washroomService.createWashroom(input);

        verify(washroomRepository).save(any(Washroom.class));
        assertThat(result.getName()).isEqualTo("Lobby");
        assertThat(result.getFloor()).isEqualTo("1");
    }

    @Test
    void updateWashroom_updatesNameAndFloor_whenFound() {
        Washroom existing = washroom(1L, "Old", "1");
        when(washroomRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(washroomRepository.save(any(Washroom.class))).thenAnswer(inv -> inv.getArgument(0));

        WashroomDto result = washroomService.updateWashroom(washroomDto(null, "New", "2"), 1L);

        assertThat(existing.getName()).isEqualTo("New");
        assertThat(existing.getFloor()).isEqualTo("2");
        assertThat(result.getName()).isEqualTo("New");
        assertThat(result.getFloor()).isEqualTo("2");
    }

    @Test
    void updateWashroom_throwsWashroomNotFoundException_whenMissing() {
        when(washroomRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> washroomService.updateWashroom(washroomDto(null, "X", "1"), 99L))
                .isInstanceOf(WashroomNotFoundException.class);

        verify(washroomRepository, never()).save(any());
    }

    @Test
    void deleteWashroomById_callsDelete_whenFound() {
        Washroom existing = washroom(1L, "Lobby", "1");
        when(washroomRepository.findById(1L)).thenReturn(Optional.of(existing));

        washroomService.deleteWashroomById(1L);

        verify(washroomRepository).delete(existing);
    }

    @Test
    void deleteWashroomById_throwsWashroomNotFoundException_whenMissing() {
        when(washroomRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> washroomService.deleteWashroomById(99L))
                .isInstanceOf(WashroomNotFoundException.class);

        verify(washroomRepository, never()).delete(any());
    }

    private static Washroom washroom(Long id, String name, String floor) {
        Washroom w = new Washroom(name, floor);
        w.setId(id);
        return w;
    }

    private static WashroomDto washroomDto(Long id, String name, String floor) {
        WashroomDto dto = new WashroomDto();
        dto.setId(id);
        dto.setName(name);
        dto.setFloor(floor);
        return dto;
    }
}
