package com.bathroombuddy.bathroombuddy.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "requests")
@Getter
@Setter
public class Request {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supply_id", nullable = false)
    private Supplies type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "washroom_id", nullable = false)
    private Washroom location;

    @Column(nullable = false)
    private String status = "PENDING";

    @Column(updatable = false, nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Request() {}

    public Request(Supplies type, Washroom location, String status) {
        this.type = type;
        this.location = location;
        this.status = status;
    }
}
