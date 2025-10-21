package com.bathroombuddy.bathroombuddy.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Request {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // tells us which supply has to do with request
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supply_id", nullable = false)
    private Supplies supplies;

    // tells us which washroom has to do with the request
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "washroom_id", nullable = false)
    private Washroom washroom;

    @Column(nullable = false)
    private String status = "PENDING";

    @Column(updatable = false, nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

}
