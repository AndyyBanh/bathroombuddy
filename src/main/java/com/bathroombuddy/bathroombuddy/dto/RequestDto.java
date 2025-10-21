package com.bathroombuddy.bathroombuddy.dto;

import com.bathroombuddy.bathroombuddy.model.Request;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RequestDto {
    private Long id;
    private String status;
    private LocalDateTime createdAt;
    private Long suppliesId;
    private Long washroomId;

}
