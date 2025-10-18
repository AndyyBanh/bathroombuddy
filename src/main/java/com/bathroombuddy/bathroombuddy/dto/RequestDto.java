package com.bathroombuddy.bathroombuddy.dto;

import com.bathroombuddy.bathroombuddy.model.Request;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class RequestDto {
    private Long id;
    private String type;
    private String washroom;
    private String status;
    private LocalDateTime createdAt;


}
