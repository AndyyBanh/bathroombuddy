package com.bathroombuddy.bathroombuddy.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class SuppliesDto {
    private Long id;
    private String type;
    private long quantity;
    private LocalDateTime lastReplenished;

}
